import React, { useState } from 'react';
import { useMedication } from '../../context/MedicationContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Circle,
  Pill,
  Utensils
} from 'lucide-react';
import { AddMedicineModal } from './AddMedicineModal';
import { DateDoseLog, DayStatus } from '../../types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Monday to Sunday as shown in prompt
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const GuardianCalendar: React.FC = () => {
  const {
    selectedPatient,
    currentDateString,
    selectedCalendarDate,
    setSelectedCalendarDate,
    calendarMonth,
    setCalendarMonth,
    calendarYear,
    setCalendarYear,
    getScheduleForDate,
    getDayStatus,
    confirmMedicineTaken
  } = useMedication();

  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);

  // Month navigation
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCalendarMonth(9); // October
    setCalendarYear(2026);
    setSelectedCalendarDate('2026-10-08');
  };

  // Calculate calendar days with Monday as start of week
  // JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat
  // We want Monday=0, Tuesday=1, ..., Sunday=6
  const getMondayOffset = (dayOfWeek: number) => (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
  const leadEmptyDays = getMondayOffset(firstDayOfMonth);
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  // Selected date schedule
  const selectedSchedule: DateDoseLog[] = getScheduleForDate(selectedCalendarDate);

  // Format selected date nicely e.g. "October 8, 2026"
  const selectedDateObj = new Date(selectedCalendarDate + 'T00:00:00');
  const selectedDateFormatted = selectedDateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const isPastDate = selectedCalendarDate < currentDateString;
  const isToday = selectedCalendarDate === currentDateString;

  // Day indicator renderer (🟢, 🟡, 🔴, ⚪)
  const renderDayIndicator = (status: DayStatus) => {
    switch (status) {
      case 'all_taken':
        return <span className="text-emerald-600 text-xs" title="All medicines taken">🟢</span>;
      case 'some_pending':
        return <span className="text-amber-500 text-xs" title="Some medicines pending">🟡</span>;
      case 'missed':
        return <span className="text-rose-500 text-xs" title="Medicine missed">🔴</span>;
      case 'upcoming_or_none':
      default:
        return <span className="text-slate-300 text-xs" title="Upcoming / No activity">⚪</span>;
    }
  };

  // Status badge renderer for medicine item
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Taken':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span>🟢</span>
            <span>Taken</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <span>🟡</span>
            <span>Pending</span>
          </span>
        );
      case 'Missed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <span>🔴</span>
            <span>Missed</span>
          </span>
        );
      case 'Upcoming':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            <span>⚪</span>
            <span>Upcoming</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
              Medication Schedule Calendar
            </span>
            <span className="text-xs text-slate-400">· Patient: {selectedPatient?.name}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Guardian Calendar & Adherence Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor daily dosage status, inspect medication history for past dates, or schedule medicines for specific dates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleJumpToToday}
            className="px-3.5 py-2 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200/80 transition-colors flex items-center gap-1.5"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Today (Oct 8)</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout: Monthly Calendar (Left) & Date Schedule (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Month Calendar Grid (7 columns) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          {/* Month Header & Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <h3 className="text-lg font-bold text-slate-900">
                {MONTH_NAMES[calendarMonth]} {calendarYear}
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header (Mon -> Sun) */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells Matrix */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Leading empty days */}
            {Array.from({ length: leadEmptyDays }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-14 sm:h-16 rounded-xl bg-slate-50/40 border border-transparent"></div>
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${calendarYear}-${(calendarMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
              const isSelected = dateStr === selectedCalendarDate;
              const isTodayCell = dateStr === currentDateString;
              const dayStatus = getDayStatus(dateStr);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedCalendarDate(dateStr)}
                  className={`h-14 sm:h-16 rounded-xl p-1.5 flex flex-col justify-between items-center transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 shadow-xs ring-2 ring-teal-500/30'
                      : isTodayCell
                      ? 'bg-amber-50/60 border-amber-300 font-bold'
                      : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="w-full flex items-center justify-between text-xs px-1">
                    <span
                      className={`font-semibold ${
                        isSelected
                          ? 'text-teal-900 font-black'
                          : isTodayCell
                          ? 'text-amber-900 font-black'
                          : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {isTodayCell && (
                      <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded font-bold uppercase">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Calendar Status Indicator (🟢, 🟡, 🔴, ⚪) matching prompt requirement */}
                  <div className="pb-1">
                    {renderDayIndicator(dayStatus)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Calendar Status Indicators Legend */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Indicators:</span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <span>🟢</span>
                <span>All medicines taken</span>
              </span>
              <span className="flex items-center gap-1">
                <span>🟡</span>
                <span>Some medicines pending</span>
              </span>
              <span className="flex items-center gap-1">
                <span>🔴</span>
                <span>Medicine missed</span>
              </span>
              <span className="flex items-center gap-1">
                <span>⚪</span>
                <span>Upcoming / None</span>
              </span>
            </div>
          </div>
        </div>

        {/* Selected Date Medication Schedule & History (5 columns) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header matching prompt example */}
            <div className="pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">
                  📅 {selectedDateFormatted}
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                  {isPastDate ? 'Medication History' : `${selectedPatient?.name}'s Medicines`}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isToday ? 'Today · Real-time Schedule' : isPastDate ? 'Past Record · Confirmation Logs' : 'Scheduled Dosages'}
                </p>
              </div>

              {/* Add Medicine From Calendar Button */}
              <button
                onClick={() => setIsAddMedicineOpen(true)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Medicine</span>
              </button>
            </div>

            {/* Medicines List matching exact prompt format */}
            <div>
              {selectedSchedule.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs space-y-3">
                  <p>No medicines scheduled for this date.</p>
                  <button
                    onClick={() => setIsAddMedicineOpen(true)}
                    className="px-3.5 py-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-white border border-teal-200 rounded-xl transition-colors"
                  >
                    + Add Medicine for {selectedDateFormatted}
                  </button>
                </div>
              ) : isPastDate ? (
                /* MEDICATION HISTORY FORMAT (Previous Dates) */
                <div className="space-y-3">
                  {selectedSchedule.map((med) => (
                    <div
                      key={med.id}
                      className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {med.status === 'Taken' ? '🟢' : med.status === 'Missed' ? '🔴' : '🟡'}
                          </span>
                          <div>
                            <h4 className="text-base font-bold text-slate-900">
                              {med.medicineName}
                            </h4>
                            <span className="text-xs text-slate-500 font-medium">
                              {med.dose} {med.tabletsCount && `— ${med.tabletsCount}`}
                            </span>
                          </div>
                        </div>

                        <div>
                          {renderStatusBadge(med.status)}
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 font-mono space-y-0.5">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Scheduled:</span>
                          <span className="font-semibold text-slate-800">{med.time}</span>
                        </div>
                        {med.status === 'Taken' && med.takenAt && (
                          <div className="flex justify-between text-emerald-800 font-bold">
                            <span>Taken:</span>
                            <span>{med.takenAt}</span>
                          </div>
                        )}
                        {med.status === 'Missed' && (
                          <div className="flex justify-between text-rose-800 font-bold">
                            <span>Status:</span>
                            <span>Missed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ACTIVE / TODAY / UPCOMING SCHEDULE FORMAT */
                <div className="space-y-3">
                  {selectedSchedule.map((med) => (
                    <div
                      key={med.id}
                      className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all space-y-2"
                    >
                      {/* Time display */}
                      <div className="text-xs font-mono font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{med.time}</span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg shrink-0">
                            💊
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-slate-900">
                              {med.medicineName}
                            </h4>
                            <span className="text-xs text-slate-500 font-medium">
                              {med.dose} {med.tabletsCount && `— ${med.tabletsCount}`}
                            </span>
                          </div>
                        </div>

                        <div>
                          {renderStatusBadge(med.status)}
                        </div>
                      </div>

                      {/* Food & confirmation details */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        {med.foodTiming && (
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <Utensils className="w-3 h-3 text-slate-400" />
                            <span>{med.foodTiming}</span>
                          </span>
                        )}

                        {med.status === 'Taken' && med.takenAt && (
                          <span className="font-mono text-emerald-700 font-bold">
                            Confirmed: {med.takenAt}
                          </span>
                        )}

                        {isToday && med.status === 'Pending' && (
                          <button
                            onClick={() => confirmMedicineTaken(med.medicineId)}
                            className="text-teal-700 hover:text-teal-900 font-bold underline transition-colors"
                          >
                            Mark as Taken
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {selectedSchedule.filter((s) => s.status === 'Taken').length} of {selectedSchedule.length} doses confirmed
            </span>
            <button
              onClick={() => setIsAddMedicineOpen(true)}
              className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add for this date</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Medicine Modal connected with selectedCalendarDate */}
      {selectedPatient && (
        <AddMedicineModal
          isOpen={isAddMedicineOpen}
          onClose={() => setIsAddMedicineOpen(false)}
          patientId={selectedPatient.id}
          initialStartDate={selectedCalendarDate}
        />
      )}
    </div>
  );
};
