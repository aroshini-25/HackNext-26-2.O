import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Patient, Medicine, Guardian, ReminderAlert, DateDoseLog, DayStatus, FoodTiming, Frequency } from '../types';
import { INITIAL_GUARDIAN, INITIAL_PATIENTS, INITIAL_MEDICINES, INITIAL_HISTORICAL_LOGS } from '../data/initialData';
import { soundManager } from '../utils/sound';

interface MedicationContextType {
  patients: Patient[];
  medicines: Medicine[];
  guardian: Guardian;
  selectedPatientId: string;
  selectedPatient: Patient | undefined;
  patientMedicines: Medicine[];
  activeReminder: ReminderAlert | null;
  recentlyConfirmedMed: Medicine | null;
  simulatedTime: string;
  soundEnabled: boolean;
  twoMinuteCountdown: number; // 0 - 120 seconds for prototype 2-minute cycle
  stats: {
    totalPatients: number;
    todayMedicines: number;
    takenMedicines: number;
    pendingMedicines: number;
    missedMedicines: number;
  };
  addPatient: (data: { name: string; age: number; phone: string; photoUrl?: string; notes?: string }) => void;
  selectPatient: (id: string) => void;
  addMedicine: (data: Omit<Medicine, 'id' | 'status' | 'reminderCount' | 'takenAt'>) => void;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  confirmMedicineTaken: (medicineId: string) => void;
  triggerTestReminder: (medId?: string) => void;
  fastForwardTwoMinutes: () => void;
  setSimulatedTime: (time: string) => void;
  resetAllData: () => void;
  toggleSound: () => void;
  closeConfirmationModal: () => void;

  // Calendar specific
  currentDateString: string; // '2026-10-08'
  selectedCalendarDate: string; // '2026-10-08'
  setSelectedCalendarDate: (date: string) => void;
  calendarMonth: number; // 0-indexed (9 for October)
  setCalendarMonth: React.Dispatch<React.SetStateAction<number>>;
  calendarYear: number;
  setCalendarYear: React.Dispatch<React.SetStateAction<number>>;
  getScheduleForDate: (dateStr: string, patientId?: string) => DateDoseLog[];
  getDayStatus: (dateStr: string, patientId?: string) => DayStatus;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PATIENTS: 'caresync_patients_v1',
  MEDICINES: 'caresync_medicines_v1',
  SELECTED_PATIENT: 'caresync_selected_patient_v1',
  SIM_TIME: 'caresync_sim_time_v1',
  HISTORICAL_LOGS: 'caresync_calendar_logs_v1',
};

// Helper: convert time string "08:00 AM" to minutes from midnight
export function timeStringToMinutes(timeStr: string): number {
  try {
    const parts = timeStr.trim().split(' ');
    const [hStr, mStr] = parts[0].split(':');
    let hours = parseInt(hStr, 10);
    const minutes = parseInt(mStr, 10);
    const modifier = parts[1]?.toUpperCase() || 'AM';

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  } catch {
    return 0;
  }
}

