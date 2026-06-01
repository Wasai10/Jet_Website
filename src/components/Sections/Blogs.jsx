import React from 'react'
import { ArrowRight, Calendar, User, BookOpen } from 'lucide-react'

const blogPosts = [
    {
        id: 1,
        title: 'The Power of Persistent Prayer in Modern Times',
        excerpt: 'In a fast-paced world, finding time to pray can be challenging. Discover how to build a consistent prayer life that changes everything.',
        category: 'Devotional',
        date: 'May 15, 2025',
        author: 'Pastor John',
        image: 'https://media.istockphoto.com/id/1333641112/photo/bible-study-multi-ethnic-group-multi-ethnic-group-of-friends-meet-for-a-bible-study-group.jpg?b=1&s=612x612&w=0&k=20&c=ZmwA6uaqXPpl_0D2pmMFtd5DfElmNXOsfTUCCrminWI=',
    },
    {
        id: 2,
        title: 'Highlights from the Annual Youth Camp 2025',
        excerpt: 'What an incredible weekend of worship, fellowship, and transformation! Read all about the life-changing moments at our recent youth camp.',
        category: 'Church News',
        date: 'May 10, 2025',
        author: 'Sarah Jenkins',
        image: 'https://res.cloudinary.com/dxeuvtxys/image/upload/q_auto/f_auto/v1779201944/Jet_team_cprlcf.jpg',
    },
    {
        id: 3,
        title: 'Understanding the True Meaning of Grace',
        excerpt: 'Grace is a word we use often, but do we truly understand its depth? Join us as we explore the unmerited favor of God in our daily lives.',
        category: 'Theology',
        date: 'May 02, 2025',
        author: 'Rev. Mark',
        image: 'https://images.pexels.com/photos/2774576/pexels-photo-2774576.jpeg',
    }
]

export default function Blogs() {
    return (
        <section
            id="blogs"
            className="relative w-full py-20 md:py-28 bg-[#00111F] text-white overflow-hidden"
        >
            {/* Background glow blobs */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(0,150,255,0.04),transparent_60%)] pointer-events-none -translate-x-1/2" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(135,206,235,0.03),transparent_60%)] pointer-events-none translate-x-1/2" />

            <div className="relative max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="text-center mb-16 md:mb-20">
                    <span className="flex items-center justify-center space-x-2 text-[#87CEEB] text-xs font-semibold uppercase tracking-widest mb-3">
                        <BookOpen className="w-4 h-4" />
                        <span>Words of Life</span>
                    </span>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
                        Latest Blogs & Devotionals
                    </h2>

                    <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base font-light">
                        Explore our latest articles, pastoral messages, and updates from the community.
                        Stay inspired and connected throughout the week.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden group hover:border-[#0096FF]/30 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,150,255,0.1)] flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#00111F] to-transparent opacity-80" />

                                {/* Category Badge */}
                                <div className="absolute top-4 right-4 bg-[#0096FF] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                    {post.category}
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10 -mt-6">
                                {/* Meta Info */}
                                <div className="flex items-center space-x-4 text-xs text-[#87CEEB] font-medium mb-4">
                                    <div className="flex items-center space-x-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{post.date}</span>
                                    </div>

                                    <div className="flex items-center space-x-1.5">
                                        <User className="w-3.5 h-3.5" />
                                        <span>{post.author}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white leading-tight mb-3 group-hover:text-[#87CEEB] transition-colors duration-300 line-clamp-2">
                                    {post.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-sm text-white/60 leading-relaxed font-light mb-6 flex-grow line-clamp-3">
                                    {post.excerpt}
                                </p>

                                {/* Read More */}
                                <div className="mt-auto pt-4 border-t border-white/5">
                                    <a
                                        href="#"
                                        className="inline-flex items-center space-x-2 text-sm font-semibold text-white hover:text-[#0096FF] transition-colors duration-300 group/link"
                                    >
                                        <span>Read Article</span>
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>



            </div>
        </section>
    )
}