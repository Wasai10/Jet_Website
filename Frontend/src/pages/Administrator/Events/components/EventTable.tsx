import { motion } from "framer-motion";
import { Pencil, Trash2, CalendarDays, UsersRound, Sparkles, Users } from "lucide-react";
import type { Event } from "@/api/events.service";

const TYPE_STYLES: Record<string, { label: string; cls: string }> = {
  UPCOMING: { label: "Upcoming", cls: "bg-primary/15 text-primary border-primary/30" },
  PAST: { label: "Past", cls: "bg-green-500/15 text-green-400 border-green-500/25" },
  HOME_FELLOWSHIP: { label: "Fellowship", cls: "bg-purple-500/15 text-purple-400 border-purple-500/25" },
};

interface Props {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onViewRsvps: (event: Event) => void;
}

function formatDate(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function checkIsJetEvent(event: Event) {
  if (event.ownership === "JET") return true;
  if (event.ownership === "PARTNERSHIP") return false;
  const titleLower = (event.title || "").toLowerCase();
  const tagLower = (event.tag || "").toLowerCase();
  return (
    titleLower.includes("mission") ||
    titleLower.includes("ossen") ||
    titleLower.includes("impact conference") ||
    titleLower.includes("house fellowship") ||
    tagLower.includes("mission") ||
    event.type === "HOME_FELLOWSHIP"
  );
}

export default function EventTable({ events, onEdit, onDelete, onViewRsvps }: Props) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
          <CalendarDays className="w-6 h-6 text-muted-foreground/40" />
        </div>
        <p className="text-muted-foreground font-medium">No events found</p>
        <p className="text-muted-foreground/50 text-sm mt-1">Try adjusting your search or filter</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {["Event & Class", "Location", "Date Range & Time", "Tag", "Type", "Registrations", "Actions"].map((h) => (
              <th
                key={h}
                className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-widest px-4 py-3 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((event, i) => {
            const typeStyle = TYPE_STYLES[event.type] ?? TYPE_STYLES.UPCOMING;
            const isJet = checkIsJetEvent(event);
            return (
              <motion.tr
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
              >
                {/* Title & Classification */}
                <td className="px-4 py-3.5 max-w-[240px]">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-1.5 h-10 rounded-full shrink-0 opacity-80 mt-0.5"
                      style={{ backgroundColor: event.color ?? "#0096FF" }}
                    />
                    <div>
                      <p className="text-foreground font-bold leading-snug truncate">{event.title}</p>
                      <div className="mt-1">
                        {isJet ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0096FF]/15 text-[#0096FF] border border-[#0096FF]/30">
                            <Sparkles className="w-2.5 h-2.5" /> JET Event
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                            <Users className="w-2.5 h-2.5" /> Partnership
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Location */}
                <td className="px-4 py-3.5 text-muted-foreground max-w-[160px]">
                  <span className="truncate block">{event.location}</span>
                </td>

                {/* Date Range & Time */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <p className="text-foreground/90 text-xs font-semibold">
                    From: {formatDate(event.date)}
                  </p>
                  {event.endDate && (
                    <p className="text-muted-foreground text-xs">
                      To: {formatDate(event.endDate)}
                    </p>
                  )}
                  {event.time && (
                    <p className="text-amber-400/90 text-[11px] mt-0.5 font-medium">Time: {event.time}</p>
                  )}
                </td>

                {/* Tag */}
                <td className="px-4 py-3.5">
                  {event.tag ? (
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                      style={{
                        color: event.color ?? "#0096FF",
                        borderColor: `${event.color ?? "#0096FF"}33`,
                        backgroundColor: `${event.color ?? "#0096FF"}11`,
                      }}
                    >
                      {event.tag}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/40 text-xs">—</span>
                  )}
                </td>

                {/* Type */}
                <td className="px-4 py-3.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${typeStyle.cls}`}
                  >
                    {typeStyle.label}
                  </span>
                </td>

                {/* View RSVPs Button */}
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => onViewRsvps(event)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                  >
                    <UsersRound className="w-3.5 h-3.5" />
                    <span>View RSVPs</span>
                  </button>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(event)}
                      title="Edit event"
                      className="w-8 h-8 rounded-lg bg-input hover:bg-primary/20 hover:text-primary text-muted-foreground flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(event)}
                      title="Delete event"
                      className="w-8 h-8 rounded-lg bg-input hover:bg-red-500/20 hover:text-red-400 text-muted-foreground flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
