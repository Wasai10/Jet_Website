import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useTheme } from "@/components/theme-provider";

const TITLES = {
  "/admin-dashboard": "Dashboard",
  "/admin-dashboard/users": "User Management",
  "/admin-dashboard/events": "Events",
  "/admin-dashboard/gallery": "Gallery",
  "/admin-dashboard/blog": "Blog",
  "/admin-dashboard/departmental-leadership": "Departmental Leadership",
  "/admin-dashboard/settings": "Settings",
};

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme } = useTheme();

  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isDark = theme === "dark" || (theme === "system" && systemDark);
  const sidebarWidth = collapsed ? 68 : 240;

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-background text-foreground`}>
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className="flex flex-col min-h-screen transition-all duration-[250ms] ease-in-out"
        style={{ paddingLeft: `${sidebarWidth}px` }}
      >
        <AdminHeader
          onMenuClick={() => setMobileOpen(true)}
          title={TITLES[pathname] ?? "Admin"}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
