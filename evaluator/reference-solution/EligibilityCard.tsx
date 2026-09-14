import { useState } from 'react';
import { getEligibility } from '../services/eligibility-api';
import type { EligibilityResponse } from '../types/eligibility';

interface Props {
  patientId: string;
}

export function EligibilityCard({ patientId }: Props) {
  const [result, setResult] = useState<EligibilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleCheckEligibility() {
    setIsLoading(true);
    setHasError(false);
    setResult(null);

    try {
      setResult(await getEligibility(patientId));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <button
        type="button"
        disabled={isLoading}
        onClick={handleCheckEligibility}
      >
        {isLoading
          ? 'Verificando elegibilidade...'
          : 'Verificar elegibilidade'}
      </button>

      <div aria-live="polite">
        {result && (
          <p>
            {result.eligible
              ? 'Paciente elegível para atendimento domiciliar.'
              : 'Paciente não elegível para atendimento domiciliar.'}
          </p>
        )}
        {hasError && <p>Não foi possível verificar a elegibilidade.</p>}
      </div>
    </section>
  );
}