// Helper to format simulated time e.g. "08:00 AM" + 2 mins -> "08:02 AM"
export function addMinutesToTimeString(timeStr: string, minutesToAdd: number): string {
  try {
    const totalMinutes = (timeStringToMinutes(timeStr) + minutesToAdd + 1440) % 1440;
    let newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    const newModifier = newHours >= 12 ? 'PM' : 'AM';

    if (newHours > 12) newHours -= 12;
    if (newHours === 0) newHours = 12;

    const formattedHours = newHours.toString().padStart(2, '0');
    const formattedMinutes = newMinutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${newModifier}`;
  } catch {
    return timeStr;
  }
}

export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentDateString = '2026-10-08';

  // Load state from localStorage or initial mock data
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return stored ? JSON.parse(stored) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEDICINES);
      return stored ? JSON.parse(stored) : INITIAL_MEDICINES;
    } catch {
      return INITIAL_MEDICINES;
    }
  });

  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_PATIENT);
      return stored || 'patient-ramesh-1';
    } catch {
      return 'patient-ramesh-1';
    }
  });

  const [historicalLogs, setHistoricalLogs] = useState<DateDoseLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORICAL_LOGS);
      return stored ? JSON.parse(stored) : INITIAL_HISTORICAL_LOGS;
    } catch {
      return INITIAL_HISTORICAL_LOGS;
    }
  });

  const [guardian] = useState<Guardian>(INITIAL_GUARDIAN);
  const [simulatedTime, setSimulatedTimeState] = useState<string>('08:00 AM');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeReminder, setActiveReminder] = useState<ReminderAlert | null>(null);
  const [recentlyConfirmedMed, setRecentlyConfirmedMed] = useState<Medicine | null>(null);
  const [twoMinuteCountdown, setTwoMinuteCountdown] = useState<number>(120);

  // Calendar view state
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-10-08');
  const [calendarMonth, setCalendarMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [calendarYear, setCalendarYear] = useState<number>(2026);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    } catch {}
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
    } catch {}
  }, [medicines]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_PATIENT, selectedPatientId);
    } catch {}
  }, [selectedPatientId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORICAL_LOGS, JSON.stringify(historicalLogs));
    } catch {}
  }, [historicalLogs]);

  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  const patientMedicines = useMemo(() => {
    return medicines.filter((m) => m.patientId === (selectedPatient?.id || 'patient-ramesh-1'));
  }, [medicines, selectedPatient]);

  // Overall guardian stats across all or selected patient
  const stats = useMemo(() => {
    const todayMedicines = medicines.length;
    const takenMedicines = medicines.filter((m) => m.status === 'Taken').length;
    const pendingMedicines = medicines.filter((m) => m.status === 'Pending' || m.status === 'Upcoming').length;
    const missedMedicines = medicines.filter((m) => m.status === 'Missed').length;

    return {
      totalPatients: patients.length,
      todayMedicines,
      takenMedicines,
      pendingMedicines,
      missedMedicines,
    };
  }, [patients, medicines]);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundManager.enabled = next;
      if (next) {
        soundManager.playSuccessChime();
      }
      return next;
    });
  }, []);

  // Set simulated clock time
  const setSimulatedTime = useCallback((time: string) => {
    setSimulatedTimeState(time);
  }, []);

  // Trigger test reminder immediately (defaults to Amlodipine or first pending medicine)
  const triggerTestReminder = useCallback(
    (medId?: string) => {
      const targetMed = medId
        ? medicines.find((m) => m.id === medId)
        : patientMedicines.find((m) => m.status !== 'Taken') || patientMedicines[0];

      if (!targetMed) return;

      const newCycle = (targetMed.reminderCount || 0) + 1;

      // Update medicine reminder cycle count
      setMedicines((prev) =>
        prev.map((m) =>
          m.id === targetMed.id
            ? {
                ...m,
                reminderCount: newCycle,
                lastReminderTime: simulatedTime,
                status: 'Pending',
              }
            : m
        )
      );

      setActiveReminder({
        medicineId: targetMed.id,
        patientId: targetMed.patientId,
        medicineName: targetMed.name,
        dose: targetMed.dose,
        tabletsCount: targetMed.tabletsCount,
        time: targetMed.time,
        reminderCycle: newCycle,
        active: true,
      });

      setTwoMinuteCountdown(120);
      soundManager.playReminderChime();
    },
    [medicines, patientMedicines, simulatedTime]
  );

  // Fast forward by 2 minutes (simulates the recurring 2-minute reminder trigger)
  const fastForwardTwoMinutes = useCallback(() => {
    setSimulatedTimeState((prevTime) => {
      const newTime = addMinutesToTimeString(prevTime, 2);

      // If there's an active reminder, increment its cycle
      if (activeReminder) {
        const nextCycle = activeReminder.reminderCycle + 1;
        setActiveReminder((prev) => (prev ? { ...prev, reminderCycle: nextCycle } : null));

        setMedicines((prevMeds) =>
          prevMeds.map((m) =>
            m.id === activeReminder.medicineId
              ? { ...m, reminderCount: nextCycle, lastReminderTime: newTime }
              : m
          )
        );

        soundManager.playReminderChime();
      } else {
        // If simulated time now matches a pending medicine's time, trigger it!
        const matchingMed = medicines.find(
          (m) => m.status === 'Pending' && m.time === newTime
        );
        if (matchingMed) {
          triggerTestReminder(matchingMed.id);
        }
      }

      return newTime;
    });

    setTwoMinuteCountdown(120);
  }, [activeReminder, medicines, triggerTestReminder]);

  // Two-minute countdown simulation loop while a reminder is active
  useEffect(() => {
    if (!activeReminder) {
      setTwoMinuteCountdown(120);
      return;
    }

    const timer = setInterval(() => {
      setTwoMinuteCountdown((prev) => {
        if (prev <= 1) {
          fastForwardTwoMinutes();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeReminder, fastForwardTwoMinutes]);

  // Check if simulated time reaches any pending medicine time
  useEffect(() => {
    if (activeReminder) return; // already alerting
    const dueMed = patientMedicines.find(
      (m) => m.status === 'Pending' && m.time === simulatedTime && m.reminderCount === 0
    );
    if (dueMed) {
      triggerTestReminder(dueMed.id);
    }
  }, [simulatedTime, patientMedicines, activeReminder, triggerTestReminder]);

  // PATIENT CONFIRMATION: "I TOOK THIS"
  const confirmMedicineTaken = useCallback(
    (medicineId: string) => {
      const takenTimestamp = simulatedTime || '08:04 AM';
      const med = medicines.find((m) => m.id === medicineId);

      // 1. Update medicine status to "Taken" and record exact taken time
      setMedicines((prev) =>
        prev.map((m) =>
          m.id === medicineId
            ? {
                ...m,
                status: 'Taken',
                takenAt: takenTimestamp,
              }
            : m
        )
      );

      // 2. Record to calendar historical logs for today's date
      setHistoricalLogs((prev) => {
        const existingIdx = prev.findIndex(
          (l) => l.medicineId === medicineId && l.date === currentDateString
        );
        const newRecord: DateDoseLog = {
          id: `log-${Date.now()}`,
          patientId: med?.patientId || selectedPatientId,
          medicineId,
          date: currentDateString,
          medicineName: med?.name || 'Medicine',
          dose: med?.dose || '',
          tabletsCount: med?.tabletsCount || '',
          time: med?.time || '',
          status: 'Taken',
          takenAt: takenTimestamp,
          foodTiming: med?.foodTiming,
        };
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = newRecord;
          return updated;
        }
        return [...prev, newRecord];
      });

      // 3. STOP reminders immediately
      setActiveReminder(null);
      setTwoMinuteCountdown(120);

      // 4. Play cheerful confirmation chime
      soundManager.playSuccessChime();

      // 5. Show confirmation modal with details
      if (med) {
        setRecentlyConfirmedMed({
          ...med,
          status: 'Taken',
          takenAt: takenTimestamp,
        });
      }
    },
    [medicines, simulatedTime, currentDateString, selectedPatientId]
  );

  const closeConfirmationModal = useCallback(() => {
    setRecentlyConfirmedMed(null);
  }, []);

  // CALENDAR: Get schedule for a specific date
  const getScheduleForDate = useCallback(
    (dateStr: string, patientId?: string): DateDoseLog[] => {
      const pId = patientId || selectedPatient?.id || 'patient-ramesh-1';
      const pMeds = medicines.filter((m) => m.patientId === pId);

      // Case 1: Today's Date (2026-10-08)
      if (dateStr === currentDateString) {
        const currentMins = timeStringToMinutes(simulatedTime);

        return pMeds.map((med) => {
          let resolvedStatus = med.status;
          const medMins = timeStringToMinutes(med.time);

          if (med.status === 'Taken') {
            resolvedStatus = 'Taken';
          } else if (medMins > currentMins) {
            resolvedStatus = 'Upcoming';
          } else {
            resolvedStatus = 'Pending';
          }

          return {
            id: med.id,
            patientId: med.patientId,
            medicineId: med.id,
            date: currentDateString,
            medicineName: med.name,
            dose: med.dose,
            tabletsCount: med.tabletsCount,
            time: med.time,
            status: resolvedStatus,
            takenAt: med.takenAt,
            foodTiming: med.foodTiming,
            notes: med.notes,
          };
        });
      }

      // Case 2: Past Date (prior to today)
      if (dateStr < currentDateString) {
        const logsForDate = historicalLogs.filter(
          (l) => l.patientId === pId && l.date === dateStr
        );

        if (logsForDate.length > 0) {
          return logsForDate;
        }

        // Realistic deterministic fallback for older dates in current month:
        // Day number logic: on oct 4 metformin was missed, all others taken
        return pMeds
          .filter((m) => !m.startDate || m.startDate <= dateStr)
          .map((med) => {
            const isTaken = !(dateStr === '2026-10-04' && med.name === 'Metformin') &&
                            !(dateStr === '2026-10-07' && med.name === 'Atorvastatin');
            return {
              id: `${med.id}-${dateStr}`,
              patientId: med.patientId,
              medicineId: med.id,
              date: dateStr,
              medicineName: med.name,
              dose: med.dose,
              tabletsCount: med.tabletsCount,
              time: med.time,
              status: isTaken ? 'Taken' : 'Missed',
              takenAt: isTaken ? addMinutesToTimeString(med.time, 3) : undefined,
              foodTiming: med.foodTiming,
              notes: med.notes,
            };
          });
      }

      // Case 3: Future Date (after today)
      return pMeds
        .filter((m) => (!m.startDate || m.startDate <= dateStr) && (!m.endDate || m.endDate >= dateStr))
        .map((med) => ({
          id: `${med.id}-${dateStr}`,
          patientId: med.patientId,
          medicineId: med.id,
          date: dateStr,
          medicineName: med.name,
          dose: med.dose,
          tabletsCount: med.tabletsCount,
          time: med.time,
          status: 'Upcoming',
          foodTiming: med.foodTiming,
          notes: med.notes,
        }));
    },
    [medicines, selectedPatient, currentDateString, simulatedTime, historicalLogs]
  );

  // CALENDAR: Get day status indicator:
  // 🟢 All medicines taken
  // 🟡 Some medicines pending
  // 🔴 Medicine missed
  // ⚪ Upcoming / no medication activity
  const getDayStatus = useCallback(
    (dateStr: string, patientId?: string): DayStatus => {
      const schedule = getScheduleForDate(dateStr, patientId);
      if (schedule.length === 0) return 'upcoming_or_none';

      const hasMissed = schedule.some((s) => s.status === 'Missed');
      if (hasMissed) return 'missed';

      const hasPending = schedule.some((s) => s.status === 'Pending');
      if (hasPending) return 'some_pending';

      const allTaken = schedule.every((s) => s.status === 'Taken');
      if (allTaken) return 'all_taken';

      return 'upcoming_or_none';
    },
    [getScheduleForDate]
  );

  // Add Patient
  const addPatient = useCallback(
    (data: { name: string; age: number; phone: string; photoUrl?: string; notes?: string }) => {
      const newPatient: Patient = {
        id: `patient-${Date.now()}`,
        name: data.name.trim(),
        age: Number(data.age),
        phone: data.phone.trim(),
        photoUrl: data.photoUrl || '',
        notes: data.notes || '',
        createdAt: currentDateString,
      };
      setPatients((prev) => [...prev, newPatient]);
      setSelectedPatientId(newPatient.id);
    },
    [currentDateString]
  );

  // Select active patient
  const selectPatient = useCallback((id: string) => {
    setSelectedPatientId(id);
    setActiveReminder(null);
  }, []);

  // Add Medicine
  const addMedicine = useCallback(
    (data: Omit<Medicine, 'id' | 'status' | 'reminderCount' | 'takenAt'>) => {
      const newMed: Medicine = {
        ...data,
        id: `med-${Date.now()}`,
        status: 'Pending',
        reminderCount: 0,
        startDate: data.startDate || currentDateString,
      };
      setMedicines((prev) => [...prev, newMed]);
    },
    [currentDateString]
  );

  // Update Medicine
  const updateMedicine = useCallback((id: string, updates: Partial<Medicine>) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  // Delete Medicine
  const deleteMedicine = useCallback((id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    setActiveReminder((prev) => (prev?.medicineId === id ? null : prev));
  }, []);

  // Reset to default sample data
  const resetAllData = useCallback(() => {
    setPatients(INITIAL_PATIENTS);
    setMedicines(INITIAL_MEDICINES);
    setHistoricalLogs(INITIAL_HISTORICAL_LOGS);
    setSelectedPatientId('patient-ramesh-1');
    setSimulatedTimeState('08:00 AM');
    setActiveReminder(null);
    setRecentlyConfirmedMed(null);
    setTwoMinuteCountdown(120);
    setSelectedCalendarDate('2026-10-08');
    setCalendarMonth(9);
    setCalendarYear(2026);
    try {
      localStorage.removeItem(STORAGE_KEYS.PATIENTS);
      localStorage.removeItem(STORAGE_KEYS.MEDICINES);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_PATIENT);
      localStorage.removeItem(STORAGE_KEYS.HISTORICAL_LOGS);
    } catch {}
  }, []);

  const value = {
    patients,
    medicines,
    guardian,
    selectedPatientId,
    selectedPatient,
    patientMedicines,
    activeReminder,
    recentlyConfirmedMed,
    simulatedTime,
    soundEnabled,
    twoMinuteCountdown,
    stats,
    addPatient,
    selectPatient,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    confirmMedicineTaken,
    triggerTestReminder,
    fastForwardTwoMinutes,
    setSimulatedTime,
    resetAllData,
    toggleSound,
    closeConfirmationModal,

    // Calendar
    currentDateString,
    selectedCalendarDate,
    setSelectedCalendarDate,
    calendarMonth,
    setCalendarMonth,
    calendarYear,
    setCalendarYear,
    getScheduleForDate,
    getDayStatus,
  };

  return <MedicationContext.Provider value={value}>{children}</MedicationContext.Provider>;
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};
