import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState, ErrorState, OfflineBanner } from './OperationalState';

describe('operational states', () => {
  it('oferece retry explicito em falhas recuperaveis', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renderiza vazio e offline com mensagens acionaveis', () => {
    const previousOnline = navigator.onLine;
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });
    const { rerender } = render(<EmptyState title="Sem sensores" description="Conecte o primeiro sensor." />);
    expect(screen.getByRole('status')).toHaveTextContent('Sem sensores');
    rerender(<OfflineBanner />);
    expect(screen.getByText(/Voce esta offline/)).toBeInTheDocument();
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: previousOnline });
  });
});
