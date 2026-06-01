import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, BookOpen, ArrowRight } from 'lucide-react';

export default function Blog() {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const blogPosts = [
        {
            id: 1,
            title: 'The Power of Persistent Prayer in Modern Times',
            excerpt: 'In a fast-paced world, finding time to pray can be challenging. Discover how to build a consistent prayer life that changes everything.',
            category: 'Devotional',
            date: 'May 15, 2026',
            author: 'Pastor John',
            image: 'https://image.pollinations.ai/prompt/kenyan%20woman%20praying%20deeply%20in%20church?width=600&height=400&nologo=true',
        },
        {
            id: 2,
            title: 'Highlights from the Annual Youth Camp 2026',
            excerpt: 'What an incredible weekend of worship, fellowship, and transformation! Read all about the life-changing moments at our recent youth camp.',
            category: 'Church News',
            date: 'May 10, 2026',
            author: 'Sarah Jenkins',
            image: 'https://image.pollinations.ai/prompt/kenyan%20youth%20camp%20worship%20group?width=600&height=400&nologo=true',
        },
        {
            id: 3,
            title: 'Understanding the True Meaning of Grace',
            excerpt: 'Grace is a word we use often, but do we truly understand its depth? Join us as we explore the unmerited favor of God in our daily lives.',
            category: 'Theology',
            date: 'May 02, 2026',
            author: 'Rev. Mark',
            image: 'https://image.pollinations.ai/prompt/kenyan%20pastor%20preaching%20grace%20at%20pulpit?width=600&height=400&nologo=true',
        },
        {
            id: 4,
            title: 'Faith in the Workplace: A Believer\'s Guide',
            excerpt: 'How do you maintain your Christian witness in a secular work environment? Practical tips for shining the light of Christ from 9 to 5.',
            category: 'Lifestyle',
            date: 'April 28, 2026',
            author: 'Grace Ochieng',
            image: 'https://image.pollinations.ai/prompt/kenyan%20christian%20woman%20working%20in%20office?width=600&height=400&nologo=true',
        },
        {
            id: 5,
            title: 'The Importance of Christian Community',
            excerpt: 'We were not meant to walk this journey alone. Exploring the biblical mandate for fellowship and why being part of a local church matters.',
            category: 'Devotional',
            date: 'April 15, 2026',
            author: 'David Kariuki',
            image: 'https://image.pollinations.ai/prompt/group%20of%20kenyan%20christian%20friends%20fellowshipping?width=600&height=400&nologo=true',
        }
    ];

    return (
        <div className="bg-[#00111F] text-white min-h-screen pt-24 pb-20">
            {/* Header */}
            <section className="max-w-7xl mx-auto px-6 py-12 text-center">
                <span className="flex items-center justify-center space-x-2 text-[#87CEEB] text-xs font-semibold uppercase tracking-widest mb-3">
                    <BookOpen className="w-4 h-4" />
                    <span>Words of Life</span>
                </span>
                <h1 className="text-4xl md:text-6xl font-black mb-4 text-white">JET Blog & Devotionals</h1>
                <p className="text-white/60 max-w-2xl mx-auto text-lg font-light">
                    Explore our latest articles, pastoral messages, and updates from the community. Stay inspired and connected throughout the week.
                </p>
            </section>

            {/* Blog Grid */}
            <section className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial="hidden" whileInView="visible" viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } }
                            }}
                            className="bg-[#001726] border border-white/5 rounded-3xl overflow-hidden group hover:border-[#0096FF]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,150,255,0.1)] flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#001726] via-transparent to-transparent opacity-90" />
                                <div className="absolute top-4 right-4 bg-[#0096FF] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                    {post.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow relative z-10">
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

                                <h3 className="text-2xl font-bold text-white leading-tight mb-4 group-hover:text-[#87CEEB] transition-colors duration-300">
                                    {post.title}
                                </h3>

                                <p className="text-white/60 leading-relaxed font-light mb-8 flex-grow">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-6 border-t border-white/10">
                                    <a href="#" className="inline-flex items-center space-x-2 text-sm font-semibold text-white hover:text-[#0096FF] transition-colors duration-300 group/link">
                                        <span>Read Full Article</span>
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                                    </a>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        </div>
    );
}
