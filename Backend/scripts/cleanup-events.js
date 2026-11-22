const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const retainedTitles = [
  'Ossen Girls Mission',
  'Impact Conference',
  'Vision Summit',
  "International Women's Day",
  'Abacy Feed a Widow Initiative',
];

async function main() {
  const result = await prisma.event.deleteMany({
    where: { title: { notIn: retainedTitles } },
  });
  console.log(`Deleted ${result.count} events outside the requested five categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
