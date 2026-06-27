import { motion } from "framer-motion";
import { Pencil, Trash2, Users } from "lucide-react";
import type { Leader } from "@/api/leadership.service";

interface Props {
  leaders: Leader[];
  onEdit: (leader: Leader) => void;
  onDelete: (leader: Leader) => void;
}

export default function LeaderTable({ leaders, onEdit, onDelete }: Props) {
  if (leaders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-muted-foreground/40" />
        </div>
        <p className="text-muted-foreground font-medium">No leaders yet</p>
        <p className="text-muted-foreground/50 text-sm mt-1">Add your first department leader to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {["Photo", "Name", "Role", "Order", "Actions"].map((h) => (
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
          {leaders.map((leader, i) => (
            <motion.tr
              key={leader.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
            >
              {/* Photo */}
              <td className="px-4 py-3">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-10 h-10 rounded-xl object-cover border border-border"
                />
              </td>

              {/* Name */}
              <td className="px-4 py-3">
                <p className="text-foreground font-semibold leading-tight">{leader.name}</p>
              </td>

              {/* Role */}
              <td className="px-4 py-3">
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  {leader.role}
                </span>
              </td>

              {/* Order */}
              <td className="px-4 py-3">
                <span className="text-muted-foreground/60 text-xs font-mono">{leader.order}</span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(leader)}
                    className="w-8 h-8 rounded-lg bg-input hover:bg-primary/20 hover:text-primary text-muted-foreground flex items-center justify-center transition-all duration-200 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(leader)}
                    className="w-8 h-8 rounded-lg bg-input hover:bg-red-500/20 hover:text-red-400 text-muted-foreground flex items-center justify-center transition-all duration-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
