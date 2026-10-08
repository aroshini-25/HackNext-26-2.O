import { PrismaClient } from '@prisma/client';
import {
  INITIAL_GUARDIAN,
  INITIAL_PATIENTS,
  INITIAL_MEDICINES,
  INITIAL_HISTORICAL_LOGS,
} from '../src/data/initialData';

export async function seedDatabase(prisma: PrismaClient) {
  // Clear existing data (in dependency order)
  await prisma.doseLog.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.guardian.deleteMany();

  // Guardian (singleton)
  await prisma.guardian.create({
    data: {
      name: INITIAL_GUARDIAN.name,
      role: INITIAL_GUARDIAN.role,
      phone: INITIAL_GUARDIAN.phone,
      relationship: INITIAL_GUARDIAN.relationship,
    },
  });

  for (const p of INITIAL_PATIENTS) {
    await prisma.patient.create({
      data: {
        id: p.id,
        name: p.name,
        age: p.age,
        phone: p.phone,
        photoUrl: p.photoUrl,
        notes: p.notes,
        createdAt: p.createdAt,
      },
    });
  }

  for (const m of INITIAL_MEDICINES) {
    await prisma.medicine.create({
      data: {
        id: m.id,
        patientId: m.patientId,
        name: m.name,
        photoUrl: m.photoUrl,
        dose: m.dose,
        tabletsCount: m.tabletsCount,
        time: m.time,
        frequency: m.frequency,
        foodTiming: m.foodTiming,
        status: m.status,
        takenAt: m.takenAt,
        reminderCount: m.reminderCount,
        lastReminderTime: m.lastReminderTime,
        notes: m.notes,
        startDate: m.startDate,
        endDate: m.endDate,
      },
    });
  }

  for (const l of INITIAL_HISTORICAL_LOGS) {
    await prisma.doseLog.create({
      data: {
        id: l.id,
        patientId: l.patientId,
        medicineId: l.medicineId,
        date: l.date,
        medicineName: l.medicineName,
        dose: l.dose,
        tabletsCount: l.tabletsCount,
        time: l.time,
        status: l.status,
        takenAt: l.takenAt,
        foodTiming: l.foodTiming,
        notes: l.notes,
      },
    });
  }
}