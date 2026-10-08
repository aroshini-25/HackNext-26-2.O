import React, { useState } from 'react';
import { useMedication } from '../../context/MedicationContext';
import { 
  Check, 
  Clock, 
  CheckCircle2, 
  Utensils, 
  ChevronLeft,
  Calendar
} from 'lucide-react';
import { ReminderModal } from './ReminderModal';
import { ConfirmationModal } from './ConfirmationModal';
import { PatientCalendarView } from './PatientCalendarView';

interface PatientDashboardProps {
  onSwitchToGuardianView?: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onSwitchToGuardianView }) => {
  const { 
    selectedPatient, 
    patientMedicines, 
    confirmMedicineTaken, 
    simulatedTime,
    activeReminder,
  } = useMedication();

  const [patientViewMode, setPatientViewMode] = useState<'medicines' | 'calendar'>('medicines');

  // Determine greeting based on simulated time
  const isMorning = simulatedTime.includes('AM');
  const greeting = isMorning ? 'Good Morning 👋' : 'Good Afternoon 👋';

  if (!selectedPatient) {
    return (
      <div className="p-8 text-center text-slate-500 text-xl">
        No patient selected. Please select a patient in the Guardian Dashboard.
      </div>
    );
  }

  // Count taken vs pending for today
  const totalMeds = patientMedicines.length;
  const takenMeds = patientMedicines.filter((m) => m.status === 'Taken').length;
  const pendingMeds = patientMedicines.filter((m) => m.status !== 'Taken').length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Simple View Switcher for Seniors */}
      <div className="flex items-center justify-center p-1.5 bg-white rounded-3xl border-3 border-teal-600/30 shadow-md max-w-lg mx-auto">
        <button
          onClick={() => setPatientViewMode('medicines')}
          className={`flex-1 py-3.5 px-5 rounded-2xl text-lg font-black transition-all cursor-pointer ${
            patientViewMode === 'medicines'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          💊 Take Medicines
        </button>
        <button
          onClick={() => setPatientViewMode('calendar')}
          className={`flex-1 py-3.5 px-5 rounded-2xl text-lg font-black transition-all cursor-pointer ${
            patientViewMode === 'calendar'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          📅 Daily Calendar
        </button>
      </div>

      {patientViewMode === 'calendar' ? (
        <PatientCalendarView />
      ) : (
        <>
          {/* Top Banner & Greeting - Extra Large Fonts for Seniors */}
          <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {selectedPatient.photoUrl ? (
                  <img
                    src={selectedPatient.photoUrl}
                    alt={selectedPatient.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-3 border-teal-300 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-teal-600 text-white flex items-center justify-center font-bold text-3xl shadow-inner shrink-0">
                    👤
                  </div>
                )}
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-teal-200">
                    {greeting}
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mt-1">
                    {selectedPatient.name}
                  </h1>
                  <p className="text-base sm:text-lg text-teal-100/90 font-medium mt-1">
                    Age: {selectedPatient.age} · Today's Medicine Schedule
                  </p>
                </div>
              </div>

              {/* Quick Progress Badge */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center sm:text-right shrink-0">
                <span className="text-xs uppercase tracking-wider font-bold text-teal-200 block">
                  Today's Progress
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1 font-mono tabular-nums">
                  {takenMeds} / {totalMeds}
                </div>
                <span className="text-sm text-teal-100 font-medium">
                  {pendingMeds === 0 ? '🎉 All medicines taken!' : `${pendingMeds} remaining`}
                </span>
              </div>
            </div>

            {/* Big Friendly Indicator */}
            <div className="mt-6 pt-6 border-t border-teal-600/60 flex flex-wrap items-center justify-between gap-4 text-teal-100">
              <div className="flex items-center gap-2 text-lg sm:text-xl font-bold font-mono">
                <Clock className="w-6 h-6 text-teal-300" />
                <span>Current Time: {simulatedTime}</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPatientViewMode('calendar')}
                  className="text-sm font-bold text-teal-200 hover:text-white underline underline-offset-4 flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>View Daily Calendar</span>
                </button>
                {onSwitchToGuardianView && (
                  <button
                    onClick={onSwitchToGuardianView}
                    className="text-sm font-semibold text-teal-200 hover:text-white underline underline-offset-4 flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Guardian Dashboard</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section Title: "YOUR MEDICINE" */}
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-wide uppercase">
                YOUR MEDICINE
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 font-medium mt-1">
                Tap the green button when you have taken your dose
              </p>
            </div>
          </div>

          {/* Very Large Medicine Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {patientMedicines.map((med) => {
              const isTaken = med.status === 'Taken';
              const isDue = activeReminder?.medicineId === med.id || (!isTaken && med.time === simulatedTime);

              return (
                <div
                  key={med.id}
                  className={`rounded-3xl p-6 sm:p-8 border-4 transition-all flex flex-col justify-between text-center ${
                    isDue
                      ? 'bg-amber-50/80 border-amber-500 shadow-2xl animate-gentle-pulse ring-4 ring-amber-300/40'
                      : isTaken
                      ? 'bg-emerald-50/40 border-emerald-400 shadow-md'
                      : 'bg-white border-slate-300 hover:border-slate-400 shadow-lg'
                  }`}
                >
                  <div className="space-y-5">
                    {/* Medicine Visual / Image */}
                    <div className="flex justify-center">
                      {med.photoUrl ? (
                        <img
                          src={med.photoUrl}
                          alt={med.name}
                          className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-slate-200 shadow-md"
                        />
                      ) : (
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-teal-50 border-2 border-teal-200 text-teal-700 flex items-center justify-center text-5xl shadow-sm">
                          💊
                        </div>
                      )}
                    </div>

                    {/* Medicine Name - Very Large */}
                    <div>
                      <h3 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                        {med.name}
                      </h3>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-base sm:text-lg font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                        <Utensils className="w-4 h-4 text-slate-500" />
                        <span>{med.foodTiming}</span>
                      </div>
                    </div>

                    {/* Dosage & Quantity details */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Dose: <span className="text-teal-700">{med.dose}</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Take: <span className="text-indigo-800">{med.tabletsCount}</span>
                      </div>
                    </div>

                    {/* Scheduled Time */}
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-mono tabular-nums flex items-center justify-center gap-2">
                      <Clock className="w-7 h-7 text-teal-600" />
                      <span>⏰ {med.time}</span>
                    </div>

                    {/* Status Indicator */}
                    <div className="py-2">
                      {isTaken ? (
                        <div className="bg-emerald-100 border-2 border-emerald-400 rounded-2xl py-3 px-4 text-emerald-950">
                          <div className="text-2xl font-black flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-7 h-7 text-emerald-700 stroke-[3]" />
                            <span>🟢 TAKEN</span>
                          </div>
                          {med.takenAt && (
                            <p className="text-base font-bold text-emerald-800 mt-1 font-mono">
                              Taken at: {med.takenAt}
                            </p>
                          )}
                        </div>
                      ) : isDue ? (
                        <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl py-3 px-4 text-amber-950">
                          <div className="text-2xl font-black animate-pulse">
                            🔔 TIME TO TAKE NOW!
                          </div>
                          <p className="text-sm font-semibold text-amber-800 mt-0.5">
                            Scheduled reminder active
                          </p>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl py-3 px-4 text-amber-950">
                          <div className="text-2xl font-black">
                            🟡 WAITING
                          </div>
                          <p className="text-sm font-semibold text-amber-800 mt-0.5">
                            Scheduled for {med.time}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button - Giant and prominent */}
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    {isTaken ? (
                      <button
                        disabled
                        className="w-full py-4 px-4 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-xl sm:text-2xl border-2 border-emerald-300 flex items-center justify-center gap-2 cursor-default opacity-90"
                      >
                        <Check className="w-7 h-7 stroke-[3]" />
                        <span>ALREADY TAKEN</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => confirmMedicineTaken(med.id)}
                        className="w-full py-5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-2xl sm:text-3xl shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer border-2 border-emerald-400"
                      >
                        <Check className="w-8 h-8 stroke-[3]" />
                        <span>I TOOK THIS</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Senior Help Guidance Box */}
          <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200 text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl shrink-0">
                🛡️
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  Need assistance or feeling unwell?
                </h4>
                <p className="text-base text-slate-600">
                  Your guardian Ananya is monitoring your medicine schedule in real-time.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <a
                href="tel:+919876512345"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-2xl shadow-md transition-colors"
              >
                <span>Call Guardian (Ananya)</span>
              </a>
            </div>
          </div>
        </>
      )}

      {/* Prominent Reminder Modal & Confirmation Modals */}
      <ReminderModal />
      <ConfirmationModal />
    </div>
  );
};
