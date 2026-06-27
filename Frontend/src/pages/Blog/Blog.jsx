import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, User, BookOpen, ArrowRight, Clock, FileText, Loader2 } from 'lucide-react'
import { blogsService } from '@/api/blogs.service'

const PAGE_SIZE = 9

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col animate-pulse">
      <div className="h-64 bg-foreground/8" />
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
        <div className="pt-6 border-t border-border">
          <div className="h-4 w-32 bg-foreground/8 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ category }) {
  const isFiltered = category !== 'All'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center justify-center py-28 gap-6 text-center col-span-full"
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
      <div className="space-y-2">
        <p className="text-foreground font-bold text-xl">
          {isFiltered ? `No ${category} posts yet` : 'No posts yet'}
        </p>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          {isFiltered
            ? `Nothing in this category — try a different filter or check back soon.`
            : 'Articles and devotionals are being prepared — check back soon.'}
        </p>
      </div>
    </motion.div>
  )
}

// ── Error banner ──────────────────────────────────────────────────────────────

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-destructive text-sm flex items-center gap-3 mb-8 col-span-full">
      <span className="font-semibold">Error:</span> {message}
      <button
        onClick={onRetry}
        className="ml-auto text-xs underline cursor-pointer hover:no-underline"
      >
        Retry
      </button>
    </div>
  )
}

// ── Blog card ─────────────────────────────────────────────────────────────────

function BlogCard({ post, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % PAGE_SIZE) * 0.07 }}
      className="bg-card border border-border rounded-3xl overflow-hidden group hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,150,255,0.1)] flex flex-col"
    >
      {/* Cover image */}
      <div className="relative h-64 overflow-hidden bg-muted">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.coverImageAlt ?? post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <BookOpen className="w-12 h-12 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />

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
      <div className="p-8 flex flex-col flex-grow">
        {/* Meta row */}
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

        <h3 className="text-xl font-bold text-foreground leading-tight mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed text-sm mb-8 flex-grow line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-6 border-t border-border">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors duration-300 group/link"
          >
            <span>Read Full Article</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Blog() {
  const [blogs, setBlogs]             = useState([])
  const [pagination, setPagination]   = useState(null)
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]             = useState('')
  const [page, setPage]               = useState(1)
  const [categories, setCategories]   = useState([])
  const [activeCategory, setActiveCategory] = useState('All')

  // Fetch categories once on mount
  useEffect(() => {
    blogsService.getCategories().then(cats => setCategories(cats)).catch(() => {})
  }, [])

  const fetchBlogs = (pageNum, cat, append = false) => {
    if (append) setLoadingMore(true)
    else { setLoading(true); setError('') }

    const query = { page: pageNum, limit: PAGE_SIZE, status: 'PUBLISHED' }
    if (cat !== 'All') query.category = cat

    blogsService
      .getAll(query)
      .then(({ blogs: incoming, pagination: meta }) => {
        setBlogs(prev => append ? [...prev, ...incoming] : incoming)
        setPagination(meta)
        setPage(pageNum)
      })
      .catch(e => setError(e?.message ?? 'Failed to load blog posts.'))
      .finally(() => {
        setLoading(false)
        setLoadingMore(false)
      })
  }

  // Initial load
  useEffect(() => { fetchBlogs(1, 'All') }, [])

  const handleCategoryChange = (cat) => {
    if (cat === activeCategory) return
    setActiveCategory(cat)
    fetchBlogs(1, cat)
  }

  const hasMore = pagination && page < pagination.pages
  const allTabs = ['All', ...categories]

  return (
    <div className="bg-background text-foreground min-h-screen pt-24 pb-20">

      {/* ── Hero header ── */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <span className="text-primary dark:text-secondary text-xs font-semibold uppercase tracking-widest mb-3 block">
            Read · Reflect · Grow
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-4">
            Blog & Devotionals
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Explore our latest articles, pastoral messages, and updates from the community —
            stay inspired and connected throughout the week.
            {pagination && !loading && (
              <span className="ml-1 text-muted-foreground/60">
                · {pagination.total} article{pagination.total !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </motion.div>
      </div>

      {/* ── Category tabs ── */}
      {allTabs.length > 1 && (
        <div className="sticky top-[64px] z-20 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
              {allTabs.map(cat => {
                const active = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer rounded-none ${
                      active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat}
                    {active && (
                      <motion.div
                        layoutId="blog-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Blog grid ── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Error */}
              {error && !loading && (
                <ErrorBanner message={error} onRetry={() => fetchBlogs(1, activeCategory)} />
              )}

              {/* Loading skeletons */}
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}

              {/* Empty */}
              {!loading && !error && blogs.length === 0 && (
                <EmptyState category={activeCategory} />
              )}

              {/* Cards */}
              {!loading && blogs.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>

            {/* ── Load more ── */}
            {hasMore && !loading && !error && (
              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => fetchBlogs(page + 1, activeCategory, true)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full border border-primary/30 bg-primary/8 text-primary hover:bg-primary hover:text-white transition-all duration-300 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>
                      Load more articles
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  )
}
