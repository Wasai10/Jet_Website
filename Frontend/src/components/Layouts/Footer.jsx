import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="relative w-full bg-slate-50 dark:bg-[#00111F] text-foreground overflow-hidden border-t border-foreground/10 font-sans">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_50%)] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

                    {/* COLUMN 1: Logo & Mission Statement */}
                    <div className="flex flex-col space-y-6">
                        <div className="self-start p-2 bg-gray-100/90 hover:bg-gray-100 transition-colors duration-300 rounded-xl shadow-md">
                            <img
                                className="h-10 w-10 object-contain rounded-lg"
                                src="/jet-logo.jpeg"
                                alt="JET Ministries Logo"
                            />
                        </div>
                        <p className="text-foreground/90 text-[15px] leading-relaxed font-normal">
                            "A community of faith, hope, and love. Join us as we grow together in Christ."
                        </p>
                    </div>

                    {/* COLUMN 2: Quick Links */}
                    <div className="flex flex-col space-y-6">
                        <h3 className="text-foreground font-bold text-lg tracking-wide relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#3B82F6]">
                            Quick Links
                        </h3>
                        <ul className="flex flex-col space-y-4 text-sm pt-1">
                            <li>
                                <Link
                                    to="/about"
                                    className="inline-block text-foreground hover:text-[#3B82F6] transition-all duration-300 hover:translate-x-1.5 transform"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/events"
                                    className="inline-block text-foreground hover:text-[#3B82F6] transition-all duration-300 hover:translate-x-1.5 transform"
                                >
                                    Ministry Events
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/giving"
                                    className="inline-block text-foreground hover:text-[#3B82F6] transition-all duration-300 hover:translate-x-1.5 transform"
                                >
                                    Giving & Resources
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="inline-block text-foreground hover:text-[#3B82F6] transition-all duration-300 hover:translate-x-1.5 transform"
                                >
                                    Sermons & Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 3: Contact Us */}
                    <div className="flex flex-col space-y-6">
                        <h3 className="text-foreground font-bold text-lg tracking-wide relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#3B82F6]">
                            Contact Us
                        </h3>
                        <ul className="flex flex-col space-y-4 text-sm pt-1">
                            <li className="flex items-start space-x-3 text-foreground/90">
                                <MapPin className="w-5 h-5 text-foreground/70 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">Nairobi, Kenya</span>
                            </li>
                            <li className="flex items-center space-x-3 text-foreground/90">
                                <Phone className="w-5 h-5 text-foreground/70 shrink-0" />
                                <span>(+254) 799573554</span>
                            </li>
                            <li className="flex items-center space-x-3 text-foreground/90">
                                <Mail className="w-5 h-5 text-foreground/70 shrink-0" />
                                <a href="mailto:jet.ministriesintl@gmail.com" className="hover:text-[#3B82F6] transition-colors duration-300">
                                    jet.ministriesintl@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 4: Newsletter */}
                    <div className="flex flex-col space-y-6">
                        <h3 className="text-foreground font-bold text-lg tracking-wide relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#3B82F6]">
                            Newsletter
                        </h3>
                        <div className="flex flex-col space-y-4 pt-1">
                            <p className="text-foreground/80 text-sm leading-relaxed">
                                Stay updated with our newsletter
                            </p>
                            <form className="flex flex-col space-y-2.5" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full px-4 py-2.5 bg-foreground/5 border border-foreground/15 rounded-lg text-foreground text-sm placeholder:text-foreground/40 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] backdrop-blur-sm transition-all duration-300"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full py-2.5 px-4 bg-foreground/10 hover:bg-foreground/15 border border-foreground/20 hover:border-foreground/30 rounded-lg text-foreground font-medium text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-foreground/10 flex flex-col items-center justify-between">
                    <p className="text-center text-foreground/50 text-xs tracking-wider font-light">
                        © 2026 JET Ministries International. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
