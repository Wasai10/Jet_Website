import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Calendar, User, Clock, Tag, Eye, BookOpen,
  AlertCircle,
} from 'lucide-react'
import { blogsService } from '@/api/blogs.service'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse">
      {/* Cover */}
      <div className="w-full h-72 md:h-96 bg-foreground/8" />

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
        {/* Category + reading time */}
        <div className="flex gap-3">
          <div className="h-5 w-20 bg-foreground/8 rounded-full" />
          <div className="h-5 w-24 bg-foreground/8 rounded-full" />
        </div>
        {/* Title */}
        <div className="space-y-3">
          <div className="h-8 bg-foreground/8 rounded-lg w-full" />
          <div className="h-8 bg-foreground/8 rounded-lg w-4/5" />
        </div>
        {/* Meta */}
        <div className="flex gap-5">
          <div className="h-4 w-28 bg-foreground/6 rounded-full" />
          <div className="h-4 w-24 bg-foreground/6 rounded-full" />
        </div>
        {/* Body lines */}
        <div className="pt-4 space-y-3">
          {[1, 0.9, 1, 0.7, 1, 0.85, 1, 0.6].map((w, i) => (
            <div key={i} className="h-4 bg-foreground/6 rounded-full" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Error state ───────────────────────────────────────────────────────────────

function ErrorState({ message }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-destructive" />
      </div>
      <div className="space-y-1.5">
        <p className="font-bold text-lg text-foreground">Could not load article</p>
        <p className="text-muted-foreground text-sm max-w-xs">{message}</p>
      </div>
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    blogsService
      .getBySlug(slug)
      .then(data => setPost(data))
      .catch(e => setError(e?.message ?? 'Article not found.'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen pt-16">
        <Skeleton />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="bg-background text-foreground min-h-screen pt-16">
        <ErrorState message={error || 'Article not found.'} />
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen pt-16">

      {/* ── Cover hero ── */}
      <div className="relative w-full h-72 md:h-[420px] overflow-hidden bg-muted">
        {post.coverImage ? (
          <>
            <img
              src={post.coverImage}
              alt={post.coverImageAlt ?? post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <BookOpen className="w-16 h-16 text-primary/20" />
          </div>
        )}

        {/* Back button over image */}
        <Link
          to="/blog"
          className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white text-xs font-semibold hover:bg-black/50 transition-all duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Blog
        </Link>
      </div>

      {/* ── Article header ── */}
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-10 pb-8 border-b border-border"
        >
          {/* Category + reading time */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            {post.category && (
              <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {post.category}
              </span>
            )}
            {post.tags?.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground bg-foreground/6 border border-foreground/10 px-2.5 py-1 rounded-full"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {post.author?.fullName && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">{post.author.fullName}</span>
              </div>
            )}
            {post.publishedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            )}
            {post.readingTime > 0 && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
            {post.viewCount > 0 && (
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-6 text-base text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-4 italic">
              {post.excerpt}
            </p>
          )}
        </motion.div>

        {/* ── Article body ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="py-10"
        >
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>

        {/* ── Footer ── */}
        <div className="pb-16 border-t border-border pt-8 flex items-center justify-between gap-4 flex-wrap">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[11px] text-muted-foreground bg-foreground/5 border border-foreground/10 px-2.5 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
