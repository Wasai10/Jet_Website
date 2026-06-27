import { Menu, Bell, Search, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/theme-provider";

export default function AdminHeader({ onMenuClick, title = "Dashboard" }) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <header className="h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-foreground font-semibold text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 border border-border rounded-xl px-3 py-2 w-52">
          <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-foreground placeholder-muted-foreground/50 outline-none w-full"
          />
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="w-9 h-9 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0096FF] to-[#0070CC] flex items-center justify-center shadow-[0_0_12px_rgba(0,150,255,0.4)] shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.fullName?.charAt(0).toUpperCase() ?? "A"}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-foreground text-xs font-semibold leading-none">{user?.fullName ?? "Admin"}</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
