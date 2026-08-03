import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, CalendarPlus } from "lucide-react";
import {
  eventsService,
  type Event,
  type EventType,
  type CreateEventPayload,
  type UpdateEventPayload,
} from "@/api/events.service";
import jetSwal from "@/lib/swal";
import EventTable from "./components/EventTable";
import EventModal from "./components/EventModal";
import EventRsvpModal from "./components/EventRsvpModal";

type ModalTarget = Event | "new" | null;

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<EventType | "ALL">("ALL");
  const [modalTarget, setModalTarget] = useState<ModalTarget>(null);
  const [rsvpEvent, setRsvpEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      setEvents(await eventsService.getAll());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async (
    id: string | null,
    payload: CreateEventPayload | UpdateEventPayload
  ) => {
    if (id === null) {
      await eventsService.create(payload as CreateEventPayload);
    } else {
      await eventsService.update(id, payload as UpdateEventPayload);
    }
    setModalTarget(null);
    await fetchEvents();
    jetSwal.fire({
      icon: "success",
      title: id === null ? "Event Created!" : "Event Updated!",
      text: id === null
        ? "The new event has been added successfully."
        : "Event details have been updated.",
      timer: 2200,
      showConfirmButton: false,
    });
  };

  const handleDelete = async (event: Event) => {
    const result = await jetSwal.fire({
      title: "Delete Event?",
      html: `Are you sure you want to remove <strong>${event.title}</strong>?<br/><span style="font-size:0.8125rem;opacity:0.45;display:block;margin-top:4px">This action cannot be undone.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "jet-swal-popup",
        title: "jet-swal-title",
        htmlContainer: "jet-swal-content",
        confirmButton: "jet-swal-confirm jet-swal-danger",
        cancelButton: "jet-swal-cancel",
      },
    });

    if (!result.isConfirmed) return;

    jetSwal.fire({
      title: "Deleting event…",
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: { popup: "jet-swal-popup", title: "jet-swal-title" },
      didOpen: () => jetSwal.showLoading(),
    });

    try {
      await eventsService.remove(event.id);
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
      jetSwal.fire({
        icon: "success",
        title: "Deleted!",
        text: `"${event.title}" has been removed.`,
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err) {
      jetSwal.fire({
        icon: "error",
        title: "Failed to Delete",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  };

  const filtered = events
    .filter((e) => typeFilter === "ALL" || e.type === typeFilter)
    .filter(
      (e) =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase()) ||
        (e.tag ?? "").toLowerCase().includes(search.toLowerCase())
    );

  const editEvent = modalTarget === "new" || modalTarget === null ? null : modalTarget;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground">All Events</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{events.length} total events</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2.5 w-48">
            <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events…"
              className="bg-transparent text-sm text-foreground placeholder-muted-foreground/40 outline-none w-full"
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as EventType | "ALL")}
            className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground/70 outline-none cursor-pointer hover:border-border transition-colors"
          >
            <option value="ALL">All Types</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="PAST">Past</option>
            <option value="HOME_FELLOWSHIP">Fellowship</option>
          </select>

          {/* Refresh */}
          <button
            onClick={fetchEvents}
            title="Refresh"
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* New Event */}
          <button
            onClick={() => setModalTarget("new")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0096FF] hover:bg-[#0080ee] text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(0,150,255,0.25)] cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card backdrop-blur-xl border border-border overflow-hidden"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-2 border-[#0096FF]/15 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-[#0096FF] rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground/60 text-sm">Loading events…</p>
          </div>
        ) : (
          <EventTable
            events={filtered}
            onEdit={(e) => setModalTarget(e)}
            onDelete={handleDelete}
            onViewRsvps={setRsvpEvent}
          />
        )}

        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border">
            <p className="text-muted-foreground/60 text-xs">
              Showing {filtered.length} of {events.length} events
            </p>
          </div>
        )}
      </motion.div>

      {/* Create / Edit modal */}
      <EventModal
        open={modalTarget !== null}
        event={editEvent}
        onClose={() => setModalTarget(null)}
        onSave={handleSave}
      />
      <EventRsvpModal event={rsvpEvent} onClose={() => setRsvpEvent(null)} />
    </div>
  );
}
