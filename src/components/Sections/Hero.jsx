import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const slides = [
    { 
        image: 'https://media.istockphoto.com/id/1333641112/photo/bible-study-multi-ethnic-group-multi-ethnic-group-of-friends-meet-for-a-bible-study-group.jpg?b=1&s=612x612&w=0&k=20&c=ZmwA6uaqXPpl_0D2pmMFtd5DfElmNXOsfTUCCrminWI=',
        headline: 'Grow Together in Fellowship',
        subheadline: 'Join our vibrant Bible study and community groups as we grow in God\'s Word.'
    },
    { 
        image: 'https://images.pexels.com/photos/2774576/pexels-photo-2774576.jpeg',
        headline: 'Heartfelt Worship & Praise',
        subheadline: 'Experience the presence of God in our spirit-filled worship services.'
    },
    { 
        image: 'https://images.pexels.com/photos/19392550/pexels-photo-19392550.jpeg',
        headline: 'Nurturing Faith Across Generations',
        subheadline: 'Empowering children, youth, and families to walk in love, hope, and truth.'
    },
]

export default function Hero() {
    const [current, setCurrent] = useState(0)
    const [fading, setFading] = useState(false)
    const timeoutRef = React.useRef(null)
    const intervalRef = React.useRef(null)

    const resetInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
        intervalRef.current = setInterval(() => {
            setFading(true)
            timeoutRef.current = setTimeout(() => {
                setCurrent((prev) => (prev + 1) % slides.length)
                setFading(false)
            }, 700)
        }, 5000)
    }

    useEffect(() => {
        resetInterval()
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const goTo = (index) => {
        if (index === current) return
        
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        
        setFading(true)
        timeoutRef.current = setTimeout(() => {
            setCurrent(index)
            setFading(false)
        }, 700)
        
        resetInterval()
    }

    return (
        <section className="hero-section" style={styles.hero}>
            <style>{`
                @media (max-width: 900px) {
                    .hero-section {
                        flex-direction: column !important;
                    }
                    .left-pane {
                        flex: 0 0 auto !important;
                        width: 100% !important;
                        padding: 3rem 1.5rem !important;
                    }
                    .right-pane {
                        flex: 1 1 100% !important;
                        width: 100% !important;
                        min-height: 500px !important;
                    }
                }
            `}</style>
            
            {/* Left Pane - Logo Background */}
            <div className="left-pane" style={styles.leftPane}>
                <img 
                    src="https://res.cloudinary.com/dvkt0lsqb/image/upload/v1778832280/JET_LOGO.jpg_v0evon.jpg"
                    alt="JET Ministries Logo"
                    style={styles.leftPaneBg}
                />
                <div style={styles.leftPaneOverlay} />
                <div style={styles.leftContent}>
                    <h1 style={styles.mainTitle}>Welcome to JET Ministries International</h1>
                    <p style={styles.mainSubtitle}>A place where faith comes alive and community thrives</p>
                </div>
            </div>

            {/* Right Pane - Slider */}
            <div className="right-pane" style={styles.rightPane}>
                {/* Background Images */}
                {slides.map((slide, i) => (
                    <img
                        key={i}
                        src={slide.image}
                        alt={`Worship Slide ${i + 1}`}
                        style={{
                            ...styles.slide,
                            objectFit: 'cover',
                            backgroundColor: '#00111F',
                            opacity: i === current ? (fading ? 0 : 1) : 0,
                            transition: 'opacity 0.7s ease-in-out',
                        }}
                    />
                ))}

                {/* Dark gradient overlay */}
                <div style={styles.overlay} />

                {/* Content */}
                <div style={styles.content}>
                    <motion.div
                        initial="hidden"
                        animate={fading ? "hidden" : "visible"}
                        variants={{
                            hidden: { 
                                opacity: 0,
                                transition: { staggerChildren: 0.1, staggerDirection: -1 }
                            },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.3, delayChildren: 0.2 }
                            }
                        }}
                    >
                        <motion.h2 
                            style={styles.headline}
                            variants={{
                                hidden: { opacity: 0, x: -30, transition: { duration: 0.5, ease: "easeInOut" } },
                                visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] } }
                            }}
                        >
                            {slides[current].headline}
                        </motion.h2>
                        <motion.p 
                            style={styles.subheadline}
                            variants={{
                                hidden: { opacity: 0, x: -30, transition: { duration: 0.5, ease: "easeInOut" } },
                                visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] } }
                            }}
                        >
                            {slides[current].subheadline}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div 
                            style={styles.buttons}
                            variants={{
                                hidden: { opacity: 0, x: -30, transition: { duration: 0.5, ease: "easeInOut" } },
                                visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] } }
                            }}
                        >
                            <a href="#about" style={styles.btnPrimary}>Learn More</a>
                            <a href="#events" style={styles.btnSecondary}>Upcoming Events</a>
                        </motion.div>
                    </motion.div>

                    {/* Dot indicators */}
                    <div style={styles.dots}>
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                onMouseEnter={() => goTo(i)}
                                style={{
                                    ...styles.dot,
                                    backgroundColor: i === current ? '#0096FF' : 'rgba(255,255,255,0.45)',
                                    transform: i === current ? 'scale(1.3)' : 'scale(1)',
                                }}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

