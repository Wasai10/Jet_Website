import React, { useState, useEffect } from 'react'

const slides = [
    { 
        image: 'https://res.cloudinary.com/dvkt0lsqb/image/upload/v1778832280/JET_LOGO.jpg_v0evon.jpg',
        headline: 'Welcome to JET Ministries International',
        subheadline: 'A place where faith comes alive and community thrives'
    },
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
                <img
                    key={i}
                    src={slide.image}
                    alt={`Worship Slide ${i + 1}`}
                    style={{
                        ...styles.slide,
                        objectFit: slide.image.includes('JET_LOGO')
                            ? 'contain'
                            : 'cover',
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
                <h1 
                    style={{
                        ...styles.headline,
                        opacity: fading ? 0 : 1,
                        transition: 'opacity 0.7s ease-in-out',
                    }}
                >
                    {slides[current].headline}
                </h1>
                <p 
                    style={{
                        ...styles.subheadline,
                        opacity: fading ? 0 : 1,
                        transition: 'opacity 0.7s ease-in-out',
                    }}
                >
                    {slides[current].subheadline}
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
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
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
