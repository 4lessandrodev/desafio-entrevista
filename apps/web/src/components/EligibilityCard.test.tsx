import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EligibilityCard } from './EligibilityCard';

describe('EligibilityCard', () => {
  it('shows the eligibility action', () => {
    render(<EligibilityCard patientId="patient-001" />);

    expect(
      screen.getByRole('button', { name: 'Verificar elegibilidade' }),
    ).toBeInTheDocument();
  });
});
