import { motion } from "framer-motion";
import { Layers, Pencil, Trash2 } from "lucide-react";
import type { Department } from "@/api/department.service";

interface Props {
  departments: Department[];
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}

export default function DepartmentGrid({ departments, onEdit, onDelete }: Props) {
  if (departments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
          <Layers className="w-6 h-6 text-muted-foreground/40" />
        </div>
        <p className="text-muted-foreground font-medium">No ministries yet</p>
        <p className="text-muted-foreground/50 text-sm mt-1">Create your first ministry department to get started</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {departments.map((dept, i) => (
        <motion.div
          key={dept.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="relative rounded-2xl overflow-hidden border border-border bg-input group h-48"
        >
          {/* Background */}
          {dept.backgroundImage ? (
            <img
              src={dept.backgroundImage}
              alt={dept.name}
              className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-300 group-hover:opacity-70"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-4">
            {/* Action buttons — top right, visible on hover */}
            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(dept)}
                className="w-8 h-8 rounded-lg bg-black/50 hover:bg-primary/70 text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(dept)}
                className="w-8 h-8 rounded-lg bg-black/50 hover:bg-red-500/70 text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom info */}
            <div className="flex items-end justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base leading-tight truncate">{dept.name}</p>
                <p className="text-white/60 text-xs mt-0.5 line-clamp-2">{dept.description}</p>
              </div>
              {/* Leader avatar */}
              <div className="flex flex-col items-center shrink-0 ml-2">
                <img
                  src={dept.leader.image}
                  alt={dept.leader.name}
                  className="w-10 h-10 rounded-full border-2 border-primary object-cover shadow-lg"
                />
                <span className="text-[9px] uppercase font-bold text-primary mt-1 text-center w-16 leading-tight truncate">
                  {dept.leader.name.split(" ")[0]}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
