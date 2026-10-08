import React, { useState } from 'react';
import { useMedication } from '../../context/MedicationContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Pill,
  Utensils
} from 'lucide-react';
import { DateDoseLog } from '../../types';

export const PatientCalendarView: React.FC = () => {
  const { 
    selectedPatient, 
    currentDateString, 
    getScheduleForDate, 
    confirmMedicineTaken,
    simulatedTime 
  } = useMedication();

  const [viewDate, setViewDate] = useState<string>(currentDateString);

  // Helper to advance / regress date by 1 day
  const changeDateByDays = (delta: number) => {
    const current = new Date(viewDate + 'T00:00:00');
    current.setDate(current.getDate() + delta);
    const y = current.getFullYear();
    const m = (current.getMonth() + 1).toString().padStart(2, '0');
    const d = current.getDate().toString().padStart(2, '0');
    setViewDate(`${y}-${m}-${d}`);
  };

  const isToday = viewDate === currentDateString;
  const isPast = viewDate < currentDateString;

  const dateObj = new Date(viewDate + 'T00:00:00');
  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

  // Get medicines for this date
  const schedule: DateDoseLog[] = getScheduleForDate(viewDate);

  // Status renderer matching prompt:
  // 🟢 Taken
  // 🟡 Pending
  // ⚪ Upcoming
  // 🔴 Missed
  const renderStatus = (med: DateDoseLog) => {
    switch (med.status) {
      case 'Taken':
        return (
          <div className="bg-emerald-100 border-2 border-emerald-400 rounded-2xl py-2 px-4 text-emerald-950 inline-flex items-center gap-2">
            <span className="text-xl">🟢</span>
            <span className="text-lg sm:text-xl font-black">TAKEN</span>
            {med.takenAt && (
              <span className="text-sm font-mono font-bold text-emerald-800 ml-1">
                ({med.takenAt})
              </span>
            )}
          </div>
        );
      case 'Pending':
        return (
          <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl py-2 px-4 text-amber-950 inline-flex items-center gap-2">
            <span className="text-xl">🟡</span>
            <span className="text-lg sm:text-xl font-black">PENDING</span>
          </div>
        );
      case 'Missed':
        return (
          <div className="bg-rose-100 border-2 border-rose-400 rounded-2xl py-2 px-4 text-rose-950 inline-flex items-center gap-2">
            <span className="text-xl">🔴</span>
            <span className="text-lg sm:text-xl font-black">MISSED</span>
          </div>
        );
      case 'Upcoming':
      default:
        return (
          <div className="bg-slate-100 border-2 border-slate-300 rounded-2xl py-2 px-4 text-slate-700 inline-flex items-center gap-2">
            <span className="text-xl">⚪</span>
            <span className="text-lg sm:text-xl font-black">UPCOMING</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Header with Simple Touch Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-teal-600/30 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <span className="text-xl sm:text-2xl font-black tracking-wide uppercase text-teal-800">
                {isToday ? 'TODAY' : weekday.toUpperCase()}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
              {dateFormatted}
            </h2>
            <p className="text-base text-slate-500 font-medium mt-1">
              {selectedPatient?.name}'s Daily Medicine Calendar
            </p>
          </div>

          {/* Simple Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeDateByDays(-1)}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-sm"
              title="Previous Day"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
            {!isToday && (
              <button
                onClick={() => setViewDate(currentDateString)}
                className="px-4 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Today
              </button>
            )}
            <button
              onClick={() => changeDateByDays(1)}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-sm"
              title="Next Day"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* List of Medicines Matching Prompt Format:
          💊 Amlodipine
          08:00 AM
          🟢 Taken
      */}
      <div className="space-y-4">
        {schedule.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-slate-200 text-slate-400 text-xl font-bold">
            No medicines scheduled for this day.
          </div>
        ) : (
          schedule.map((med) => {
            const isPendingToday = isToday && med.status === 'Pending';

            return (
              <div
                key={med.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border-3 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  med.status === 'Taken'
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : isPendingToday
                    ? 'border-amber-400 ring-4 ring-amber-300/30'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Medicine Name with Icon */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl">💊</span>
                    <div>
                      <h3 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                        {med.medicineName}
                      </h3>
                      <p className="text-lg font-bold text-slate-600 mt-0.5">
                        {med.dose} {med.tabletsCount && `(${med.tabletsCount})`}
                      </p>
                    </div>
                  </div>

                  {/* Scheduled Time */}
                  <div className="inline-flex items-center gap-2 text-xl sm:text-2xl font-mono font-black text-slate-800 bg-slate-100 px-4 py-1.5 rounded-2xl">
                    <Clock className="w-5 h-5 text-teal-600" />
                    <span>{med.time}</span>
                  </div>

                  {med.foodTiming && (
                    <div className="text-sm font-semibold text-slate-500 flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-slate-400" />
                      <span>{med.foodTiming}</span>
                    </div>
                  )}
                </div>

                {/* Right Side: Status Indicator + Action Button if Pending */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {renderStatus(med)}

                  {isPendingToday && (
                    <button
                      onClick={() => confirmMedicineTaken(med.medicineId)}
                      className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer border-2 border-emerald-400"
                    >
                      <Check className="w-6 h-6 stroke-[3]" />
                      <span>I TOOK THIS</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
