import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Trash2, Plus, Download, Search, RefreshCw, X } from "lucide-react";
import { documentsService, type MinistryDocument } from "@/api/documents.service";
import jetSwal from "@/lib/swal";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<MinistryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    fileUrl: "",
    file: null as File | null,
  });

  const fetchDocs = async () => {
    setLoading(true);
    try {
      setDocuments(await documentsService.getAll());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      jetSwal.fire({ icon: "error", title: "Missing Title", text: "Please enter a document title." });
      return;
    }
    if (!form.file && !form.fileUrl) {
      jetSwal.fire({ icon: "error", title: "Missing File", text: "Please select a file or enter a document URL." });
      return;
    }

    setUploading(true);
    try {
      await documentsService.create(
        {
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          category: form.category,
          fileUrl: form.fileUrl || undefined,
        },
        form.file || undefined
      );

      jetSwal.fire({
        icon: "success",
        title: "Document Uploaded!",
        text: "The document is now available for download on the frontend Giving & Resources page.",
        timer: 2000,
        showConfirmButton: false,
      });

      setForm({ title: "", description: "", category: "General", fileUrl: "", file: null });
      setModalOpen(false);
      await fetchDocs();
    } catch (err) {
      jetSwal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err instanceof Error ? err.message : "Could not save document.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (doc: MinistryDocument) => {
    const res = await jetSwal.fire({
      title: "Delete Document?",
      html: `Are you sure you want to remove <strong>${doc.title}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!res.isConfirmed) return;

    try {
      await documentsService.remove(doc.id);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      jetSwal.fire({ icon: "success", title: "Deleted!", timer: 1800, showConfirmButton: false });
    } catch (err) {
      jetSwal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  };

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()) ||
      (d.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Ministry Documents & Downloads
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {documents.length} Uploaded Documents Available for Public Download
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2.5 w-48">
            <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents…"
              className="bg-transparent text-xs text-foreground placeholder-muted-foreground/40 outline-none w-full"
            />
          </div>

          <button
            onClick={fetchDocs}
            title="Refresh"
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-all shadow-md cursor-pointer hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </motion.div>

      {/* Documents Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border overflow-hidden rounded-2xl p-6 shadow-xl"
      >
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Loading documents…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground space-y-2">
            <FileText className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <p className="font-bold text-foreground">No documents uploaded yet</p>
            <p className="text-xs">Click "Upload Document" above to upload PDFs, guides, or fellowship resources.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col justify-between p-5 rounded-2xl bg-muted/20 border border-border hover:border-primary/40 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {doc.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">{doc.fileSize || "PDF"}</span>
                  </div>
                  <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                    {doc.title}
                  </h3>
                  {doc.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{doc.description}</p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>

                  <button
                    onClick={() => handleDelete(doc)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Upload Document Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div
            className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" /> Upload Ministry Document
                </h3>
                <p className="text-xs text-muted-foreground">Upload files for users to download in the frontend.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Document Title *</label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. JET Fellowship Vision Handbook 2026"
                  className="w-full rounded-xl bg-input border border-border px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short explanation of what this document contains…"
                  className="w-full resize-none rounded-xl bg-input border border-border px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl bg-input border border-border px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="General">General</option>
                    <option value="Vision & Faith">Vision & Faith</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Discipleship">Discipleship</option>
                    <option value="Reports">Reports</option>
                    <option value="Newsletters">Newsletters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Document File</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                    className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary file:font-bold cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Or Direct File URL (Optional)</label>
                <input
                  type="url"
                  value={form.fileUrl}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full rounded-xl bg-input border border-border px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs disabled:opacity-50 hover:bg-primary/90"
                >
                  {uploading ? "Uploading…" : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
