import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarPlus, Save, Star, ImagePlus, Loader2, ChevronDown, Trash2 } from "lucide-react";
import { eventsService, type Event, type CreateEventPayload, type UpdateEventPayload } from "@/api/events.service";

const PRESET_COLORS = [
  "#0096FF", "#87CEEB", "#22C55E", "#A855F7", "#F59E0B", "#EF4444", "#EC4899",
];

const EVENT_TYPES = [
  { value: "UPCOMING",         label: "Upcoming",           description: "Future scheduled event",         color: "#0096FF" },
  { value: "PAST",             label: "Past",               description: "Already occurred event",         color: "#22C55E" },
  { value: "HOME_FELLOWSHIP",  label: "Home Fellowship",    description: "Small-group home gathering",      color: "#A855F7" },
  { value: "WORSHIP",          label: "Worship Service",    description: "Worship & praise session",        color: "#F59E0B" },
  { value: "CONFERENCE",       label: "Conference",         description: "Ministry conference or seminar",  color: "#EC4899" },
  { value: "OUTREACH",         label: "Community Outreach", description: "Outreach or mission activity",    color: "#14B8A6" },
  { value: "YOUTH",            label: "Youth Event",        description: "Youth-focused programme",         color: "#EF4444" },
  { value: "PRAYER",           label: "Prayer Meeting",     description: "Intercession or prayer session",  color: "#87CEEB" },
  { value: "SPECIAL",          label: "Special Event",      description: "One-off or special occasion",     color: "#6366F1" },
] as const;

type EventType = typeof EVENT_TYPES[number]["value"];

interface Props {
  open: boolean;
  event: Event | null;
  onClose: () => void;
  onSave: (id: string | null, payload: CreateEventPayload | UpdateEventPayload) => Promise<void>;
}

function toDateInput(val?: string | null): string {
  if (!val) return "";
  return new Date(val).toISOString().slice(0, 10);
}

/** Derives PAST or UPCOMING purely from the date string (YYYY-MM-DD). */
function autoType(dateStr: string): EventType {
  if (!dateStr) return "UPCOMING";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today ? "PAST" : "UPCOMING";
}

const inputCls =
  "w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/40 text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all";
const labelCls = "text-[11px] font-semibold text-muted-foreground uppercase tracking-widest";

