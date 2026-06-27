import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, UserPlus, Save, ImagePlus, Loader2 } from "lucide-react";
import type { Leader } from "@/api/leadership.service";

interface Props {
  open: boolean;
  leader: Leader | null;
  onClose: () => void;
  onSave: (id: string | null, form: FormData) => Promise<void>;
}

const inputCls =
  "w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/40 text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all";
const labelCls = "text-[11px] font-semibold text-muted-foreground uppercase tracking-widest";

export default function LeaderModal({ open, leader, onClose, onSave }: Props) {
  const isCreate = open && leader === null;

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [order, setOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setName(leader?.name ?? "");
    setRole(leader?.role ?? "");
    setOrder(leader?.order ?? 0);
    setImageFile(null);
    setImagePreview(leader?.image ?? "");
    setError("");
  }, [leader, open]);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5 MB."); return; }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const canSave = !!name.trim() && !!role.trim() && (isCreate ? !!imageFile : true);

  const handleSave = async () => {
    if (!canSave) return;
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("name", name.trim());
      form.append("role", role.trim());
      form.append("order", String(order));
      if (imageFile) form.append("image", imageFile);
      await onSave(leader?.id ?? null, form);
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-card border border-border rounded-3xl w-full max-w-md shadow-[0_40px_80px_rgba(0,0,0,0.6)] pointer-events-auto max-h-[90vh] flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-border shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${isCreate ? "bg-primary/15 border-primary/30" : "bg-input border-border"}`}>
                    {isCreate
                      ? <UserPlus className="w-4 h-4 text-primary" />
                      : <Save className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-lg leading-none">
                      {isCreate ? "Add Leader" : "Edit Leader"}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {isCreate ? "Add a new department leader" : "Update leader details"}
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

              {/* Body */}
              <div className="overflow-y-auto px-7 py-5 space-y-4 flex-1">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Name <span className="text-red-400">*</span></label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Kamau"
                    className={inputCls}
                  />
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Role <span className="text-red-400">*</span></label>
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Worship Director"
                    className={inputCls}
                  />
                </div>

                {/* Display order */}
                <div className="space-y-1.5">
                  <label className={labelCls}>
                    Display Order
                    <span className="text-muted-foreground/40 normal-case font-normal ml-1">(lower = first)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className={inputCls}
                  />
                </div>

                {/* Photo upload */}
                <div className="space-y-2">
                  <label className={labelCls}>
                    Photo{" "}
                    {isCreate
                      ? <span className="text-red-400">*</span>
                      : <span className="text-muted-foreground/40 normal-case font-normal">(leave empty to keep current)</span>}
                  </label>

                  {imagePreview && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-border">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files[0] ?? null); }}
                    className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/40 bg-card hover:bg-input transition-all cursor-pointer"
                  >
                    <ImagePlus className="w-5 h-5 text-muted-foreground/50" />
                    <p className="text-muted-foreground/60 text-xs text-center">
                      Drop photo here or <span className="text-primary">browse</span>
                    </p>
                    <p className="text-muted-foreground/40 text-[10px]">Max 5 MB · JPEG, PNG, WebP</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => { handleFileChange(e.target.files?.[0] ?? null); e.target.value = ""; }}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-7 py-5 border-t border-border shrink-0">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 text-sm font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !canSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0096FF] hover:bg-[#0080ee] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(0,150,255,0.3)] cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCreate ? (
                    <><UserPlus className="w-3.5 h-3.5" /><span>Add Leader</span></>
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
