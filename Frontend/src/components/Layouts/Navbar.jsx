import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import {
  Sun, Moon, Menu, X, ArrowRight, Home, Info, Calendar,
  Heart, Images, FileText, Phone, Mail, MapPin
} from "lucide-react"

const navItems = [
    { name: 'Home', href: '/', desc: 'Welcome & overview', icon: Home },
    { name: 'About Us', href: '/about', desc: 'Our roots, vision & leaders', icon: Info },
    { name: 'Events', href: '/events', desc: 'Upcoming services & missions', icon: Calendar },
    { name: 'Giving & Resources', href: '/giving', desc: 'Tithes, offerings & downloads', icon: Heart },
    { name: 'Our Gallery', href: '/gallery', desc: 'Moments of fellowship', icon: Images },
    { name: 'Blogs & Sermons', href: '/blog', desc: 'Pastoral messages & updates', icon: FileText },
]

export default function Navbar() {
    const { theme, setTheme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const location = useLocation()

    // Automatically close mobile menu on route navigation
    useEffect(() => {
        setIsMenuOpen(false)
    }, [location.pathname])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isMenuOpen])

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-xs">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 sm:h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex flex-shrink-0 items-center">
                        <Link to="/" className="flex items-center gap-2.5">
                            <img
                                className="h-9 sm:h-10 w-auto rounded-md shadow-xs transition-transform hover:scale-105 active:scale-95"
                                src="/jet-logo.jpeg"
                                alt="JET Ministries Logo"
                            />
                            <div className="flex flex-col text-left">
                                <span className="font-extrabold text-sm tracking-tight text-foreground leading-tight">
                                    JET Ministries
                                </span>
                                <span className="text-[10px] text-muted-foreground hidden xs:block font-medium leading-none">
                                    International
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Centered Menu Items (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                        <div className="flex items-center space-x-6 lg:space-x-8">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`text-sm font-medium transition-colors hover:text-primary ${
                                            isActive
                                                ? 'text-primary font-bold'
                                                : 'text-foreground/75'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Right side: Theme Toggle & Contact Button & Hamburger */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                const isDark = document.documentElement.classList.contains('dark')
                                setTheme(isDark ? 'light' : 'dark')
                            }}
                            aria-label="Toggle theme"
                            className="text-foreground/70 hover:text-foreground h-9 w-9 rounded-xl cursor-pointer"
                        >
                            <Sun className="h-[1.15rem] w-[1.15rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.15rem] w-[1.15rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>
                        
                        <Button size="sm" asChild className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 px-3.5 py-1.5 text-xs font-semibold rounded-xl shadow-xs">
                            <Link to="/about">Contact Us</Link>
                        </Button>

                        {/* Mobile Menu Toggle button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                                className="h-10 w-10 rounded-xl flex items-center justify-center text-foreground hover:bg-muted/60 active:scale-95 transition-all cursor-pointer"
                            >
                                {isMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer with Backdrop */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-x-0 top-14 sm:top-16 bottom-0 z-50 flex flex-col bg-background/98 backdrop-blur-2xl animate-in fade-in duration-200 overflow-y-auto">
                    <div className="px-4 py-4 space-y-1.5 flex-1">
                        <div className="px-2 py-1 mb-2">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                Main Menu
                            </p>
                        </div>

                        {navItems.map((item) => {
                            const IconComponent = item.icon
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center gap-3.5 rounded-2xl px-4 py-3.5 transition-all touch-manipulation active:scale-[0.98] ${
                                        isActive
                                            ? 'bg-primary/15 text-primary border border-primary/25 shadow-xs'
                                            : 'text-foreground hover:bg-muted/60 border border-transparent'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                        isActive ? 'bg-primary text-white' : 'bg-foreground/5 text-muted-foreground'
                                    }`}>
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-bold leading-tight ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                            {item.name}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-primary' : 'text-foreground/30'}`} />
                                </Link>
                            )
                        })}

                        {/* Quick Contact & Info Card */}
                        <div className="pt-4 pb-2">
                            <div className="p-4 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
                                <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                                    Need Prayer or Assistance?
                                </p>
                                <div className="space-y-2 text-xs">
                                    <a
                                        href="tel:0113738019"
                                        className="flex items-center gap-2.5 text-foreground/80 hover:text-primary transition-colors py-1"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Phone className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium">Call Us: 0113738019</span>
                                    </a>
                                    <a
                                        href="mailto:jet.ministriesintl@gmail.com"
                                        className="flex items-center gap-2.5 text-foreground/80 hover:text-primary transition-colors py-1"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Mail className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-medium truncate">jet.ministriesintl@gmail.com</span>
                                    </a>
                                    <div className="flex items-center gap-2.5 text-muted-foreground py-1">
                                        <div className="w-7 h-7 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
                                            <MapPin className="w-3.5 h-3.5" />
                                        </div>
                                        <span>Nairobi, Kenya</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
