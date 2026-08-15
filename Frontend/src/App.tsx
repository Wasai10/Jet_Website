import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public layouts & pages
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Home from "@/pages/Landing/Home";
import Gallery from "@/pages/Gallery/Gallery";
import About from "@/pages/About/About";
import Events from "@/pages/Events/Events";
import EventRsvp from "@/pages/Events/EventRsvp";
import Giving from "@/pages/Giving/Giving";
import Blog from "@/pages/Blog/Blog";
import BlogPost from "@/pages/Blog/BlogPost";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";

// Admin layout & pages
import AdminLayout from "@/components/Layouts/AdminLayout";
import AdminDashboard from "@/pages/Administrator/Dashboard/AdminDashboard";
import Users from "@/pages/Administrator/UserManagement/Users";
import AdminEvents from "@/pages/Administrator/Events/AdminEvents";
import AdminRegistrations from "@/pages/Administrator/Registrations/AdminRegistrations";
import AdminDocuments from "@/pages/Administrator/Documents/AdminDocuments";
import AdminGallery from "@/pages/Administrator/Gallery/AdminGallery";
import AdminBlog from "@/pages/Administrator/Blogs/AdminBlog";
import DepartmentalLeadership from "@/pages/Administrator/DepartmentalLeadership/DepartmentslLeadership";

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
          <Route path="/events/:id/rsvp" element={<DefaultLayout><EventRsvp /></DefaultLayout>} />
          <Route path="/giving" element={<DefaultLayout><Giving /></DefaultLayout>} />
          <Route path="/blog" element={<DefaultLayout><Blog /></DefaultLayout>} />
          <Route path="/blog/:slug" element={<DefaultLayout><BlogPost /></DefaultLayout>} />

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
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="departmental-leadership" element={<DepartmentalLeadership />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
