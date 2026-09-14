import type { NextFunction, Request, Response } from 'express';
import type { EligibilityService } from '../services/eligibility.service.js';

export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  execute = async (
    request: Request<{ patientId: string }>,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.eligibilityService.execute(
        request.params.patientId,
      );

      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
