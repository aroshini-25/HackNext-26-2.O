import React from 'react';
import { useMedication } from '../../context/MedicationContext';
import { Bell, Check, Clock, Pill, AlertTriangle, FastForward } from 'lucide-react';

export const ReminderModal: React.FC = () => {
  const { 
    activeReminder, 
    confirmMedicineTaken, 
    medicines,
    twoMinuteCountdown,
    fastForwardTwoMinutes
  } = useMedication();

  if (!activeReminder) return null;

  const currentMed = medicines.find((m) => m.id === activeReminder.medicineId);
  const minutesLeft = Math.floor(twoMinuteCountdown / 60);
  const secondsLeft = twoMinuteCountdown % 60;
  const formattedCountdown = `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="reminder-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden animate-gentle-pulse">
        {/* Urgent Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-3 shadow-inner">
            <Bell className="w-12 h-12 text-white animate-bounce" />
          </div>
          <h2 id="reminder-title" className="text-3xl sm:text-4xl font-extrabold tracking-wide uppercase">
            🔔 MEDICINE TIME
          </h2>
          <p className="text-xl sm:text-2xl font-medium text-amber-100 mt-1">
            It is time to take:
          </p>
        </div>

        {/* Medicine Details - Extra Large for Seniors */}
        <div className="p-8 sm:p-10 space-y-6 text-center bg-amber-50/30">
          {/* Medicine Name */}
          <div className="flex flex-col items-center justify-center gap-3">
            {currentMed?.photoUrl ? (
              <img
                src={currentMed.photoUrl}
                alt={activeReminder.medicineName}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-300 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-4xl shadow-inner">
                💊
              </div>
            )}
            <h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {activeReminder.medicineName}
            </h3>
          </div>

          {/* Dose and Tablet details in huge, clear text */}
          <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-800">
              Dose: <span className="text-teal-700">{activeReminder.dose}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800">
              Take: <span className="text-indigo-700">{activeReminder.tabletsCount}</span>
            </div>
            <div className="inline-flex items-center gap-2 text-2xl font-extrabold text-amber-900 bg-amber-100/80 px-5 py-2 rounded-xl mt-2 font-mono tabular-nums">
              <Clock className="w-6 h-6 text-amber-700" />
              <span>⏰ {activeReminder.time}</span>
            </div>
          </div>

          {/* 2-Minute Recurring Cycle Live Indicator */}
          <div className="bg-amber-100/60 border border-amber-300/80 rounded-2xl p-4 text-left">
            <div className="flex items-center justify-between text-sm sm:text-base font-semibold text-amber-900">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Active Reminder Cycle #{activeReminder.reminderCycle}</span>
              </span>
              <span className="font-mono text-xs bg-amber-200/80 px-2.5 py-1 rounded-md text-amber-950 font-bold">
                Repeats in {formattedCountdown}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-800/90 mt-1">
              Repeating alarm fires every <strong>2 minutes</strong> until confirmed.
            </p>
            <div className="mt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={fastForwardTwoMinutes}
                className="text-xs text-amber-900 underline font-semibold flex items-center gap-1 hover:text-amber-950"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Simulate next 2-min reminder chime</span>
              </button>
            </div>
          </div>

          {/* Giant, Impossible-to-Miss Action Button */}
          <div className="pt-2">
            <button
              onClick={() => confirmMedicineTaken(activeReminder.medicineId)}
              className="w-full py-5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-extrabold text-2xl sm:text-3xl shadow-xl flex items-center justify-center gap-4 transition-all cursor-pointer border-2 border-emerald-400"
            >
              <Check className="w-9 h-9 stroke-[3]" />
              <span>✓ I TOOK THIS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
