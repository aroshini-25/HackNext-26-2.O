import React from 'react';
import { useMedication } from '../context/MedicationContext';
import { Shield, User, Pill } from 'lucide-react';

export type ActiveView = 'guardian' | 'patient';

interface NavigationProps {
  currentView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const { patients, selectedPatientId, selectPatient, activeReminder } = useMedication();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
              <Pill className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                CareSync
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-none">
                Medication Management System
              </span>
            </div>
          </div>

          {/* Central Segmented View Switcher: Guardian Dashboard | Patient Dashboard */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onViewChange('guardian')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                currentView === 'guardian'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              <span>Guardian Dashboard</span>
            </button>

            <button
              onClick={() => onViewChange('patient')}
              className={`relative flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                currentView === 'patient'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Patient Dashboard</span>
              {activeReminder && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping absolute -top-0.5 -right-0.5"></span>
              )}
            </button>
          </div>

          {/* Patient Selector Dropdown */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-400">Viewing Patient:</span>
              <select
                value={selectedPatientId}
                onChange={(e) => selectPatient(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    👤 {p.name} (Age: {p.age})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
