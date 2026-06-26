import { motion } from "framer-motion";
import { Pencil, Trash2, ShieldCheck, User } from "lucide-react";
import type { User as UserType } from "@/api/auth.service";

interface Props {
  users: UserType[];
  currentUserId: string;
  onEdit: (user: UserType) => void;
  onDelete: (user: UserType) => void;
}

export default function UserTable({ users, currentUserId, onEdit, onDelete }: Props) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
          <User className="w-6 h-6 text-white/20" />
        </div>
        <p className="text-white/50 font-medium">No users found</p>
        <p className="text-white/25 text-sm mt-1">Try adjusting your search</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
              <th key={h} className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-widest px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0096FF]/40 to-[#0070CC]/40 flex items-center justify-center text-white text-xs font-bold shrink-0 border border-white/10">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium leading-none">
                      {user.fullName}
                      {user.id === currentUserId && (
                        <span className="ml-2 text-[9px] bg-[#0096FF]/20 text-[#0096FF] px-1.5 py-0.5 rounded-full font-bold">YOU</span>
                      )}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">{user.id.slice(0, 8)}…</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-white/60">{user.email}</td>
              <td className="px-4 py-3.5">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                  user.role === "ADMIN"
                    ? "bg-[#0096FF]/15 text-[#0096FF] border border-[#0096FF]/25"
                    : "bg-white/[0.06] text-white/50 border border-white/[0.08]"
                }`}>
                  {user.role === "ADMIN" ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3.5 text-white/40 text-xs">
                {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(user)}
                    className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-[#0096FF]/20 hover:text-[#0096FF] text-white/40 flex items-center justify-center transition-all duration-200 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    disabled={user.id === currentUserId}
                    className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-red-500/20 hover:text-red-400 text-white/40 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 cursor-pointer"
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
