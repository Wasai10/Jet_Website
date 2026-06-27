import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, FolderPlus, Save, ImagePlus, ChevronDown } from "lucide-react";
import type { Department } from "@/api/department.service";
import type { Leader } from "@/api/leadership.service";

interface Props {
  open: boolean;
  department: Department | null;
  leaders: Leader[];
  onClose: () => void;
  onSave: (id: string | null, form: FormData) => Promise<void>;
}

const inputCls =
  "w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/40 text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all";
const labelCls = "text-[11px] font-semibold text-muted-foreground uppercase tracking-widest";

export default function DepartmentModal({ open, department, leaders, onClose, onSave }: Props) {
  const isCreate = open && department === null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);
  const [leaderId, setLeaderId] = useState("");
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState("");
  const [leaderDropOpen, setLeaderDropOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const leaderDropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setName(department?.name ?? "");
    setDescription(department?.description ?? "");
    setOrder(department?.order ?? 0);
    setLeaderId(department?.leaderId ?? leaders[0]?.id ?? "");
    setBgFile(null);
    setBgPreview(department?.backgroundImage ?? "");
    setError("");
    setLeaderDropOpen(false);
  }, [department, open, leaders]);

  useEffect(() => {
    if (!leaderDropOpen) return;
    const handler = (e: MouseEvent) => {
      if (leaderDropRef.current && !leaderDropRef.current.contains(e.target as Node)) {
        setLeaderDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [leaderDropOpen]);

  const handleBgFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Background must be under 10 MB."); return; }
    setError("");
    setBgFile(file);
    setBgPreview(URL.createObjectURL(file));
  };

  const selectedLeader = leaders.find((l) => l.id === leaderId);
  const canSave = !!name.trim() && description.trim().length >= 10 && !!leaderId;

  const handleSave = async () => {
    if (!canSave) return;
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("name", name.trim());
      form.append("description", description.trim());
      form.append("order", String(order));
      form.append("leaderId", leaderId);
      if (bgFile) form.append("background", bgFile);
      await onSave(department?.id ?? null, form);
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
                      ? <FolderPlus className="w-4 h-4 text-primary" />
                      : <Save className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-lg leading-none">
                      {isCreate ? "New Ministry" : "Edit Ministry"}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {isCreate ? "Create a new ministry department" : "Update ministry details"}
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
                  <label className={labelCls}>Ministry Name <span className="text-red-400">*</span></label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Worship & Arts"
                    className={inputCls}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Description <span className="text-red-400">*</span></label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this ministry about? (at least 10 characters)"
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Leader picker */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Leader <span className="text-red-400">*</span></label>

                  {leaders.length === 0 ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-400 text-sm">
                      No leaders available. Add a leader first before creating a ministry.
                    </div>
                  ) : (
                    <div className="relative" ref={leaderDropRef}>
                      <button
                        type="button"
                        onClick={() => setLeaderDropOpen((v) => !v)}
                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none transition-all cursor-pointer flex items-center gap-3 text-left hover:border-primary/40"
                      >
                        {selectedLeader ? (
                          <>
                            <img
                              src={selectedLeader.image}
                              alt={selectedLeader.name}
                              className="w-7 h-7 rounded-lg object-cover border border-border shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{selectedLeader.name}</div>
                              <div className="text-[11px] text-muted-foreground truncate">{selectedLeader.role}</div>
                            </div>
                          </>
                        ) : (
                          <span className="text-muted-foreground/40 flex-1">Select a leader…</span>
                        )}
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground/60 shrink-0 transition-transform duration-200 ${leaderDropOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {leaderDropOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden"
                          >
                            <div className="max-h-52 overflow-y-auto py-1">
                              {leaders.map((l) => {
                                const selected = leaderId === l.id;
                                return (
                                  <button
                                    key={l.id}
                                    type="button"
                                    onClick={() => { setLeaderId(l.id); setLeaderDropOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                                      selected ? "bg-primary/8 text-foreground" : "text-foreground hover:bg-muted/60"
                                    }`}
                                  >
                                    <img
                                      src={l.image}
                                      alt={l.name}
                                      className="w-8 h-8 rounded-lg object-cover border border-border shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium leading-tight truncate">{l.name}</div>
                                      <div className="text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">{l.role}</div>
                                    </div>
                                    {selected && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
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

                {/* Background image */}
                <div className="space-y-2">
                  <label className={labelCls}>
                    Background Image
                    <span className="text-muted-foreground/40 normal-case font-normal ml-1">(optional)</span>
                  </label>

                  {bgPreview && (
                    <div className="w-full h-28 rounded-xl overflow-hidden border border-border">
                      <img src={bgPreview} alt="Background preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handleBgFile(e.dataTransfer.files[0] ?? null); }}
                    className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/40 bg-card hover:bg-input transition-all cursor-pointer"
                  >
                    <ImagePlus className="w-5 h-5 text-muted-foreground/50" />
                    <p className="text-muted-foreground/60 text-xs text-center">
                      Drop background here or <span className="text-primary">browse</span>
                    </p>
                    <p className="text-muted-foreground/40 text-[10px]">Max 10 MB · JPEG, PNG, WebP</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => { handleBgFile(e.target.files?.[0] ?? null); e.target.value = ""; }}
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
                  disabled={loading || !canSave || leaders.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0096FF] hover:bg-[#0080ee] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(0,150,255,0.3)] cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isCreate ? (
                    <><FolderPlus className="w-3.5 h-3.5" /><span>Create Ministry</span></>
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
