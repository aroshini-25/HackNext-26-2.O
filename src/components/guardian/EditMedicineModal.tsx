import React, { useState, useEffect } from 'react';
import { useMedication } from '../../context/MedicationContext';
import { X, Pill, Clock, Hash, Utensils, Repeat, FileText, Image } from 'lucide-react';
import { Medicine, FoodTiming, Frequency, MedicineStatus } from '../../types';

interface EditMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
}

const COMMON_TIMES = ['07:00 AM', '08:00 AM', '09:00 AM', '12:30 PM', '01:00 PM', '06:00 PM', '08:00 PM', '09:30 PM'];
const COMMON_DOSES = ['2.5 mg', '5 mg', '10 mg', '20 mg', '50 mg', '100 mg', '250 mg', '500 mg', '1000 IU'];

export const EditMedicineModal: React.FC<EditMedicineModalProps> = ({ isOpen, onClose, medicine }) => {
  const { updateMedicine } = useMedication();

  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [tabletsCount, setTabletsCount] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('Daily');
  const [foodTiming, setFoodTiming] = useState<FoodTiming>('After food');
  const [status, setStatus] = useState<MedicineStatus>('Pending');
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (medicine) {
      setName(medicine.name);
      setDose(medicine.dose);
      setTabletsCount(medicine.tabletsCount);
      setTime(medicine.time);
      setFrequency(medicine.frequency);
      setFoodTiming(medicine.foodTiming);
      setStatus(medicine.status);
      setPhotoUrl(medicine.photoUrl || '');
      setNotes(medicine.notes || '');
    }
  }, [medicine]);

  if (!isOpen || !medicine) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMedicine(medicine.id, {
      name: name.trim(),
      dose: dose.trim(),
      tabletsCount: tabletsCount.trim(),
      time: time.trim(),
      frequency,
      foodTiming,
      status,
      photoUrl: photoUrl.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-edit-med-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-700">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-edit-med-title" className="text-lg font-bold text-slate-900">Edit Medicine</h2>
              <p className="text-xs text-slate-500">Update dose, time schedule, or dietary instructions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Medicine Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Dose *
              </label>
              <input
                type="text"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_DOSES.slice(0, 4).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDose(d)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tablets Quantity *
              </label>
              <input
                type="text"
                value={tabletsCount}
                onChange={(e) => setTabletsCount(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Scheduled Time *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_TIMES.slice(0, 4).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MedicineStatus)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                <option value="Pending">🟡 Pending</option>
                <option value="Taken">🟢 Taken</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Missed">🔴 Missed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Food Relationship
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['After food', 'Before food', 'With food', 'Empty stomach'] as FoodTiming[]).map((ft) => (
                <button
                  key={ft}
                  type="button"
                  onClick={() => setFoodTiming(ft)}
                  className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition-all ${
                    foodTiming === ft
                      ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold ring-1 ring-teal-500'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {ft}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Instructions / Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
            >
              Update Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
