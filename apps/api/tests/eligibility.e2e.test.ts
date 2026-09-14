import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('GET /api/patients/:patientId/eligibility', () => {
  it('returns an eligible patient', async () => {
    const response = await request(app).get(
      '/api/patients/patient-001/eligibility',
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      patientId: 'patient-001',
      eligible: true,
      reasons: [],
    });
  });
});
