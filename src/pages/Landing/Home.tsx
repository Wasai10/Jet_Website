import React from 'react'
import Navbar from "@/components/Layouts/Navbar"
import Hero from "@/components/Sections/Hero"

export default function Home() {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <Navbar />
            <main>
                <Hero />
            </main>
        </div>
    )
}
