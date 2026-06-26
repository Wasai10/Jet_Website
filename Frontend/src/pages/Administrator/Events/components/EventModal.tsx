import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarPlus, Save, Star, Image, Users } from "lucide-react";
import type { Event, CreateEventPayload, UpdateEventPayload } from "@/api/events.service";

const PRESET_COLORS = [
  "#0096FF", "#87CEEB", "#22C55E", "#A855F7", "#F59E0B", "#EF4444", "#EC4899",
];

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
function autoType(dateStr: string): "PAST" | "UPCOMING" {
  if (!dateStr) return "UPCOMING";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today ? "PAST" : "UPCOMING";
}

const inputCls =
  "w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-[#0096FF]/60 focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all";
const labelCls = "text-[11px] font-semibold text-white/40 uppercase tracking-widest";

export default function EventModal({ open, event, onClose, onSave }: Props) {
  const isCreate = open && event === null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tag, setTag] = useState("");
  const [color, setColor] = useState("#0096FF");
  const [type, setType] = useState<"UPCOMING" | "PAST" | "HOME_FELLOWSHIP">("UPCOMING");
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    // HOME_FELLOWSHIP is preserved; PAST/UPCOMING is always re-derived from the date
    setType(event?.type === "HOME_FELLOWSHIP" ? "HOME_FELLOWSHIP" : autoType(d));
    setFeatured(event?.featured ?? false);
    setImages((event?.images ?? []).join(", "));
    setError("");
  }, [event, open]);

  /** When the date changes, keep PAST/UPCOMING in sync; leave HOME_FELLOWSHIP alone. */
  const handleDateChange = (val: string) => {
    setDate(val);
    setType((prev) => (prev === "HOME_FELLOWSHIP" ? "HOME_FELLOWSHIP" : autoType(val)));
  };

  const canSave = !!title.trim() && !!description.trim() && !!location.trim() && !!date;

  const handleSave = async () => {
    if (!canSave) return;
    setError("");
    setLoading(true);
    try {
      const imagesArray = images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
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
        images: imagesArray.length > 0 ? imagesArray : undefined,
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
            <div className="bg-[#001726] border border-white/[0.1] rounded-3xl w-full max-w-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] pointer-events-auto max-h-[90vh] flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-white/[0.07] shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${isCreate ? "bg-[#0096FF]/15 border-[#0096FF]/25" : "bg-white/[0.06] border-white/[0.1]"}`}>
                    {isCreate
                      ? <CalendarPlus className="w-4 h-4 text-[#0096FF]" />
                      : <Save className="w-4 h-4 text-white/50" />}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-none">
                      {isCreate ? "New Event" : "Edit Event"}
                    </h3>
                    <p className="text-white/40 text-xs mt-0.5">
                      {isCreate ? "Add a ministry event" : "Update event details"}
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
                      className={`${inputCls} [color-scheme:dark]`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelCls}>
                      Time{" "}
                      <span className="text-white/20 normal-case font-normal">(optional)</span>
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
                      <span className="text-white/20 normal-case font-normal">(optional)</span>
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
                        className="ml-1 text-[10px] font-mono text-white/30"
                        style={{ color }}
                      >
                        {color}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Type — auto-derived from date; Fellowship is a manual override */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Event Type</label>
                  <div className="flex gap-2 items-stretch">
                    {/* Auto-detected badge */}
                    <div className="flex-1 flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        type === "HOME_FELLOWSHIP" ? "bg-purple-400" :
                        type === "PAST" ? "bg-green-400" : "bg-[#0096FF]"
                      }`} />
                      <span className="text-white/40 text-xs">Type:</span>
                      <span className={`text-xs font-semibold ${
                        type === "HOME_FELLOWSHIP" ? "text-purple-400" :
                        type === "PAST" ? "text-green-400" : "text-[#0096FF]"
                      }`}>
                        {type === "HOME_FELLOWSHIP" ? "Home Fellowship" : type === "PAST" ? "Past" : "Upcoming"}
                      </span>
                      {type !== "HOME_FELLOWSHIP" && (
                        <span className="text-white/20 text-[10px] ml-auto hidden sm:block">
                          auto from date
                        </span>
                      )}
                    </div>

                    {/* Home Fellowship toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        setType((prev) =>
                          prev === "HOME_FELLOWSHIP" ? autoType(date) : "HOME_FELLOWSHIP"
                        )
                      }
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                        type === "HOME_FELLOWSHIP"
                          ? "bg-purple-500/15 border-purple-500/40 text-purple-400"
                          : "bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.07]"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      Fellowship
                    </button>
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Star
                      className={`w-4 h-4 transition-colors ${featured ? "text-amber-400 fill-amber-400" : "text-white/25"}`}
                    />
                    <span className="text-sm font-medium text-white/70">Featured Event</span>
                    <span className="text-xs text-white/25 hidden sm:inline">— shown prominently on the homepage</span>
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

                {/* Images */}
                <div className="space-y-1.5">
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5">
                      <Image className="w-3 h-3" />
                      Image URLs
                      <span className="text-white/20 normal-case font-normal">(optional — comma separated)</span>
                    </span>
                  </label>
                  <textarea
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                    placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                    rows={2}
                    className={`${inputCls} resize-none`}
                  />
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
