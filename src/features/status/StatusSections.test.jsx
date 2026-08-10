import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AreaServiceMap from './AreaServiceMap';
import StatusSummary from './StatusSummary';

describe('platform status sections', () => {
  it('renderiza indicadores e filtro de area', () => {
    render(
      <StatusSummary
        controller={{
          totalDevices: 7,
          offlineDevices: 2,
          activeAlerts: [{ id: 'alert-1' }],
          selectedArea: 'all',
          setSelectedArea: vi.fn(),
          setEventPage: vi.fn(),
        }}
      />
    );
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByLabelText(/Filtrar/)).toBeInTheDocument();
  });

  it('filtra o mapa de servicos pela area selecionada', () => {
    render(<AreaServiceMap controller={{ selectedArea: 'B1' }} />);
    expect(screen.getByText('Viveiro de Mudas')).toBeInTheDocument();
    expect(screen.queryByText('Estufa Norte')).not.toBeInTheDocument();
  });
});
