import React from 'react'
import { motion } from 'framer-motion'
import { Eye, Target, Users, Heart } from 'lucide-react'

export default function About() {
    return (
        <section id="about" className="relative w-full py-20 md:py-32 bg-[#001726] text-white overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(0,150,255,0.05),transparent_60%)] pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(135,206,235,0.05),transparent_60%)] pointer-events-none" />

            {/* Subtle textured grid background for depth */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
            }} />

            {/* Cathedral Silhouette Corner Decorations */}
            <div className="absolute top-12 left-12 w-48 h-48 opacity-[0.02] pointer-events-none text-white hidden lg:block">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                    <path d="M50 5 L60 30 L55 30 L55 95 L45 95 L45 30 L40 30 Z M20 40 L30 55 L27 55 L27 95 L13 95 L13 55 L10 55 Z M80 40 L90 55 L87 55 L87 95 L73 95 L73 55 L70 55 Z" />
                </svg>
            </div>
            <div className="absolute bottom-12 right-12 w-64 h-64 opacity-[0.02] pointer-events-none text-white hidden lg:block">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                    <path d="M50 5 L60 30 L55 30 L55 95 L45 95 L45 30 L40 30 Z M20 40 L30 55 L27 55 L27 95 L13 95 L13 55 L10 55 Z M80 40 L90 55 L87 55 L87 95 L73 95 L73 55 L70 55 Z" />
                </svg>
            </div>

            <div className="relative max-w-7xl mx-auto px-6">
                {/* FIRST ROW: Visuals / Image & Narrative */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.2 } }
                    }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-8 md:mb-10"
                >

                    {/* LEFT COLUMN: Visuals / Image Group */}
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, x: -40 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                        }}
                        className="lg:col-span-5 relative"
                    >
                        {/* Main Image Frame */}
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#001726]/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                            <img
                                src="https://res.cloudinary.com/dxeuvtxys/image/upload/q_auto/f_auto/v1779201944/Jet_team_cprlcf.jpg"
                                alt="JET Ministries Team"
                                className="w-full h-[450px] object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        {/* Floating Glassmorphic Stats Card */}
                        <div className="absolute -bottom-6 -right-4 md:right-6 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-xl max-w-[200px] animate-fade-in hover:border-white/20 transition-all duration-300">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-[#0096FF]/20 rounded-lg text-[#87CEEB]">
                                    <Users className="w-5 h-5" />
                                </div>
                                <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">Our Family</span>
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-0.5">10+ Years</h4>
                            <p className="text-xs text-white/70">Of sharing faith, hope, and love in Christ.</p>
                        </div>
                    </div>

                    </motion.div>

                    {/* RIGHT COLUMN: Content */}
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, x: 40 },
                            visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                        }}
                        className="lg:col-span-7 flex flex-col space-y-6"
                    >
                        {/* Eyebrow tag */}
                        <span className="text-[#87CEEB] text-xs font-semibold uppercase tracking-widest">
                            About JET Ministries
                        </span>

                        {/* Heading */}
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                            Transforming Lives, Building Community, and Spreading Hope
                        </h2>

                        {/* Introductory Narrative */}
                        <p className="text-white/80 text-[16px] leading-relaxed font-normal">
                            JET Ministries International is a community of believers dedicated to experiencing God's love and sharing it with the world. We believe that through fellowship, worship, and study, we grow together as a family in Christ to impact our society positively.
                        </p>

                        {/* Vision & Mission Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            {/* Vision Card */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/5 p-6 rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-white/15 hover:scale-[1.02]">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="p-2 bg-[#0096FF]/10 rounded-lg text-[#0096FF]">
                                        <Eye className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-white text-base">Our Vision</h3>
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed font-light">
                                    To be a lighthouse of hope, raising a generation of believers who are deeply rooted in Christ, walking in faith, and active in service.
                                </p>
                            </div>

                            {/* Mission Card */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/5 p-6 rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-white/15 hover:scale-[1.02]">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="p-2 bg-[#87CEEB]/10 rounded-lg text-[#87CEEB]">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-white text-base">Our Mission</h3>
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed font-light">
                                    To share the message of Christ through word and action, equipping believers to grow spiritually and reach the world with His love.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
                {/* Service Cards Layout */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.15 } }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-6xl mx-auto"
                >
                    {/* CARD 1 */}
                    <motion.button 
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                        }}
                        className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/10 hover:border-white/15 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,150,255,0.06)] w-full text-left group"
                    >
                        {/* Icon Container */}
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#0096FF]/10 group-hover:border-[#0096FF]/20 flex-shrink-0">
                            <svg className="w-5 h-5 text-[#87CEEB] transition-colors duration-300 group-hover:text-[#0096FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 15c0-4.5 3.5-8 8-8m10 8c0-4.5-3.5-8-8-8m0 0v13m-2-13a4.5 4.5 0 0 0-4.5 4.5c0 3 4.5 6.5 4.5 6.5m2-11a4.5 4.5 0 0 1 4.5 4.5c0 3-4.5 6.5-4.5 6.5" />
                            </svg>
                        </div>
                        {/* Text Info */}
                        <div className="flex-grow min-w-0">
                            <h4 className="text-[15px] font-bold text-white group-hover:text-[#87CEEB] transition-colors duration-300 leading-tight truncate">
                                Our Community
                            </h4>
                            <p className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors duration-300 leading-tight mt-0.5 truncate">
                                Vibrant Faith Formation programs.
                            </p>
                        </div>
                        {/* Compact Arrow */}
                        <div className="w-6 h-6 rounded-full bg-[#0096FF]/10 text-[#87CEEB] flex items-center justify-center transition-all duration-300 group-hover:bg-[#0096FF] group-hover:text-white group-hover:scale-110 flex-shrink-0">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </motion.button>

                    {/* CARD 2 */}
                    <motion.button 
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                        }}
                        className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/10 hover:border-white/15 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,150,255,0.06)] w-full text-left group"
                    >
                        {/* Icon Container */}
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#0096FF]/10 group-hover:border-[#0096FF]/20 flex-shrink-0">
                            <svg className="w-5 h-5 text-[#87CEEB] transition-colors duration-300 group-hover:text-[#0096FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5V11M9 8H15M12 14.5a3.5 3.5 0 0 1-3.5-3.5c0-2.5 3.5-5.5 3.5-5.5s3.5 3 3.5 5.5a3.5 3.5 0 0 1-3.5 3.5zM3 18c0-2 4-3 9-3s9 1 9 3v2H3v-2z" />
                            </svg>
                        </div>
                        {/* Text Info */}
                        <div className="flex-grow min-w-0">
                            <h4 className="text-[15px] font-bold text-white group-hover:text-[#87CEEB] transition-colors duration-300 leading-tight truncate">
                                Church Mission
                            </h4>
                            <p className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors duration-300 leading-tight mt-0.5 truncate">
                                Fundraisers & special activities.
                            </p>
                        </div>
                        {/* Compact Arrow */}
                        <div className="w-6 h-6 rounded-full bg-[#0096FF]/10 text-[#87CEEB] flex items-center justify-center transition-all duration-300 group-hover:bg-[#0096FF] group-hover:text-white group-hover:scale-110 flex-shrink-0">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </motion.button>

                    {/* CARD 3 */}
                    <motion.button 
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                        }}
                        className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/10 hover:border-white/15 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,150,255,0.06)] w-full text-left group"
                    >
                        {/* Icon Container */}
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#0096FF]/10 group-hover:border-[#0096FF]/20 flex-shrink-0">
                            <svg className="w-5 h-5 text-[#87CEEB] transition-colors duration-300 group-hover:text-[#0096FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 20h4M9 6c2-2 4-2 6 0l-2 14h-2L9 6zm3-4v2" />
                            </svg>
                        </div>
                        {/* Text Info */}
                        <div className="flex-grow min-w-0">
                            <h4 className="text-[15px] font-bold text-white group-hover:text-[#87CEEB] transition-colors duration-300 leading-tight truncate">
                                Weekly Events
                            </h4>
                            <p className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors duration-300 leading-tight mt-0.5 truncate">
                                Opportunities for all age groups.
                            </p>
                        </div>
                        {/* Compact Arrow */}
                        <div className="w-6 h-6 rounded-full bg-[#0096FF]/10 text-[#87CEEB] flex items-center justify-center transition-all duration-300 group-hover:bg-[#0096FF] group-hover:text-white group-hover:scale-110 flex-shrink-0">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </motion.button>

                    {/* CARD 4 */}
                    <motion.button 
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                        }}
                        className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/10 hover:border-white/15 hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(0,150,255,0.06)] w-full text-left group"
                    >
                        {/* Icon Container */}
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#0096FF]/10 group-hover:border-[#0096FF]/20 flex-shrink-0">
                            <svg className="w-5 h-5 text-[#87CEEB] transition-colors duration-300 group-hover:text-[#0096FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="7" r="4" />
                                <path d="M5 21a7 7 0 0 1 14 0" />
                                <path d="M12 11v6" />
                                <path d="M9 14h6" />
                            </svg>
                        </div>
                        {/* Text Info */}
                        <div className="flex-grow min-w-0">
                            <h4 className="text-[15px] font-bold text-white group-hover:text-[#87CEEB] transition-colors duration-300 leading-tight truncate">
                                Support Networks
                            </h4>
                            <p className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors duration-300 leading-tight mt-0.5 truncate">
                                Care & support systems for all.
                            </p>
                        </div>
                        {/* Compact Arrow */}
                        <div className="w-6 h-6 rounded-full bg-[#0096FF]/10 text-[#87CEEB] flex items-center justify-center transition-all duration-300 group-hover:bg-[#0096FF] group-hover:text-white group-hover:scale-110 flex-shrink-0">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </motion.button>
                </motion.div>
            </div>
        </section>
    )
}
