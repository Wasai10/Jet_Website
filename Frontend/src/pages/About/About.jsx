import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, UserX, Layers } from 'lucide-react';
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
            <section className="relative h-[80vh] overflow-hidden">
                {/* Background image */}
                <img
                    src="https://res.cloudinary.com/dom6wa8ih/image/upload/v1782561968/jet_gallery/sok6zgpetvozpbid13pt.jpg"
                    alt="JET Ministries — our roots"
                    className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
                />
                {/* Left-heavy overlay so text is always legible */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />
                {/* Top darkening to blend with fixed nav */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

                {/* Content — vertically centred, cleared below the nav */}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-6 w-full" style={{ paddingTop: '4.5rem' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -28 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.85, ease: "easeOut" }}
                            className="max-w-lg space-y-4"
                        >
                            {/* Eyebrow */}
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-[2px] bg-primary rounded-full shrink-0" />
                                <span className="text-primary text-[11px] font-bold uppercase tracking-[0.22em]">Our Roots & Origin</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
                                Where It<br />All Began
                            </h1>

                            {/* Divider */}
                            <div className="w-12 h-1 bg-primary rounded-full" />

                            {/* Body */}
                            <p className="text-white/65 text-sm md:text-base leading-relaxed">
                                From a small living-room fellowship to a vibrant multi-city ministry —
                                built on faith, shaped by calling, and sustained by God's boundless grace.
                            </p>

                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. The Founder */}
            <section className="py-20 mt-8">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="relative bg-primary rounded-3xl overflow-visible min-h-[280px]"
                    >
                        {/* Text — left side, max 58% wide so the image has room */}
                        <div className="relative z-10 p-10 md:p-14 md:max-w-[58%] space-y-4">
                            <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Leadership</p>
                            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                Meet Our Founder
                            </h3>
                            <p className="text-white/75 leading-relaxed text-sm md:text-base">
                                Driven by a divine mandate, our founder has dedicated their life to spreading
                                the Gospel and uplifting communities. With a heart for the marginalized and a
                                vision for spiritual revival, they have shepherded JET Ministries from its
                                inception to its current global footprint.
                            </p>
                            <p className="text-white/75 leading-relaxed text-sm md:text-base">
                                Their leadership is characterized by humility, profound biblical insight, and
                                a relentless passion for empowering the next generation of leaders.
                            </p>
                        </div>

                        {/* Founder image — anchored to bottom-right, overflows above the card */}
                        <div className="absolute right-10 bottom-0 h-[115%] pointer-events-none hidden md:block">
                            <img
                                src="https://res.cloudinary.com/dvkt0lsqb/image/upload/v1775352177/20260405_0422_Image_Generation_remix_01kndkp2b7fgbaajgj3zrwx5ng_rizvpg.png"
                                alt="Founder"
                                className="h-full w-auto object-contain drop-shadow-2xl"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. Mission & Vision */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-primary/20 to-transparent p-10 rounded-3xl border border-primary/30 backdrop-blur-sm">
                        <Heart className="w-12 h-12 text-primary mb-6" />
                        <h3 className="text-3xl font-bold mb-4 text-foreground">Our Mission</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            To share the message of Christ through word and action, equipping believers to grow spiritually and reach the world with His love.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-transparent p-10 rounded-3xl border border-purple-500/30 backdrop-blur-sm">
                        <Users className="w-12 h-12 text-purple-500 dark:text-purple-400 mb-6" />
                        <h3 className="text-3xl font-bold mb-4 text-foreground">Our Vision</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            To be a lighthouse of hope, raising a generation of believers who are deeply rooted in Christ, walking in faith, and active in service.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* 4. What We Believe */}
            <section className="bg-muted/40 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">What We Believe</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Our doctrine is centered on the authority of Scripture, the triune nature of God, the person of Jesus Christ, salvation by grace, and the purpose of the Church.
                        </p>
                    </div>
                    <div className="space-y-10">
                        {[
                            { title: "The Bible", body: "We believe the Bible is the inspired and authoritative Word of God, without error in its original manuscripts, and is the final authority for faith and practice." },
                            { title: "God", body: "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit, equal in power and glory." },
                            { title: "Jesus Christ", body: "We believe in the deity of Jesus Christ, His virgin birth, His sinless life, His miracles, His substitutionary death, His bodily resurrection, His ascension to heaven, and His personal return in power and glory." },
                            { title: "Salvation", body: "We believe that salvation is a gift of God's grace, received through faith in Jesus Christ alone, and not by works. It includes forgiveness of sins, eternal life, and transformation by the Holy Spirit." },
                            { title: "The Church", body: "We believe the Church is the body of Christ, composed of all believers, called to worship God, edify one another, and proclaim the Gospel to the world." },
                        ].map(({ title, body }) => (
                            <div key={title}>
                                <h3 className="text-2xl font-semibold mb-3 text-foreground">{title}</h3>
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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

            {/* 6. Ministries */}
            <section className="bg-foreground/5 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Our Ministries</h2>
                        <p className="text-muted-foreground">Find your place to serve, grow, and connect.</p>
                    </div>
                    {ministries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center">
                                <Layers className="w-7 h-7 text-muted-foreground/40" />
                            </div>
                            <p className="text-foreground font-semibold">No ministries added yet</p>
                            <p className="text-muted-foreground text-sm max-w-xs">
                                Our ministry departments will appear here once they have been set up.
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
