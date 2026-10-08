import React, { useState } from 'react';
import { useMedication } from '../../context/MedicationContext';
import { 
  UserPlus, 
  Plus, 
  Pill, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Edit3, 
  Trash2, 
  Phone, 
  Utensils, 
  Repeat, 
  LayoutGrid, 
  Table as TableIcon,
  Search,
  BellRing,
  Heart,
  ChevronRight
} from 'lucide-react';
import { AddPatientModal } from './AddPatientModal';
import { AddMedicineModal } from './AddMedicineModal';
import { EditMedicineModal } from './EditMedicineModal';
import { GuardianCalendar } from './GuardianCalendar';
import { Medicine } from '../../types';

interface GuardianDashboardProps {
  onSwitchToPatientView?: () => void;
}

export const GuardianDashboard: React.FC<GuardianDashboardProps> = ({ onSwitchToPatientView }) => {
  const {
    patients,
    selectedPatient,
    selectedPatientId,
    selectPatient,
    guardian,
    stats,
    patientMedicines,
    deleteMedicine,
    confirmMedicineTaken,
    triggerTestReminder,
  } = useMedication();

  const [activeSection, setActiveSection] = useState<'calendar' | 'prescriptions'>('calendar');
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [viewLayout, setViewLayout] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Taken' | 'Pending'>('all');

  // Filtered medicines for selected patient
  const filteredMedicines = patientMedicines.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          med.dose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'Taken' 
        ? med.status === 'Taken' 
        : (med.status === 'Pending' || med.status === 'Upcoming');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Top Header & Guardian Identity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              {guardian.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  Active Caregiver
                </span>
                <span className="text-xs text-slate-400">· {guardian.relationship}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{guardian.name}</h1>
              <p className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{guardian.role}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-xs">{guardian.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onSwitchToPatientView && (
              <button
                onClick={onSwitchToPatientView}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors border border-teal-200/60"
              >
                <span>View as Patient</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsAddPatientOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100">
          {/* Total Patients */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Total Patients
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {stats.totalPatients}
              </span>
              <span className="text-xs text-slate-400">Registered</span>
            </div>
          </div>

          {/* Today's Medicines */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
              Today's Medicines
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {stats.todayMedicines}
              </span>
              <span className="text-xs text-slate-400">Prescriptions</span>
            </div>
          </div>

          {/* Taken Medicines */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-xs font-medium text-emerald-800 uppercase tracking-wider block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Taken Medicines
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                {stats.takenMedicines}
              </span>
              <span className="text-xs text-emerald-600/80">
                {stats.todayMedicines > 0
                  ? `${Math.round((stats.takenMedicines / stats.todayMedicines) * 100)}% adherence`
                  : '0%'}
              </span>
            </div>
          </div>

          {/* Pending Medicines */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
            <span className="text-xs font-medium text-amber-800 uppercase tracking-wider block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Pending Medicines
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
                {stats.pendingMedicines}
              </span>
              <span className="text-xs text-amber-600/80">Awaiting dose</span>
            </div>
          </div>

          {/* Missed Medicines */}
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 col-span-2 md:col-span-1">
            <span className="text-xs font-medium text-rose-800 uppercase tracking-wider block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Missed Medicines
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-rose-700 font-mono tabular-nums">
                {stats.missedMedicines}
              </span>
              <span className="text-xs text-rose-600/80">Overdue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Patients Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Patients Under Your Care</h2>
            <p className="text-xs text-slate-500">Select a patient card to manage prescriptions and schedules</p>
          </div>
          <button
            onClick={() => setIsAddPatientOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Patient</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => {
            const isSelected = patient.id === selectedPatientId;
            const patientMeds = patientMedicines.filter((m) => m.patientId === patient.id);
            const takenCount = patientMeds.filter((m) => m.status === 'Taken').length;
            const pendingCount = patientMeds.filter((m) => m.status === 'Pending' || m.status === 'Upcoming').length;

            return (
              <div
                key={patient.id}
                onClick={() => selectPatient(patient.id)}
                className={`relative cursor-pointer rounded-2xl p-5 border transition-all text-left ${
                  isSelected
                    ? 'bg-teal-50/40 border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {patient.photoUrl ? (
                      <img
                        src={patient.photoUrl}
                        alt={patient.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
                        {patient.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">👤 {patient.name}</h3>
                        {isSelected && (
                          <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">Age: {patient.age} · {patient.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Patient Summary Card Stats */}
                <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span>💊</span>
                    <span>{patientMeds.length} Medicines</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <span>🟢</span> {takenCount} Taken
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-amber-700">
                      <span>🟡</span> {pendingCount} Pending
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Navigation Tabs: 📅 Calendar & History | 💊 Prescriptions */}
      {selectedPatient && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveSection('calendar')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'calendar'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>📅 Calendar & History</span>
            </button>

            <button
              onClick={() => setActiveSection('prescriptions')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'prescriptions'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-4 h-4 text-teal-600" />
              <span>💊 All Prescriptions ({patientMedicines.length})</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 px-3">
            Active Patient: <strong className="text-slate-800">{selectedPatient.name}</strong> (Age: {selectedPatient.age})
          </div>
        </div>
      )}

      {/* Render Calendar Section */}
      {selectedPatient && activeSection === 'calendar' && (
        <GuardianCalendar />
      )}

      {/* Selected Patient Medicine Management Section */}
      {selectedPatient && activeSection === 'prescriptions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Header of Medicine Management */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Prescription Schedule
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-medium text-teal-700">Patient: {selectedPatient.name}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Medicine Management for {selectedPatient.name}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Layout Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewLayout('table')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewLayout === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Table layout"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewLayout('cards')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewLayout === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Card layout"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Add Medicine Button */}
              <button
                onClick={() => setIsAddMedicineOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medicine</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicine name or dose..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filter:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All ({patientMedicines.length})
                </button>
                <button
                  onClick={() => setStatusFilter('Taken')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    statusFilter === 'Taken' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Taken ({patientMedicines.filter((m) => m.status === 'Taken').length})
                </button>
                <button
                  onClick={() => setStatusFilter('Pending')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    statusFilter === 'Pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Pending ({patientMedicines.filter((m) => m.status !== 'Taken').length})
                </button>
              </div>
            </div>
          </div>

          {/* Schedule Table View */}
          {viewLayout === 'table' ? (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Medicine</th>
                    <th className="py-3 px-4">Dose & Qty</th>
                    <th className="py-3 px-4">Scheduled Time</th>
                    <th className="py-3 px-4">Food Instructions</th>
                    <th className="py-3 px-4">Frequency</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Confirmation Log</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMedicines.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No medicines match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredMedicines.map((med) => {
                      const isTaken = med.status === 'Taken';
                      return (
                        <tr key={med.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            <div className="flex items-center gap-3">
                              {med.photoUrl ? (
                                <img
                                  src={med.photoUrl}
                                  alt={med.name}
                                  className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                                  <Pill className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <span className="text-slate-900 block font-bold">{med.name}</span>
                                {med.notes && (
                                  <span className="text-[11px] text-slate-400 block max-w-xs truncate">
                                    {med.notes}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-slate-900 font-medium">{med.dose}</div>
                            <div className="text-xs text-slate-500">{med.tabletsCount}</div>
                          </td>

                          <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-slate-800">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {med.time}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-xs">
                            <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded-md font-medium">
                              <Utensils className="w-3 h-3 text-slate-400" />
                              {med.foodTiming}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                            {med.frequency}
                          </td>

                          <td className="py-3.5 px-4">
                            {isTaken ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                🟢 Taken
                              </span>
                            ) : med.status === 'Upcoming' ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                                <Clock className="w-3.5 h-3.5 text-blue-600" />
                                🔵 Upcoming
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                🟡 Pending
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-xs">
                            {isTaken ? (
                              <div className="text-emerald-800 font-semibold font-mono">
                                Taken at {med.takenAt || med.time}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Awaiting confirmation</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!isTaken && (
                                <button
                                  onClick={() => triggerTestReminder(med.id)}
                                  className="p-1 text-slate-400 hover:text-teal-600 transition-colors"
                                  title="Test reminder chime"
                                >
                                  <BellRing className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => setEditingMedicine(med)}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteMedicine(med.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedicines.map((med) => {
                const isTaken = med.status === 'Taken';
                return (
                  <div
                    key={med.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isTaken
                        ? 'bg-emerald-50/20 border-emerald-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {med.photoUrl ? (
                            <img
                              src={med.photoUrl}
                              alt={med.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                              <Pill className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{med.name}</h4>
                            <p className="text-xs text-slate-500">{med.foodTiming}</p>
                          </div>
                        </div>

                        <div>
                          {isTaken ? (
                            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                              🟢 Taken
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                              🟡 Pending
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details specs */}
                      <div className="mt-4 space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Dose:</span>
                          <span className="font-semibold text-slate-900">{med.dose}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Quantity:</span>
                          <span className="font-semibold text-slate-900">{med.tabletsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Time:</span>
                          <span className="font-mono tabular-nums font-semibold text-slate-900">{med.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Frequency:</span>
                          <span className="font-medium text-slate-800">{med.frequency}</span>
                        </div>
                        {isTaken && med.takenAt && (
                          <div className="flex justify-between pt-1 border-t border-slate-200/60 text-emerald-800 font-semibold">
                            <span>Taken at:</span>
                            <span className="font-mono">{med.takenAt}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingMedicine(med)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMedicine(med.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>

                      {!isTaken && (
                        <button
                          onClick={() => triggerTestReminder(med.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <BellRing className="w-3.5 h-3.5" />
                          <span>Test Alert</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
      />

      {selectedPatient && (
        <AddMedicineModal
          isOpen={isAddMedicineOpen}
          onClose={() => setIsAddMedicineOpen(false)}
          patientId={selectedPatient.id}
        />
      )}

      <EditMedicineModal
        isOpen={!!editingMedicine}
        onClose={() => setEditingMedicine(null)}
        medicine={editingMedicine}
      />
    </div>
  );
};
