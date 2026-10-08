import React, { useState } from 'react';
import { MedicationProvider } from './context/MedicationContext';
import { Navigation, ActiveView } from './components/Navigation';
import { GuardianDashboard } from './components/guardian/GuardianDashboard';
import { PatientDashboard } from './components/patient/PatientDashboard';

function MedicationApp() {
  const [activeView, setActiveView] = useState<ActiveView>('guardian');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header & View Switcher */}
      <Navigation
        currentView={activeView}
        onViewChange={(view) => setActiveView(view)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'guardian' ? (
          <GuardianDashboard
            onSwitchToPatientView={() => setActiveView('patient')}
          />
        ) : (
          <PatientDashboard
            onSwitchToGuardianView={() => setActiveView('guardian')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            CareSync Medication Management System · Built for high reliability and senior accessibility.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Prototype Version 1.0</span>
            <span aria-hidden="true">·</span>
            <span>Frontend State Sync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <MedicationProvider>
      <MedicationApp />
    </MedicationProvider>
  );
}
