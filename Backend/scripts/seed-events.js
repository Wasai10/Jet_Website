/**
 * Seed script – inserts or updates the 5 canonical events.
 * Run from the Backend directory: node scripts/seed-events.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const EVENTS = [
  {
    title: "Ossen Girls Mission",
    description: "A mission dedicated to empowering young girls through the love of Christ and community outreach.",
    location: "TBD",
    date: new Date("2026-09-10T09:00:00Z"),
    type: "PAST",
    tag: "Mission",
    ownership: "JET",
    color: "#22C55E",
    featured: false,
  },
  {
    title: "Impact Conference",
    description: "An annual conference focused on creating lasting impact in society through faith and action.",
    location: "TBD",
    date: new Date("2026-10-02T09:00:00Z"),
    type: "PAST",
    tag: "Conference",
    ownership: "JET",
    color: "#EC4899",
    featured: false,
  },
  {
    title: "Vision Summit",
    description: "A summit gathering leaders and members to align on the vision and direction of JET Ministries.",
    location: "TBD",
    date: new Date("2026-10-10T09:00:00Z"),
    type: "PAST",
    tag: "Summit",
    ownership: "JET",
    color: "#6366F1",
    featured: false,
  },
  {
    title: "International Women's Day",
    description: "A special celebration honouring women in the ministry and the community, highlighting their strength and contributions.",
    location: "TBD",
    date: new Date("2027-03-08T09:00:00Z"),
    type: "UPCOMING",
    tag: "Celebration",
    ownership: "JET",
    color: "#F59E0B",
    featured: true,
  },
  {
    title: "Abacy Feed a Widow Initiative",
    description: "An outreach initiative dedicated to feeding and caring for widows in the community, showing the love of Christ in action.",
    location: "TBD",
    date: new Date("2027-04-20T09:00:00Z"),
    type: "UPCOMING",
    tag: "Outreach",
    ownership: "JET",
    color: "#14B8A6",
    featured: false,
  },
];

async function main() {
  console.log("Seeding events...\n");
  for (const event of EVENTS) {
    const existing = await prisma.event.findFirst({ where: { title: event.title } });
    if (existing) {
      await prisma.event.update({ where: { id: existing.id }, data: event });
      console.log(`  ↻ Updated: ${event.title} [${event.type}]`);
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

