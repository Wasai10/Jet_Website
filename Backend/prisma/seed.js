const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('12JetMinistries**', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@jetministries.com' },
        update: {},
        create: {
            fullName: 'Wasai Church',
            email: 'admin@jetministries.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    console.log(`Admin account seeded: ${admin.email} (id: ${admin.id})`)

    // Seed Events with JET vs PARTNERSHIP classification, date range & background photos
    const defaultEvents = [
        {
            title: 'Annual JET Missions & Community Outreach',
            description: 'Joining hands to bring hope, medical aid, food assistance, and the gospel to underserved communities in Baringo.',
            location: 'Baringo County Mission Grounds',
            date: new Date('2026-09-10T09:00:00Z'),
            endDate: new Date('2026-09-14T17:00:00Z'),
            time: '09:00 AM – 05:00 PM Daily',
            tag: 'Mission',
            color: '#0096FF',
            featured: true,
            coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
            type: 'UPCOMING',
            ownership: 'JET',
        },
        {
            title: 'Ossen Girls Empowerment & Discipleship Conference',
            description: 'A transformative gathering empowering young women through God\'s word, mentorship, skill acquisition, and prayer.',
            location: 'Ossen High School Hall',
            date: new Date('2026-10-02T08:30:00Z'),
            endDate: new Date('2026-10-04T16:00:00Z'),
            time: '08:30 AM – 04:00 PM',
            tag: 'Youth',
            color: '#EC4899',
            featured: true,
            coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
            type: 'UPCOMING',
            ownership: 'JET',
        },
        {
            title: 'Kingdom Impact Leadership Conference 2026',
            description: 'Equipping kingdom leaders, ministers, and visionaries for impactful ministry, governance, and community influence.',
            location: 'JET Main Sanctuary, Nairobi',
            date: new Date('2026-11-05T09:00:00Z'),
            endDate: new Date('2026-11-07T18:00:00Z'),
            time: '09:00 AM – 06:00 PM',
            tag: 'Conference',
            color: '#A855F7',
            featured: true,
            coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
            type: 'UPCOMING',
            ownership: 'JET',
        },
        {
            title: 'Weekly JET House Fellowship & Prayer Circle',
            description: 'Intimate weekly home fellowship for spiritual growth, worship, bible study, and deep communion.',
            location: 'Westlands Fellowship Center',
            date: new Date('2026-08-20T18:00:00Z'),
            endDate: new Date('2026-08-20T20:30:00Z'),
            time: '06:00 PM – 08:30 PM',
            tag: 'Fellowship',
            color: '#10B981',
            featured: false,
            coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
            type: 'HOME_FELLOWSHIP',
            ownership: 'JET',
        },
        {
            title: 'Joint Inter-Ministry Prayer Summit',
            description: 'Partnered with regional churches for a united night of prayer, worship, and intercession.',
            location: 'National Stadium Arena',
            date: new Date('2026-09-25T20:00:00Z'),
            endDate: new Date('2026-09-26T06:00:00Z'),
            time: '08:00 PM – 06:00 AM (Overnight)',
            tag: 'Prayer',
            color: '#F59E0B',
            featured: false,
            coverImage: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
            type: 'UPCOMING',
            ownership: 'PARTNERSHIP',
        },
    ]

    for (const evt of defaultEvents) {
        const existing = await prisma.event.findFirst({ where: { title: evt.title } })
        if (!existing) {
            await prisma.event.create({ data: evt })
        }
    }
    console.log('Events seeded.')

    // Seed Sample Ministry Documents
    const sampleDocs = [
        {
            title: 'JET Fellowship Vision & Beliefs Handbook 2026',
            description: 'Comprehensive guide covering ministry core values, faith statements, and operational vision.',
            fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1680000000/sample.pdf',
            fileName: 'JET_Vision_Handbook_2026.pdf',
            fileSize: '2.4 MB',
            category: 'Vision & Faith',
        },
        {
            title: 'House Fellowship Leaders Training Guide',
            description: 'Training manual for small group leaders, hosts, and facilitators.',
            fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1680000000/sample.pdf',
            fileName: 'House_Fellowship_Guide.pdf',
            fileSize: '1.8 MB',
            category: 'Fellowship',
        },
        {
            title: 'Discipleship & New Believers Study Curriculum',
            description: 'Four-week foundation guide for new believers growing in faith and Scripture.',
            fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1680000000/sample.pdf',
            fileName: 'Discipleship_Curriculum.pdf',
            fileSize: '3.1 MB',
            category: 'Discipleship',
        },
    ]

    for (const doc of sampleDocs) {
        const existing = await prisma.ministryDocument.findFirst({ where: { title: doc.title } })
        if (!existing) {
            await prisma.ministryDocument.create({ data: doc })
        }
    }
    console.log('Ministry documents seeded.')
}

main()
    .catch((err) => {
        console.error('Seed failed:', err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
