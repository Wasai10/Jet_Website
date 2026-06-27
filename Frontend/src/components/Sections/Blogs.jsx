import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, User, BookOpen, Clock, FileText } from 'lucide-react'
import { blogsService } from '@/api/blogs.service'

const PREVIEW_LIMIT = 3

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col animate-pulse">
      <div className="h-56 bg-foreground/8" />
      <div className="p-8 flex flex-col gap-4 flex-grow">
        <div className="flex gap-4">
          <div className="h-3 w-24 bg-foreground/8 rounded-full" />
          <div className="h-3 w-20 bg-foreground/8 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-foreground/8 rounded-full w-full" />
          <div className="h-5 bg-foreground/8 rounded-full w-3/4" />
        </div>
        <div className="space-y-2 flex-grow">
          <div className="h-3.5 bg-foreground/6 rounded-full w-full" />
          <div className="h-3.5 bg-foreground/6 rounded-full w-full" />
          <div className="h-3.5 bg-foreground/6 rounded-full w-2/3" />
        </div>
        <div className="pt-4 border-t border-border">
          <div className="h-4 w-28 bg-foreground/8 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="col-span-full flex flex-col items-center justify-center py-20 gap-5 text-center"
    >
      <div className="relative flex items-center justify-center">
        {[56, 88, 120].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-primary"
            style={{ width: size, height: size, opacity: 0 }}
            animate={{ opacity: [0, 0.14, 0], scale: [0.88, 1.04, 1.04] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.55, ease: 'easeOut' }}
          />
        ))}
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center relative z-10">
          <FileText className="w-7 h-7 text-primary" />
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-foreground font-bold text-lg">No articles yet</p>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          Blog posts and devotionals are being prepared — check back soon.
        </p>
      </div>
    </motion.div>
  )
}

// ── Blog card ─────────────────────────────────────────────────────────────────

function BlogCard({ post, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/30 hover:bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,150,255,0.1)] flex flex-col"
    >
      {/* Cover */}
      <div className="relative h-56 overflow-hidden bg-muted">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.coverImageAlt ?? post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <BookOpen className="w-10 h-10 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />

        {/* Category badge */}
        {post.category && (
          <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
            {post.category}
          </div>
        )}

        {/* Featured badge */}
        {post.featured && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-primary dark:text-secondary font-medium mb-4">
          {post.publishedAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          )}
          {post.author?.fullName && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{post.author.fullName}</span>
            </div>
          )}
          {post.readingTime > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readingTime} min read</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed font-light mb-6 flex-grow line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-border">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors duration-300 group/link"
          >
            <span>Read Article</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function Blogs() {
  const [posts, setPosts]   = useState([])
  const [total, setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    blogsService
      .getAll({ page: 1, limit: PREVIEW_LIMIT, status: 'PUBLISHED' })
      .then(({ blogs, pagination }) => {
        setPosts(blogs)
        setTotal(pagination?.total ?? blogs.length)
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section
      id="blogs"
      className="relative w-full py-20 md:py-28 bg-background text-foreground overflow-hidden"
    >
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(0,150,255,0.04),transparent_60%)] pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(135,206,235,0.03),transparent_60%)] pointer-events-none translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* ── Section header ── */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-flex items-center justify-center gap-2 text-primary dark:text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
            <BookOpen className="w-4 h-4" />
            Words of Life
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Latest Blogs & Devotionals
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base font-light">
            Explore our latest articles, pastoral messages, and updates from the community.
            Stay inspired and connected throughout the week.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && [0, 1, 2].map(i => <SkeletonCard key={i} />)}
          {!loading && posts.length === 0 && <EmptyState />}
          {!loading && posts.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
        </div>

        {/* ── CTA ── */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-center mt-12 md:mt-16"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-[0_10px_25px_rgba(0,150,255,0.3)] transition-all duration-300 hover:-translate-y-0.5"
            >
              {total > PREVIEW_LIMIT
                ? `View all ${total} articles`
                : 'View all articles'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  )
}
