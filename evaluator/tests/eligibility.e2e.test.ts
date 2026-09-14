import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import type { EligibilityResult } from '../src/models/patient.js';

describe('GET /api/patients/:patientId/eligibility', () => {
  const cases: Array<[string, EligibilityResult]> = [
    [
      'patient-001',
      { patientId: 'patient-001', eligible: true, reasons: [] },
    ],
    [
      'patient-002',
      {
        patientId: 'patient-002',
        eligible: false,
        reasons: ['EXAM_NOT_ELIGIBLE'],
      },
    ],
    [
      'patient-003',
      {
        patientId: 'patient-003',
        eligible: false,
        reasons: ['INACTIVE_PATIENT', 'NO_EXAMS'],
      },
    ],
    [
      'patient-004',
      {
        patientId: 'patient-004',
        eligible: false,
        reasons: ['INVALID_DOCUMENT'],
      },
    ],
  ];

  it.each(cases)('returns the expected result for %s', async (patientId, expectedBody) => {
    const response = await request(app).get(
      `/api/patients/${patientId}/eligibility`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedBody);
  });

  it('returns 404 for an unknown patient', async () => {
    const response = await request(app).get(
      '/api/patients/unknown/eligibility',
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Patient not found' });
  });
});
