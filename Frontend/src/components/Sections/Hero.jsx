import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'

const slides = [
    { 
        image: 'https://images.pexels.com/photos/2774576/pexels-photo-2774576.jpeg?auto=compress&cs=tinysrgb&w=1920',
        eyebrow: 'Welcome to JET International',
        headline: 'Heartfelt Worship & Praise',
        subheadline: 'Experience the transforming presence of God in our spirit-filled worship services and authentic community.',
        primaryCta: { label: 'Explore Ministries', href: '/about' },
        secondaryCta: { label: 'Upcoming Events', href: '/events' }
    },
    { 
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1920&q=80',
        eyebrow: 'Fellowship & Discipleship',
        headline: 'Grow Together in Faith',
        subheadline: 'Join our vibrant Bible study groups, house fellowships, and outreach missions as we grow in God\'s Word.',
        primaryCta: { label: 'Our Fellowships', href: '/about' },
        secondaryCta: { label: 'Photo Gallery', href: '/gallery' }
    },
    { 
        image: 'https://images.pexels.com/photos/19392550/pexels-photo-19392550.jpeg?auto=compress&cs=tinysrgb&w=1920',
        eyebrow: 'Generations for Christ',
        headline: 'Nurturing Faith Across Generations',
        subheadline: 'Empowering children, youth, and families to walk in love, hope, and truth.',
        primaryCta: { label: 'Learn More', href: '/about' },
        secondaryCta: { label: 'Giving & Resources', href: '/giving' }
    },
]

export default function Hero() {
    const [current, setCurrent] = useState(0)
    const timeoutRef = useRef(null)
    const intervalRef = useRef(null)
    const touchStartX = useRef(null)
    const touchEndX = useRef(null)

    const resetInterval = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
        }, 5500)
    }

    useEffect(() => {
        resetInterval()
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const goTo = (index) => {
        setCurrent(index)
        resetInterval()
    }

    // Touch swipe for mobile hero
    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].clientX
    }

    const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].clientX
        if (touchStartX.current === null || touchEndX.current === null) return
        const diff = touchStartX.current - touchEndX.current
        if (diff > 45) {
            goTo((current + 1) % slides.length)
        } else if (diff < -45) {
            goTo((current - 1 + slides.length) % slides.length)
        }
        touchStartX.current = null
        touchEndX.current = null
    }

    const activeSlide = slides[current]

    return (
        <section
            className="relative w-full min-h-[66vh] sm:min-h-[75vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#000d1a]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Background Slides */}
            {slides.map((slide, i) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                    style={{ transitionProperty: 'opacity, transform' }}
                >
                    <img
                        src={slide.image}
                        alt={slide.headline}
                        className="w-full h-full object-cover object-center"
                        loading={i === 0 ? 'eager' : 'lazy'}
                    />
                </div>
            ))}

            {/* Gradient Overlays for perfect legibility & seamless section transition */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#000d1a] via-[#000d1a]/65 to-[#000d1a]/50 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,10,25,0.7)_100%)] z-10 pointer-events-none" />

            {/* Subtle glow orb */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0096FF]/15 rounded-full blur-[120px] pointer-events-none z-10" />

            {/* Content Container */}
            <div className="relative z-20 w-full max-w-4xl mx-auto px-5 sm:px-6 md:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16 text-center flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        {/* Eyebrow Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#87CEEB] text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-3.5 sm:mb-5 shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-[#0096FF]" />
                            <span>{activeSlide.eyebrow}</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-3 sm:mb-4 max-w-3xl drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
                            {activeSlide.headline}
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xs sm:text-base md:text-lg text-white/85 leading-relaxed max-w-xl mx-auto mb-6 sm:mb-8 font-normal drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
                            {activeSlide.subheadline}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-8 sm:mb-10">
                            <Link
                                to={activeSlide.primaryCta.href}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#0096FF] hover:bg-[#0080ee] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_0_24px_rgba(0,150,255,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                            >
                                <span>{activeSlide.primaryCta.label}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <Link
                                to={activeSlide.secondaryCta.href}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                            >
                                <span>{activeSlide.secondaryCta.label}</span>
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dot / Slide Indicator Pills */}
                <div className="flex items-center justify-center gap-2 z-20">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer touch-manipulation ${
                                i === current
                                    ? 'w-7 sm:w-8 bg-[#0096FF] shadow-[0_0_12px_rgba(0,150,255,0.7)]'
                                    : 'w-2 sm:w-2.5 bg-white/35 hover:bg-white/60'
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