const styles = {
    hero: {
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'var(--background)',
        overflow: 'hidden',
    },
    leftPane: {
        position: 'relative',
        flex: '0 0 40%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '3rem 3rem',
        backgroundColor: 'var(--background)',
        zIndex: 5,
        boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
        overflow: 'hidden',
    },
    leftPaneBg: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        zIndex: 1,
    },
    leftPaneOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 20, 80, 0.8)',
        zIndex: 2,
    },
    leftContent: {
        position: 'relative',
        zIndex: 3,
        textAlign: 'center',
    },
    mainTitle: {
        fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: '1rem',
        lineHeight: 1.2,
        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
    },
    mainSubtitle: {
        fontSize: '1.1rem',
        color: '#ffffff',
        opacity: 0.9,
        lineHeight: 1.5,
        textShadow: '0 1px 8px rgba(0,0,0,0.5)',
    },
    rightPane: {
        flex: '1',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    slide: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
    },
    overlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,10,30,0.4) 0%, rgba(0,10,30,0.7) 100%)',
        zIndex: 1,
    },
    content: {
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: '0 1.5rem',
        maxWidth: '780px',
    },
    eyebrow: {
        fontSize: '0.85rem',
        fontWeight: 600,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#87CEEB',
        marginBottom: '1rem',
    },
    headline: {
        fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
        fontWeight: 800,
        color: '#ffffff',
        lineHeight: 1.15,
        marginBottom: '1.1rem',
        textShadow: '0 2px 24px rgba(0,0,0,0.35)',
    },
    subheadline: {
        fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
        color: 'rgba(255,255,255,0.82)',
        lineHeight: 1.65,
        marginBottom: '3.5rem',
        fontWeight: 400,
    },
    buttons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '4.2rem',
    },
    btnPrimary: {
        display: 'inline-block',
        padding: '0.75rem 2rem',
        borderRadius: '0.5rem',
        backgroundColor: '#0096FF',
        color: '#ffffff',
        fontWeight: 600,
        fontSize: '0.95rem',
        textDecoration: 'none',
        transition: 'background-color 0.2s ease, transform 0.2s ease',
        boxShadow: '0 4px 20px rgba(0,150,255,0.4)',
    },
    btnSecondary: {
        display: 'inline-block',
        padding: '0.75rem 2rem',
        borderRadius: '0.5rem',
        border: '2px solid rgba(255,255,255,0.65)',
        color: '#ffffff',
        fontWeight: 600,
        fontSize: '0.95rem',
        textDecoration: 'none',
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
        backgroundColor: 'transparent',
    },
    dots: {
        display: 'flex',
        gap: '0.6rem',
        justifyContent: 'center',
    },
    dot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        padding: 0,
    },
}
