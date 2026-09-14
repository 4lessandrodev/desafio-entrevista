export type EligibilityReason =
  | 'INACTIVE_PATIENT'
  | 'INVALID_DOCUMENT'
  | 'NO_EXAMS'
  | 'EXAM_NOT_ELIGIBLE';

export interface Exam {
  code: string;
  homeCareEligible: boolean;
}

export interface Patient {
  id: string;
  active: boolean;
  hasValidDocument: boolean;
  exams: Exam[];
}

export interface EligibilityResult {
  patientId: string;
  eligible: boolean;
  reasons: EligibilityReason[];
}
