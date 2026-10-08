import React, { useState } from 'react';
import { useMedication } from '../../context/MedicationContext';
import { X, Pill, Clock, Hash, Utensils, Repeat, FileText, Image } from 'lucide-react';
import { FoodTiming, Frequency } from '../../types';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  initialStartDate?: string;
}

const COMMON_TIMES = ['07:00 AM', '08:00 AM', '09:00 AM', '12:30 PM', '01:00 PM', '06:00 PM', '08:00 PM', '09:30 PM'];
const COMMON_DOSES = ['2.5 mg', '5 mg', '10 mg', '20 mg', '50 mg', '100 mg', '250 mg', '500 mg', '1000 IU'];
const COMMON_QUANTITIES = ['1 tablet', '2 tablets', '1 capsule', '2 capsules', '5 ml', '10 ml', '1 puff'];

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ 
  isOpen, 
  onClose, 
  patientId, 
  initialStartDate 
}) => {
  const { addMedicine, currentDateString } = useMedication();

  const [name, setName] = useState('');
  const [dose, setDose] = useState('5 mg');
  const [tabletsCount, setTabletsCount] = useState('1 tablet');
  const [time, setTime] = useState('08:00 AM');
  const [frequency, setFrequency] = useState<Frequency>('Daily');
  const [foodTiming, setFoodTiming] = useState<FoodTiming>('After food');
  const [photoUrl, setPhotoUrl] = useState('');
  const [startDate, setStartDate] = useState(initialStartDate || '2026-10-08');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    if (initialStartDate) {
      setStartDate(initialStartDate);
    }
  }, [initialStartDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Medicine name is required';
    if (!dose.trim()) newErrors.dose = 'Dose is required';
    if (!tabletsCount.trim()) newErrors.tabletsCount = 'Tablets quantity is required';
    if (!time.trim()) newErrors.time = 'Time is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addMedicine({
      patientId,
      name: name.trim(),
      dose: dose.trim(),
      tabletsCount: tabletsCount.trim(),
      time: time.trim(),
      frequency,
      foodTiming,
      photoUrl: photoUrl.trim() || undefined,
      startDate: startDate || currentDateString,
      endDate: endDate.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
    setName('');
    setDose('5 mg');
    setTabletsCount('1 tablet');
    setTime('08:00 AM');
    setPhotoUrl('');
    setStartDate(initialStartDate || '2026-10-08');
    setEndDate('');
    setNotes('');
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-add-med-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-700">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-add-med-title" className="text-lg font-bold text-slate-900">Add Medicine Prescription</h2>
              <p className="text-xs text-slate-500">Configure dosage, schedule timing, and dietary instructions</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Medicine Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Medicine Name *
            </label>
            <div className="relative">
              <Pill className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder="e.g. Amlodipine, Metformin, Lisinopril"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.name ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100'
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Dose and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Dose *
              </label>
              <input
                type="text"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="e.g. 5 mg"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
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
                Quantity (Number of Tablets) *
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={tabletsCount}
                  onChange={(e) => setTabletsCount(e.target.value)}
                  placeholder="e.g. 1 tablet"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_QUANTITIES.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setTabletsCount(q)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time & Frequency */}
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
                  placeholder="e.g. 08:00 AM"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
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
                Frequency *
              </label>
              <div className="relative">
                <Repeat className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as Frequency)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="Daily">Daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="Weekly">Weekly</option>
                  <option value="As needed">As needed (SOS)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Food Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Food Relationship *
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

          {/* Schedule Duration: Start Date & End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-mono"
              />
            </div>
          </div>

          {/* Optional Photo URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Medicine Photo URL (Optional)
            </label>
            <div className="relative">
              <Image className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="/src/assets/... or image URL"
                className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Instructions / Notes
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Swallow with warm water after morning meal"
                className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          {/* Actions */}
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
              Save Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
