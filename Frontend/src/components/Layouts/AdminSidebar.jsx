import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, CalendarDays, ImageIcon,
  BookOpen, Settings, LogOut, ChevronLeft, ChevronRight, X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { to: "/admin-dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin-dashboard/users", label: "Users", icon: Users },
  { to: "/admin-dashboard/events", label: "Events", icon: CalendarDays },
  { to: "/admin-dashboard/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin-dashboard/blog", label: "Blog", icon: BookOpen },
  { to: "/admin-dashboard/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-6 border-b border-white/[0.06] ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0096FF] to-[#0070CC] flex items-center justify-center shadow-[0_0_20px_rgba(0,150,255,0.4)] shrink-0">
          <span className="text-white font-black text-sm">JET</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-sm leading-none">JET Ministries</p>
            <p className="text-white/40 text-[10px] mt-0.5">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen?.(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group
              ${isActive
                ? "bg-[#0096FF]/15 text-[#0096FF] shadow-[inset_0_0_0_1px_rgba(0,150,255,0.3)]"
                : "text-white/50 hover:text-white hover:bg-white/[0.06]"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 border-t border-white/[0.06] pt-4 space-y-2">
        {!collapsed && user && (
          <div className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <p className="text-white text-xs font-semibold truncate">{user.fullName}</p>
            <p className="text-white/40 text-[10px] truncate">{user.email}</p>
            <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-widest bg-[#0096FF]/20 text-[#0096FF] px-2 py-0.5 rounded-full">
              {user.role}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col h-screen bg-[#001726] border-r border-white/[0.06] fixed left-0 top-0 z-30 overflow-hidden"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-6 -right-3 w-6 h-6 bg-[#001726] border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer shadow-lg"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 h-full w-[260px] bg-[#001726] border-r border-white/[0.06] z-50"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
