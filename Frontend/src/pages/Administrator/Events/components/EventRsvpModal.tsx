import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Mail, Phone, UsersRound, X } from "lucide-react";
import { eventsService, type Event, type EventRsvp } from "@/api/events.service";

interface Props {
  event: Event | null;
  onClose: () => void;
}

export default function EventRsvpModal({ event, onClose }: Props) {
  const [rsvps, setRsvps] = useState<EventRsvp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!event) return;
    setLoading(true); setError("");
    eventsService.getRsvps(event.id)
      .then(setRsvps)
      .catch((err: Error) => setError(err.message || "Could not load RSVPs."))
      .finally(() => setLoading(false));
  }, [event]);

  const attendeeCount = rsvps.reduce((total, rsvp) => total + rsvp.guests, 0);

  return <AnimatePresence>{event && <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} className="fixed inset-0 z-50 grid place-items-center p-4 pointer-events-none">
      <section className="w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden rounded-3xl bg-card border border-border shadow-2xl pointer-events-auto">
        <header className="flex items-start justify-between gap-5 px-6 py-5 border-b border-border">
          <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Event attendance</p><h2 className="mt-1 text-xl font-bold text-foreground">{event.title}</h2><p className="mt-1 text-sm text-muted-foreground">{rsvps.length} RSVPs · {attendeeCount} people attending</p></div>
          <button onClick={onClose} aria-label="Close RSVPs" className="w-9 h-9 grid place-items-center rounded-xl bg-input text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </header>
        <div className="overflow-auto flex-1">
          {loading && <div className="py-20 text-center text-muted-foreground">Loading RSVPs…</div>}
          {error && <div className="m-6 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-500">{error}</div>}
          {!loading && !error && rsvps.length === 0 && <div className="py-20 text-center"><UsersRound className="w-9 h-9 mx-auto text-muted-foreground/35 mb-3" /><p className="font-medium text-foreground">No RSVPs yet</p><p className="mt-1 text-sm text-muted-foreground">Registrations will appear here as people RSVP.</p></div>}
          {!loading && !error && rsvps.length > 0 && <table className="w-full min-w-[700px] text-sm"><thead className="sticky top-0 bg-card border-b border-border"><tr>{["Name", "Contact", "Guests", "Note", "RSVP date"].map((heading) => <th key={heading} className="px-5 py-3 text-left text-[11px] uppercase tracking-widest text-muted-foreground">{heading}</th>)}</tr></thead><tbody>{rsvps.map((rsvp) => <tr key={rsvp.id} className="border-b border-border/60"><td className="px-5 py-4 font-medium text-foreground">{rsvp.fullName}</td><td className="px-5 py-4 text-muted-foreground"><p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{rsvp.email}</p>{rsvp.phone && <p className="mt-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{rsvp.phone}</p>}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-primary"><UsersRound className="w-3.5 h-3.5" />{rsvp.guests}</span></td><td className="px-5 py-4 text-muted-foreground max-w-52">{rsvp.notes || "—"}</td><td className="px-5 py-4 text-muted-foreground whitespace-nowrap"><span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{new Date(rsvp.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span></td></tr>)}</tbody></table>}
        </div>
      </section>
    </motion.div>
  </>}</AnimatePresence>;
}
