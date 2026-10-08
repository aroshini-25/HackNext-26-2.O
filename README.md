# CareSync Medication Manager

Dual-dashboard medication management system connecting guardians and patients with scheduled reminders, instant confirmations, and real-time adherence tracking.

## Stack

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS (`src/`)
- **Backend:** Express + TypeScript (`server/`)
- **Database:** SQLite via Prisma ORM (`prisma/`)

## Prerequisites

- Node.js

## Run Locally

1. Install dependencies:
   `npm install --legacy-peer-deps`

2. Set up the database (SQLite + Prisma):
   `npm run db:push`
   `npm run db:seed`

3. Start the backend API (port 4000):
   `npm run server`

4. Start the frontend (port 3000, proxies `/api` to the backend):
   `npm run dev`

Then open http://localhost:3000.

## Backend & Database

- **API:** REST endpoints under `/api` — patients, medicines, guardian, dose logs, reset
- **Schema:** `prisma/schema.prisma` (`Patient`, `Medicine`, `Guardian`, `DoseLog`)
- **Seed data:** `prisma/seed.ts`
- **Config:** `DATABASE_URL` and `PORT` in `.env`

### Commands

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start frontend dev server (Vite)     |
| `npm run server`     | Start backend API (watched)          |
| `npm run build`      | Build the frontend for production    |
| `npm run lint`       | Type-check (`tsc --noEmit`)          |
| `npm run db:push`    | Sync the Prisma schema to the DB     |
| `npm run db:seed`    | Seed the DB with initial sample data |
| `npm run db:studio`  | Open Prisma Studio                   |
| `npm run db:reset`   | Wipe and re-seed the database        |