import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function DefaultLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
