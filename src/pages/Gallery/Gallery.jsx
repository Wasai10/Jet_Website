import React, { useState } from 'react'
import { X, ZoomIn, ChevronLeft, ChevronRight, Images, PlayCircle } from 'lucide-react'
import { galleryItems, galleryCategories } from '@/data/galleryPhotos'
import { motion } from 'framer-motion'

export default function Gallery() {
    const [activeFilter, setActiveFilter] = useState('All')
    const [lightboxIndex, setLightboxIndex] = useState(null)

    const filtered = activeFilter === 'All'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeFilter)

    const openLightbox = (index) => setLightboxIndex(index)
    const closeLightbox = () => setLightboxIndex(null)
    const prevImage = () => setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length)
    const nextImage = () => setLightboxIndex(i => (i + 1) % filtered.length)

    // keyboard navigation
    React.useEffect(() => {
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
        <motion.div className="min-h-screen bg-background font-sans antialiased">
            <main>
                <section id="gallery" className="relative w-full py-20 md:py-28 bg-[#001726] text-white overflow-hidden">
                    {/* Background glow blobs */}
                    <div className="absolute top-0 right-1/3 w-80 h-80 bg-[radial-gradient(circle,rgba(0,150,255,0.05),transparent_60%)] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[radial-gradient(circle,rgba(135,206,235,0.04),transparent_60%)] pointer-events-none" />

                    {/* Dot grid texture */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                        backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`,
                        backgroundSize: '28px 28px'
                    }} />

                    <div className="relative max-w-7xl mx-auto px-6">

                        {/* Section Header */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                            <div>
                                <span className="text-[#87CEEB] text-xs font-semibold uppercase tracking-widest mb-3 block">
                                    Moments & Memories
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                                    Our Gallery
                                </h2>
                            </div>
                            {/* Image count pill */}
                            <div className="flex items-center space-x-2 bg-white/5 border border-white/5 rounded-full px-4 py-2 self-start md:self-auto">
                                <Images className="w-4 h-4 text-[#87CEEB]" />
                                <span className="text-xs text-white/60 font-medium">{filtered.length} photos</span>
                            </div>
                        </div>


                        {/* Filter Tabs */}
                        <div className="flex flex-wrap gap-2 mb-10">
                            {galleryCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border transition-all duration-300 ${activeFilter === cat
                                        ? 'bg-[#0096FF] border-[#0096FF] text-white shadow-[0_0_16px_rgba(0,150,255,0.35)]'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Masonry Grid */}
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                            {filtered.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-white/15 transition-all duration-500 shadow-lg hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                                    onClick={() => openLightbox(index)}
                                >
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className={`w-full transition-transform duration-700 group-hover:scale-105 ${item.src.includes('JET_LOGO') ? 'h-40 sm:h-48 md:h-56 object-contain p-6 bg-white/5' : 'h-auto object-cover'}`}
                                        loading="lazy"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#001726]/90 via-[#001726]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5">
                                        <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                                            <span className="text-[9px] uppercase tracking-widest font-bold text-[#87CEEB] mb-1 block">
                                                {item.category}
                                            </span>
                                            <h4 className="text-sm font-bold text-white leading-tight">
                                                {item.title}
                                            </h4>
                                        </div>
                                    </div>
                                    {/* Zoom icon */}
                                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                                        <ZoomIn className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* View More Button */}
                        <div className="flex justify-center mt-6">
                            <button className="flex items-center space-x-3 px-7 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white/70 hover:bg-[#0096FF]/10 hover:border-[#0096FF]/30 hover:text-[#87CEEB] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,150,255,0.15)]">
                                <span>View Full Gallery</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Livestream Featured Card */}
                        <div className="mt-20">
                            <div className="relative w-full rounded-2xl overflow-hidden border border-[#0096FF]/30 bg-[#001726]/60 backdrop-blur-md shadow-[0_8px_32px_rgba(0,150,255,0.1)] group">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0096FF]/10 to-transparent pointer-events-none" />
                                <div className="flex flex-col md:flex-row items-center p-6 md:p-8 gap-6 md:gap-10 relative z-10">
                                    {/* Livestream Thumbnail/Icon */}
                                    <div className="relative w-full md:w-1/3 aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-[#0096FF]/40 transition-colors duration-500 cursor-pointer">
                                        <img
                                            src="https://images.pexels.com/photos/2774576/pexels-photo-2774576.jpeg"
                                            alt="Live Stream"
                                            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20" />
                                        <PlayCircle className="w-12 h-12 text-white relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(0,150,255,0.5)]" />
                                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full animate-pulse flex items-center space-x-1.5">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                            <span>Live Now</span>
                                        </div>
                                    </div>

                                    {/* Livestream Info */}
                                    <div className="flex flex-col flex-grow text-center md:text-left">
                                        <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
                                            Sunday Worship Service
                                        </h3>
                                        <p className="text-sm md:text-base text-white/70 leading-relaxed font-light mb-6 max-w-xl mx-auto md:mx-0">
                                            Join us from anywhere in the world. Experience the worship, the word, and the presence of God live as it happens.
                                        </p>

                                        <div>
                                            <button className="inline-flex items-center justify-center md:justify-start space-x-2 bg-[#0096FF] text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#007acc] transition-all duration-300 shadow-[0_0_20px_rgba(0,150,255,0.4)] hover:shadow-[0_0_25px_rgba(0,150,255,0.6)] hover:scale-105">
                                                <PlayCircle className="w-5 h-5" />
                                                <span>Watch Live Now</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Lightbox Modal ── */}
                    {lightboxIndex !== null && (
                        <div
                            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
                            onClick={closeLightbox}
                        >
                            {/* Close button */}
                            <button
                                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 z-10"
                                onClick={closeLightbox}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Prev */}
                            <button
                                className="absolute left-4 md:left-8 w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-[#0096FF]/30 hover:border-[#0096FF]/40 transition-all duration-200 z-10"
                                onClick={(e) => { e.stopPropagation(); prevImage() }}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Image */}
                            <div
                                className="relative max-w-4xl w-full mx-16 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <img
                                    src={filtered[lightboxIndex]?.src}
                                    alt={filtered[lightboxIndex]?.alt}
                                    className="w-full max-h-[80vh] object-contain bg-[#001726]"
                                />
                                {/* Caption bar */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4">
                                    <span className="text-[10px] uppercase tracking-widest text-[#87CEEB] font-bold">
                                        {filtered[lightboxIndex]?.category}
                                    </span>
                                    <h4 className="text-white font-bold text-base mt-0.5">
                                        {filtered[lightboxIndex]?.title}
                                    </h4>
                                    <p className="text-white/40 text-xs mt-0.5">
                                        {lightboxIndex + 1} / {filtered.length}
                                    </p>
                                </div>
                            </div>

                            {/* Next */}
                            <button
                                className="absolute right-4 md:right-8 w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-[#0096FF]/30 hover:border-[#0096FF]/40 transition-all duration-200 z-10"
                                onClick={(e) => { e.stopPropagation(); nextImage() }}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </motion.div>
    )
}
