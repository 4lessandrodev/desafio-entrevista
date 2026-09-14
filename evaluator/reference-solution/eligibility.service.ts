import type {
  EligibilityReason,
  EligibilityResult,
} from '../models/patient.js';
import { NotFoundError } from '../errors/not-found.error.js';
import type { PatientRepository } from '../repositories/patient.repository.js';

export class EligibilityService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(patientId: string): Promise<EligibilityResult> {
    const patient = await this.patientRepository.findById(patientId);

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    const reasons: EligibilityReason[] = [];

    if (!patient.active) {
      reasons.push('INACTIVE_PATIENT');
    }

    if (!patient.hasValidDocument) {
      reasons.push('INVALID_DOCUMENT');
    }

    if (patient.exams.length === 0) {
      reasons.push('NO_EXAMS');
    }

    if (patient.exams.some((exam) => !exam.homeCareEligible)) {
      reasons.push('EXAM_NOT_ELIGIBLE');
    }

    return {
      patientId: patient.id,
      eligible: reasons.length === 0,
      reasons,
    };
  }
}
