import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LazyRouteBoundary from './LazyRouteBoundary';

function BrokenRoute() {
  throw new TypeError('Failed to fetch dynamically imported module');
}

describe('LazyRouteBoundary', () => {
  it('renders a recoverable state and resets after navigation', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const view = render(
      <LazyRouteBoundary routeKey="/broken">
        <BrokenRoute />
      </LazyRouteBoundary>
    );

    expect(screen.getByText('Esta pagina nao terminou de carregar.')).toBeInTheDocument();

    view.rerender(
      <LazyRouteBoundary routeKey="/healthy">
        <div>Rota recuperada</div>
      </LazyRouteBoundary>
    );
    expect(screen.getByText('Rota recuperada')).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
