import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ArrowRight, ChevronRight } from 'lucide-react'

const events = [
    {
        id: 1,
        tag: 'Featured',
        date: { day: '25', month: 'MAY', year: '2025' },
        time: '10:00 AM – 1:00 PM',
        title: 'Sunday Worship & Communion Service',
        description: 'Join us for a powerful time of worship, the Word, and Holy Communion as we gather together as one body in Christ.',
        location: 'JET Ministries Main Auditorium',
        color: '#0096FF',
        featured: true,
    },
    {
        id: 2,
        tag: 'Youth',
        date: { day: '31', month: 'MAY', year: '2025' },
        time: '3:00 PM – 6:00 PM',
        title: 'JET Youth Night Out',
        description: 'An exciting evening for the youth filled with praise, games, and a powerful devotional session to ignite faith in the next generation.',
        location: 'Youth Hall, JET Compound',
        color: '#87CEEB',
        featured: false,
    },
    {
        id: 3,
        tag: 'Prayer',
        date: { day: '07', month: 'JUN', year: '2025' },
        time: '6:00 AM – 8:00 AM',
        title: 'Early Morning Prayer Intercession',
        description: 'Start your week in the presence of God. Come and intercede for your family, community, and nation as we pray together.',
        location: 'Prayer Room, JET Ministries',
        color: '#0096FF',
        featured: false,
    },
    {
        id: 4,
        tag: 'Community',
        date: { day: '14', month: 'JUN', year: '2025' },
        time: '9:00 AM – 4:00 PM',
        title: 'Community Outreach Day',
        description: 'We are going into the community to serve — food drives, free medical camps, and gospel sharing. Come be the hands and feet of Jesus.',
        location: 'Eastlands Community Centre',
        color: '#87CEEB',
        featured: false,
    },
]

export default function Events() {
    const [hovered, setHovered] = useState(null)
    const featured = events.find(e => e.featured)
    const rest = events.filter(e => !e.featured)

    return (
        <section id="events" className="relative w-full py-20 md:py-28 bg-background dark:bg-[#00111F] text-foreground overflow-hidden">
            {/* Background glow blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(0,150,255,0.06),transparent_60%)] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(135,206,235,0.05),transparent_60%)] pointer-events-none" />

            {/* Dot grid texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `radial-gradient(rgba(100,100,100,0.3) 1px, transparent 1px)`,
                backgroundSize: '28px 28px'
            }} />

            <div className="relative max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, y: -20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                    }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14"
                >
                    <div>
                        <span className="text-[#0096FF] dark:text-[#87CEEB] text-xs font-semibold uppercase tracking-widest mb-3 block">
                            What's Coming Up
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
                            Upcoming Events
                        </h2>
                    </div>
                    <button className="flex items-center space-x-2 text-sm font-semibold text-[#0096FF] dark:text-[#87CEEB] hover:text-foreground transition-colors duration-300 group self-start md:self-auto">
                        <span>View all events</span>
                        <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </motion.div>

                {/* Events Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.2 } }
                    }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >

                    {/* FEATURED EVENT — large left card */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: -30 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                        }}
                        className="lg:col-span-5 relative bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-2xl overflow-hidden p-7 flex flex-col justify-between transition-all duration-300 hover:bg-foreground/10 hover:border-foreground/15 hover:shadow-[0_12px_40px_rgba(0,150,255,0.08)] group cursor-pointer"
                        onMouseEnter={() => setHovered(featured.id)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0096FF] to-transparent opacity-60" />

                        {/* Tag */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[#0096FF] bg-[#0096FF]/10 border border-[#0096FF]/20 px-3 py-1 rounded-full">
                                {featured.tag}
                            </span>
                            <div className="flex items-center space-x-1.5 text-foreground/40 text-xs">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{featured.date.year}</span>
                            </div>
                        </div>

                        {/* Date block */}
                        <div className="mb-5">
                            <div className="flex items-end space-x-2">
                                <span className="text-6xl font-black text-foreground leading-none">{featured.date.day}</span>
                                <div className="flex flex-col mb-1">
                                    <span className="text-[#0096FF] dark:text-[#87CEEB] text-sm font-bold leading-tight">{featured.date.month}</span>
                                    <span className="text-foreground/30 text-xs leading-tight">{featured.date.year}</span>
                                </div>
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-foreground leading-snug mb-3 group-hover:text-[#87CEEB] transition-colors duration-300">
                                {featured.title}
                            </h3>
                            <p className="text-sm text-foreground/60 leading-relaxed font-light">
                                {featured.description}
                            </p>
                        </div>

                        {/* Meta info */}
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center space-x-2 text-foreground/50 text-xs">
                                <Clock className="w-3.5 h-3.5 text-[#87CEEB]" />
                                <span>{featured.time}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-foreground/50 text-xs">
                                <MapPin className="w-3.5 h-3.5 text-[#87CEEB]" />
                                <span>{featured.location}</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <button className="mt-7 flex items-center space-x-2.5 text-xs uppercase tracking-widest font-semibold text-[#0096FF] dark:text-[#87CEEB] hover:text-foreground group/btn transition-colors duration-300">
                            <span>Learn More</span>
                            <div className="w-7 h-7 rounded-full bg-[#0096FF]/20 border border-[#0096FF]/30 flex items-center justify-center transition-all duration-300 group-hover/btn:bg-[#0096FF] group-hover/btn:scale-110 group-hover/btn:shadow-[0_0_12px_rgba(0,150,255,0.4)]">
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </button>
                    </motion.div>

                    {/* RIGHT COLUMN — stacked smaller cards */}
                    <div className="lg:col-span-7 flex flex-col gap-5">
                        {rest.map((event) => (
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: 30 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
                                }}
                                key={event.id}
                                className="relative flex items-start space-x-5 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-xl p-5 transition-all duration-300 hover:bg-foreground/10 hover:border-foreground/15 hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(0,150,255,0.06)] group cursor-pointer"
                                onMouseEnter={() => setHovered(event.id)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                {/* Left accent line */}
                                <div
                                    className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full opacity-50"
                                    style={{ backgroundColor: event.color }}
                                />

                                {/* Date block */}
                                <div className="flex-shrink-0 text-center w-12 pl-3">
                                    <div className="text-2xl font-black text-foreground leading-none">{event.date.day}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: event.color }}>
                                        {event.date.month}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="w-px self-stretch bg-foreground/5 flex-shrink-0" />

                                {/* Content */}
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <span
                                            className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border"
                                            style={{ color: event.color, borderColor: `${event.color}33`, backgroundColor: `${event.color}11` }}
                                        >
                                            {event.tag}
                                        </span>
                                        <div className="flex items-center space-x-1 text-foreground/30 text-[10px]">
                                            <Clock className="w-3 h-3" />
                                            <span>{event.time}</span>
                                        </div>
                                    </div>

                                    <h4 className="text-[15px] font-bold text-foreground leading-snug mb-1.5 group-hover:text-[#87CEEB] transition-colors duration-300 truncate">
                                        {event.title}
                                    </h4>
                                    <p className="text-[12px] text-foreground/50 leading-relaxed font-light line-clamp-2">
                                        {event.description}
                                    </p>

                                    <div className="flex items-center space-x-1.5 mt-2.5 text-foreground/40 text-[11px]">
                                        <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: event.color }} />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div
                                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                                    style={{
                                        backgroundColor: hovered === event.id ? event.color : `${event.color}15`,
                                        borderColor: `${event.color}30`,
                                        color: hovered === event.id ? '#fff' : event.color,
                                    }}
                                >
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
