import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthContext } from '../../auth/AuthContext';
import { buildAuthContext } from '../../test/factories';
import RedirectIfAuth from './RedirectIfAuth';
import RequireAuth from './RequireAuth';

function CurrentLocation() {
  const location = useLocation();
  return <div>{location.pathname}</div>;
}

function renderWithAuth(value, initialPath, element) {
  return render(
    <AuthContext.Provider value={buildAuthContext(value)}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<CurrentLocation />} />
          <Route path="/dashboard/app" element={element} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('auth guards', () => {
  it('redireciona visitante de rota protegida', () => {
    renderWithAuth(
      { authenticated: false },
      '/dashboard/app',
      <RequireAuth>
        <div>privado</div>
      </RequireAuth>
    );
    expect(screen.getByText('/login')).toBeInTheDocument();
  });

  it('renderiza rota protegida para usuario autenticado', () => {
    renderWithAuth(
      { authenticated: true },
      '/dashboard/app',
      <RequireAuth>
        <div>privado</div>
      </RequireAuth>
    );
    expect(screen.getByText('privado')).toBeInTheDocument();
  });

  it('mostra estado explicito enquanto a identidade inicializa', () => {
    renderWithAuth(
      { initialized: false },
      '/dashboard/app',
      <RequireAuth>
        <div>privado</div>
      </RequireAuth>
    );
    expect(screen.getByRole('status', { name: 'Validando sessao' })).toBeInTheDocument();
  });

  it('afasta usuario autenticado da pagina de login', () => {
    render(
      <AuthContext.Provider value={buildAuthContext({ authenticated: true })}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route
              path="/login"
              element={
                <RedirectIfAuth>
                  <div>login</div>
                </RedirectIfAuth>
              }
            />
            <Route path="/dashboard/app" element={<CurrentLocation />} />
            <Route path="/dashboard/profile" element={<CurrentLocation />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText('/dashboard/app')).toBeInTheDocument();
  });

  it('preserva retorno interno seguro depois da autenticacao', () => {
    render(
      <AuthContext.Provider value={buildAuthContext({ authenticated: true })}>
        <MemoryRouter initialEntries={['/login?returnTo=%2Fdashboard%2Fprofile']}>
          <Routes>
            <Route
              path="/login"
              element={
                <RedirectIfAuth>
                  <div>login</div>
                </RedirectIfAuth>
              }
            />
            <Route path="/dashboard/profile" element={<CurrentLocation />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText('/dashboard/profile')).toBeInTheDocument();
  });
});
