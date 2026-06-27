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
}

main()
    .catch((err) => {
        console.error('Seed failed:', err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
