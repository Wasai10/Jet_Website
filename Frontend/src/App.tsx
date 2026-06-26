import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public layouts & pages
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Home from "@/pages/Landing/Home";
import Gallery from "@/pages/Gallery/Gallery";
import About from "@/pages/About/About";
import Events from "@/pages/Events/Events";
import Blog from "@/pages/Blog/Blog";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";

// Admin layout & pages
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminDashboard from "@/pages/Administrator/Dashboard/AdminDashboard";
import Users from "@/pages/Administrator/UserManagement/Users";
import AdminEvents from "@/pages/Administrator/Events/AdminEvents";
import AdminGallery from "@/pages/Administrator/Gallery/AdminGallery";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<DefaultLayout><Home /></DefaultLayout>} />
          <Route path="/gallery" element={<DefaultLayout><Gallery /></DefaultLayout>} />
          <Route path="/about" element={<DefaultLayout><About /></DefaultLayout>} />
          <Route path="/events" element={<DefaultLayout><Events /></DefaultLayout>} />
          <Route path="/blog" element={<DefaultLayout><Blog /></DefaultLayout>} />

          {/* Auth routes (no navbar layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes — ADMIN role required */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="gallery" element={<AdminGallery />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
