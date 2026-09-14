import type { Patient } from '../models/patient.js';

export interface PatientRepository {
  findById(patientId: string): Promise<Patient | null>;
}

const patients: Patient[] = [
  {
    id: 'patient-001',
    active: true,
    hasValidDocument: true,
    exams: [
      { code: 'HMG', homeCareEligible: true },
      { code: 'GLI', homeCareEligible: true },
    ],
  },
  {
    id: 'patient-002',
    active: true,
    hasValidDocument: true,
    exams: [
      { code: 'HMG', homeCareEligible: true },
      { code: 'RX', homeCareEligible: false },
    ],
  },
  {
    id: 'patient-003',
    active: false,
    hasValidDocument: true,
    exams: [],
  },
  {
    id: 'patient-004',
    active: true,
    hasValidDocument: false,
    exams: [{ code: 'HMG', homeCareEligible: true }],
  },
];

export class InMemoryPatientRepository implements PatientRepository {
  async findById(patientId: string): Promise<Patient | null> {
    return patients.find((patient) => patient.id === patientId) ?? null;
  }
}
