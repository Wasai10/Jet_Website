import { motion } from "framer-motion";
import { Users, CalendarDays, ImageIcon, BookOpen, TrendingUp, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: "easeOut" } },
});

const stats = [
  { label: "Total Users", value: "—", icon: Users, color: "#0096FF", glow: "rgba(0,150,255,0.2)" },
  { label: "Upcoming Events", value: "—", icon: CalendarDays, color: "#22C55E", glow: "rgba(34,197,94,0.2)" },
  { label: "Gallery Photos", value: "—", icon: ImageIcon, color: "#A855F7", glow: "rgba(168,85,247,0.2)" },
  { label: "Blog Posts", value: "—", icon: BookOpen, color: "#F59E0B", glow: "rgba(245,158,11,0.2)" },
];

const quickLinks = [
  { label: "Manage Users", href: "/admin-dashboard/users", icon: Users, desc: "View, edit and delete user accounts" },
  { label: "Manage Events", href: "/admin-dashboard/events", icon: CalendarDays, desc: "Create and schedule ministry events" },
  { label: "Manage Gallery", href: "/admin-dashboard/gallery", icon: ImageIcon, desc: "Upload and organise gallery photos" },
  { label: "Manage Blog", href: "/admin-dashboard/blog", icon: BookOpen, desc: "Write and publish blog posts" },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <motion.div {...fadeUp(0)}>
        <h2 className="text-2xl font-bold text-white">
          Good to see you, {user?.fullName?.split(" ")[0]} 👋
        </h2>
        <p className="text-white/40 text-sm mt-1">Here's what's happening with JET Ministries today.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, glow }, i) => (
          <motion.div key={label} {...fadeUp(i * 0.08)}
            className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}18`, boxShadow: `0 0 16px ${glow}` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <TrendingUp className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-white/40 text-xs mt-1 font-medium">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <motion.div {...fadeUp(0.2)}>
        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ label, href, icon: Icon, desc }, i) => (
            <motion.a
              key={label}
              href={href}
              {...fadeUp(0.2 + i * 0.07)}
              className="group bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-[#0096FF]/[0.08] hover:border-[#0096FF]/30 hover:shadow-[0_0_24px_rgba(0,150,255,0.08)] transition-all duration-300 cursor-pointer block"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center group-hover:bg-[#0096FF]/20 transition-colors">
                  <Icon className="w-4 h-4 text-white/50 group-hover:text-[#0096FF] transition-colors" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-[#0096FF] transition-colors" />
              </div>
              <p className="text-white font-semibold text-sm">{label}</p>
              <p className="text-white/40 text-xs mt-1 leading-relaxed">{desc}</p>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Info card */}
      <motion.div {...fadeUp(0.35)}
        className="bg-gradient-to-r from-[#0096FF]/10 to-transparent border border-[#0096FF]/20 rounded-2xl p-6 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#0096FF]/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,150,255,0.3)]">
          <TrendingUp className="w-6 h-6 text-[#0096FF]" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Analytics coming soon</p>
          <p className="text-white/40 text-xs mt-0.5">Real-time stats and charts will appear here once connected to the live data.</p>
        </div>
      </motion.div>
    </div>
  );
}
