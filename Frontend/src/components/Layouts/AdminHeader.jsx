import { Menu, Bell, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminHeader({ onMenuClick, title = "Dashboard" }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[#00111F]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-white font-semibold text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 w-52">
          <Search className="w-4 h-4 text-white/30 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full"
          />
        </div>

        <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#0096FF] rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0096FF] to-[#0070CC] flex items-center justify-center shadow-[0_0_12px_rgba(0,150,255,0.4)] shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.fullName?.charAt(0).toUpperCase() ?? "A"}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-white text-xs font-semibold leading-none">{user?.fullName ?? "Admin"}</p>
            <p className="text-white/40 text-[10px] mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
