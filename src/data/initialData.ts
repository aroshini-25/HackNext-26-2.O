import { Patient, Medicine, Guardian, DateDoseLog } from '../types';

export const INITIAL_GUARDIAN: Guardian = {
  name: 'Ananya Sharma',
  role: 'Primary Caregiver & Guardian',
  phone: '+91 98765 12345',
  relationship: 'Daughter / Family Guardian',
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'patient-ramesh-1',
    name: 'Ramesh',
    age: 65,
    phone: '+91 98765 43210',
    photoUrl: '/src/assets/images/ramesh_portrait_1791457693608.jpg',
    notes: 'Hypertension and Type 2 Diabetes management. Regular morning walker.',
    createdAt: '2026-10-01',
  },
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    patientId: 'patient-ramesh-1',
    name: 'Amlodipine',
    photoUrl: '/src/assets/images/amlodipine_pills_1791457709401.jpg',
    dose: '5 mg',
    tabletsCount: '1 tablet',
    time: '08:00 AM',
    frequency: 'Daily',
    foodTiming: 'After food',
    status: 'Taken',
    takenAt: '08:04 AM',
    reminderCount: 0,
    startDate: '2026-10-01',
    notes: 'For blood pressure control. Take with a glass of water after breakfast.',
  },
  {
    id: 'med-2',
    patientId: 'patient-ramesh-1',
    name: 'Metformin',
    photoUrl: '',
    dose: '500 mg',
    tabletsCount: '1 tablet',
    time: '01:00 PM',
    frequency: 'Daily',
    foodTiming: 'After food',
    status: 'Pending',
    reminderCount: 0,
    startDate: '2026-10-01',
    notes: 'For blood sugar control. Take directly after lunch.',
  },
  {
    id: 'med-3',
    patientId: 'patient-ramesh-1',
    name: 'Atorvastatin',
    photoUrl: '',
    dose: '10 mg',
    tabletsCount: '1 tablet',
    time: '08:00 PM',
    frequency: 'Daily',
    foodTiming: 'After food',
    status: 'Upcoming',
    reminderCount: 0,
    startDate: '2026-10-01',
    notes: 'Cholesterol regulation. Take in the evening after dinner.',
  },
];

