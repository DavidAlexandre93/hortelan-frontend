import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

export const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export const areaStatusConfig = {
  normal: { label: 'Normal', color: 'success', icon: CheckCircleRoundedIcon },
  warning: { label: 'Atenção', color: 'warning', icon: WarningAmberRoundedIcon },
  critical: { label: 'Crítico', color: 'error', icon: ErrorRoundedIcon },
};

export const greenhouseAreas = [
  {
    id: 'A1',
    name: 'Estufa Norte',
    status: 'normal',
    devices: [
      { id: 'S-101', type: 'sensor', name: 'Sensor Solo A', connectionStatus: 'online' },
      { id: 'S-102', type: 'sensor', name: 'Sensor Clima A', connectionStatus: 'online' },
      { id: 'D-014', type: 'device', name: 'Bomba de Irrigação', connectionStatus: 'online' },
    ],
    alerts: [],
  },
  {
    id: 'A2',
    name: 'Estufa Sul',
    status: 'warning',
    devices: [
      { id: 'S-205', type: 'sensor', name: 'Sensor Umidade B', connectionStatus: 'offline' },
      { id: 'D-118', type: 'device', name: 'Válvula Setor 2', connectionStatus: 'online' },
    ],
    alerts: ['Umidade do solo abaixo de 32% nas últimas 2h'],
  },
  {
    id: 'B1',
    name: 'Viveiro de Mudas',
    status: 'critical',
    devices: [
      { id: 'S-307', type: 'sensor', name: 'Sensor Temperatura C', connectionStatus: 'online' },
      { id: 'D-219', type: 'device', name: 'Exaustor Principal', connectionStatus: 'offline' },
    ],
    alerts: ['Temperatura acima de 38°C', 'Falha intermitente no exaustor principal'],
  },
];

export const streamTemplates = [
  { type: 'telemetry', severity: 'info', text: 'Medição recebida' },
  { type: 'alert', severity: 'warning', text: 'Alerta ativo detectado' },
  { type: 'connectivity', severity: 'info', text: 'Heartbeat de conectividade' },
  { type: 'actuator', severity: 'success', text: 'Ação de atuador confirmada' },
];

export const ruleExecutions = [
  {
    id: 'RE-001',
    areaId: 'A1',
    areaName: 'Estufa Norte',
    ruleName: 'Irrigação automática por umidade',
    status: 'success',
    reason: 'Umidade do solo ficou abaixo de 35% por 10 minutos',
    createdBy: 'Camila Souza',
    editedBy: 'Rodrigo Lima',
    executedAt: '2026-02-24T08:34:00.000Z',
  },
  {
    id: 'RE-002',
    areaId: 'A2',
    areaName: 'Estufa Sul',
    ruleName: 'Exaustor por alta temperatura',
    status: 'failed',
    reason: 'Falha de comunicação com o atuador D-118',
    createdBy: 'Fernanda Alves',
    editedBy: 'Fernanda Alves',
    executedAt: '2026-02-24T09:02:00.000Z',
  },
  {
    id: 'RE-003',
    areaId: 'B1',
    areaName: 'Viveiro de Mudas',
    ruleName: 'Nebulização preventiva por calor',
    status: 'success',
    reason: 'Temperatura acima de 34°C e umidade do ar abaixo de 48%',
    createdBy: 'Juliana Prado',
    editedBy: 'Marcos Teixeira',
    executedAt: '2026-02-24T10:11:00.000Z',
  },
  {
    id: 'RE-004',
    areaId: 'A2',
    areaName: 'Estufa Sul',
    ruleName: 'Irrigação de segurança no fim do dia',
    status: 'failed',
    reason: 'Limite diário de irrigações já atingido',
    createdBy: 'Camila Souza',
    editedBy: 'Camila Souza',
    executedAt: '2026-02-24T17:45:00.000Z',
  },
];

export function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function buildInitialAlerts() {
  return greenhouseAreas.flatMap((area) =>
    area.alerts.map((message, index) => ({
      id: `${area.id}-alert-${index}`,
      areaId: area.id,
      areaName: area.name,
      deviceName: area.devices[0]?.name || 'Dispositivo',
      message,
      severity: area.status === 'critical' ? 'error' : 'warning',
      acknowledgedAt: null,
    }))
  );
}

export function buildInitialActuators() {
  return greenhouseAreas.reduce((acc, area) => {
    const areaActuators = area.devices
      .filter((device) => device.type === 'device')
      .map((device) => ({
        ...device,
        areaId: area.id,
        areaName: area.name,
        isOn: false,
      }));

    return [...acc, ...areaActuators];
  }, []);
}
