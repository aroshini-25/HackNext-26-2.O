# CareSync Medication Manager

The CareSync – Senior-Centric Medication Management & Caregiver Support project is a smart healthcare support system developed to help senior citizens manage their daily medications in a simple, organized, and reliable way. Many elderly people take multiple medicines at different times with different dosages and instructions, which can lead to confusion, missed doses, or uncertainty about whether a medicine has already been taken. This becomes more difficult when they live alone or when caregivers are not always physically available.

CareSync provides a senior-friendly medication management platform where users can view their complete medication schedule, understand medicine details, and receive timely voice-based reminders. The system also includes camera-assisted medicine scanning, which helps capture and identify medicine information and add it to the medication schedule.

As an additional hardware-based voice assistance feature, Alexa is integrated with the system to provide hands-free medication reminders and guidance. This allows senior citizens to receive medication notifications through voice without depending completely on a mobile or computer screen. Alexa can announce the scheduled medicine, remind the senior about the medication time, and provide simple voice-based assistance.

The system follows a complete medication support process: Understand → Remember → Act → Confirm → Monitor → Support. When a reminder is triggered, the senior can choose “I Took It,” “Remind Me Later,” or “I Need Help.” The selected action updates the medication status and helps identify when further support may be required.

A dedicated caregiver dashboard provides visibility into the senior's medication activities, including taken, pending, and upcoming medicines. If a medicine remains unconfirmed or the senior requests assistance, the caregiver can receive an alert and provide timely support.

The main goal of CareSync is not only to remind seniors about their medicines, but to create a closed-loop medication support system combining software, camera assistance, voice interaction, and Alexa-based hardware support. This helps reduce medication confusion, improve caregiver communication, and promote greater independence, confidence, safety, and continuity of care for senior citizens.

Dual-dashboard medication management system connecting guardians and patients with scheduled reminders, instant confirmations, and real-time adherence tracking.

 ## Demo Link

Demo link :
[Click Here to View Demo](https://drive.google.com/file/d/1YQc_vd4Z7L955M_ZRsR-odBJPMOTmCDz/view?usp=sharing)

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