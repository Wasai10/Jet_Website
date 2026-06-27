import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Save, UserPlus } from "lucide-react";
import type { User, UpdateUserPayload, CreateUserAdminPayload } from "@/api/auth.service";

interface Props {
  open: boolean;
  user: User | null;
  currentUserRole: string;
  onClose: () => void;
  onSave: (id: string | null, payload: UpdateUserPayload | CreateUserAdminPayload) => Promise<void>;
}

export default function UserModal({ open, user, currentUserRole, onClose, onSave }: Props) {
  const isCreate = open && user === null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setFullName(user?.fullName ?? "");
      setEmail(user?.email ?? "");
      setRole(user?.role ?? "USER");
      setPassword("");
      setShowPassword(false);
      setError("");
    }
  }, [user, open]);

  const canSave = isCreate
    ? !!fullName.trim() && !!email.trim() && !!password
    : !!fullName.trim() && !!email.trim();

  const handleSave = async () => {
    if (!canSave) return;
    setError("");
    setLoading(true);
    try {
      if (isCreate) {
        await onSave(null, { fullName: fullName.trim(), email: email.trim(), password, role });
      } else {
        const payload: UpdateUserPayload = {};
        if (fullName.trim() !== user!.fullName) payload.fullName = fullName.trim();
        if (email.trim() !== user!.email) payload.email = email.trim();
        if (password) payload.password = password;
        if (role !== user!.role && currentUserRole === "ADMIN") payload.role = role;
        await onSave(user!.id, payload);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
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
            <div className="bg-card border border-border rounded-3xl p-7 w-full max-w-md shadow-[0_40px_80px_rgba(0,0,0,0.6)] pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                    isCreate
                      ? "bg-primary/15 border-primary/30"
                      : "bg-input border-border"
                  }`}>
                    {isCreate
                      ? <UserPlus className="w-4.5 h-4.5 text-primary" />
                      : <Save className="w-4 h-4 text-muted-foreground" />
                    }
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-lg leading-none">
                      {isCreate ? "New User" : "Edit User"}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {isCreate ? "Add a new member to the system" : "Update account details"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-input hover:bg-muted/50 text-muted-foreground hover:text-foreground flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/40 text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/40 text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    {isCreate ? (
                      <>Password <span className="text-red-400">*</span></>
                    ) : (
                      <>New Password <span className="normal-case text-muted-foreground/40">(leave blank to keep)</span></>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 pr-12 text-foreground placeholder-muted-foreground/40 text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Role — admins always see this */}
                {currentUserRole === "ADMIN" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Role</label>
                    <div className="flex gap-3">
                      {(["USER", "ADMIN"] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                            role === r
                              ? "bg-primary/15 border-primary/40 text-primary"
                              : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-7">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-40 text-sm font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !canSave}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all cursor-pointer ${
                    isCreate
                      ? "bg-[#0096FF] hover:bg-[#0080ee] shadow-[0_0_16px_rgba(0,150,255,0.3)]"
                      : "bg-[#0096FF] hover:bg-[#0080ee] shadow-[0_0_16px_rgba(0,150,255,0.3)]"
                  }`}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isCreate ? (
                    <><UserPlus className="w-3.5 h-3.5" /><span>Create User</span></>
                  ) : (
                    <><Save className="w-3.5 h-3.5" /><span>Save Changes</span></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
