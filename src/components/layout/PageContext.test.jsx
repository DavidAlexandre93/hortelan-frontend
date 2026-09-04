import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PageContext from './PageContext';

describe('PageContext', () => {
  const baseProps = {
    badge: 'Operacao ao vivo',
    heading: 'Visao geral do cultivo',
    subheading: 'Sensores, alertas e automacoes em uma leitura objetiva.',
    onOpenAssistant: vi.fn(),
  };

  it('prioriza contexto da rota e expõe a ação de IA quando disponível', () => {
    render(<PageContext {...baseProps} hasAiContext />);

    expect(screen.getByRole('heading', { name: 'Visao geral do cultivo' })).toBeInTheDocument();
    expect(screen.getByText('Dados ilustrativos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Perguntar a IA' })).toBeInTheDocument();
  });

  it('não cria uma ação de IA em rotas sem contexto declarado', () => {
    render(<PageContext {...baseProps} />);

    expect(screen.queryByRole('button', { name: 'Perguntar a IA' })).not.toBeInTheDocument();
  });
});
