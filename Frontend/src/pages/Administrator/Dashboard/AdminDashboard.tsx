import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, CalendarDays, ImageIcon, BookOpen,
  TrendingUp, ArrowUpRight, RefreshCw, Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/api/auth.service";
import { eventsService } from "@/api/events.service";
import { galleryService } from "@/api/gallery.service";
import { blogsService } from "@/api/blogs.service";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
});

interface Stats {
  users: number;
  upcomingEvents: number;
  photos: number;
  blogs: number;
  publishedBlogs: number;
}

interface RecentPost {
  id: string;
  title: string;
  status: string;
  category: string;
  createdAt: string;
}

interface RecentEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [users, events, photos, blogsRes] = await Promise.all([
        authService.getAllUsers(),
        eventsService.getAll(),
        galleryService.getAll(),
        blogsService.adminGetAll({ limit: 5 }),
      ]);

      const upcoming = events.filter((e) => e.type === "UPCOMING").length;

      setStats({
        users: users.length,
        upcomingEvents: upcoming,
        photos: photos.length,
        blogs: blogsRes.pagination.total,
        publishedBlogs: blogsRes.blogs.filter((b) => b.status === "PUBLISHED").length,
      });

      setRecentPosts(
        blogsRes.blogs.slice(0, 4).map((b) => ({
          id: b.id,
          title: b.title,
          status: b.status,
          category: b.category,
          createdAt: b.createdAt,
        }))
      );

      setRecentEvents(
        events
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4)
          .map((e) => ({
            id: e.id,
            title: e.title,
            date: e.date,
            location: e.location,
            type: e.type,
          }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const statCards = [
    { label: "Total Users",      value: stats?.users,          icon: Users,       color: "#0096FF", glow: "rgba(0,150,255,0.2)",   href: "/admin-dashboard/users"   },
    { label: "Upcoming Events",  value: stats?.upcomingEvents, icon: CalendarDays, color: "#22C55E", glow: "rgba(34,197,94,0.2)",   href: "/admin-dashboard/events"  },
    { label: "Gallery Photos",   value: stats?.photos,         icon: ImageIcon,   color: "#A855F7", glow: "rgba(168,85,247,0.2)",  href: "/admin-dashboard/gallery" },
    { label: "Blog Posts",       value: stats?.blogs,          icon: BookOpen,    color: "#F59E0B", glow: "rgba(245,158,11,0.2)",  href: "/admin-dashboard/blog"    },
  ];

  const STATUS_COLORS: Record<string, string> = {
    PUBLISHED: "#22C55E",
    DRAFT:     "#9CA3AF",
    SCHEDULED: "#0096FF",
    ARCHIVED:  "#F59E0B",
  };

  const TYPE_COLORS: Record<string, string> = {
    UPCOMING:        "#0096FF",
    PAST:            "#9CA3AF",
    HOME_FELLOWSHIP: "#A855F7",
    WORSHIP:         "#F59E0B",
    CONFERENCE:      "#EC4899",
    OUTREACH:        "#14B8A6",
    YOUTH:           "#EF4444",
    PRAYER:          "#87CEEB",
    SPECIAL:         "#6366F1",
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  return (
    <div className="space-y-8">

      {/* Greeting + refresh */}
      <motion.div {...fadeUp(0)} className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Good to see you, {user?.fullName?.split(" ")[0]} 👋
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Here's what's happening with JET Ministries today.
          </p>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          title="Refresh"
          className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, glow, href }, i) => (
          <motion.div key={label} {...fadeUp(i * 0.08)}>
            <Link
              to={href}
              className="block bg-card border border-border rounded-2xl p-5 hover:bg-muted/50 hover:border-primary/20 hover:shadow-[0_0_24px_rgba(0,150,255,0.06)] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}18`, boxShadow: `0 0 16px ${glow}` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/60 transition-colors" />
              </div>
              {loading ? (
                <div className="h-8 w-12 bg-muted/60 rounded-lg animate-pulse mb-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {value ?? "—"}
                </p>
              )}
              <p className="text-muted-foreground text-xs mt-1 font-medium">{label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent activity — two columns */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent blog posts */}
        <motion.div {...fadeUp(0.2)} className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="text-foreground text-sm font-semibold">Recent Blog Posts</h3>
            </div>
            <Link
              to="/admin-dashboard/blog"
              className="text-primary text-xs hover:underline cursor-pointer"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 flex-1 bg-muted/60 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-muted/60 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <BookOpen className="w-8 h-8 text-muted-foreground/20" />
              <p className="text-muted-foreground/50 text-xs">No posts yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium truncate">{post.title}</p>
                    <p className="text-muted-foreground/60 text-xs mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(post.createdAt)} · {post.category}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${STATUS_COLORS[post.status] ?? "#9CA3AF"}18`,
                      color: STATUS_COLORS[post.status] ?? "#9CA3AF",
                    }}
                  >
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent events */}
        <motion.div {...fadeUp(0.25)} className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#22C55E]" />
              <h3 className="text-foreground text-sm font-semibold">Recent Events</h3>
            </div>
            <Link
              to="/admin-dashboard/events"
              className="text-primary text-xs hover:underline cursor-pointer"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 flex-1 bg-muted/60 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-muted/60 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <CalendarDays className="w-8 h-8 text-muted-foreground/20" />
              <p className="text-muted-foreground/50 text-xs">No events yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium truncate">{event.title}</p>
                    <p className="text-muted-foreground/60 text-xs mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(event.date)} · {event.location}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${TYPE_COLORS[event.type] ?? "#0096FF"}18`,
                      color: TYPE_COLORS[event.type] ?? "#0096FF",
                    }}
                  >
                    {event.type.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Blog stats summary */}
      {!loading && stats && (
        <motion.div {...fadeUp(0.35)}
          className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-2xl p-5 flex items-center gap-5"
        >
          <div className="w-11 h-11 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,150,255,0.25)]">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-semibold text-sm">Content at a glance</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              {stats.publishedBlogs} published post{stats.publishedBlogs !== 1 ? "s" : ""} ·{" "}
              {stats.blogs - stats.publishedBlogs} in draft/scheduled ·{" "}
              {stats.photos} gallery photo{stats.photos !== 1 ? "s" : ""} ·{" "}
              {stats.upcomingEvents} upcoming event{stats.upcomingEvents !== 1 ? "s" : ""}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
