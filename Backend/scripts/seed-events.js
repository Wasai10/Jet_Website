/**
 * Seed script – inserts the 5 canonical events if they don't already exist.
 * Run from the Backend directory: node scripts/seed-events.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const EVENTS = [
  {
    title: "Ossen Girls Mission",
    description: "A mission dedicated to empowering young girls through the love of Christ and community outreach.",
    location: "TBD",
    date: new Date("2024-06-15T09:00:00Z"),
    type: "PAST",
    tag: "Mission",
    ownership: "JET Ministries",
    featured: false,
  },
  {
    title: "Impact Conference",
    description: "An annual conference focused on creating lasting impact in society through faith and action.",
    location: "TBD",
    date: new Date("2024-08-20T09:00:00Z"),
    type: "PAST",
    tag: "Conference",
    ownership: "JET Ministries",
    featured: false,
  },
  {
    title: "Vision Summit",
    description: "A summit gathering leaders and members to align on the vision and direction of JET Ministries.",
    location: "TBD",
    date: new Date("2024-10-10T09:00:00Z"),
    type: "PAST",
    tag: "Summit",
    ownership: "JET Ministries",
    featured: false,
  },
  {
    title: "International Women's Day",
    description: "A special celebration honouring women in the ministry and the community, highlighting their strength and contributions.",
    location: "TBD",
    date: new Date("2025-03-08T09:00:00Z"),
    type: "UPCOMING",
    tag: "Celebration",
    ownership: "JET Ministries",
    featured: true,
  },
  {
    title: "Abacy Feed a Widow Initiative",
    description: "An outreach initiative dedicated to feeding and caring for widows in the community, showing the love of Christ in action.",
    location: "TBD",
    date: new Date("2025-04-20T09:00:00Z"),
    type: "UPCOMING",
    tag: "Outreach",
    ownership: "JET Ministries",
    featured: false,
  },
];

async function main() {
  console.log("Seeding events...\n");
  for (const event of EVENTS) {
    const existing = await prisma.event.findFirst({ where: { title: event.title } });
    if (existing) {
      console.log(`  ⏭  Skipped (already exists): ${event.title}`);
    } else {
      await prisma.event.create({ data: event });
      console.log(`  ✅ Created: ${event.title} [${event.type}]`);
    }
  }
  console.log("\nDone!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

