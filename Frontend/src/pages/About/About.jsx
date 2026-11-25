import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, UserX, Layers, Zap, Trophy } from 'lucide-react';
import { leadershipService } from '@/api/leadership.service';
import { departmentService } from '@/api/department.service';

export default function About() {
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const [leaders, setLeaders] = useState([]);
    const [ministries, setMinistries] = useState([]);

    useEffect(() => {
        leadershipService.getAll().then(setLeaders).catch(() => {});
        departmentService.getAll().then(setMinistries).catch(() => {});
    }, []);

    return (
        <div className="bg-background text-foreground min-h-screen pb-20 overflow-x-hidden">

            {/* 1. Hero */}
            <section className="relative min-h-[55vh] md:min-h-[85vh] py-16 md:py-24 flex items-center justify-center overflow-hidden">
                <img
                    src="https://res.cloudinary.com/dxeuvtxys/image/upload/v1790668559/Background_photo_nzwy4a.jpg"
                    alt="JET Ministries — our roots"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-10 md:pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="mx-auto max-w-4xl space-y-4 text-center"
                    >
                        <div className="flex items-center gap-2 sm:gap-3 justify-center">
                            <span className="w-5 sm:w-7 h-[2px] bg-primary rounded-full shrink-0" />
                            <span className="text-primary text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.2em]">Our Roots &amp; Origin</span>
                            <span className="w-5 sm:w-7 h-[2px] bg-primary rounded-full shrink-0" />
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                            Where It All Began
                        </h1>

                        <div className="w-12 sm:w-14 h-1 bg-primary rounded-full mx-auto" />

                        <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                            JET stands for Jesus Evangelistic Train, hence we have JET Ministries International. It began when its founder was still a student, following a call to start a ministry. It initially began as a healing ministry with only three members. Over time, more people joined, and the ministry continued to grow. Today, the vision is to see people grow spiritually and become a positive influence in society, with a strong desire for the members to also make a meaningful economic impact.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. The Founder */}
            <section className="py-12 sm:py-20 mt-4 sm:mt-8 bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="relative bg-[#2563EB] rounded-2xl sm:rounded-3xl overflow-visible min-h-[260px]"
                    >
                        {/* Mobile Founder Image Avatar */}
                        <div className="flex md:hidden justify-center pt-6 px-6">
                            <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl bg-slate-900/30">
                                <img
                                    src="https://res.cloudinary.com/dxeuvtxys/image/upload/e_background_removal/f_png/v1791274966/Mr_Abacy_an0dpz.jpg"
                                    alt="Mr Abacy Young - Founder"
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="relative z-10 p-6 sm:p-10 md:p-14 md:max-w-[58%] space-y-3 sm:space-y-4 text-center md:text-left">
                            <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em]">Leadership</p>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                                Meet Our Founder
                            </h3>
                            <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                                Mr Abacy Young is the founder and visionary leader of JET Ministries International.
                            </p>
                            <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                                His leadership is characterized by humility, profound biblical insight, and
                                a relentless passion for empowering the next generation of leaders to win.
                            </p>
                        </div>

                        {/* Founder image — desktop anchored bottom-right */}
                        <div className="absolute right-10 bottom-0 h-[115%] pointer-events-none hidden md:block">
                            <img
                                src="https://res.cloudinary.com/dxeuvtxys/image/upload/e_background_removal/f_png/v1791274966/Mr_Abacy_an0dpz.jpg"
                                alt="Founder"
                                className="h-full w-auto object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.35)]"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. Mission & Vision */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    <div className="bg-gradient-to-br from-primary/20 to-transparent p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-primary/30 backdrop-blur-sm">
                        <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
                        <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">Our Mission</h3>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            To prepare God's people for the works of service that the body of Christ may be built. (Ephesians 4:12)
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-transparent p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-purple-500/30 backdrop-blur-sm">
                        <Users className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 dark:text-purple-400 mb-4" />
                        <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">Our Vision</h3>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            To develop a generation to impact the whole world for Jesus Christ turning them to be fully committed followers of Him.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/20 to-transparent p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-primary/30 backdrop-blur-sm">
                        <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4" />
                        <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">Our Driving Force</h3>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            Impacting Generations
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-transparent p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-purple-500/30 backdrop-blur-sm">
                        <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 dark:text-purple-400 mb-4" />
                        <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">Our Mantra</h3>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            Helping the Next Generation Win
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* 4. What We Believe */}
            <section className="bg-muted/40 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">What We Believe</h2>
                        <p className="text-muted-foreground max-w-3xl mx-auto">
                            We believe in the authority of Scripture, the transforming power of the Gospel, and the call to build people into fully committed followers of Christ.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[
                            {
                                title: "In the Beginning God",
                                body: "We believe God is the origin of all things, the source of life, and the architect of purpose. Before any movement, any vision, or any generation, there was God — sovereign, creative, and active. We build our lives and our ministry on that truth.",
                                className: "bg-gradient-to-br from-blue-600/15 via-blue-500/10 to-cyan-500/10 border-blue-500/30"
                            },
                            {
                                title: "The Word Is Life",
                                body: "We believe the Word of God is alive, authoritative, and transformative. It is the standard that shapes character, governs destiny, and releases wisdom for personal growth, leadership, family restoration, and national revival.",
                                className: "bg-gradient-to-br from-indigo-600/15 via-violet-500/10 to-purple-500/10 border-violet-500/30"
                            },
                            {
                                title: "God with Us",
                                body: "We believe God is not distant. He is present, personal, and deeply involved in the lives of His people. Where God is at work, there is hope, healing, direction, and the power to rise above limitation into divine assignment.",
                                className: "bg-gradient-to-br from-cyan-600/15 via-sky-500/10 to-blue-500/10 border-sky-500/30"
                            },
                            {
                                title: "Growth That Produces Greatness",
                                body: "We believe in growth that is intentional, disciplined, and visible. We are not content with spiritual inactivity. We pursue growth in wisdom, character, influence, and capacity so people can become meaningful contributors to the kingdom and society.",
                                className: "bg-gradient-to-br from-primary/20 via-blue-600/10 to-indigo-500/10 border-primary/30"
                            },
                            {
                                title: "Unity That Builds Nations",
                                body: "We believe unity is not weakness; it is power. When believers, leaders, and communities align around purpose, they become a force for restoration, influence, and transformation. We are committed to strong relationships, shared vision, and collective impact.",
                                className: "bg-gradient-to-br from-violet-600/15 via-purple-500/10 to-fuchsia-500/10 border-purple-500/30"
                            },
                            {
                                title: "Kingdom Economics & Transformation",
                                body: "We believe the Gospel must move beyond spiritual expression into practical transformation. We are committed to raising people who are not only spiritually strong but also economically empowered, responsible, and impactful — creating a generation that can build, sustain, and bless communities with wisdom and excellence.",
                                className: "bg-gradient-to-br from-sky-600/15 via-blue-500/10 to-indigo-500/10 border-sky-600/30"
                            }
                        ].map(({ title, body, className }) => (
                            <div key={title} className={`rounded-3xl border p-6 shadow-sm ${className}`}>
                                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 mb-5 flex items-center justify-center">
                                    <span className="text-lg font-black text-primary">✦</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-foreground">{title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Department Leaders */}
            <section className="bg-muted/40 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Meet your Leaders!!</h2>
                        <p className="text-muted-foreground">Meet the dedicated individuals guiding our ministries.</p>
                    </div>
                    {leaders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center">
                                <UserX className="w-7 h-7 text-muted-foreground/40" />
                            </div>
                            <p className="text-foreground font-semibold">No leaders added yet</p>
                            <p className="text-muted-foreground text-sm max-w-xs">
                                Our department leaders will appear here once they have been added.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
                            {leaders.map((leader, index) => (
                                <motion.div
                                    key={leader.id}
                                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.9 },
                                        visible: { opacity: 1, scale: 1, transition: { delay: index * 0.05 } }
                                    }}
                                    className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
                                >
                                    <img
                                        src={leader.image}
                                        alt={leader.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                                        <h4 className="font-bold text-lg text-white">{leader.name}</h4>
                                        <p className="text-primary text-sm font-medium">{leader.role}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 6. Ministries & Partnerships */}
            <section className="bg-foreground/5 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Our Ministries & Partnerships</h2>
                        <p className="text-muted-foreground">Find your place to serve, grow, and connect through ministry and partnership.</p>
                    </div>
                    {ministries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center">
                                <Layers className="w-7 h-7 text-muted-foreground/40" />
                            </div>
                            <p className="text-foreground font-semibold">No ministries or partnerships added yet</p>
                            <p className="text-muted-foreground text-sm max-w-xs">
                                Our ministries and partnership initiatives will appear here once they have been set up.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {ministries.map((min, index) => (
                                <motion.div
                                    key={min.id}
                                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } }
                                    }}
                                    className="relative rounded-2xl overflow-hidden h-80 group cursor-pointer"
                                >
                                    {min.backgroundImage ? (
                                        <img
                                            src={min.backgroundImage}
                                            alt={min.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2 text-white">{min.name}</h3>
                                            <p className="text-sm text-white/70">{min.description}</p>
                                        </div>
                                        <div className="flex flex-col items-center ml-4 shrink-0">
                                            <img
                                                src={min.leader.image}
                                                alt={min.leader.name}
                                                className="w-14 h-14 rounded-full border-2 border-primary object-cover mb-2 shadow-lg"
                                            />
                                            <span className="text-[10px] uppercase font-bold text-primary text-center w-max">
                                                Led by<br />{min.leader.name.split(' ')[0]}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
