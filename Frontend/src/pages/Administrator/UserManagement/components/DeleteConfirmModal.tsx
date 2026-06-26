import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { User } from "@/api/auth.service";

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function DeleteConfirmModal({ open, user, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await onConfirm(user.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[#001726] border border-white/[0.1] rounded-3xl p-7 w-full max-w-sm shadow-[0_40px_80px_rgba(0,0,0,0.6)] pointer-events-auto">
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] text-white/40 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-white font-bold text-lg mb-2">Delete User</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="text-white font-semibold">{user?.fullName}</span>?
                This action cannot be undone.
              </p>

              <div className="flex gap-3 mt-7">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 text-sm font-medium transition-all cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(239,68,68,0.25)] cursor-pointer"
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><Trash2 className="w-3.5 h-3.5" /><span>Delete</span></>
                  }
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
