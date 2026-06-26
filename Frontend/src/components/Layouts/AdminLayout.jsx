import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const TITLES = {
  "/admin-dashboard": "Dashboard",
  "/admin-dashboard/users": "User Management",
  "/admin-dashboard/events": "Events",
  "/admin-dashboard/gallery": "Gallery",
  "/admin-dashboard/blog": "Blog",
  "/admin-dashboard/settings": "Settings",
};

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const sidebarWidth = collapsed ? 68 : 240;

  return (
    <div className="min-h-screen bg-[#00111F] text-white">
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
