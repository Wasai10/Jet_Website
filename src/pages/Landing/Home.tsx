import React from 'react'
import Navbar from "@/components/Layouts/Navbar"
import Hero from "@/components/Sections/Hero"
import About from "@/components/Sections/About"
import Footer from "@/components/Layouts/Footer"

export default function Home() {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <Navbar />
            <main>
                <Hero />
                <About />
            </main>
            <Footer />
        </div>
    )
}
