import React from 'react'
import { Eye, Target, Users, Heart } from 'lucide-react'

export default function About() {
    return (
        <section id="about" className="relative w-full py-20 md:py-28 bg-[#001726] text-white overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(0,150,255,0.05),transparent_60%)] pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(135,206,235,0.05),transparent_60%)] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* LEFT COLUMN: Visuals / Image Group */}
                    <div className="lg:col-span-5 relative">
                        {/* Main Image Frame */}
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#001726]/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                            <img 
                                src="https://images.pexels.com/photos/2774576/pexels-photo-2774576.jpeg" 
                                alt="JET Ministries Fellowship" 
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

                    {/* RIGHT COLUMN: Content */}
                    <div className="lg:col-span-7 flex flex-col space-y-6">
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

                        {/* Core Value Pill Tags */}
                        <div className="pt-4">
                            <h4 className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-3">Our Core Values</h4>
                            <div className="flex flex-wrap gap-2.5">
                                <span className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white">
                                    Faith
                                </span>
                                <span className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white">
                                    Hope
                                </span>
                                <span className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white">
                                    Love
                                </span>
                                <span className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white">
                                    Community
                                </span>
                                <span className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white">
                                    Service
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
