import { motion } from 'framer-motion'
import Hero from "@/components/Sections/Hero"
import About from "@/components/Sections/About"
import Events from "@/components/Sections/Events"
import Gallery from "@/components/Sections/Gallery"
import Blogs from "@/components/Sections/Blogs"
import LiveStream from "@/components/Sections/LiveStream"

export default function Home() {
    return (
        <motion.div className="min-h-screen bg-background font-sans antialiased">
            <main>
                <Hero />
                <About />
                <Events />
                <Gallery />
                <LiveStream />
                <Blogs />
            </main>
        </motion.div>
    )
}
