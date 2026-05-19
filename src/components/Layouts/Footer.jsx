import React from 'react'
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="relative w-full bg-[#00111F] text-white overflow-hidden border-t border-white/5 font-sans">
            {/* Subtle background spiritual radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
                {/* 4-Column Grid with wide spacing */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

                    {/* COLUMN 1: Logo & Mission Statement */}
                    <div className="flex flex-col space-y-6">
                        {/* Logo neatly contained inside a soft light-grey square background with subtle padding & rounded corners */}
                        <div className="self-start p-2 bg-gray-100/90 hover:bg-gray-100 transition-colors duration-300 rounded-xl shadow-md">
                            <img
                                className="h-10 w-10 object-contain rounded-lg"
                                src="https://res.cloudinary.com/dvkt0lsqb/image/upload/v1778832280/JET_LOGO.jpg_v0evon.jpg"
                                alt="JET Ministries Logo"
                            />
                        </div>

                        {/* Short church mission statement in medium-size white text */}
                        <p className="text-white/90 text-[15px] leading-relaxed font-normal">
                            “A community of faith, hope, and love. Join us as we grow together in Christ.”
                        </p>

                    </div>

                    {/* COLUMN 2: Quick Links */}
                    <div className="flex flex-col space-y-6">
                        <h3 className="text-white font-bold text-lg tracking-wide relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#3B82F6]">
                            Quick Links
                        </h3>
                        <ul className="flex flex-col space-y-4 text-sm pt-1">
                            <li>
                                <a
                                    href="#"
                                    className="inline-block text-white hover:text-[#3B82F6] transition-all duration-300 hover:translate-x-1.5 transform"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="inline-block text-white hover:text-[#3B82F6] transition-all duration-300 hover:translate-x-1.5 transform"
                                >
                                    Sermons & Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="inline-block text-white hover:text-[#3B82F6] transition-all duration-300 hover:translate-x-1.5 transform"
                                >
                                    Events
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="inline-block text-white hover:text-[#3B82F6] transition-all duration-300 hover:translate-x-1.5 transform"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 3: Contact Us */}
                    <div className="flex flex-col space-y-6">
                        <h3 className="text-white font-bold text-lg tracking-wide relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#3B82F6]">
                            Contact Us
                        </h3>
                        <ul className="flex flex-col space-y-4 text-sm pt-1">
                            <li className="flex items-start space-x-3 text-white/90">
                                <MapPin className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">123 Faith Street, Hope City, HC 12345</span>
                            </li>
                            <li className="flex items-center space-x-3 text-white/90">
                                <Phone className="w-5 h-5 text-white/70 shrink-0" />
                                <span>(+254)799573554</span>
                            </li>
                            <li className="flex items-center space-x-3 text-white/90">
                                <Mail className="w-5 h-5 text-white/70 shrink-0" />
                                <a href="mailto:jet.ministriesintl@gmail.com" className="hover:text-[#3B82F6] transition-colors duration-300">
                                    jet.ministriesintl@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 4: Newsletter */}
                    <div className="flex flex-col space-y-6">
                        <h3 className="text-white font-bold text-lg tracking-wide relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#3B82F6]">
                            Newsletter
                        </h3>
                        <div className="flex flex-col space-y-4 pt-1">
                            <p className="text-white/80 text-sm leading-relaxed">
                                Stay updated with our newsletter
                            </p>

                            {/* Glassmorphic Subscription Input & Button */}
                            <form className="flex flex-col space-y-2.5" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] backdrop-blur-sm transition-all duration-300"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-lg text-white font-medium text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    Subscribe
                                </button>
                            </form>

                            {/* Blue call-to-action link */}
                            <a
                                href="#"
                                className="inline-flex items-center text-[#3B82F6] hover:text-[#60A5FA] font-medium text-sm transition-all duration-300 mt-1 self-start group"
                            >
                                Subscribe now
                                <ArrowRight className="ml-1.5 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Section */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col items-center justify-between">
                    <p className="text-center text-white/50 text-xs tracking-wider font-light">
                        © 2026 JET Ministries International. All rights reserved.
                    </p>
                </div>
            </div>
        </footer >
    )
}
