import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../server/seedDatabase';

const prisma = new PrismaClient();

async function main() {
  await seedDatabase(prisma);
  console.log('Seeded:', {
    guardian: await prisma.guardian.count(),
    patients: await prisma.patient.count(),
    medicines: await prisma.medicine.count(),
    doseLogs: await prisma.doseLog.count(),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });