import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, UsersRound, Mail, Phone, CalendarDays, Download, CheckCircle2 } from "lucide-react";
import { eventsService, type EventRsvp } from "@/api/events.service";

export default function AdminRegistrations() {
  const [rsvps, setRsvps] = useState<EventRsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("ALL");

  const fetchRsvps = async () => {
    setLoading(true);
    try {
      setRsvps(await eventsService.getAllRsvps());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRsvps();
  }, []);

  const eventTitles = Array.from(new Set(rsvps.map((r) => r.event?.title).filter(Boolean)));

  const filtered = rsvps
    .filter((r) => eventFilter === "ALL" || r.event?.title === eventFilter)
    .filter(
      (r) =>
        r.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        (r.phone || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.event?.title || "").toLowerCase().includes(search.toLowerCase())
    );

  const totalGuests = filtered.reduce((sum, r) => sum + (r.guests || 1), 0);

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ["Event", "Full Name", "Email", "Phone", "Guests", "Notes", "RSVP Date"];
    const rows = filtered.map((r) => [
      `"${r.event?.title || "N/A"}"`,
      `"${r.fullName}"`,
      `"${r.email}"`,
      `"${r.phone || ""}"`,
      r.guests,
      `"${(r.notes || "").replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JET_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <UsersRound className="w-5 h-5 text-primary" /> Master Registrations & RSVPs
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {rsvps.length} Total Registrations · {totalGuests} People Attending
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
              placeholder="Search registrants…"
              className="bg-transparent text-xs text-foreground placeholder-muted-foreground/40 outline-none w-full"
            />
          </div>

          {/* Event Filter */}
          {eventTitles.length > 0 && (
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-card border border-border rounded-xl px-3 py-2.5 text-xs text-foreground/80 outline-none cursor-pointer max-w-44 truncate"
            >
              <option value="ALL">All Events</option>
              {eventTitles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}

          {/* Refresh */}
          <button
            onClick={fetchRsvps}
            title="Refresh"
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </motion.div>

      {/* Registrations Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border overflow-hidden rounded-2xl shadow-xl"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Loading registrations…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UsersRound className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="font-bold text-foreground text-base">No registrations found</p>
            <p className="text-muted-foreground text-xs mt-1">Registrations will appear here as users RSVP for events.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {["Registrant", "Event", "Contact", "Guests", "Note", "Registration Date"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((rsvp, idx) => (
                  <tr key={rsvp.id || idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{rsvp.fullName}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-medium text-primary max-w-56 truncate">
                      {rsvp.event?.title || "Event"}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground text-xs space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground/70" />
                        <span>{rsvp.email}</span>
                      </div>
                      {rsvp.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground/70" />
                          <span>{rsvp.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-bold text-primary px-2.5 py-1 rounded-full bg-primary/10 text-xs">
                        <UsersRound className="w-3.5 h-3.5" />
                        {rsvp.guests || 1}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-muted-foreground text-xs max-w-48 truncate">
                      {rsvp.notes || "—"}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-muted-foreground/70" />
                        <span>
                          {new Date(rsvp.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
