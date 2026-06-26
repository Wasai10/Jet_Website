import { motion } from "framer-motion";
import { Pencil, Trash2, CalendarDays, Star } from "lucide-react";
import type { Event } from "@/api/events.service";

const TYPE_STYLES: Record<string, { label: string; cls: string }> = {
  UPCOMING: { label: "Upcoming", cls: "bg-[#0096FF]/15 text-[#0096FF] border-[#0096FF]/25" },
  PAST: { label: "Past", cls: "bg-green-500/15 text-green-400 border-green-500/25" },
  HOME_FELLOWSHIP: { label: "Fellowship", cls: "bg-purple-500/15 text-purple-400 border-purple-500/25" },
};

interface Props {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

export default function EventTable({ events, onEdit, onDelete }: Props) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
          <CalendarDays className="w-6 h-6 text-white/20" />
        </div>
        <p className="text-white/50 font-medium">No events found</p>
        <p className="text-white/25 text-sm mt-1">Try adjusting your search or filter</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {["Event", "Location", "Date & Time", "Tag", "Type", "Featured", "Actions"].map((h) => (
              <th
                key={h}
                className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-widest px-4 py-3 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((event, i) => {
            const typeStyle = TYPE_STYLES[event.type] ?? TYPE_STYLES.UPCOMING;
            return (
              <motion.tr
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
              >
                {/* Title */}
                <td className="px-4 py-3.5 max-w-[220px]">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-8 rounded-full shrink-0 opacity-70"
                      style={{ backgroundColor: event.color ?? "#0096FF" }}
                    />
                    <p className="text-white font-medium leading-tight truncate">{event.title}</p>
                  </div>
                </td>

                {/* Location */}
                <td className="px-4 py-3.5 text-white/50 max-w-[160px]">
                  <span className="truncate block">{event.location}</span>
                </td>

                {/* Date & Time */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <p className="text-white/80 text-xs">
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {event.time && (
                    <p className="text-white/35 text-[11px] mt-0.5">{event.time}</p>
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
                    <span className="text-white/20 text-xs">—</span>
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

                {/* Featured */}
                <td className="px-4 py-3.5">
                  {event.featured ? (
                    <span className="flex items-center gap-1 text-amber-400 text-[11px] font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      Yes
                    </span>
                  ) : (
                    <span className="text-white/20 text-xs">No</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(event)}
                      className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-[#0096FF]/20 hover:text-[#0096FF] text-white/40 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(event)}
                      className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-red-500/20 hover:text-red-400 text-white/40 flex items-center justify-center transition-all duration-200 cursor-pointer"
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
