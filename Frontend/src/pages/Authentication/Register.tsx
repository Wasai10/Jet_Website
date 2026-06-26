import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordStrong = password.length >= 6;
  const passwordsMatch = password === confirm && confirm.length > 0;

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!passwordsMatch) { setError("Passwords do not match."); return; }
    setError("");
    setLoading(true);
    try {
      await register({ fullName, email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#00111F] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#0096FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#0096FF]/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0096FF] to-[#0070CC] flex items-center justify-center shadow-[0_0_30px_rgba(0,150,255,0.5)]">
              <span className="text-white font-black text-base">JET</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">JET Ministries</p>
              <p className="text-white/40 text-xs mt-0.5">Create Account</p>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
          <p className="text-white/50 text-sm mb-8">Join JET Ministries community</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-6"
            >
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <p className="text-green-400 text-sm">Account created! Redirecting to login…</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm outline-none focus:border-[#0096FF]/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm outline-none focus:border-[#0096FF]/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 pr-12 text-white placeholder-white/25 text-sm outline-none focus:border-[#0096FF]/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <p className={`text-[11px] pl-1 ${passwordStrong ? "text-green-400" : "text-white/30"}`}>
                  {passwordStrong ? "✓ Strong enough" : "At least 6 characters required"}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                required
                className={`w-full bg-white/[0.05] border rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm outline-none transition-all duration-200
                  ${confirm.length > 0
                    ? passwordsMatch
                      ? "border-green-500/40 focus:border-green-500/60 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)]"
                      : "border-red-500/40 focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                    : "border-white/[0.08] focus:border-[#0096FF]/60 focus:shadow-[0_0_0_3px_rgba(0,150,255,0.1)]"
                  } focus:bg-white/[0.07]`}
              />
              {confirm.length > 0 && !passwordsMatch && (
                <p className="text-[11px] text-red-400 pl-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !fullName || !email || !passwordStrong || !passwordsMatch}
              className="w-full flex items-center justify-center gap-2 bg-[#0096FF] hover:bg-[#0080ee] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(0,150,255,0.3)] hover:shadow-[0_0_30px_rgba(0,150,255,0.5)] mt-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#0096FF] hover:text-[#40b0ff] transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
