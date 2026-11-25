import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Sun, Moon, Menu, X, ArrowRight } from "lucide-react"

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Giving & Resources', href: '/giving' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blogs', href: '/blog' },
]

export default function Navbar() {
    const { theme, setTheme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const location = useLocation()

    // Automatically close mobile menu on route navigation
    useEffect(() => {
        setIsMenuOpen(false)
    }, [location.pathname])

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
                                alt="JET Logo"
                            />
                            <span className="font-bold text-sm tracking-tight hidden xs:inline sm:hidden lg:inline text-foreground">
                                JET Ministries
                            </span>
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
                                                : 'text-foreground/70'
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

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                                className="h-10 w-10 rounded-xl text-foreground cursor-pointer active:scale-95"
                            >
                                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu with Backdrop & Active highlights */}
            {isMenuOpen && (
                <div className="md:hidden border-b border-border bg-background/98 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 shadow-xl">
                    <div className="px-4 pt-2 pb-5 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all touch-manipulation ${
                                        isActive
                                            ? 'bg-primary/15 text-primary font-bold shadow-xs'
                                            : 'text-foreground/80 hover:bg-muted/60 hover:text-foreground'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span>{item.name}</span>
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </Link>
                            )
                        })}

                        <div className="pt-3">
                            <Button asChild size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold py-2.5 rounded-xl shadow-xs">
                                <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                                    <span>Contact Us</span>
                                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
