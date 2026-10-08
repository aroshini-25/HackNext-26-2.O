import { Patient, Medicine, Guardian, DateDoseLog } from '../types';

const BASE_URL = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  // Guardian
  getGuardian: () => request<Guardian>('/guardian'),

  // Patients
  getPatients: () => request<Patient[]>('/patients'),
  createPatient: (data: Partial<Patient> & { name: string; age: number; phone: string }) =>
    request<Patient>('/patients', { method: 'POST', body: JSON.stringify(data) }),

  // Medicines
  getMedicines: (patientId?: string) =>
    request<Medicine[]>(`/medicines${patientId ? `?patientId=${encodeURIComponent(patientId)}` : ''}`),
  createMedicine: (data: Partial<Medicine>) =>
    request<Medicine>('/medicines', { method: 'POST', body: JSON.stringify(data) }),
  updateMedicine: (id: string, updates: Partial<Medicine>) =>
    request<Medicine>(`/medicines/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  deleteMedicine: (id: string) =>
    request<{ ok: boolean }>(`/medicines/${id}`, { method: 'DELETE' }),
  confirmMedicine: (id: string, data: { takenAt: string; date: string; patientId?: string }) =>
    request<{ medicine: Medicine; log: DateDoseLog }>(`/medicines/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Dose logs
  getLogs: (params?: { patientId?: string; date?: string }) => {
    const qs = new URLSearchParams();
    if (params?.patientId) qs.set('patientId', params.patientId);
    if (params?.date) qs.set('date', params.date);
    const q = qs.toString();
    return request<DateDoseLog[]>(`/logs${q ? `?${q}` : ''}`);
  },

  // Reset
  resetData: () =>
    request<{ patients: Patient[]; medicines: Medicine[]; guardian: Guardian }>('/reset', {
      method: 'POST',
    }),
};