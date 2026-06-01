import React from 'react'
import { motion } from 'framer-motion'
import Hero from "@/components/Sections/Hero"
import About from "@/components/Sections/About"
import Events from "@/components/Sections/Events"
import Gallery from "@/components/Sections/Gallery"
import Blogs from "@/components/Sections/Blogs"

export default function Home() {
    return (
        <motion.div className="min-h-screen bg-background font-sans antialiased">
            <main>
                <Hero />
                <About />
                <Events />
                <Gallery />
                <Blogs />
            </main>
        </motion.div>
    )
}
