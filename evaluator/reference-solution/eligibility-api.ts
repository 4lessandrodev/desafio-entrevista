import type { EligibilityResponse } from '../types/eligibility';

export async function getEligibility(
  patientId: string,
): Promise<EligibilityResponse> {
  const response = await fetch(
    `/api/patients/${encodeURIComponent(patientId)}/eligibility`,
  );

  if (!response.ok) {
    throw new Error('Unable to fetch eligibility');
  }

  return response.json() as Promise<EligibilityResponse>;
}
