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

    // Seed the canonical event categories with their past/upcoming status.
    const defaultEvents = [
        {
            title: 'Ossen Girls Mission',
            description: 'A mission dedicated to empowering young girls through the love of Christ and community outreach.',
            location: 'Ossen, Baringo County',
            date: new Date('2026-09-10T09:00:00Z'),
            tag: 'Mission',
            color: '#22C55E',
            featured: false,
            coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
            type: 'PAST',
            ownership: 'JET',
        },
        {
            title: 'Impact Conference',
            description: 'An annual conference focused on creating lasting impact in society through faith and action.',
            location: 'JET Main Auditorium',
            date: new Date('2026-10-02T09:00:00Z'),
            tag: 'Conference',
            color: '#EC4899',
            featured: false,
            coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
            type: 'PAST',
            ownership: 'JET',
        },
        {
            title: 'Vision Summit',
            description: 'A summit gathering leaders and members to align on the vision and direction of JET Ministries.',
            location: 'JET Main Auditorium',
            date: new Date('2026-10-10T09:00:00Z'),
            tag: 'Summit',
            color: '#6366F1',
            featured: false,
            coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
            type: 'PAST',
            ownership: 'JET',
        },
        {
            title: 'International Women\'s Day',
            description: 'A special celebration honouring women in the ministry and the community, highlighting their strength and contributions.',
            location: 'JET Main Auditorium',
            date: new Date('2027-03-08T09:00:00Z'),
            tag: 'Celebration',
            color: '#F59E0B',
            featured: true,
            coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
            type: 'UPCOMING',
            ownership: 'JET',
        },
        {
            title: 'Abacy Feed a Widow Initiative',
            description: 'An outreach initiative dedicated to feeding and caring for widows in the community, showing the love of Christ in action.',
            location: 'Abacy Community Center',
            date: new Date('2027-04-20T09:00:00Z'),
            tag: 'Outreach',
            color: '#14B8A6',
            featured: false,
            coverImage: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
            type: 'UPCOMING',
            ownership: 'JET',
        },
    ]

    for (const evt of defaultEvents) {
        const existing = await prisma.event.findFirst({ where: { title: evt.title } })
        if (existing) {
            await prisma.event.update({ where: { id: existing.id }, data: evt })
        } else {
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
