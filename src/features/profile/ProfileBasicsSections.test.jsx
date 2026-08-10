import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ProfileBasicsSections from './ProfileBasicsSections';

const form = {
  name: 'Ana',
  photoURL: '',
  bio: '',
  preferences: { language: 'pt-BR', measurementUnit: 'metrico', timezone: 'America/Sao_Paulo' },
  notifications: {
    irrigationAlerts: true,
    pestAlerts: false,
    weatherAlerts: false,
    communityUpdates: false,
    marketing: false,
  },
  savedAddresses: [{ id: 'address-1', label: 'Casa', addressLine: 'Rua A' }],
};

describe('ProfileBasicsSections', () => {
  it('preserva o formulario controlado e comunica alteracoes', async () => {
    const user = userEvent.setup();
    const setField = vi.fn();
    render(<ProfileBasicsSections controller={{ form, setField, avatarLetter: 'A' }} />);
    expect(screen.getByDisplayValue('Ana')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Nome'), ' Silva');
    expect(setField).toHaveBeenCalledWith('name', 'Ana ');
  });
});
