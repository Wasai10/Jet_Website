import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Save, Star, ImageIcon, Plus } from "lucide-react";
import {
  PHOTO_CATEGORIES,
  type Photo,
  type PhotoCategory,
  type UploadPhotoMetadata,
  type UpdatePhotoPayload,
} from "@/api/gallery.service";

export interface UploadItem {
  file: File;
  metadata: UploadPhotoMetadata;
}

interface Props {
  open: boolean;
  photo: Photo | null;
  onClose: () => void;
  onUpload: (items: UploadItem[]) => Promise<void>;
  onUpdate: (id: string, payload: UpdatePhotoPayload) => Promise<void>;
}

const inputCls =
  "w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/40 text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all";
const labelCls = "text-[11px] font-semibold text-muted-foreground uppercase tracking-widest";

const filenameToTitle = (f: File) =>
  f.name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function PhotoModal({ open, photo, onClose, onUpload, onUpdate }: Props) {
  const isCreate = open && photo === null;

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState<PhotoCategory>("General");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMulti = files.length > 1;

  // Reset on open/close
  useEffect(() => {
    if (!open) {
      previews.forEach((p) => URL.revokeObjectURL(p));
      return;
    }
    previews.forEach((p) => URL.revokeObjectURL(p));
    setFiles([]);
    setPreviews([]);
    setDragging(false);
    setTitle(photo?.title ?? "");
    setAlt(photo?.alt ?? "");
    setCategory((photo?.category as PhotoCategory) ?? "General");
    setFeatured(photo?.featured ?? false);
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo, open]);

  const addFiles = (incoming: File[]) => {
    const images = incoming.filter((f) => f.type.startsWith("image/"));
    const skipped = incoming.length - images.length;
    if (skipped > 0) setError(`${skipped} file(s) skipped — only images are allowed.`);
    else setError("");
    if (images.length === 0) return;

    setFiles((prev) => [...prev, ...images]);
    setPreviews((prev) => [...prev, ...images.map((f) => URL.createObjectURL(f))]);
  };

  const removeFile = (i: number) => {
    URL.revokeObjectURL(previews[i]);
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length) addFiles(selected);
    e.target.value = "";
  };

  const canSave = isCreate
    ? files.length > 0 && !!alt.trim() && (isMulti || !!title.trim())
    : !!title.trim() && !!alt.trim();

  const handleSave = async () => {
    if (!canSave) return;
    setError("");
    setLoading(true);
    try {
      if (isCreate) {
        const items: UploadItem[] = files.map((f, i) => ({
          file: f,
          metadata: {
            title: isMulti ? filenameToTitle(f) : title.trim(),
            alt: alt.trim(),
            category,
            featured: i === 0 ? featured : false,
          },
        }));
        await onUpload(items);
      } else {
        await onUpdate(photo!.id, {
          title: title.trim(),
          alt: alt.trim(),
          category,
          featured,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-card border border-border rounded-3xl w-full max-w-lg shadow-[0_40px_80px_rgba(0,0,0,0.6)] pointer-events-auto max-h-[90vh] flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-border shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${isCreate ? "bg-primary/15 border-primary/30" : "bg-input border-border"}`}>
                    {isCreate
                      ? <Upload className="w-4 h-4 text-primary" />
                      : <Save className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-lg leading-none">
                      {isCreate ? "Upload Photos" : "Edit Photo"}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {isCreate
                        ? files.length > 0
                          ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                          : "Select one or more images"
                        : "Update photo details"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-input hover:bg-muted/50 text-muted-foreground hover:text-foreground flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto px-7 py-5 space-y-4 flex-1">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* ── CREATE MODE ── */}
                {isCreate && (
                  <>
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {files.length === 0 ? (
                      /* Empty dropzone */
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                          dragging
                            ? "border-[#0096FF] bg-[#0096FF]/10"
                            : "border-border hover:border-border hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-input border border-border flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-muted-foreground/60" />
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground text-sm font-medium">
                              Drop images here or{" "}
                              <span className="text-primary">browse files</span>
                            </p>
                            <p className="text-muted-foreground/50 text-xs mt-1">
                              PNG, JPG, WEBP — max 10 MB each · multiple allowed
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Thumbnail grid */
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        className={`rounded-2xl border border-dashed transition-all duration-200 p-3 ${
                          dragging ? "border-[#0096FF] bg-[#0096FF]/5" : "border-border"
                        }`}
                      >
                        <div className="grid grid-cols-4 gap-2">
                          {previews.slice(0, 7).map((src, i) => (
                            <div
                              key={i}
                              className="relative aspect-square rounded-xl overflow-hidden group/thumb border border-border"
                            >
                              <img
                                src={src}
                                alt={`Preview ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(i)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}

                          {files.length > 7 && (
                            <div className="aspect-square rounded-xl border border-border bg-card flex items-center justify-center">
                              <span className="text-muted-foreground text-xs font-bold">+{files.length - 7}</span>
                            </div>
                          )}

                          {/* Add more tile */}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border border-dashed border-border hover:border-primary/50 bg-card hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-muted-foreground/60" />
                            <span className="text-[9px] text-muted-foreground/50">Add more</span>
                          </button>
                        </div>

                        {isMulti && (
                          <p className="text-muted-foreground/60 text-[11px] mt-2.5 px-0.5">
                            Titles are auto-generated from filenames — edit them individually after upload.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Title — only for single file */}
                    {files.length === 1 && (
                      <div className="space-y-1.5">
                        <label className={labelCls}>
                          Title <span className="text-red-400">*</span>
                        </label>
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Sunday Morning Worship"
                          className={inputCls}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* ── EDIT MODE ── */}
                {!isCreate && photo && (
                  <>
                    <div className="rounded-xl overflow-hidden border border-border">
                      <img
                        src={photo.url}
                        alt={photo.alt}
                        className="w-full h-36 object-cover"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelCls}>
                        Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Sunday Morning Worship"
                        className={inputCls}
                      />
                    </div>
                  </>
                )}

                {/* Alt text — always shown */}
                <div className="space-y-1.5">
                  <label className={labelCls}>
                    Alt Text <span className="text-red-400">*</span>
                    {isMulti && (
                      <span className="ml-1 normal-case text-muted-foreground/50 font-normal tracking-normal">
                        (shared across all photos)
                      </span>
                    )}
                  </label>
                  <input
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    placeholder="e.g. Congregation singing during Sunday service"
                    className={inputCls}
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className={labelCls}>
                    Category
                    {isMulti && (
                      <span className="ml-1 normal-case text-muted-foreground/50 font-normal tracking-normal">
                        (shared)
                      </span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PHOTO_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          category === cat
                            ? "bg-primary/15 border-primary/40 text-primary"
                            : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured toggle — hidden in multi mode */}
                {!isMulti && (
                  <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Star
                        className={`w-4 h-4 transition-colors ${featured ? "text-amber-400 fill-amber-400" : "text-muted-foreground/50"}`}
                      />
                      <span className="text-sm font-medium text-foreground/70">Featured Photo</span>
                      <span className="text-xs text-muted-foreground/50 hidden sm:inline">— pinned to top of gallery</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFeatured(!featured)}
                      className={`relative w-11 h-6 rounded-full border transition-all duration-300 cursor-pointer ${
                        featured ? "bg-[#0096FF] border-[#0096FF]" : "bg-muted/60 border-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                          featured ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-7 py-5 border-t border-border shrink-0">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-40 text-sm font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !canSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0096FF] hover:bg-[#0080ee] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(0,150,255,0.3)] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Uploading{files.length > 1 ? ` ${files.length} photos` : ""}…</span>
                    </>
                  ) : isCreate ? (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        Upload {files.length > 1 ? `${files.length} Photos` : "Photo"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
