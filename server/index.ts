import 'dotenv/config';
import express from 'express';
import { prisma } from './db';
import { seedDatabase } from './seedDatabase';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(express.json());

// CORS (allow the Vite dev server origin + same-origin proxy)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const api = express.Router();
app.use('/api', api);

api.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

/* ----------------------------- Guardian ----------------------------- */
api.get('/guardian', async (_req, res, next) => {
  try {
    const guardian = await prisma.guardian.findFirst();
    res.json(guardian);
  } catch (e) {
    next(e);
  }
});

/* ----------------------------- Patients ----------------------------- */
api.get('/patients', async (_req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({ orderBy: { createdAt: 'asc' } });
    res.json(patients);
  } catch (e) {
    next(e);
  }
});

api.post('/patients', async (req, res, next) => {
  try {
    const { name, age, phone, photoUrl, notes, createdAt } = req.body;
    const patient = await prisma.patient.create({
      data: {
        name,
        age: Number(age),
        phone,
        photoUrl: photoUrl || '',
        notes: notes || '',
        createdAt: createdAt || new Date().toISOString().slice(0, 10),
      },
    });
    res.status(201).json(patient);
  } catch (e) {
    next(e);
  }
});

/* ---------------------------- Medicines ------------------------------ */
api.get('/medicines', async (req, res, next) => {
  try {
    const patientId = req.query.patientId as string | undefined;
    const medicines = await prisma.medicine.findMany({
      where: patientId ? { patientId } : undefined,
      orderBy: { time: 'asc' },
    });
    res.json(medicines);
  } catch (e) {
    next(e);
  }
});

api.post('/medicines', async (req, res, next) => {
  try {
    const { id, patientId, name, photoUrl, dose, tabletsCount, time, frequency, foodTiming, notes, startDate, endDate } = req.body;
    const medicine = await prisma.medicine.create({
      data: {
        ...(id ? { id } : {}),
        patientId,
        name,
        photoUrl: photoUrl || '',
        dose,
        tabletsCount,
        time,
        frequency,
        foodTiming,
        notes: notes || '',
        startDate: startDate || null,
        endDate: endDate || null,
        status: 'Pending',
        reminderCount: 0,
      },
    });
    res.status(201).json(medicine);
  } catch (e) {
    next(e);
  }
});

api.patch('/medicines/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: _id, patientId, ...updates } = req.body;
    const medicine = await prisma.medicine.update({
      where: { id },
      data: updates,
    });
    res.json(medicine);
  } catch (e) {
    next(e);
  }
});

api.delete('/medicines/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.medicine.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// Confirm a medicine as taken: update status + upsert a dose log for the date
api.post('/medicines/:id/confirm', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { takenAt, date, patientId } = req.body;

    const existing = await prisma.medicine.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    const medicine = await prisma.medicine.update({
      where: { id },
      data: { status: 'Taken', takenAt },
    });

    const logDate = date || new Date().toISOString().slice(0, 10);

    const log = await prisma.doseLog.upsert({
      where: { id: `log-${id}-${logDate}` },
      update: {
        status: 'Taken',
        takenAt,
      },
      create: {
        id: `log-${id}-${logDate}`,
        patientId: patientId || existing.patientId,
        medicineId: id,
        date: logDate,
        medicineName: existing.name,
        dose: existing.dose,
        tabletsCount: existing.tabletsCount,
        time: existing.time,
        status: 'Taken',
        takenAt,
        foodTiming: existing.foodTiming,
        notes: existing.notes,
      },
    });

    res.json({ medicine, log });
  } catch (e) {
    next(e);
  }
});

/* ------------------------------ Dose logs ----------------------------- */
api.get('/logs', async (req, res, next) => {
  try {
    const { patientId, date } = req.query;
    const logs = await prisma.doseLog.findMany({
      where: {
        ...(patientId ? { patientId: patientId as string } : {}),
        ...(date ? { date: date as string } : {}),
      },
      orderBy: { date: 'asc' },
    });
    res.json(logs);
  } catch (e) {
    next(e);
  }
});

/* -------------------------------- Reset ------------------------------- */
api.post('/reset', async (_req, res, next) => {
  try {
    await seedDatabase(prisma);
    const [patients, medicines, guardian] = await Promise.all([
      prisma.patient.findMany(),
      prisma.medicine.findMany(),
      prisma.guardian.findFirst(),
    ]);
    res.json({ patients, medicines, guardian });
  } catch (e) {
    next(e);
  }
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`CareSync API running at http://localhost:${PORT}`);
});