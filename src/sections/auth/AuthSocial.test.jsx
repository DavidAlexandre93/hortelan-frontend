import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../auth/AuthContext';
import { buildAuthContext } from '../../test/factories';
import AuthSocial from './AuthSocial';

function renderSocial(context) {
  return render(
    <AuthContext.Provider value={buildAuthContext(context)}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<AuthSocial />} />
          <Route path="/dashboard/app" element={<h1>Dashboard demo</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('social authentication controls', () => {
  it('labels and completes social access as demo when demo mode is active', async () => {
    const loginWithSocial = vi.fn().mockResolvedValue({ user: { id: 'demo-user' } });
    renderSocial({ demoMode: true, loginWithSocial });

    await userEvent.click(screen.getByRole('button', { name: 'Google (demo)' }));

    expect(loginWithSocial).toHaveBeenCalledWith({ provider: 'google', remember: true, trustDevice: true });
    expect(await screen.findByRole('heading', { name: 'Dashboard demo' })).toBeInTheDocument();
  });

  it('does not present unconfigured provider buttons as functional OAuth', () => {
    renderSocial({ demoMode: false });

    expect(screen.getByRole('button', { name: 'Google' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Apple' })).toBeDisabled();
    expect(screen.getByText(/aguardando configuracao segura dos provedores/i)).toBeInTheDocument();
  });
});