export default function EventModal({ open, event, onClose, onSave }: Props) {
  const isCreate = open && event === null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tag, setTag] = useState("");
  const [color, setColor] = useState("#0096FF");
  const [type, setType] = useState<EventType>("UPCOMING");
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const [typeOpen, setTypeOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const d = toDateInput(event?.date);
    setTitle(event?.title ?? "");
    setDescription(event?.description ?? "");
    setLocation(event?.location ?? "");
    setDate(d);
    setTime(event?.time ?? "");
    setTag(event?.tag ?? "");
    setColor(event?.color ?? "#0096FF");
    // PAST/UPCOMING are re-derived from the date; any other type stored on the event is preserved
    const storedType = event?.type as EventType | undefined;
    const isDateDerived = !storedType || storedType === "PAST" || storedType === "UPCOMING";
    setType(isDateDerived ? autoType(d) : storedType);
    setFeatured(event?.featured ?? false);
    setImages(Array.isArray(event?.images) ? (event.images as string[]) : []);
    setUploadError("");
    setError("");
  }, [event, open]);

  useEffect(() => {
    if (!typeOpen) return;
    const handler = (e: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [typeOpen]);

  /** When the date changes, auto-sync only if type is PAST or UPCOMING; preserve any manual selection. */
  const handleDateChange = (val: string) => {
    setDate(val);
    setType((prev) => (prev === "PAST" || prev === "UPCOMING") ? autoType(val) : prev);
  };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError("");
    setUploading(true);
    try {
      const uploads = await Promise.all(
        Array.from(files).map(async (file) => {
          if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image.`);
          if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} exceeds 5 MB.`);
          const result = await eventsService.uploadImage(file);
          return result.url;
        })
      );
      setImages((prev) => [...prev, ...uploads]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const canSave = !!title.trim() && !!description.trim() && !!location.trim() && !!date;

  const handleSave = async () => {
    if (!canSave) return;
    setError("");
    setLoading(true);
    try {
      const payload: CreateEventPayload = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        date,
        time: time.trim() || undefined,
        tag: tag.trim() || undefined,
        color,
        type,
        featured,
        images: images.length > 0 ? images : undefined,
      };
      await onSave(event?.id ?? null, payload);
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
            <div className="bg-card border border-border rounded-3xl w-full max-w-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] pointer-events-auto max-h-[90vh] flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-border shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${isCreate ? "bg-primary/15 border-primary/30" : "bg-input border-border"}`}>
                    {isCreate
                      ? <CalendarPlus className="w-4 h-4 text-primary" />
                      : <Save className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-lg leading-none">
                      {isCreate ? "New Event" : "Edit Event"}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {isCreate ? "Add a ministry event" : "Update event details"}
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

                {/* Title */}
                <div className="space-y-1.5">
                  <label className={labelCls}>
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sunday Worship Service"
                    className={inputCls}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className={labelCls}>
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this event about?"
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className={labelCls}>
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. JET Ministries Auditorium"
                    className={inputCls}
                  />
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelCls}>
                      Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className={`${inputCls} dark:[color-scheme:dark] [color-scheme:light]`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>
                      Time{" "}
                      <span className="text-muted-foreground/40 normal-case font-normal">(optional)</span>
                    </label>
                    <input
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. 10:00 AM – 1:00 PM"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Tag + Color */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelCls}>
                      Tag{" "}
                      <span className="text-muted-foreground/40 normal-case font-normal">(optional)</span>
                    </label>
                    <input
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="e.g. Youth, Prayer"
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>Accent Color</label>
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          title={c}
                          className={`w-7 h-7 rounded-full border-2 transition-all duration-200 cursor-pointer shrink-0 ${
                            color === c
                              ? "border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                              : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      {/* Live preview swatch */}
                      <span
                        className="ml-1 text-[10px] font-mono text-muted-foreground/60"
                        style={{ color }}
                      >
                        {color}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event Type dropdown */}
                <div className="space-y-1.5">
                  <label className={labelCls}>
                    Event Type
                    {(type === "PAST" || type === "UPCOMING") && (
                      <span className="ml-1.5 normal-case font-normal text-muted-foreground/40 tracking-normal">
                        — auto-set from date
                      </span>
                    )}
                  </label>
                  <div className="relative" ref={typeDropdownRef}>
                    {/* Trigger */}
                    <button
                      type="button"
                      onClick={() => setTypeOpen((v) => !v)}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all cursor-pointer flex items-center gap-3 text-left"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: EVENT_TYPES.find((t) => t.value === type)?.color ?? "#0096FF" }}
                      />
                      <span className="flex-1 truncate">
                        {EVENT_TYPES.find((t) => t.value === type)?.label ?? "Select type"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground/60 flex-shrink-0 transition-transform duration-200 ${typeOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Options panel */}
                    <AnimatePresence>
                      {typeOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden"
                        >
                          <div className="max-h-64 overflow-y-auto py-1">
                            {EVENT_TYPES.map((t) => {
                              const selected = type === t.value;
                              return (
                                <button
                                  key={t.value}
                                  type="button"
                                  onClick={() => { setType(t.value as EventType); setTypeOpen(false); }}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                                    selected
                                      ? "bg-primary/8 text-foreground"
                                      : "text-foreground hover:bg-muted/60"
                                  }`}
                                >
                                  <span
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: t.color }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium leading-tight">{t.label}</div>
                                    <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">{t.description}</div>
                                  </div>
                                  {selected && (
                                    <span
                                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: t.color }}
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Star
                      className={`w-4 h-4 transition-colors ${featured ? "text-amber-400 fill-amber-400" : "text-muted-foreground/50"}`}
                    />
                    <span className="text-sm font-medium text-foreground/70">Featured Event</span>
                    <span className="text-xs text-muted-foreground/50 hidden sm:inline">— shown prominently on the homepage</span>
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

                {/* Images */}
                <div className="space-y-2">
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5">
                      <ImagePlus className="w-3 h-3" />
                      Event Images
                      <span className="text-muted-foreground/40 normal-case font-normal">(optional)</span>
                    </span>
                  </label>

                  {/* Uploaded thumbnails */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((url, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-border aspect-video">
                          <img
                            src={url}
                            alt={`Event image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 hover:bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Drop zone */}
                  <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handleImageFiles(e.dataTransfer.files); }}
                    className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/40 bg-card hover:bg-input transition-all cursor-pointer"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <span className="text-muted-foreground/60 text-xs">Uploading…</span>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="w-5 h-5 text-muted-foreground/50" />
                        <p className="text-muted-foreground/60 text-xs text-center">
                          Drop images here or <span className="text-primary">browse</span>
                        </p>
                        <p className="text-muted-foreground/40 text-[10px]">Max 5 MB · JPEG, PNG, WebP · Multiple allowed</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => { handleImageFiles(e.target.files); e.target.value = ""; }}
                    className="hidden"
                  />
                  {uploadError && (
                    <p className="text-red-400 text-xs">{uploadError}</p>
                  )}
                </div>
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
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isCreate ? (
                    <>
                      <CalendarPlus className="w-3.5 h-3.5" />
                      <span>Create Event</span>
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
