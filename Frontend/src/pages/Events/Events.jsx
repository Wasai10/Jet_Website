import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function Events() {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="bg-background dark:bg-[#00111F] text-foreground min-h-screen pt-24 pb-20">
            {/* Header */}
            <section className="max-w-7xl mx-auto px-6 py-12 text-center">
                <h1 className="text-4xl md:text-6xl font-black mb-4 text-foreground">Ministry Events</h1>
                <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
                    Discover how we are impacting communities and growing together through our past missions and upcoming gatherings.
                </p>
            </section>

            {/* Upcoming Events */}
            <section className="bg-foreground/5 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center space-x-3 mb-10">
                        <div className="w-2 h-8 bg-[#0096FF] rounded-full"></div>
                        <h2 className="text-3xl font-bold text-foreground">Upcoming Events</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Impact Conference */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-foreground/5 dark:bg-[#001726] border border-foreground/10 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0096FF]/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                            <div className="flex items-center space-x-2 text-[#0096FF] mb-4 text-sm font-bold uppercase tracking-widest">
                                <Calendar className="w-4 h-4" />
                                <span>August 2026</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-3 text-foreground">Impact Conference</h3>
                            <div className="flex items-center space-x-2 text-foreground/60 mb-6">
                                <MapPin className="w-4 h-4" />
                                <span>Maranatha Church, Machakos</span>
                            </div>
                            <p className="text-foreground/80 mb-8 leading-relaxed">
                                Get ready for our massive Impact Conference! A time of spiritual renewal, deep teaching, and powerful worship.
                            </p>
                            <button className="flex items-center space-x-2 bg-foreground/10 hover:bg-[#0096FF] hover:text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors text-foreground">
                                <span>Register Now</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>

                        {/* Feed a Widow */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-foreground/5 dark:bg-[#001726] border border-foreground/10 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                            <div className="flex items-center space-x-2 text-purple-500 dark:text-purple-400 mb-4 text-sm font-bold uppercase tracking-widest">
                                <Calendar className="w-4 h-4" />
                                <span>December 2026</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-3 text-foreground">Abacy's Feed the Widow</h3>
                            <div className="flex items-center space-x-2 text-foreground/60 mb-6">
                                <MapPin className="w-4 h-4" />
                                <span>Nyakach Village, Kisumu</span>
                            </div>
                            <p className="text-foreground/80 mb-8 leading-relaxed">
                                Join us this December as we return to Kisumu to spread love and provide essential food supplies to the elderly widows in Nyakach village.
                            </p>
                            <button className="flex items-center space-x-2 bg-foreground/10 hover:bg-purple-600 hover:text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors text-foreground">
                                <span>Support Initiative</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Past Events (2026) */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center space-x-3 mb-12">
                        <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                        <h2 className="text-3xl font-bold text-foreground">Past Events (2026)</h2>
                    </div>

                    <div className="space-y-20">
                        {/* Vision Summit */}
                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <span className="text-green-600 dark:text-green-400 font-bold tracking-widest uppercase text-sm mb-2 block">February 2026</span>
                                <h3 className="text-4xl font-bold mb-4 text-foreground">Vision Summit</h3>
                                <p className="text-foreground/70 mb-4 flex items-center space-x-2"><MapPin className="w-4 h-4"/> <span>Arena of Church Liberties, Kisumu</span></p>
                                <p className="text-foreground/80 leading-relaxed text-lg">
                                    Our annual Vision Summit gathered leaders and believers to cast the vision for the year. It was a powerful time of alignment and impartation.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <img src="https://image.pollinations.ai/prompt/kenyan%20church%20leaders%20summit%20meeting?width=800&height=600&nologo=true" alt="Vision Summit" className="rounded-2xl w-full h-48 object-cover" />
                                <img src="https://image.pollinations.ai/prompt/crowd%20of%20kenyan%20people%20worshipping%20in%20church?width=800&height=600&nologo=true" alt="Vision Summit Crowd" className="rounded-2xl w-full h-48 object-cover translate-y-6" />
                            </div>
                        </div>

                        {/* Kwetu Home of Peace */}
                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            <div className="order-2 lg:order-1">
                                <img src="https://image.pollinations.ai/prompt/group%20of%20kenyan%20nuns%20with%20african%20boys%20in%20a%20childrens%20home?width=800&height=800&nologo=true" alt="Kwetu Home of Peace" className="rounded-3xl w-full h-[400px] object-cover shadow-2xl border border-foreground/10" />
                            </div>
                            <div className="order-1 lg:order-2">
                                <h3 className="text-4xl font-bold mb-4 text-foreground">Kwetu Home of Peace Mission</h3>
                                <p className="text-foreground/80 leading-relaxed text-lg">
                                    We visited the Kwetu home of peace, sharing the love of Christ with the beautiful boys there alongside the dedicated African nuns who care for them. It was a day filled with joy, laughter, and powerful prayers.
                                </p>
                            </div>
                        </div>

                        {/* Ossen Girls Mission */}
                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <h3 className="text-4xl font-bold mb-4 text-foreground">Ossen Girls Mission</h3>
                                <p className="text-foreground/80 leading-relaxed text-lg">
                                    An impactful day at the secondary school! Our team spent hours preaching, singing, and praying with the students, inspiring the next generation of young women to live boldly for Christ.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <img src="https://image.pollinations.ai/prompt/kenyan%20secondary%20school%20girls%20praying%20and%20singing?width=800&height=600&nologo=true" alt="Ossen Girls" className="rounded-2xl w-full h-56 object-cover" />
                                <img src="https://image.pollinations.ai/prompt/pastor%20preaching%20to%20african%20school%20girls?width=800&height=600&nologo=true" alt="Preaching to youth" className="rounded-2xl w-full h-56 object-cover translate-y-6" />
                            </div>
                        </div>

                        {/* Nyakach Fundraising */}
                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
                                <img src="https://image.pollinations.ai/prompt/old%20african%20widows%20and%20school%20children%20singing%20in%20a%20village%20fundraiser%20kenya?width=1200&height=600&nologo=true" alt="Fundraising Nyakach" className="rounded-2xl w-full h-64 object-cover col-span-2" />
                            </div>
                            <div className="order-1 lg:order-2">
                                <h3 className="text-4xl font-bold mb-4 text-foreground">Fundraising in Nyakach</h3>
                                <p className="text-foreground/80 leading-relaxed text-lg">
                                    The community came together in a massive way. Old widows, school children, and the entire community sang and celebrated around an influential guest as we raised funds for local development projects.
                                </p>
                            </div>
                        </div>

                        {/* Impact Conference (Past) */}
                        <div className="bg-foreground/5 dark:bg-[#001726] border border-foreground/10 rounded-3xl p-8 md:p-12">
                            <h3 className="text-3xl font-bold mb-6 text-center text-foreground">Impact Conference Memories</h3>
                            <p className="text-foreground/70 text-center max-w-2xl mx-auto mb-10 text-lg">
                                Beyond the preaching, the Impact Conference was a time of serious fun! Team building, games, and pure joy.
                            </p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <img src="https://image.pollinations.ai/prompt/kenyan%20people%20playing%20games%20at%20a%20church%20youth%20conference?width=600&height=400&nologo=true" alt="Playing" className="w-full h-48 object-cover rounded-2xl" />
                                <img src="https://image.pollinations.ai/prompt/kenyan%20church%20youth%20team%20building%20games?width=600&height=400&nologo=true" alt="Team Building" className="w-full h-48 object-cover rounded-2xl" />
                                <img src="https://image.pollinations.ai/prompt/group%20of%20kenyan%20youths%20having%20fun%20together?width=600&height=400&nologo=true" alt="Fun together" className="w-full h-48 object-cover rounded-2xl" />
                            </div>
                        </div>

                        {/* Abacy's Feed the Widow */}
                        <div className="grid lg:grid-cols-2 gap-10 items-center bg-foreground/5 p-8 md:p-12 rounded-3xl">
                            <div>
                                <h3 className="text-4xl font-bold mb-4 text-foreground">Abacy's Feed the Widow Initiative</h3>
                                <p className="text-foreground/80 leading-relaxed text-lg mb-6">
                                    A hallmark of our outreach. Last year, our founder led the charge in distributing bags of food to the elderly widows, ensuring they felt the tangible love and provision of God.
                                </p>
                                <div className="flex items-center space-x-4">
                                    <img src="https://image.pollinations.ai/prompt/portrait%20of%20a%20distinguished%20kenyan%20pastor%20preaching?width=400&height=400&nologo=true" alt="Founder" className="w-16 h-16 rounded-full object-cover border-2 border-purple-500" />
                                    <div>
                                        <p className="font-bold text-foreground">Our Founder</p>
                                        <p className="text-sm text-foreground/50">Leading the Initiative</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <img src="https://image.pollinations.ai/prompt/kenyan%20widows%20receiving%20bags%20of%20food?width=800&height=800&nologo=true" alt="Widows receiving food" className="rounded-3xl w-full h-[350px] object-cover shadow-2xl" />
                            </div>
                        </div>

                        {/* Home Fellowships */}
                        <div>
                            <div className="text-center mb-12">
                                <h3 className="text-4xl font-bold mb-4 text-foreground">Home Fellowships</h3>
                                <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
                                    True connection happens in smaller circles. We held powerful home fellowships across three different venues recently.
                                </p>
                            </div>

                            <div className="space-y-12">
                                {/* Venue 1 */}
                                <div>
                                    <h4 className="text-xl font-bold text-[#0096FF] mb-4">Venue 1: The Oasis</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <img src="https://image.pollinations.ai/prompt/small%20group%20of%20kenyan%20people%20fellowshipping%20in%20a%20living%20room?width=600&height=400&nologo=true" alt="Fellowship 1" className="w-full h-48 md:h-64 object-cover rounded-2xl" />
                                        <img src="https://image.pollinations.ai/prompt/small%20group%20of%20kenyan%20people%20fellowshipping%20in%20a%20living%20room?width=600&height=400&nologo=true" alt="Fellowship 2" className="w-full h-48 md:h-64 object-cover rounded-2xl" />
                                    </div>
                                </div>
                                {/* Venue 2 */}
                                <div>
                                    <h4 className="text-xl font-bold text-[#0096FF] mb-4">Venue 2: Grace House</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <img src="https://image.pollinations.ai/prompt/kenyan%20family%20praying%20together%20in%20a%20house?width=600&height=400&nologo=true" alt="Fellowship 3" className="w-full h-48 md:h-64 object-cover rounded-2xl" />
                                        <img src="https://image.pollinations.ai/prompt/kenyan%20family%20praying%20together%20in%20a%20house?width=600&height=400&nologo=true" alt="Fellowship 4" className="w-full h-48 md:h-64 object-cover rounded-2xl" />
                                    </div>
                                </div>
                                {/* Venue 3 */}
                                <div>
                                    <h4 className="text-xl font-bold text-[#0096FF] mb-4">Venue 3: Peace Haven</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <img src="https://image.pollinations.ai/prompt/small%20group%20of%20african%20people%20studying%20the%20bible%20at%20home?width=600&height=400&nologo=true" alt="Fellowship 5" className="w-full h-48 md:h-64 object-cover rounded-2xl" />
                                        <img src="https://image.pollinations.ai/prompt/small%20group%20of%20african%20people%20studying%20the%20bible%20at%20home?width=600&height=400&nologo=true" alt="Fellowship 6" className="w-full h-48 md:h-64 object-cover rounded-2xl" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
