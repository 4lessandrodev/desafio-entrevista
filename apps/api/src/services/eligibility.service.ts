import type { EligibilityResult } from '../models/patient.js';
import { NotFoundError } from '../errors/not-found.error.js';
import type { PatientRepository } from '../repositories/patient.repository.js';

export class EligibilityService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(patientId: string): Promise<EligibilityResult> {
    const patient = await this.patientRepository.findById(patientId);

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // TODO: implementar regra de elegibilidade.

    throw new Error('Not implemented');
  }
}