// Historical logs for previous dates in October 2026 (prior to today Oct 8, 2026)
export const INITIAL_HISTORICAL_LOGS: DateDoseLog[] = [
  // October 7, 2026 (Matches user prompt example exactly: Amlodipine Taken 08:03, Metformin Taken 01:05, Atorvastatin Missed)
  {
    id: 'hist-1007-1',
    patientId: 'patient-ramesh-1',
    medicineId: 'med-1',
    date: '2026-10-07',
    medicineName: 'Amlodipine',
    dose: '5 mg',
    tabletsCount: '1 tablet',
    time: '08:00 AM',
    status: 'Taken',
    takenAt: '08:03 AM',
    foodTiming: 'After food',
  },
  {
    id: 'hist-1007-2',
    patientId: 'patient-ramesh-1',
    medicineId: 'med-2',
    date: '2026-10-07',
    medicineName: 'Metformin',
    dose: '500 mg',
    tabletsCount: '1 tablet',
    time: '01:00 PM',
    status: 'Taken',
    takenAt: '01:05 PM',
    foodTiming: 'After food',
  },
  {
    id: 'hist-1007-3',
    patientId: 'patient-ramesh-1',
    medicineId: 'med-3',
    date: '2026-10-07',
    medicineName: 'Atorvastatin',
    dose: '10 mg',
    tabletsCount: '1 tablet',
    time: '08:00 PM',
    status: 'Missed',
    foodTiming: 'After food',
  },

  // October 6, 2026 - All taken
  { id: 'hist-1006-1', patientId: 'patient-ramesh-1', medicineId: 'med-1', date: '2026-10-06', medicineName: 'Amlodipine', dose: '5 mg', tabletsCount: '1 tablet', time: '08:00 AM', status: 'Taken', takenAt: '08:02 AM', foodTiming: 'After food' },
  { id: 'hist-1006-2', patientId: 'patient-ramesh-1', medicineId: 'med-2', date: '2026-10-06', medicineName: 'Metformin', dose: '500 mg', tabletsCount: '1 tablet', time: '01:00 PM', status: 'Taken', takenAt: '01:08 PM', foodTiming: 'After food' },
  { id: 'hist-1006-3', patientId: 'patient-ramesh-1', medicineId: 'med-3', date: '2026-10-06', medicineName: 'Atorvastatin', dose: '10 mg', tabletsCount: '1 tablet', time: '08:00 PM', status: 'Taken', takenAt: '08:12 PM', foodTiming: 'After food' },

  // October 5, 2026 - All taken
  { id: 'hist-1005-1', patientId: 'patient-ramesh-1', medicineId: 'med-1', date: '2026-10-05', medicineName: 'Amlodipine', dose: '5 mg', tabletsCount: '1 tablet', time: '08:00 AM', status: 'Taken', takenAt: '08:05 AM', foodTiming: 'After food' },
  { id: 'hist-1005-2', patientId: 'patient-ramesh-1', medicineId: 'med-2', date: '2026-10-05', medicineName: 'Metformin', dose: '500 mg', tabletsCount: '1 tablet', time: '01:00 PM', status: 'Taken', takenAt: '01:04 PM', foodTiming: 'After food' },
  { id: 'hist-1005-3', patientId: 'patient-ramesh-1', medicineId: 'med-3', date: '2026-10-05', medicineName: 'Atorvastatin', dose: '10 mg', tabletsCount: '1 tablet', time: '08:00 PM', status: 'Taken', takenAt: '08:00 PM', foodTiming: 'After food' },

  // October 4, 2026 - Missed
  { id: 'hist-1004-1', patientId: 'patient-ramesh-1', medicineId: 'med-1', date: '2026-10-04', medicineName: 'Amlodipine', dose: '5 mg', tabletsCount: '1 tablet', time: '08:00 AM', status: 'Taken', takenAt: '08:09 AM', foodTiming: 'After food' },
  { id: 'hist-1004-2', patientId: 'patient-ramesh-1', medicineId: 'med-2', date: '2026-10-04', medicineName: 'Metformin', dose: '500 mg', tabletsCount: '1 tablet', time: '01:00 PM', status: 'Missed', foodTiming: 'After food' },
  { id: 'hist-1004-3', patientId: 'patient-ramesh-1', medicineId: 'med-3', date: '2026-10-04', medicineName: 'Atorvastatin', dose: '10 mg', tabletsCount: '1 tablet', time: '08:00 PM', status: 'Taken', takenAt: '08:15 PM', foodTiming: 'After food' },

  // October 3, 2026 - All taken
  { id: 'hist-1003-1', patientId: 'patient-ramesh-1', medicineId: 'med-1', date: '2026-10-03', medicineName: 'Amlodipine', dose: '5 mg', tabletsCount: '1 tablet', time: '08:00 AM', status: 'Taken', takenAt: '08:00 AM', foodTiming: 'After food' },
  { id: 'hist-1003-2', patientId: 'patient-ramesh-1', medicineId: 'med-2', date: '2026-10-03', medicineName: 'Metformin', dose: '500 mg', tabletsCount: '1 tablet', time: '01:00 PM', status: 'Taken', takenAt: '01:10 PM', foodTiming: 'After food' },
  { id: 'hist-1003-3', patientId: 'patient-ramesh-1', medicineId: 'med-3', date: '2026-10-03', medicineName: 'Atorvastatin', dose: '10 mg', tabletsCount: '1 tablet', time: '08:00 PM', status: 'Taken', takenAt: '08:06 PM', foodTiming: 'After food' },

  // October 2, 2026 - All taken
  { id: 'hist-1002-1', patientId: 'patient-ramesh-1', medicineId: 'med-1', date: '2026-10-02', medicineName: 'Amlodipine', dose: '5 mg', tabletsCount: '1 tablet', time: '08:00 AM', status: 'Taken', takenAt: '08:04 AM', foodTiming: 'After food' },
  { id: 'hist-1002-2', patientId: 'patient-ramesh-1', medicineId: 'med-2', date: '2026-10-02', medicineName: 'Metformin', dose: '500 mg', tabletsCount: '1 tablet', time: '01:00 PM', status: 'Taken', takenAt: '01:12 PM', foodTiming: 'After food' },
  { id: 'hist-1002-3', patientId: 'patient-ramesh-1', medicineId: 'med-3', date: '2026-10-02', medicineName: 'Atorvastatin', dose: '10 mg', tabletsCount: '1 tablet', time: '08:00 PM', status: 'Taken', takenAt: '08:01 PM', foodTiming: 'After food' },

  // October 1, 2026 - All taken
  { id: 'hist-1001-1', patientId: 'patient-ramesh-1', medicineId: 'med-1', date: '2026-10-01', medicineName: 'Amlodipine', dose: '5 mg', tabletsCount: '1 tablet', time: '08:00 AM', status: 'Taken', takenAt: '08:07 AM', foodTiming: 'After food' },
  { id: 'hist-1001-2', patientId: 'patient-ramesh-1', medicineId: 'med-2', date: '2026-10-01', medicineName: 'Metformin', dose: '500 mg', tabletsCount: '1 tablet', time: '01:00 PM', status: 'Taken', takenAt: '01:15 PM', foodTiming: 'After food' },
  { id: 'hist-1001-3', patientId: 'patient-ramesh-1', medicineId: 'med-3', date: '2026-10-01', medicineName: 'Atorvastatin', dose: '10 mg', tabletsCount: '1 tablet', time: '08:00 PM', status: 'Taken', takenAt: '08:05 PM', foodTiming: 'After food' },
];

