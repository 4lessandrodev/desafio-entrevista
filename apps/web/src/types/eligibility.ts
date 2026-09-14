export type EligibilityReason =
  | 'INACTIVE_PATIENT'
  | 'INVALID_DOCUMENT'
  | 'NO_EXAMS'
  | 'EXAM_NOT_ELIGIBLE';

export interface EligibilityResponse {
  patientId: string;
  eligible: boolean;
  reasons: EligibilityReason[];
}
