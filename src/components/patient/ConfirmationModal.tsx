import React from 'react';
import { useMedication } from '../../context/MedicationContext';
import { CheckCircle2, X } from 'lucide-react';

export const ConfirmationModal: React.FC = () => {
  const { recentlyConfirmedMed, closeConfirmationModal } = useMedication();

  if (!recentlyConfirmedMed) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-emerald-500 overflow-hidden text-center">
        {/* Top Celebration Banner */}
        <div className="bg-emerald-600 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-3 shadow-inner">
            <CheckCircle2 className="w-16 h-16 text-white stroke-[2.5]" />
          </div>
          <h2 id="confirm-modal-title" className="text-3xl sm:text-4xl font-black uppercase tracking-wide">
            ✅ MEDICINE TAKEN
          </h2>
        </div>

        {/* Medicine Details matching the prompt */}
        <div className="p-8 sm:p-10 space-y-6 bg-emerald-50/40">
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-sm space-y-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {recentlyConfirmedMed.name}
            </h3>
            <p className="text-2xl font-bold text-teal-800">
              {recentlyConfirmedMed.dose}
            </p>
            <p className="text-2xl font-mono tabular-nums font-bold text-slate-700">
              {recentlyConfirmedMed.time}
            </p>
          </div>

          <div className="bg-emerald-100/70 border border-emerald-300 rounded-xl p-4">
            <p className="text-xl sm:text-2xl font-bold text-emerald-950">
              Your medicine has been marked as taken.
            </p>
            <p className="text-sm font-medium text-emerald-800 mt-1">
              Recorded at <span className="font-mono font-bold">{recentlyConfirmedMed.takenAt || recentlyConfirmedMed.time}</span>. Guardian dashboard updated automatically.
            </p>
          </div>

          <button
            onClick={closeConfirmationModal}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xl shadow-lg transition-colors cursor-pointer"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
};
