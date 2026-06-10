import React from 'react';
import { motion } from 'framer-motion';
import { Play, Users, MapPin, Heart, Music } from 'lucide-react';

export default function About() {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const leaders = [
        { name: "John Doe", role: "Worship Leader", image: "https://image.pollinations.ai/prompt/portrait%20of%20a%20kenyan%20man%20worship%20leader%20smiling?width=400&height=400&nologo=true" },
        { name: "Sarah Smith", role: "Youth Pastor", image: "https://image.pollinations.ai/prompt/portrait%20of%20a%20young%20kenyan%20woman%20youth%20pastor?width=400&height=400&nologo=true" },
        { name: "Michael Johnson", role: "Men's Ministry", image: "https://image.pollinations.ai/prompt/portrait%20of%20a%20kenyan%20man%20mens%20ministry%20leader?width=400&height=400&nologo=true" },
        { name: "Grace Ochieng", role: "Women's Ministry", image: "https://image.pollinations.ai/prompt/portrait%20of%20an%20older%20kenyan%20woman%20ministry%20leader?width=400&height=400&nologo=true" },
        { name: "David Kariuki", role: "Children's Ministry", image: "https://image.pollinations.ai/prompt/portrait%20of%20a%20kenyan%20man%20childrens%20ministry?width=400&height=400&nologo=true" },
        { name: "Ruth Wanjiru", role: "Prayer Department", image: "https://image.pollinations.ai/prompt/portrait%20of%20a%20kenyan%20woman%20praying?width=400&height=400&nologo=true" },
        { name: "Peter Kamau", role: "Ushering & Protocol", image: "https://image.pollinations.ai/prompt/portrait%20of%20a%20kenyan%20man%20usher%20in%20church?width=400&height=400&nologo=true" },
        { name: "Joy Mutuku", role: "Media & Tech", image: "https://image.pollinations.ai/prompt/portrait%20of%20a%20kenyan%20woman%20media%20tech?width=400&height=400&nologo=true" },
        { name: "Simon Njoroge", role: "Outreach & Missions", image: "https://image.pollinations.ai/prompt/portrait%20of%20a%20kenyan%20man%20pastor%20smiling?width=400&height=400&nologo=true" },
        { name: "Esther Auma", role: "Hospitality", image: "https://image.pollinations.ai/prompt/portrait%20of%20a%20kenyan%20woman%20hospitality?width=400&height=400&nologo=true" },
    ];

    const ministries = [
        { name: "Youth Impact", desc: "Empowering the next generation.", leader: "Sarah Smith", leaderImg: "https://image.pollinations.ai/prompt/portrait%20of%20a%20young%20kenyan%20woman%20youth%20pastor?width=400&height=400&nologo=true", bg: "https://image.pollinations.ai/prompt/group%20of%20kenyan%20youths%20in%20church?width=800&height=800&nologo=true" },
        { name: "Women of Grace", desc: "Building strong women of faith.", leader: "Grace Ochieng", leaderImg: "https://image.pollinations.ai/prompt/portrait%20of%20an%20older%20kenyan%20woman%20ministry%20leader?width=400&height=400&nologo=true", bg: "https://image.pollinations.ai/prompt/group%20of%20kenyan%20women%20fellowshipping?width=800&height=800&nologo=true" },
        { name: "Men of Valor", desc: "Equipping men to lead.", leader: "Michael Johnson", leaderImg: "https://image.pollinations.ai/prompt/portrait%20of%20a%20kenyan%20man%20mens%20ministry%20leader?width=400&height=400&nologo=true", bg: "https://image.pollinations.ai/prompt/group%20of%20kenyan%20men%20praying%20together?width=800&height=800&nologo=true" },
        { name: "Kids Kingdom", desc: "Laying a foundation of faith.", leader: "David Kariuki", leaderImg: "https://image.pollinations.ai/prompt/portrait%20of%20a%20kenyan%20man%20childrens%20ministry?width=400&height=400&nologo=true", bg: "https://image.pollinations.ai/prompt/group%20of%20kenyan%20children%20in%20sunday%20school?width=800&height=800&nologo=true" },
        { name: "Outreach Missions", desc: "Taking the gospel to the world.", leader: "Simon Njoroge", leaderImg: "https://image.pollinations.ai/prompt/portrait%20of%20a%20kenyan%20man%20pastor%20smiling?width=400&height=400&nologo=true", bg: "https://image.pollinations.ai/prompt/kenyan%20church%20mission%20outreach%20in%20village?width=800&height=800&nologo=true" },
        { name: "Prayer Warriors", desc: "Standing in the gap.", leader: "Ruth Wanjiru", leaderImg: "https://image.pollinations.ai/prompt/portrait%20of%20a%20kenyan%20woman%20praying?width=400&height=400&nologo=true", bg: "https://image.pollinations.ai/prompt/group%20of%20kenyan%20people%20praying%20passionately?width=800&height=800&nologo=true" },
    ];

    return (
        <div className="bg-[#00111F] text-white min-h-screen pt-24 pb-20">
            {/* 1. Origin & History */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex justify-center">
                        {/* Placeholder Logo / Shield */}
                        <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-[#0096FF] to-[#001726] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,150,255,0.3)]">
                            <h2 className="text-5xl font-black text-white tracking-tighter">JET</h2>
                        </div>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-6">
                        <h2 className="text-sm text-[#0096FF] font-bold uppercase tracking-widest">Our Roots</h2>
                        <h1 className="text-4xl md:text-5xl font-bold">The Origin & History</h1>
                        <p className="text-white/70 leading-relaxed text-lg">
                            JET Ministries International began with a profound calling to transform lives and build a community anchored in the love of Christ. What started as a small fellowship in a living room has grown into a vibrant, multi-city ministry. 
                        </p>
                        <p className="text-white/70 leading-relaxed text-lg">
                            Over the years, we have seen God move mightily—planting churches, establishing impactful community outreach programs, and raising a generation of believers who are unashamed of the Gospel. Our history is a testament to unwavering faith and God's boundless grace.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. The Founder */}
            <section className="bg-white/5 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 space-y-6">
                            <h2 className="text-sm text-[#0096FF] font-bold uppercase tracking-widest">Leadership</h2>
                            <h3 className="text-4xl font-bold">Meet Our Founder</h3>
                            <p className="text-white/70 leading-relaxed text-lg">
                                Driven by a divine mandate, our founder has dedicated their life to spreading the Gospel and uplifting communities. With a heart for the marginalized and a vision for spiritual revival, they have shepherded JET Ministries from its inception to its current global footprint.
                            </p>
                            <p className="text-white/70 leading-relaxed text-lg">
                                Their leadership is characterized by humility, profound biblical insight, and a relentless passion for empowering the next generation of leaders.
                            </p>
                        </div>
                        <div className="order-1 md:order-2">
                            <img 
                                src="https://image.pollinations.ai/prompt/portrait%20of%20a%20distinguished%20kenyan%20pastor%20preaching?width=800&height=1000&nologo=true" 
                                alt="Founder" 
                                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl border border-white/10"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. Mission & Vision */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-[#0096FF]/20 to-transparent p-10 rounded-3xl border border-[#0096FF]/30 backdrop-blur-sm">
                        <Heart className="w-12 h-12 text-[#0096FF] mb-6" />
                        <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                        <p className="text-white/80 text-lg leading-relaxed">
                            To share the message of Christ through word and action, equipping believers to grow spiritually and reach the world with His love.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-transparent p-10 rounded-3xl border border-purple-500/30 backdrop-blur-sm">
                        <Users className="w-12 h-12 text-purple-400 mb-6" />
                        <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
                        <p className="text-white/80 text-lg leading-relaxed">
                            To be a lighthouse of hope, raising a generation of believers who are deeply rooted in Christ, walking in faith, and active in service.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* 4. What We Believe */}
            <section className="bg-[#001726] py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Believe</h2>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            Our doctrine is centered on the authority of Scripture, the triune nature of God, the person of Jesus Christ, salvation by grace, and the purpose of the Church.
                        </p>
                    </div>

                    <div className="space-y-10 text-white">
                        <div>
                            <h3 className="text-2xl font-semibold mb-3">The Bible</h3>
                            <p className="text-white/70 leading-relaxed">
                                We believe the Bible is the inspired and authoritative Word of God, without error in its original manuscripts, and is the final authority for faith and practice.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-3">God</h3>
                            <p className="text-white/70 leading-relaxed">
                                We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit, equal in power and glory.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-3">Jesus Christ</h3>
                            <p className="text-white/70 leading-relaxed">
                                We believe in the deity of Jesus Christ, His virgin birth, His sinless life, His miracles, His substitutionary death, His bodily resurrection, His ascension to heaven, and His personal return in power and glory.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-3">Salvation</h3>
                            <p className="text-white/70 leading-relaxed">
                                We believe that salvation is a gift of God's grace, received through faith in Jesus Christ alone, and not by works. It includes forgiveness of sins, eternal life, and transformation by the Holy Spirit.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-3">The Church</h3>
                            <p className="text-white/70 leading-relaxed">
                                We believe the Church is the body of Christ, composed of all believers, called to worship God, edify one another, and proclaim the Gospel to the world.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Department Leaders */}
            <section className="bg-[#001726] py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Department Leaders</h2>
                        <p className="text-white/60">Meet the dedicated individuals guiding our ministries.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {leaders.map((leader, index) => (
                            <motion.div 
                                key={index}
                                initial="hidden" whileInView="visible" viewport={{ once: true }} 
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9 },
                                    visible: { opacity: 1, scale: 1, transition: { delay: index * 0.05 } }
                                }}
                                className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
                            >
                                <img src={leader.image} alt={leader.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                                    <h4 className="font-bold text-lg">{leader.name}</h4>
                                    <p className="text-[#0096FF] text-sm font-medium">{leader.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Locations (Nairobi & Kisumu) */}
            <section className="py-20">
                <div className="space-y-16">
                    {/* Nairobi */}
                    <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                        <img src="https://image.pollinations.ai/prompt/large%20crowd%20of%20kenyan%20people%20worshipping%20in%20nairobi%20church?width=1200&height=800&nologo=true" alt="Nairobi Members" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-[#00111F]/50 mix-blend-multiply" />
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 text-center px-6">
                            <MapPin className="w-16 h-16 text-[#0096FF] mx-auto mb-6" />
                            <h2 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-4">Nairobi Family</h2>
                            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light">A vibrant community of believers stationed in the heart of the capital, spreading light and love.</p>
                        </motion.div>
                    </div>

                    {/* Kisumu */}
                    <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                        <img src="https://image.pollinations.ai/prompt/large%20crowd%20of%20kenyan%20people%20fellowshipping%20in%20kisumu?width=1200&height=800&nologo=true" alt="Kisumu Members" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-[#00111F]/50 mix-blend-multiply" />
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 text-center px-6">
                            <MapPin className="w-16 h-16 text-[#0096FF] mx-auto mb-6" />
                            <h2 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-4">Kisumu Family</h2>
                            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light">Anchored by the lakeside, this powerful congregation is deeply rooted in service and fellowship.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 6. Ministries & Leaders */}
            <section className="bg-white/5 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Ministries</h2>
                        <p className="text-white/60">Find your place to serve, grow, and connect.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ministries.map((min, index) => (
                            <motion.div 
                                key={index}
                                initial="hidden" whileInView="visible" viewport={{ once: true }}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } }
                                }}
                                className="relative rounded-2xl overflow-hidden h-80 group cursor-pointer"
                            >
                                <img src={min.bg} alt={min.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#00111F] via-[#00111F]/70 to-transparent" />
                                
                                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{min.name}</h3>
                                        <p className="text-sm text-white/70">{min.desc}</p>
                                    </div>
                                    {/* Small Leader Card Insert */}
                                    <div className="flex flex-col items-center ml-4 shrink-0">
                                        <img src={min.leaderImg} alt={min.leader} className="w-14 h-14 rounded-full border-2 border-[#0096FF] object-cover mb-2 shadow-lg" />
                                        <span className="text-[10px] uppercase font-bold text-[#0096FF] text-center w-max">Led by<br/>{min.leader.split(' ')[0]}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. JET Band */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="relative rounded-[3rem] overflow-hidden bg-[#001726] border border-[#0096FF]/20 shadow-[0_0_50px_rgba(0,150,255,0.1)]">
                    <div className="absolute top-0 right-0 w-full h-full">
                        <img src="https://image.pollinations.ai/prompt/kenyan%20church%20worship%20band%20singing?width=1200&height=800&nologo=true" alt="JET Band" className="w-full h-full object-cover opacity-20 mix-blend-luminosity" />
                    </div>
                    
                    <div className="relative z-10 p-10 md:p-20 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center space-x-2 bg-[#0096FF]/20 text-[#0096FF] px-4 py-2 rounded-full mb-6">
                                <Music className="w-4 h-4" />
                                <span className="text-sm font-bold tracking-widest uppercase">Worship Arts</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">The JET Band</h2>
                            <p className="text-white/70 text-lg mb-8 leading-relaxed">
                                Experience the powerful, spirit-led worship of the JET Band. Through anointed music and passionate praise, they lead our congregation into the presence of God every week. 
                            </p>
                            <a 
                                href="https://youtube.com" 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:-translate-y-1"
                            >
                                <Play className="w-5 h-5 fill-current" />
                                <span>Watch on YouTube</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
