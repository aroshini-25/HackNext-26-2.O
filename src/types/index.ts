export type FoodTiming = 'Before food' | 'After food' | 'With food' | 'Empty stomach';

export type MedicineStatus = 'Pending' | 'Taken' | 'Missed' | 'Upcoming';

export type Frequency = 'Daily' | 'Twice daily' | 'Three times daily' | 'Every 8 hours' | 'Weekly' | 'As needed';

export interface Medicine {
  id: string;
  patientId: string;
  name: string;
  photoUrl?: string;
  dose: string;             // e.g. "5 mg", "500 mg"
  tabletsCount: string;      // e.g. "1 tablet", "2 capsules"
  time: string;             // e.g. "08:00 AM", "01:00 PM"
  frequency: Frequency;     // e.g. "Daily"
  foodTiming: FoodTiming;   // e.g. "After food"
  status: MedicineStatus;   // "Pending" | "Taken" | "Missed" | "Upcoming"
  takenAt?: string;         // e.g. "08:04 AM"
  reminderCount: number;    // Count of 2-minute reminders triggered (1, 2, 3...)
  lastReminderTime?: string;// e.g. "08:02 AM"
  notes?: string;
  startDate?: string;       // e.g. "2026-10-08"
  endDate?: string;         // e.g. "2026-10-31"
}

export interface DateDoseLog {
  id: string;
  patientId: string;
  medicineId: string;
  date: string;             // "YYYY-MM-DD" e.g. "2026-10-07"
  medicineName: string;
  dose: string;
  tabletsCount?: string;
  time: string;             // Scheduled time: "08:00 AM"
  status: MedicineStatus;   // "Taken" | "Pending" | "Missed" | "Upcoming"
  takenAt?: string;         // Confirmation time e.g. "08:03 AM"
  foodTiming?: FoodTiming;
  notes?: string;
}

export type DayStatus = 'all_taken' | 'some_pending' | 'missed' | 'upcoming_or_none';


export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  photoUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface Guardian {
  name: string;
  role: string;
  phone: string;
  relationship: string;
}

export interface ReminderAlert {
  medicineId: string;
  patientId: string;
  medicineName: string;
  dose: string;
  tabletsCount: string;
  time: string;
  reminderCycle: number;
  active: boolean;
}
