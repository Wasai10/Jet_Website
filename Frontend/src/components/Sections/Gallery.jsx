import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X, ZoomIn, ChevronLeft, ChevronRight, Images, ImageOff, ArrowRight, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { galleryService } from '@/api/gallery.service'

const PREVIEW_LIMIT = 4

// ── Skeleton ──────────────────────────────────────────────────────────────────

const SKELETON_HEIGHTS = ['h-40 sm:h-52', 'h-48 sm:h-64', 'h-36 sm:h-48', 'h-52 sm:h-72', 'h-44 sm:h-56', 'h-48 sm:h-60']

function SkeletonGrid() {
  return (
    <div className="columns-2 sm:columns-2 lg:columns-3 gap-2.5 space-y-2.5 sm:gap-4 sm:space-y-4">
      {SKELETON_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className={`break-inside-avoid rounded-xl sm:rounded-2xl ${h} bg-foreground/8 animate-pulse border border-foreground/5`}
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
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 sm:py-20 gap-4 sm:gap-5 text-center px-4"
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
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center relative z-10">
          <ImageOff className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-foreground font-bold text-base sm:text-lg">
          {isFiltered ? `No ${category} photos yet` : 'No photos yet'}
        </p>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-xs leading-relaxed">
          {isFiltered
            ? `Nothing in the ${category} category — try a different filter.`
            : 'Beautiful moments are being captured — check back soon.'}
        </p>
      </div>
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function Gallery() {
  const [photos, setPhotos]                         = useState([])
  const [loading, setLoading]                       = useState(true)
  const [activeCategory, setActiveCategory]         = useState('All')
  const [activeSubcategory, setActiveSubcategory]   = useState(null)
  const [womensMenuOpen, setWomensMenuOpen]         = useState(false)
  const [lightboxIndex, setLightboxIndex]           = useState(null)

  const touchStartX = useRef(null)
  const touchEndX = useRef(null)

  useEffect(() => {
    galleryService
      .getAll()
      .then(data => setPhotos(data))
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = photos.filter(p => {
    if (activeCategory === 'All') return true
    const pCat = (p.category || '').trim().toLowerCase()
    const targetCat = activeCategory.trim().toLowerCase()
    if (pCat !== targetCat) return false

    if (activeSubcategory) {
      const pSub = (p.subcategory || '').trim().toLowerCase()
      const targetSub = activeSubcategory.trim().toLowerCase()
      if (pSub !== targetSub) return false
    }
    return true
  })

  const previewPhotos = filtered.slice(0, PREVIEW_LIMIT)
  const totalCount = filtered.length

  const openLightbox  = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => (i - 1 + previewPhotos.length) % previewPhotos.length)
  const nextImage = () => setLightboxIndex(i => (i + 1) % previewPhotos.length)

  // Touch swipe for mobile lightbox
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX
  }

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    if (diff > 45) {
      nextImage()
    } else if (diff < -45) {
      prevImage()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return
      if (e.key === 'ArrowLeft')  prevImage()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'Escape')     closeLightbox()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, previewPhotos.length])

  return (
    <section id="gallery" className="relative w-full py-12 sm:py-20 md:py-28 bg-background text-foreground overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-0 right-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-[radial-gradient(circle,rgba(0,150,255,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-[radial-gradient(circle,rgba(135,206,235,0.04),transparent_60%)] pointer-events-none" />

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(100,100,100,0.3) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* ── Section header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
          <div>
            <span className="text-primary dark:text-secondary text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3 block">
              Moments & Memories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
              Our Gallery
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 sm:mt-2 max-w-xl">
              Explore moments of faith, fellowship, outreach and transformation through the activities and experiences of JET International Ministries.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 bg-foreground/5 border border-foreground/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 self-start md:self-auto shrink-0 shadow-xs">
            <Images className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
              {loading ? '—' : `${previewPhotos.length}${totalCount > PREVIEW_LIMIT ? `/${totalCount}` : ''} photo${previewPhotos.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* ── Category tabs (Horizontally scrollable on mobile) ── */}
        <div className="space-y-2.5 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {/* All */}
            <button
              onClick={() => {
                setActiveCategory('All')
                setActiveSubcategory(null)
                setWomensMenuOpen(false)
              }}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider border transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 ${
                activeCategory === 'All'
                  ? 'bg-primary border-primary text-white shadow-[0_0_16px_rgba(0,150,255,0.35)]'
                  : 'bg-card border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              All
            </button>

            {/* Outreach Ministry */}
            <button
              onClick={() => {
                setActiveCategory('Outreach Ministry')
                setActiveSubcategory('Outreach and Missions')
                setWomensMenuOpen(false)
              }}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider border transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 ${
                activeCategory === 'Outreach Ministry'
                  ? 'bg-primary border-primary text-white shadow-[0_0_16px_rgba(0,150,255,0.35)]'
                  : 'bg-card border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              Outreach Ministry
            </button>

            {/* Women's Ministry */}
            <div className="relative shrink-0">
              <button
                onClick={() => setWomensMenuOpen(prev => !prev)}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider border transition-all duration-200 whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 ${
                  activeCategory === "Women's Ministry"
                    ? 'bg-primary border-primary text-white shadow-[0_0_16px_rgba(0,150,255,0.35)]'
                    : 'bg-card border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <span>Women's Ministry</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {womensMenuOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-56 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                  <button
                    onClick={() => {
                      setActiveCategory("Women's Ministry")
                      setActiveSubcategory(null)
                      setWomensMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/60"
                  >
                    All Women's Ministry
                  </button>
                  <button
                    onClick={() => {
                      setActiveCategory("Women's Ministry")
                      setActiveSubcategory('JET Ladies')
                      setWomensMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/60"
                  >
                    JET Ladies
                  </button>
                  <button
                    onClick={() => {
                      setActiveCategory("Women's Ministry")
                      setActiveSubcategory("International Women's Day")
                      setWomensMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/60"
                  >
                    International Women's Day
                  </button>
                </div>
              )}
            </div>

            {/* House Fellowships */}
            <button
              onClick={() => {
                setActiveCategory('House Fellowships')
                setActiveSubcategory('House Fellowships')
                setWomensMenuOpen(false)
              }}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider border transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 ${
                activeCategory === 'House Fellowships'
                  ? 'bg-primary border-primary text-white shadow-[0_0_16px_rgba(0,150,255,0.35)]'
                  : 'bg-card border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              House Fellowships
            </button>
          </div>

          {/* Subcategory Pill Track for Women's Ministry */}
          {activeCategory === "Women's Ministry" && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              <button
                type="button"
                onClick={() => setActiveSubcategory(null)}
                className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border shrink-0 transition-all cursor-pointer ${
                  !activeSubcategory
                    ? 'bg-primary/20 border-primary text-primary font-bold shadow-xs'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                All Women's
              </button>
              <button
                type="button"
                onClick={() => setActiveSubcategory('JET Ladies')}
                className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border shrink-0 transition-all cursor-pointer ${
                  activeSubcategory === 'JET Ladies'
                    ? 'bg-primary/20 border-primary text-primary font-bold shadow-xs'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                JET Ladies
              </button>
              <button
                type="button"
                onClick={() => setActiveSubcategory("International Women's Day")}
                className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border shrink-0 transition-all cursor-pointer ${
                  activeSubcategory === "International Women's Day"
                    ? 'bg-primary/20 border-primary text-primary font-bold shadow-xs'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                International Women's Day
              </button>
            </motion.div>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && <SkeletonGrid />}

        {/* ── Empty ── */}
        {!loading && previewPhotos.length === 0 && (
          <EmptyState category={activeSubcategory || activeCategory} />
        )}

        {/* ── Masonry grid (2 columns on mobile) ── */}
        {!loading && previewPhotos.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${activeSubcategory}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="columns-2 sm:columns-2 lg:columns-3 gap-2.5 space-y-2.5 sm:gap-4 sm:space-y-4"
            >
              {previewPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer border border-foreground/10 hover:border-foreground/20 transition-all duration-300 shadow-sm sm:shadow-lg hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] bg-card active:scale-[0.98] touch-manipulation"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-32 sm:h-44 md:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Caption & Gradient: readable on mobile, hover-enhanced on desktop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 sm:p-5 pointer-events-none">
                    <div className="sm:translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-secondary mb-0.5 sm:mb-1 block">
                        {photo.subcategory || photo.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-1 sm:line-clamp-2">
                        {photo.title}
                      </h4>
                    </div>
                  </div>

                  {/* Category Pill Top-Left */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/60 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 pointer-events-none">
                    {photo.subcategory || photo.category}
                  </div>

                  {/* Zoom icon on desktop */}
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-xs border border-white/10 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <ZoomIn className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── View all link ── */}
        <div className="mt-8 sm:mt-12 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-[0_0_24px_rgba(0,150,255,0.4)] transition-all duration-300 group cursor-pointer active:scale-95 touch-manipulation"
          >
            <span>Explore full gallery ({photos.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* ── Lightbox with Mobile Swipe ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 touch-none select-none"
            onClick={closeLightbox}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              className="absolute top-3 right-3 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 z-30 cursor-pointer touch-manipulation"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              className="absolute left-2 sm:left-4 md:left-8 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-primary/30 transition-all duration-200 z-30 cursor-pointer touch-manipulation"
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl w-full mx-1 sm:mx-8 md:mx-16 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={previewPhotos[lightboxIndex]?.url}
                alt={previewPhotos[lightboxIndex]?.alt}
                className="w-full max-h-[66vh] sm:max-h-[80vh] object-contain bg-black"
              />
              <div className="bg-gradient-to-t from-black via-black/90 to-transparent px-4 py-3 sm:px-6 sm:py-4 border-t border-white/10">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-primary font-bold">
                  {previewPhotos[lightboxIndex]?.category} {previewPhotos[lightboxIndex]?.subcategory ? `· ${previewPhotos[lightboxIndex]?.subcategory}` : ''}
                </span>
                <h4 className="text-white font-bold text-sm sm:text-base mt-0.5 leading-snug truncate">
                  {previewPhotos[lightboxIndex]?.title}
                </h4>
              </div>
            </motion.div>

            <button
              className="absolute right-2 sm:right-4 md:right-8 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-primary/30 transition-all duration-200 z-30 cursor-pointer touch-manipulation"
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
