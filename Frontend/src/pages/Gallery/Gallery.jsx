import { useState, useEffect, useRef } from 'react'
import {
  X, ZoomIn, ChevronLeft, ChevronRight, Images, ImageOff,
  Search, ChevronDown, RotateCcw, Check, LayoutGrid, Square
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  galleryService,
  GALLERY_STRUCTURE,
} from '@/api/gallery.service'

// ── Skeletons ─────────────────────────────────────────────────────────────────

const SKELETON_HEIGHTS = ['h-40 sm:h-52', 'h-48 sm:h-64', 'h-36 sm:h-48', 'h-52 sm:h-72', 'h-44 sm:h-56', 'h-48 sm:h-60']

function SkeletonGrid({ columns = 2 }) {
  return (
    <div className={`${columns === 1 ? 'columns-1' : 'columns-2'} sm:columns-2 lg:columns-3 gap-2.5 space-y-2.5 sm:gap-4 sm:space-y-4 lg:gap-5 lg:space-y-5`}>
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

function EmptyState({ activeCategory, activeSubcategory, searchQuery, onReset }) {
  const isFiltered = activeCategory !== 'All' || !!activeSubcategory || !!searchQuery.trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center justify-center py-16 sm:py-24 gap-5 sm:gap-6 text-center px-4"
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

      <div className="space-y-2 max-w-md">
        <p className="text-foreground font-bold text-lg sm:text-xl">
          No gallery moments found
        </p>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          {isFiltered
            ? 'No gallery moments found. Try another category or search term.'
            : 'The gallery is empty for now. Beautiful moments are being captured — stay tuned.'}
        </p>
      </div>

      {isFiltered && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white hover:bg-primary/90 shadow-md transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Filters & Reset</span>
        </button>
      )}
    </motion.div>
  )
}

// ── Error banner ──────────────────────────────────────────────────────────────

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 sm:px-5 py-3.5 text-destructive text-xs sm:text-sm flex items-center gap-3 mb-6 sm:mb-8">
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

