import { BookOpen, Eye, ExternalLink, Pencil, Star, Trash2 } from "lucide-react";
import type { Blog, BlogStatus } from "@/api/blogs.service";

interface Props {
  blogs: Blog[];
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
}

const STATUS: Record<BlogStatus, { label: string; text: string; bg: string }> = {
  DRAFT:     { label: "Draft",     text: "text-muted-foreground",  bg: "bg-input"               },
  PUBLISHED: { label: "Published", text: "text-[#22C55E]",         bg: "bg-[#22C55E]/10"        },
  SCHEDULED: { label: "Scheduled", text: "text-primary",           bg: "bg-primary/10"          },
  ARCHIVED:  { label: "Archived",  text: "text-[#F59E0B]",         bg: "bg-[#F59E0B]/10"        },
};

const GRADE: Record<string, { text: string; bg: string }> = {
  A: { text: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
  B: { text: "text-primary",   bg: "bg-primary/10"   },
  C: { text: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
  D: { text: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
};

function scoreGrade(score: number | null) {
  if (score === null || score === undefined) return null;
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "D";
}

export default function BlogTable({ blogs, onEdit, onDelete }: Props) {
  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-muted-foreground/40" />
        </div>
        <p className="text-muted-foreground/60 text-sm">No blog posts yet</p>
        <p className="text-muted-foreground/40 text-xs">Click "New Post" to write your first blog.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {["Post", "Status", "Category", "Author", "Views", "SEO", "Date", ""].map((h, i) => (
              <th
                key={i}
                className={`text-left text-muted-foreground font-medium py-3 px-4 text-xs uppercase tracking-wider whitespace-nowrap
                  ${i === 2 ? "hidden md:table-cell" : ""}
                  ${i === 3 || i === 4 ? "hidden lg:table-cell" : ""}
                  ${i === 5 ? "hidden xl:table-cell" : ""}
                  ${i === 6 ? "hidden md:table-cell" : ""}
                  ${i === 7 ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => {
            const st = STATUS[blog.status] ?? STATUS.DRAFT;
            const grade = scoreGrade(blog.seoScore);
            const gs = grade ? GRADE[grade] : null;
            const date = blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

            return (
              <tr key={blog.id} className="border-b border-border/50 hover:bg-muted/30 group transition-colors">
                {/* Post title + cover */}
                <td className="py-3 px-4 max-w-[260px]">
                  <div className="flex items-center gap-3">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.coverImageAlt ?? blog.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 bg-input"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-foreground font-medium truncate text-sm leading-tight">{blog.title}</p>
                        {blog.featured && (
                          <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B] shrink-0" />
                        )}
                      </div>
                      <p className="text-muted-foreground/50 text-xs truncate mt-0.5">/{blog.slug}</p>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${st.bg} ${st.text}`}>
                    {st.label}
                  </span>
                </td>

                {/* Category */}
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="text-muted-foreground text-xs">{blog.category}</span>
                </td>

                {/* Author */}
                <td className="py-3 px-4 hidden lg:table-cell">
                  <span className="text-muted-foreground text-xs">{blog.author?.fullName ?? "—"}</span>
                </td>

                {/* Views */}
                <td className="py-3 px-4 hidden lg:table-cell">
                  <div className="flex items-center gap-1.5 text-muted-foreground/60">
                    <Eye className="w-3 h-3" />
                    <span className="text-xs">{blog.viewCount.toLocaleString()}</span>
                  </div>
                </td>

                {/* SEO score */}
                <td className="py-3 px-4 hidden xl:table-cell">
                  {grade && gs ? (
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${gs.bg} ${gs.text}`}>
                        {grade}
                      </span>
                      <span className="text-muted-foreground/50 text-xs">{blog.seoScore}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground/40 text-xs">—</span>
                  )}
                </td>

                {/* Date */}
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="text-muted-foreground/60 text-xs whitespace-nowrap">{date}</span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(blog)}
                      title="Edit post"
                      className="w-8 h-8 rounded-lg bg-input hover:bg-primary/20 hover:text-primary text-muted-foreground flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {blog.status === "PUBLISHED" && (
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View live"
                        className="w-8 h-8 rounded-lg bg-input hover:bg-[#22C55E]/20 hover:text-[#22C55E] text-muted-foreground flex items-center justify-center transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => onDelete(blog)}
                      title="Delete post"
                      className="w-8 h-8 rounded-lg bg-input hover:bg-[#EF4444]/20 hover:text-[#EF4444] text-muted-foreground flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
