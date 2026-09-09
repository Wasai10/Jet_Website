import { useState, useEffect } from 'react'
import { X, ZoomIn, ChevronLeft, ChevronRight, Images, ImageOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { galleryService, PHOTO_CATEGORIES } from '@/api/gallery.service'

const ALL_TABS = ['All', ...PHOTO_CATEGORIES]

// ── Skeleton ─────────────────────────────────────────────────────────────────

const SKELETON_HEIGHTS = ['h-52', 'h-64', 'h-48', 'h-72', 'h-56', 'h-60', 'h-44', 'h-68', 'h-56']

function SkeletonGrid() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {SKELETON_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className={`break-inside-avoid rounded-2xl ${h} bg-foreground/8 animate-pulse border border-foreground/5`}
        />
      ))}
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
      className="flex flex-col items-center justify-center py-24 gap-6 text-center"
    >
      {/* Pulsing rings */}
      <div className="relative flex items-center justify-center">
        {[56, 88, 120].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-[#0096FF]"
            style={{ width: size, height: size, opacity: 0 }}
            animate={{ opacity: [0, 0.14, 0], scale: [0.88, 1.04, 1.04] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.55, ease: 'easeOut' }}
          />
        ))}
        <div className="w-16 h-16 rounded-2xl bg-[#0096FF]/10 border border-[#0096FF]/20 flex items-center justify-center relative z-10">
          <ImageOff className="w-7 h-7 text-[#0096FF]" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-foreground font-bold text-xl">
          {isFiltered ? `No ${category} photos yet` : 'No photos yet'}
        </p>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          {isFiltered
            ? `Nothing in the ${category} category — try a different filter or check back later.`
            : 'The gallery is empty for now. Beautiful moments are being captured — stay tuned.'}
        </p>
      </div>
    </motion.div>
  )
}

// ── Error banner ──────────────────────────────────────────────────────────────

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-destructive text-sm flex items-center gap-3 mb-8">
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

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Gallery() {
  const [photos, setPhotos]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const load = () => {
    setLoading(true)
    setError('')
    galleryService
      .getAll()
      .then(data => setPhotos(data))
      .catch(e  => setError(e?.message ?? 'Failed to load gallery.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = activeFilter === 'All'
    ? photos
    : photos.filter(p => p.category === activeFilter)

  const openLightbox  = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length)
  const nextImage = () => setLightboxIndex(i => (i + 1) % filtered.length)

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return
      if (e.key === 'ArrowLeft')  prevImage()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'Escape')     closeLightbox()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, filtered.length])

  return (
    <section className="relative w-full py-20 md:py-28 bg-background text-foreground overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-[radial-gradient(circle,rgba(0,150,255,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[radial-gradient(circle,rgba(135,206,235,0.04),transparent_60%)] pointer-events-none" />

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(100,100,100,0.3) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* ── Section header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-primary dark:text-secondary text-xs font-semibold uppercase tracking-widest mb-3 block">
              Moments & Memories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
              Our Gallery
            </h2>
          </div>

          {/* Photo count pill */}
          <div className="flex items-center space-x-2 bg-foreground/5 border border-foreground/10 rounded-full px-4 py-2 self-start md:self-auto">
            <Images className="w-4 h-4 text-secondary" />
            <span className="text-xs text-muted-foreground font-medium">
              {loading ? '—' : `${filtered.length} photo${filtered.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {ALL_TABS.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-primary border-primary text-white shadow-[0_0_16px_rgba(0,150,255,0.35)]'
                  : 'bg-foreground/5 border-foreground/10 text-muted-foreground hover:bg-foreground/10 hover:text-foreground hover:border-foreground/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Error ── */}
        {error && <ErrorBanner message={error} onRetry={load} />}

        {/* ── Loading ── */}
        {loading && <SkeletonGrid />}

        {/* ── Empty ── */}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState category={activeFilter} />
        )}

        {/* ── Masonry grid ── */}
        {!loading && !error && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
            >
              {filtered.map((photo, index) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer border border-foreground/10 hover:border-foreground/20 transition-all duration-500 shadow-lg hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-secondary mb-1 block">
                        {photo.category}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {photo.title}
                      </h4>
                    </div>
                  </div>

                  {/* Featured badge */}
                  {photo.featured && (
                    <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}

                  {/* Zoom icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <ZoomIn className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ── Lightbox (always dark by design) ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 z-10"
              onClick={closeLightbox}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 md:left-8 w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-primary/30 hover:border-primary/40 transition-all duration-200 z-10"
              onClick={(e) => { e.stopPropagation(); prevImage() }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl w-full mx-16 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIndex]?.url}
                alt={filtered[lightboxIndex]?.alt}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent px-6 py-4">
                <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                  {filtered[lightboxIndex]?.category}
                </span>
                <h4 className="text-white font-bold text-base mt-0.5">
                  {filtered[lightboxIndex]?.title}
                </h4>
                <p className="text-white/40 text-xs mt-0.5">
                  {lightboxIndex + 1} / {filtered.length}
                </p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 md:right-8 w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-primary/30 hover:border-primary/40 transition-all duration-200 z-10"
              onClick={(e) => { e.stopPropagation(); nextImage() }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
