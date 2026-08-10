import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ConfirmationDialog from './ConfirmationDialog';

describe('ConfirmationDialog', () => {
  it('exige a confirmacao nominal antes de executar a acao', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmationDialog
        open
        title="Excluir conta"
        description="Acao permanente"
        confirmationName="EXCLUIR"
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
    expect(confirmButton).toBeDisabled();
    await user.type(screen.getByLabelText(/Digite EXCLUIR/), 'EXCLUIR');
    expect(confirmButton).toBeEnabled();
    await user.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('bloqueia cancelamento e confirmacao durante uma mutacao', () => {
    render(
      <ConfirmationDialog
        open
        busy
        title="Revogar"
        description="Acao em andamento"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDisabled();
  });
});
