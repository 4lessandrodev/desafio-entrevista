import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getEligibility } from '../services/eligibility-api';
import { EligibilityCard } from './EligibilityCard';

vi.mock('../services/eligibility-api', () => ({
  getEligibility: vi.fn(),
}));

const getEligibilityMock = vi.mocked(getEligibility);

afterEach(() => {
  vi.clearAllMocks();
});

describe('EligibilityCard', () => {
  it('shows and disables the action while loading', async () => {
    getEligibilityMock.mockReturnValue(new Promise<never>(() => undefined));
    const user = userEvent.setup();
    render(<EligibilityCard patientId="patient-001" />);

    const button = screen.getByRole('button', {
      name: 'Verificar elegibilidade',
    });
    await user.click(button);

    expect(
      screen.getByRole('button', { name: 'Verificando elegibilidade...' }),
    ).toBeDisabled();
  });

  it('shows an eligible result', async () => {
    getEligibilityMock.mockResolvedValue({
      patientId: 'patient-001',
      eligible: true,
      reasons: [],
    });
    const user = userEvent.setup();
    render(<EligibilityCard patientId="patient-001" />);

    await user.click(
      screen.getByRole('button', { name: 'Verificar elegibilidade' }),
    );

    expect(
      await screen.findByText(
        'Paciente elegível para atendimento domiciliar.',
      ),
    ).toBeInTheDocument();
  });

  it('shows an ineligible result', async () => {
    getEligibilityMock.mockResolvedValue({
      patientId: 'patient-002',
      eligible: false,
      reasons: ['EXAM_NOT_ELIGIBLE'],
    });
    const user = userEvent.setup();
    render(<EligibilityCard patientId="patient-002" />);

    await user.click(
      screen.getByRole('button', { name: 'Verificar elegibilidade' }),
    );

    expect(
      await screen.findByText(
        'Paciente não elegível para atendimento domiciliar.',
      ),
    ).toBeInTheDocument();
  });

  it('shows an error when the API request fails', async () => {
    getEligibilityMock.mockRejectedValue(new Error('Network failure'));
    const user = userEvent.setup();
    render(<EligibilityCard patientId="patient-001" />);

    await user.click(
      screen.getByRole('button', { name: 'Verificar elegibilidade' }),
    );

    expect(
      await screen.findByText(
        'Não foi possível verificar a elegibilidade.',
      ),
    ).toBeInTheDocument();
  });
});