// ── Main Page Component ───────────────────────────────────────────────────────

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter state
  const [activeCategory, setActiveCategory] = useState('All') // 'All' | 'Outreach Ministry' | "Women's Ministry" | 'House Fellowships'
  const [activeSubcategory, setActiveSubcategory] = useState(null) // string | null
  const [searchQuery, setSearchQuery] = useState('')
  const [womensDropdownOpen, setWomensDropdownOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [mobileColumns, setMobileColumns] = useState(2) // 1 | 2 columns for mobile phones

  const womensDropdownRef = useRef(null)
  const touchStartX = useRef(null)
  const touchEndX = useRef(null)

  const load = () => {
    setLoading(true)
    setError('')
    galleryService
      .getAll()
      .then(data => setPhotos(data))
      .catch(e => setError(e?.message ?? 'Failed to load gallery.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (womensDropdownRef.current && !womensDropdownRef.current.contains(e.target)) {
        setWomensDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset all filters & search
  const handleResetFilters = () => {
    setActiveCategory('All')
    setActiveSubcategory(null)
    setSearchQuery('')
    setWomensDropdownOpen(false)
  }

  // Combined Dynamic Filter (Category + Subcategory + Search)
  const filtered = photos.filter((photo) => {
    // 1. Category Matching
    if (activeCategory !== 'All') {
      const pCat = (photo.category || '').trim().toLowerCase()
      const targetCat = activeCategory.trim().toLowerCase()
      if (pCat !== targetCat) return false

      // If a specific subcategory is selected, match it
      if (activeSubcategory) {
        const pSub = (photo.subcategory || '').trim().toLowerCase()
        const targetSub = activeSubcategory.trim().toLowerCase()
        if (pSub !== targetSub) return false
      }
    }

    // 2. Search Matching (title, alt, category, subcategory)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      const titleMatch = (photo.title || '').toLowerCase().includes(q)
      const altMatch = (photo.alt || '').toLowerCase().includes(q)
      const catMatch = (photo.category || '').toLowerCase().includes(q)
      const subMatch = (photo.subcategory || '').toLowerCase().includes(q)
      if (!titleMatch && !altMatch && !catMatch && !subMatch) return false
    }

    return true
  })

  // Lightbox handlers
  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length)
  const nextImage = () => setLightboxIndex((i) => (i + 1) % filtered.length)

  // Touch swipe support for mobile lightbox
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX
  }

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    if (diff > 45) {
      nextImage() // Swiped left -> next photo
    } else if (diff < -45) {
      prevImage() // Swiped right -> previous photo
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, filtered.length])

  return (
    <section className="relative w-full py-10 sm:py-16 md:py-24 bg-background text-foreground overflow-hidden min-h-screen">
      {/* Background glow blobs */}
      <div className="absolute top-0 right-1/3 w-72 sm:w-96 h-72 sm:h-96 bg-[radial-gradient(circle,rgba(0,150,255,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[radial-gradient(circle,rgba(135,206,235,0.05),transparent_60%)] pointer-events-none" />

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(100,100,100,0.3) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* ── Section 1: Header & Introduction ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <span className="text-primary dark:text-secondary text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3 block">
              Moments & Memories
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-2.5 sm:mb-4">
              Our Gallery
            </h1>
            <p className="text-muted-foreground text-xs sm:text-base leading-relaxed">
              Explore moments of faith, fellowship, outreach and transformation through the activities and experiences of JET International Ministries.
            </p>
          </div>

          {/* Controls bar: Photo count + Mobile layout switcher */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            {/* Mobile Column Grid Switcher (1-col vs 2-col) */}
            <div className="flex sm:hidden items-center bg-card border border-border rounded-xl p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => setMobileColumns(1)}
                className={`p-1.5 rounded-lg transition-colors ${mobileColumns === 1 ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                title="Single Column View"
                aria-label="Single column view"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileColumns(2)}
                className={`p-1.5 rounded-lg transition-colors ${mobileColumns === 2 ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                title="Two Column View"
                aria-label="Two column view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Photo Count Badge */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 bg-foreground/5 border border-foreground/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm">
              <Images className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="text-[11px] sm:text-xs text-muted-foreground font-semibold">
                {loading ? '—' : `${filtered.length} of ${photos.length}`}
              </span>
            </div>
          </div>
        </div>

        {/* ── Section 2: Navigation & Search Control Bar ── */}
        <div className="space-y-3 sm:space-y-5 mb-8 sm:mb-12">

          {/* Category Navigation Bar (Horizontally scrollable on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">

            {/* 1. All Option */}
            <button
              onClick={() => {
                setActiveCategory('All')
                setActiveSubcategory(null)
                setWomensDropdownOpen(false)
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider border transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 ${
                activeCategory === 'All'
                  ? 'bg-primary border-primary text-white shadow-[0_0_18px_rgba(0,150,255,0.4)] scale-102'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              All
            </button>

            {/* 2. Outreach Ministry */}
            <button
              onClick={() => {
                setActiveCategory('Outreach Ministry')
                setActiveSubcategory('Outreach and Missions')
                setWomensDropdownOpen(false)
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider border transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 ${
                activeCategory === 'Outreach Ministry'
                  ? 'bg-primary border-primary text-white shadow-[0_0_18px_rgba(0,150,255,0.4)] scale-102'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Outreach Ministry
            </button>

            {/* 3. Women's Ministry */}
            <div className="relative shrink-0" ref={womensDropdownRef}>
              <button
                type="button"
                onClick={() => setWomensDropdownOpen(prev => !prev)}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider border transition-all duration-200 whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 ${
                  activeCategory === "Women's Ministry"
                    ? 'bg-primary border-primary text-white shadow-[0_0_18px_rgba(0,150,255,0.4)] scale-102'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span>Women's Ministry</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${womensDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Submenu Dropdown */}
              <AnimatePresence>
                {womensDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-30 overflow-hidden py-1.5"
                  >
                    {/* View All Women's Ministry */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory("Women's Ministry")
                        setActiveSubcategory(null)
                        setWomensDropdownOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left font-semibold transition-colors ${
                        activeCategory === "Women's Ministry" && !activeSubcategory
                          ? 'bg-primary/15 text-primary font-bold'
                          : 'text-foreground hover:bg-muted/60'
                      }`}
                    >
                      <span>All Women's Ministry</span>
                      {activeCategory === "Women's Ministry" && !activeSubcategory && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>

                    <div className="h-px bg-border my-1" />

                    {/* JET Ladies */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory("Women's Ministry")
                        setActiveSubcategory('JET Ladies')
                        setWomensDropdownOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left font-semibold transition-colors ${
                        activeCategory === "Women's Ministry" && activeSubcategory === 'JET Ladies'
                          ? 'bg-primary/15 text-primary font-bold'
                          : 'text-foreground hover:bg-muted/60'
                      }`}
                    >
                      <span>JET Ladies</span>
                      {activeCategory === "Women's Ministry" && activeSubcategory === 'JET Ladies' && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>

                    {/* International Women's Day */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory("Women's Ministry")
                        setActiveSubcategory("International Women's Day")
                        setWomensDropdownOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left font-semibold transition-colors ${
                        activeCategory === "Women's Ministry" && activeSubcategory === "International Women's Day"
                          ? 'bg-primary/15 text-primary font-bold'
                          : 'text-foreground hover:bg-muted/60'
                      }`}
                    >
                      <span>International Women's Day</span>
                      {activeCategory === "Women's Ministry" && activeSubcategory === "International Women's Day" && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. House Fellowships */}
            <button
              onClick={() => {
                setActiveCategory('House Fellowships')
                setActiveSubcategory('House Fellowships')
                setWomensDropdownOpen(false)
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider border transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 ${
                activeCategory === 'House Fellowships'
                  ? 'bg-primary border-primary text-white shadow-[0_0_18px_rgba(0,150,255,0.4)] scale-102'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              House Fellowships
            </button>
          </div>

          {/* Subcategory Pill Track for Women's Ministry on Mobile/Desktop */}
          {activeCategory === "Women's Ministry" && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              <button
                type="button"
                onClick={() => setActiveSubcategory(null)}
                className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border shrink-0 transition-all cursor-pointer touch-manipulation ${
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
                className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border shrink-0 transition-all cursor-pointer touch-manipulation ${
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
                className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border shrink-0 transition-all cursor-pointer touch-manipulation ${
                  activeSubcategory === "International Women's Day"
                    ? 'bg-primary/20 border-primary text-primary font-bold shadow-xs'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                International Women's Day
              </button>
            </motion.div>
          )}

          {/* Search Bar + Active Filters Breadcrumb */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">

            {/* Search Input Box */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search photos, activities, categories…"
                className="w-full bg-card border border-border rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Active Hierarchy Pill Indicator */}
            {(activeCategory !== 'All' || activeSubcategory || searchQuery) && (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">Active:</span>

                {activeCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-primary/10 text-primary border border-primary/25">
                    <span>{activeCategory}</span>
                    {activeSubcategory && (
                      <>
                        <span className="opacity-40">/</span>
                        <span>{activeSubcategory}</span>
                      </>
                    )}
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium bg-foreground/5 text-foreground border border-foreground/15">
                    <span>"{searchQuery}"</span>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="text-[11px] sm:text-xs text-muted-foreground hover:text-primary underline ml-0.5 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Section 3: Content (Error / Loading / Empty / Grid) ── */}

        {/* Error banner */}
        {error && <ErrorBanner message={error} onRetry={load} />}

        {/* Loading skeleton */}
        {loading && <SkeletonGrid columns={mobileColumns} />}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            activeCategory={activeCategory}
            activeSubcategory={activeSubcategory}
            searchQuery={searchQuery}
            onReset={handleResetFilters}
          />
        )}

        {/* Masonry image grid (Adaptive 2-column mobile default) */}
        {!loading && !error && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${activeSubcategory}-${searchQuery}-${mobileColumns}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className={`${mobileColumns === 1 ? 'columns-1' : 'columns-2'} sm:columns-2 lg:columns-3 gap-2.5 space-y-2.5 sm:gap-4 sm:space-y-4 lg:gap-5 lg:space-y-5`}
            >
              {filtered.map((photo, index) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer border border-foreground/10 hover:border-primary/40 transition-all duration-300 shadow-sm sm:shadow-md hover:shadow-2xl hover:shadow-primary/10 bg-card active:scale-[0.98] touch-manipulation"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-auto max-h-52 sm:max-h-none object-cover transition-transform duration-500 group-hover:scale-104"
                    loading="lazy"
                  />

                  {/* Gradient Overlay & Captions: readable on touch/mobile, enhanced on desktop hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 sm:p-5 pointer-events-none">
                    <div className="sm:translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-300">
                      {/* Category & Subcategory Tag */}
                      <div className="flex flex-wrap items-center gap-1 mb-1">
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-primary text-white">
                          {photo.category}
                        </span>
                        {photo.subcategory && (
                          <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-white/25 text-white backdrop-blur-xs">
                            {photo.subcategory}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-base font-bold text-white leading-tight line-clamp-1 sm:line-clamp-2">
                        {photo.title}
                      </h4>
                      {photo.alt && (
                        <p className="text-white/70 text-[10px] sm:text-xs mt-0.5 line-clamp-1 sm:line-clamp-2 hidden sm:block">
                          {photo.alt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Top-Left Category Pill (Persistent Badge) */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 z-10 pointer-events-none">
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/65 text-white backdrop-blur-xs border border-white/20">
                      {photo.subcategory || photo.category}
                    </span>
                    {photo.featured && (
                      <span className="bg-amber-400 text-black text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-xs">
                        ★
                      </span>
                    )}
                  </div>

                  {/* Zoom indicator on desktop */}
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 backdrop-blur-xs border border-white/20 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <ZoomIn className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ── Section 4: Lightbox Modal with Mobile Touch Swipe ── */}
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
            {/* Close button with safe touch target */}
            <button
              className="absolute top-3 right-3 sm:top-5 sm:right-5 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer z-30 touch-manipulation"
              onClick={closeLightbox}
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev button */}
            <button
              className="absolute left-2 sm:left-4 md:left-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-primary/40 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer z-30 touch-manipulation"
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Image Box */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl w-full mx-1 sm:mx-6 md:mx-16 rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIndex]?.url}
                alt={filtered[lightboxIndex]?.alt}
                className="w-full max-h-[66vh] sm:max-h-[78vh] object-contain bg-black"
              />

              {/* Caption */}
              <div className="bg-gradient-to-t from-black via-black/95 to-transparent px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-t border-white/10">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-primary font-bold px-1.5 py-0.5 rounded bg-primary/20">
                      {filtered[lightboxIndex]?.category}
                    </span>
                    {filtered[lightboxIndex]?.subcategory && (
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/80 font-semibold px-1.5 py-0.5 rounded bg-white/10">
                        {filtered[lightboxIndex]?.subcategory}
                      </span>
                    )}
                  </div>
                  <h4 className="text-white font-bold text-sm sm:text-base leading-snug truncate">
                    {filtered[lightboxIndex]?.title}
                  </h4>
                  {filtered[lightboxIndex]?.alt && (
                    <p className="text-white/60 text-[11px] sm:text-xs mt-0.5 line-clamp-1">
                      {filtered[lightboxIndex]?.alt}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-white/40 text-[11px] sm:text-xs font-semibold shrink-0">
                  <span className="sm:hidden text-white/30 text-[10px]">Swipe left/right</span>
                  <span>{lightboxIndex + 1} of {filtered.length}</span>
                </div>
              </div>
            </motion.div>

            {/* Next button */}
            <button
              className="absolute right-2 sm:right-4 md:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-primary/40 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer z-30 touch-manipulation"
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
