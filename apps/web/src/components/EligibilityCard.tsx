import { useState } from 'react';
import { getEligibility } from '../services/eligibility-api';
import type { EligibilityResponse } from '../types/eligibility';

interface Props {
  patientId: string;
}

export function EligibilityCard({ patientId }: Props) {
  // TODO: implementar estados e integração com a API.

  return (
    <section>
      <button type="button">Verificar elegibilidade</button>
    </section>
  );
}
