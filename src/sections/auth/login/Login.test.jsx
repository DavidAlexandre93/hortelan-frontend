import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../../../auth/AuthContext';
import { buildAuthContext } from '../../../test/factories';
import ThemeProvider from '../../../theme';
import { LoginPage, RegisterPage } from './Login';

function renderAuthPage(path, context = {}) {
  return render(
    <HelmetProvider>
      <ThemeProvider>
        <AuthContext.Provider value={buildAuthContext(context)}>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard/profile" element={<h1>Perfil protegido</h1>} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

describe('authentication pages', () => {
  it('renderiza login sem publicar credenciais de demonstracao', () => {
    renderAuthPage('/login');
    expect(screen.getByRole('heading', { name: 'Acesse sua operacao' })).toBeInTheDocument();
    expect(screen.queryByText(/davidfernandes|admin/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mostrar senha' })).toBeInTheDocument();
  });

  it('envia login e respeita returnTo interno', async () => {
    const login = vi.fn().mockResolvedValue({ user: { id: '1' } });
    renderAuthPage('/login?returnTo=%2Fdashboard%2Fprofile', { login });
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('E-mail'), 'teste@hortelan.local');
    await user.type(screen.getByLabelText('Senha'), 'Senha!123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(login).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('heading', { name: 'Perfil protegido' })).toBeInTheDocument();
  });

  it('oferece cadastro dedicado com consentimento obrigatorio', async () => {
    renderAuthPage('/register');
    expect(screen.getByRole('heading', { name: 'Crie sua conta Hortelan' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Eu aceito/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }));
    expect(await screen.findByLabelText('Nome completo')).toHaveAttribute('aria-invalid', 'true');
  });
});
