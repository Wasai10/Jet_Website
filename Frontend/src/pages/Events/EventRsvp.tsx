import { type FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, CheckCircle2, Clock, MapPin, Users } from "lucide-react";
import { eventsService, type Event } from "@/api/events.service";

const fmtDate = (date: string) => new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function EventRsvp() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", guests: "1", notes: "" });

  useEffect(() => {
    if (!id) return;
    eventsService.getById(id).then(setEvent).catch((err: Error) => setError(err.message || "This event could not be found.")).finally(() => setLoading(false));
  }, [id]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true); setError("");
    try {
      await eventsService.rsvp(id, { fullName: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim() || undefined, guests: Number(form.guests), notes: form.notes.trim() || undefined });
      setComplete(true);
    } catch (err) { setError(err instanceof Error ? err.message : "We could not save your RSVP."); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-[65vh] grid place-items-center text-muted-foreground">Loading event…</div>;
  if (!event) return <div className="min-h-[65vh] grid place-items-center text-muted-foreground">{error || "Event not found."}</div>;
  if (complete) return <section className="min-h-[65vh] grid place-items-center px-4"><div className="max-w-lg text-center bg-card border border-border rounded-3xl p-10 shadow-xl"><CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-5" /><h1 className="text-2xl font-bold text-foreground">You’re on the list!</h1><p className="mt-3 text-muted-foreground">Your RSVP for <strong className="text-foreground">{event.title}</strong> has been received. We look forward to seeing you.</p><Link to="/events" className="inline-flex mt-7 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">Back to events</Link></div></section>;

  return <section className="py-14 md:py-20 px-4"><div className="max-w-5xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-7">
    <aside className="rounded-3xl overflow-hidden bg-card border border-border">{event.images?.[0] && <img src={event.images[0]} alt={`${event.title} poster`} className="w-full aspect-[4/3] object-cover" />}<div className="p-7"><span className="text-xs font-bold uppercase tracking-widest text-primary">{event.tag || event.type.replaceAll("_", " ")}</span><h1 className="mt-3 text-2xl font-black text-foreground">{event.title}</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.description}</p><dl className="mt-6 space-y-3 text-sm text-muted-foreground"><div className="flex gap-3"><Calendar className="w-4 h-4 text-primary" /><dd>{fmtDate(event.date)}</dd></div>{event.time && <div className="flex gap-3"><Clock className="w-4 h-4 text-primary" /><dd>{event.time}</dd></div>}<div className="flex gap-3"><MapPin className="w-4 h-4 text-primary" /><dd>{event.location}</dd></div></dl></div></aside>
    <div className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-xl"><div className="flex items-center gap-3 mb-7"><div className="p-3 rounded-2xl bg-primary/10"><Users className="w-5 h-5 text-primary" /></div><div><h2 className="font-bold text-xl text-foreground">RSVP for this event</h2><p className="text-sm text-muted-foreground">Please share your details below.</p></div></div>{error && <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-500">{error}</div>}<form onSubmit={submit} className="space-y-4"><label className="block text-sm font-medium text-foreground">Full name<input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1.5 w-full rounded-xl bg-input border border-border px-4 py-3 outline-none focus:border-primary" /></label><label className="block text-sm font-medium text-foreground">Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5 w-full rounded-xl bg-input border border-border px-4 py-3 outline-none focus:border-primary" /></label><div className="grid sm:grid-cols-2 gap-4"><label className="block text-sm font-medium text-foreground">Phone <span className="text-muted-foreground">(optional)</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5 w-full rounded-xl bg-input border border-border px-4 py-3 outline-none focus:border-primary" /></label><label className="block text-sm font-medium text-foreground">People attending<select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className="mt-1.5 w-full rounded-xl bg-input border border-border px-4 py-3 outline-none focus:border-primary">{Array.from({ length: 10 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select></label></div><label className="block text-sm font-medium text-foreground">Note <span className="text-muted-foreground">(optional)</span><textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1.5 w-full resize-none rounded-xl bg-input border border-border px-4 py-3 outline-none focus:border-primary" placeholder="Anything we should know?" /></label><button disabled={submitting} className="w-full rounded-xl bg-primary py-3.5 font-bold text-primary-foreground disabled:opacity-50">{submitting ? "Sending RSVP…" : "Confirm RSVP"}</button></form></div>
  </div></section>;
}
