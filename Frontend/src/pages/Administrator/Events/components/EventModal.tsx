import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarPlus, Save, Star, ChevronDown, Sparkles, Users } from "lucide-react";
import { type Event, type CreateEventPayload, type UpdateEventPayload, type EventOwnership } from "@/api/events.service";

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
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [tag, setTag] = useState("");
  const [type, setType] = useState<EventType>("UPCOMING");
  const [ownership, setOwnership] = useState<EventOwnership>("PARTNERSHIP");
  const [coverImage, setCoverImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const [typeOpen, setTypeOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const d = toDateInput(event?.date);
    const ed = toDateInput(event?.endDate);
    setTitle(event?.title ?? "");
    setDescription(event?.description ?? "");
    setLocation(event?.location ?? "");
    setDate(d);
    setEndDate(ed);
    setTime(event?.time ?? "");
    setTag(event?.tag ?? "");
    const storedType = event?.type as EventType | undefined;
    const isDateDerived = !storedType || storedType === "PAST" || storedType === "UPCOMING";
    setType(isDateDerived ? autoType(d) : storedType);

    setOwnership(event?.ownership === "JET" ? "JET" : "PARTNERSHIP");
    setCoverImage(event?.coverImage ?? (Array.isArray(event?.images) ? event.images[0] : ""));
    setFeatured(event?.featured ?? false);
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

  const handleDateChange = (val: string) => {
    setDate(val);
    setType((prev) => (prev === "PAST" || prev === "UPCOMING") ? autoType(val) : prev);
  };

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
        endDate: endDate || undefined,
        time: time.trim() || undefined,
        tag: tag.trim() || undefined,
        type,
        ownership,
        coverImage: coverImage || undefined,
        featured,
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
                    placeholder="e.g. Annual JET Missions & Outreach"
                    className={inputCls}
                  />
                </div>

                {/* Ownership Selection (JET vs Partnership) */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Event Classification (Ownership)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOwnership("JET")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        ownership === "JET"
                          ? "bg-primary/15 text-primary border-primary shadow-sm"
                          : "bg-input border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>JET Event</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOwnership("PARTNERSHIP")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        ownership === "PARTNERSHIP"
                          ? "bg-purple-500/15 text-purple-400 border-purple-500 shadow-sm"
                          : "bg-input border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Partnership Event</span>
                    </button>
                  </div>
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
                    placeholder="e.g. JET Main Auditorium"
                    className={inputCls}
                  />
                </div>

                {/* From Date + To Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelCls}>
                      From Date <span className="text-red-400">*</span>
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
                      To Date <span className="text-muted-foreground/40 normal-case font-normal">(optional)</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`${inputCls} dark:[color-scheme:dark] [color-scheme:light]`}
                    />
                  </div>
                </div>

                {/* Time + Tag */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelCls}>
                      Time <span className="text-muted-foreground/40 normal-case font-normal">(e.g. 09:00 AM – 05:00 PM)</span>
                    </label>
                    <input
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. 09:00 AM – 05:00 PM"
                      className={inputCls}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelCls}>Tag</label>
                    <input
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="e.g. Mission, Youth, Prayer"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Background Cover Image Photo URL */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Background Photo Image URL</label>
                  <input
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className={inputCls}
                  />
                  <p className="text-[10px] text-muted-foreground">URL of cover background photo displayed on event cards.</p>
                </div>

                {/* Event Type dropdown */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Event Category Type</label>
                  <div className="relative" ref={typeDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setTypeOpen((v) => !v)}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:border-primary/50 transition-all cursor-pointer flex items-center gap-3 text-left"
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

                    <AnimatePresence>
                      {typeOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
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
                                    selected ? "bg-primary/10 text-foreground font-bold" : "text-foreground hover:bg-muted/60"
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
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0096FF] hover:bg-[#0080ee] disabled:opacity-40 text-white text-sm font-semibold transition-all shadow-md cursor-pointer"
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
