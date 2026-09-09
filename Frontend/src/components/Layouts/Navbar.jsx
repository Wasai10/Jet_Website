import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Sun, Moon, Menu, X } from "lucide-react"

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

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                    {/* Logo */}
                    <div className="flex flex-shrink-0 items-center">
                        <Link to="/">
                            <img
                                className="h-10 w-auto rounded-md shadow-sm transition-transform hover:scale-105"
                                src="/jet-logo.jpeg"
                                alt="JET Logo"
                            />
                        </Link>
                    </div>

                    {/* Centered Menu Items (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                        <div className="flex items-center space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right side: Theme Toggle & Contact Button */}
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                            const isDark = document.documentElement.classList.contains('dark')
                            setTheme(isDark ? 'light' : 'dark')
                        }}
                            aria-label="Toggle theme"
                            className="text-foreground/70 hover:text-foreground"
                        >
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>
                        
                        <Button size="sm" className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 text-xs">
                            Contact Us
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden animate-in slide-in-from-top-4 duration-200">
                    <div className="space-y-1 px-4 pb-3 pt-2 bg-background border-b shadow-lg">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="block rounded-md px-3 py-2 text-base font-medium text-foreground/70 hover:bg-accent hover:text-foreground"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-4 pb-2">
                            <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                                Contact Us
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
