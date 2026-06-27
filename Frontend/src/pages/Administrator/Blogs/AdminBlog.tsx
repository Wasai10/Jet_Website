import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, RefreshCw, Search, PenLine } from "lucide-react";
import {
  blogsService,
  type Blog,
  type BlogStatus,
} from "@/api/blogs.service";
import jetSwal from "@/lib/swal";
import BlogTable from "./components/BlogTable";
import BlogEditor from "./components/BlogEditor";

type View = "list" | "editor";
type EditorTarget = Blog | "new";

const STATUS_FILTERS: { label: string; value: BlogStatus | "ALL" }[] = [
  { label: "All",       value: "ALL"       },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft",     value: "DRAFT"     },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Archived",  value: "ARCHIVED"  },
];

export default function AdminBlog() {
  const [view, setView]                 = useState<View>("list");
  const [editorTarget, setEditorTarget] = useState<EditorTarget | null>(null);
  const [blogs, setBlogs]               = useState<Blog[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "ALL">("ALL");

  // ── Data ──────────────────────────────────────────────────────────────────

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const result = await blogsService.adminGetAll({ limit: 100 });
      setBlogs(result.blogs);
    } catch (err) {
      jetSwal.fire({
        icon: "error",
        title: "Failed to load posts",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  // On mount: loading is already true from useState(true), so no synchronous
  // setState is needed here — all updates happen after the async resolve.
  useEffect(() => {
    blogsService
      .adminGetAll({ limit: 100 })
      .then((r) => setBlogs(r.blogs))
      .catch((err) =>
        jetSwal.fire({
          icon: "error",
          title: "Failed to load posts",
          text: err instanceof Error ? err.message : "Something went wrong.",
        })
      )
      .finally(() => setLoading(false));
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────

  const openEditor = (target: EditorTarget) => {
    setEditorTarget(target);
    setView("editor");
  };

  const closeEditor = () => {
    setView("list");
    setEditorTarget(null);
  };

  const handleSaved = async (blog: Blog) => {
    closeEditor();
    await fetchBlogs();
    jetSwal.fire({
      icon: "success",
      title: blog.status === "PUBLISHED" ? "Post Published!" : "Post Saved!",
      text: blog.status === "PUBLISHED"
        ? `"${blog.title}" is now live.`
        : `"${blog.title}" has been saved as ${blog.status.toLowerCase()}.`,
      timer: 2500,
      showConfirmButton: false,
    });
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (blog: Blog) => {
    const result = await jetSwal.fire({
      title: "Delete Post?",
      html: `Are you sure you want to delete <strong>${blog.title}</strong>?<br/>
             <span style="font-size:0.8125rem;opacity:0.45;display:block;margin-top:4px">
               This action cannot be undone.
             </span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "jet-swal-popup",
        title: "jet-swal-title",
        htmlContainer: "jet-swal-content",
        confirmButton: "jet-swal-confirm jet-swal-danger",
        cancelButton: "jet-swal-cancel",
      },
    });

    if (!result.isConfirmed) return;

    jetSwal.fire({
      title: "Deleting post…",
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: { popup: "jet-swal-popup", title: "jet-swal-title" },
      didOpen: () => jetSwal.showLoading(),
    });

    try {
      await blogsService.remove(blog.id);
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
      jetSwal.fire({
        icon: "success",
        title: "Deleted!",
        text: `"${blog.title}" has been removed.`,
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err) {
      jetSwal.fire({
        icon: "error",
        title: "Failed to Delete",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  };

  // ── Filtering ─────────────────────────────────────────────────────────────

  const filtered = blogs
    .filter((b) => statusFilter === "ALL" || b.status === statusFilter)
    .filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      (b.author?.fullName ?? "").toLowerCase().includes(search.toLowerCase())
    );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence mode="wait">
      {view === "editor" && editorTarget ? (
        // ── Editor view ──────────────────────────────────────────────────
        <motion.div
          key="editor"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <BlogEditor
            target={editorTarget}
            onBack={closeEditor}
            onSaved={handleSaved}
          />
        </motion.div>
      ) : (
        // ── List view ────────────────────────────────────────────────────
        <motion.div
          key="list"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Blog Posts</h2>
              <p className="text-muted-foreground text-sm mt-0.5">
                {blogs.length} total · {blogs.filter((b) => b.status === "PUBLISHED").length} published
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2.5 w-52">
                <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search posts…"
                  className="bg-transparent text-sm text-foreground placeholder-muted-foreground/40 outline-none w-full"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as BlogStatus | "ALL")}
                className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground/70 outline-none cursor-pointer hover:border-border transition-colors"
              >
                {STATUS_FILTERS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              {/* Refresh */}
              <button
                onClick={fetchBlogs}
                title="Refresh"
                className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>

              {/* New post */}
              <button
                onClick={() => openEditor("new")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0096FF] hover:bg-[#0080ee] text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(0,150,255,0.25)] cursor-pointer"
              >
                <PenLine className="w-4 h-4" />
                <span>New Post</span>
              </button>
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {STATUS_FILTERS.map((s) => {
              const count = s.value === "ALL"
                ? blogs.length
                : blogs.filter((b) => b.status === s.value).length;
              const active = statusFilter === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setStatusFilter(s.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer
                    ${active
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground/70 hover:bg-card"
                    }`}
                >
                  {s.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-primary/20 text-primary" : "bg-input text-muted-foreground/60"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-card backdrop-blur-xl border border-border rounded-2xl overflow-hidden"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-2 border-[#0096FF]/15 rounded-full" />
                  <div className="absolute inset-0 border-2 border-transparent border-t-[#0096FF] rounded-full animate-spin" />
                </div>
                <p className="text-muted-foreground/60 text-sm">Loading posts…</p>
              </div>
            ) : filtered.length === 0 && search ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <BookOpen className="w-10 h-10 text-muted-foreground/20" />
                <p className="text-muted-foreground/60 text-sm">No posts match "{search}"</p>
              </div>
            ) : (
              <BlogTable
                blogs={filtered}
                onEdit={openEditor}
                onDelete={handleDelete}
              />
            )}

            {!loading && filtered.length > 0 && (
              <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                <p className="text-muted-foreground/50 text-xs">
                  Showing {filtered.length} of {blogs.length} posts
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
