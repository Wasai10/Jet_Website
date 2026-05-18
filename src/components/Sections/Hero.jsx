import React, { useState, useEffect } from 'react'

const slides = [
    { image: 'https://media.istockphoto.com/id/1333641112/photo/bible-study-multi-ethnic-group-multi-ethnic-group-of-friends-meet-for-a-bible-study-group.jpg?b=1&s=612x612&w=0&k=20&c=ZmwA6uaqXPpl_0D2pmMFtd5DfElmNXOsfTUCCrminWI=' },
    { image: 'https://images.pexels.com/photos/2774576/pexels-photo-2774576.jpeg' },
    { image: 'https://images.pexels.com/photos/19392550/pexels-photo-19392550.jpeg' },
]

export default function Hero() {
    const [current, setCurrent] = useState(0)
    const [fading, setFading] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setFading(true)
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % slides.length)
                setFading(false)
            }, 700)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const goTo = (index) => {
        if (index === current) return
        setFading(true)
        setTimeout(() => {
            setCurrent(index)
            setFading(false)
        }, 700)
    }

    return (
        <section style={styles.hero}>
            {/* Background Images */}
            {slides.map((slide, i) => (
                <div
                    key={i}
                    style={{
                        ...styles.slide,
                        backgroundImage: `url(${slide.image})`,
                        opacity: i === current ? (fading ? 0 : 1) : 0,
                        transition: 'opacity 0.7s ease-in-out',
                    }}
                />
            ))}

            {/* Dark gradient overlay */}
            <div style={styles.overlay} />

            {/* Content */}
            <div style={styles.content}>
                <h1 style={styles.headline}>
                    Welcome to JET Ministries International
                </h1>
                <p style={styles.subheadline}>
                    A place where faith comes alive and community thrives
                </p>

                {/* CTA Buttons */}
                <div style={styles.buttons}>
                    <a href="#about" style={styles.btnPrimary}>Learn More</a>
                    <a href="#events" style={styles.btnSecondary}>Upcoming Events</a>
                </div>

                {/* Dot indicators */}
                <div style={styles.dots}>
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
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
        </section>
    )
}

const styles = {
    hero: {
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slide: {
        position: 'absolute',
        inset: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
    overlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,10,30,0.55) 0%, rgba(0,10,30,0.72) 100%)',
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
        marginBottom: '2.2rem',
        fontWeight: 400,
    },
    buttons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '2.8rem',
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
