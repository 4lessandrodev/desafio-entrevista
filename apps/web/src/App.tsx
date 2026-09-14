import { useState } from 'react';
import { EligibilityCard } from './components/EligibilityCard';

const patientIds = [
  'patient-001',
  'patient-002',
  'patient-003',
  'patient-004',
];

export function App() {
  const [patientId, setPatientId] = useState('patient-001');

  return (
    <main className="container">
      <h1>Desafio de Elegibilidade</h1>

      <div className="field">
        <label htmlFor="patient">Paciente</label>
        <select
          id="patient"
          value={patientId}
          onChange={(event) => setPatientId(event.target.value)}
        >
          {patientIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>

      <EligibilityCard key={patientId} patientId={patientId} />
    </main>
  );
}
