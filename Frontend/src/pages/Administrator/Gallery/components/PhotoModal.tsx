import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Save, Star, ImageIcon } from "lucide-react";
import {
  PHOTO_CATEGORIES,
  type Photo,
  type PhotoCategory,
  type UploadPhotoMetadata,
  type UpdatePhotoPayload,
} from "@/api/gallery.service";

interface Props {
  open: boolean;
  photo: Photo | null;
  onClose: () => void;
  onUpload: (file: File, metadata: UploadPhotoMetadata) => Promise<void>;
  onUpdate: (id: string, payload: UpdatePhotoPayload) => Promise<void>;
}

const inputCls =
  "w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-[#0096FF]/60 focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all";
const labelCls = "text-[11px] font-semibold text-white/40 uppercase tracking-widest";

export default function PhotoModal({ open, photo, onClose, onUpload, onUpdate }: Props) {
  const isCreate = open && photo === null;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState<PhotoCategory>("General");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setFile(null);
    setPreview(null);
    setDragging(false);
    setTitle(photo?.title ?? "");
    setAlt(photo?.alt ?? "");
    setCategory((photo?.category as PhotoCategory) ?? "General");
    setFeatured(photo?.featured ?? false);
    setError("");
  }, [photo, open]);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const canSave = isCreate
    ? !!file && !!title.trim() && !!alt.trim()
    : !!title.trim() && !!alt.trim();

  const handleSave = async () => {
    if (!canSave) return;
    setError("");
    setLoading(true);
    try {
      if (isCreate) {
        await onUpload(file!, { title: title.trim(), alt: alt.trim(), category, featured });
      } else {
        await onUpdate(photo!.id, { title: title.trim(), alt: alt.trim(), category, featured });
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
            <div className="bg-[#001726] border border-white/[0.1] rounded-3xl w-full max-w-lg shadow-[0_40px_80px_rgba(0,0,0,0.6)] pointer-events-auto max-h-[90vh] flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-white/[0.07] shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${isCreate ? "bg-[#0096FF]/15 border-[#0096FF]/25" : "bg-white/[0.06] border-white/[0.1]"}`}>
                    {isCreate
                      ? <Upload className="w-4 h-4 text-[#0096FF]" />
                      : <Save className="w-4 h-4 text-white/50" />}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-none">
                      {isCreate ? "Upload Photo" : "Edit Photo"}
                    </h3>
                    <p className="text-white/40 text-xs mt-0.5">
                      {isCreate ? "Add a new gallery image" : "Update photo details"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] text-white/40 hover:text-white flex items-center justify-center transition-all cursor-pointer"
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

                {/* Dropzone — upload mode only */}
                {isCreate && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
                      dragging
                        ? "border-[#0096FF] bg-[#0096FF]/10"
                        : "border-white/[0.12] hover:border-white/[0.25] hover:bg-white/[0.02]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                      }}
                    />
                    {preview ? (
                      <div className="relative group/preview">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full max-h-52 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity">
                          <p className="text-white text-xs font-semibold flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Click to change
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-white/30" />
                        </div>
                        <div className="text-center">
                          <p className="text-white/60 text-sm font-medium">
                            Drop image here or{" "}
                            <span className="text-[#0096FF]">browse files</span>
                          </p>
                          <p className="text-white/25 text-xs mt-1">PNG, JPG, WEBP — max 10 MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Edit — show current photo thumbnail */}
                {!isCreate && photo && (
                  <div className="rounded-xl overflow-hidden border border-white/[0.08]">
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      className="w-full h-36 object-cover"
                    />
                  </div>
                )}

                {/* Title */}
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

                {/* Alt text */}
                <div className="space-y-1.5">
                  <label className={labelCls}>
                    Alt Text <span className="text-red-400">*</span>
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
                  <label className={labelCls}>Category</label>
                  <div className="flex flex-wrap gap-2">
                    {PHOTO_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          category === cat
                            ? "bg-[#0096FF]/15 border-[#0096FF]/40 text-[#0096FF]"
                            : "bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.07]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Star
                      className={`w-4 h-4 transition-colors ${featured ? "text-amber-400 fill-amber-400" : "text-white/25"}`}
                    />
                    <span className="text-sm font-medium text-white/70">Featured Photo</span>
                    <span className="text-xs text-white/25 hidden sm:inline">— pinned to top of gallery</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFeatured(!featured)}
                    className={`relative w-11 h-6 rounded-full border transition-all duration-300 cursor-pointer ${
                      featured ? "bg-[#0096FF] border-[#0096FF]" : "bg-white/[0.08] border-white/[0.12]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                        featured ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-7 py-5 border-t border-white/[0.07] shrink-0">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 disabled:opacity-40 text-sm font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !canSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0096FF] hover:bg-[#0080ee] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(0,150,255,0.3)] cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isCreate ? (
                    <><Upload className="w-3.5 h-3.5" /><span>Upload Photo</span></>
                  ) : (
                    <><Save className="w-3.5 h-3.5" /><span>Save Changes</span></>
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
