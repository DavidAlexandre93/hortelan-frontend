import { useEffect, useMemo, useState } from 'react';
import SensorsIcon from '@mui/icons-material/Sensors';
import RouterIcon from '@mui/icons-material/Router';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import Page from '../components/Page';

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

const areaStatusConfig = {
  normal: { label: 'Normal', color: 'success', icon: CheckCircleRoundedIcon },
  warning: { label: 'Atenção', color: 'warning', icon: WarningAmberRoundedIcon },
  critical: { label: 'Crítico', color: 'error', icon: ErrorRoundedIcon },
};

const severityConfig = {
  high: { label: 'Alta', color: 'error' },
  medium: { label: 'Média', color: 'warning' },
  low: { label: 'Baixa', color: 'info' },
};

const alertTypeConfig = {
  sensor: 'Sensor',
  device: 'Dispositivo',
  ambiente: 'Ambiente',
  planta: 'Planta',
  operacao: 'Operação',
};

const greenhouseAreas = [
  {
    id: 'A1',
    name: 'Estufa Norte',
    status: 'normal',
    devices: [
      { id: 'S-101', type: 'sensor', name: 'Sensor Solo A', connectionStatus: 'online' },
      { id: 'S-102', type: 'sensor', name: 'Sensor Clima A', connectionStatus: 'online' },
      { id: 'D-014', type: 'device', name: 'Bomba de Irrigação', connectionStatus: 'online' },
      { id: 'S-101', type: 'sensor', name: 'Sensor Solo A', top: '28%', left: '18%' },
      { id: 'S-102', type: 'sensor', name: 'Sensor Clima A', top: '62%', left: '42%' },
      { id: 'D-014', type: 'device', name: 'Bomba de Irrigação', top: '18%', left: '74%' },
    ],
    plants: [
      {
        id: 'PL-001',
        name: 'Tomate Italiano',
        sensorReadings: { moisture: 56, temperature: 24, conductivity: 1.7 },
        alerts: [],
      },
      {
        id: 'PL-002',
        name: 'Manjericão',
        sensorReadings: { moisture: 41, temperature: 28, conductivity: 1.2 },
        alerts: ['Desenvolvimento lento observado na última inspeção visual'],
      },
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
      { id: 'S-205', type: 'sensor', name: 'Sensor Umidade B', top: '36%', left: '20%' },
      { id: 'D-118', type: 'device', name: 'Válvula Setor 2', top: '68%', left: '58%' },
    ],
    plants: [
      {
        id: 'PL-031',
        name: 'Alface Crespa',
        sensorReadings: { moisture: 29, temperature: 31, conductivity: 0.8 },
        alerts: ['Pontas queimadas em folhas externas'],
      },
      {
        id: 'PL-032',
        name: 'Rúcula',
        sensorReadings: null,
        alerts: [],
      },
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
  {
    id: 'B2',
    name: 'Área de Compostagem',
    status: 'normal',
    devices: [
      { id: 'S-412', type: 'sensor', name: 'Sensor pH D', connectionStatus: 'online' },
      { id: 'D-333', type: 'device', name: 'Misturador', connectionStatus: 'online' },
      { id: 'S-413', type: 'sensor', name: 'Sensor Umidade D', connectionStatus: 'online' },
    ],
    alerts: [],
  },
];

const streamTemplates = [
  { type: 'telemetry', severity: 'info', text: 'Medição recebida' },
  { type: 'alert', severity: 'warning', text: 'Alerta ativo detectado' },
  { type: 'connectivity', severity: 'info', text: 'Heartbeat de conectividade' },
  { type: 'actuator', severity: 'success', text: 'Ação de atuador confirmada' },
];

const statusPriority = { healthy: 1, attention: 2, critical: 3 };

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'medium',
});
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'medium' });

function buildInitialAlerts() {
  const alerts = [];

  greenhouseAreas.forEach((area) => {
    area.alerts.forEach((message, index) => {
      alerts.push({
        id: `${area.id}-alert-${index}`,
        areaId: area.id,
        areaName: area.name,
        deviceName: area.devices[0]?.name || 'Dispositivo',
        message,
        severity: area.status === 'critical' ? 'error' : 'warning',
        acknowledgedAt: null,
      });
    });
  });

  return alerts;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'medium',
});
export default function StatusPage() {
  const [selectedArea, setSelectedArea] = useState('all');
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState(() => buildInitialAlerts());

  useEffect(() => {
    const interval = setInterval(() => {
      const area = randomItem(greenhouseAreas);
      const device = randomItem(area.devices);
      const template = randomItem(streamTemplates);
      const createdAt = new Date().toISOString();

      const event = {
        id: `${createdAt}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt,
        areaId: area.id,
        areaName: area.name,
        deviceId: device.id,
        deviceName: device.name,
        type: template.type,
        severity: template.severity,
        message: `${template.text} em ${device.name}`,
      };

      setEvents((prev) => [event, ...prev].slice(0, 40));

      if (template.type === 'alert' && Math.random() > 0.45) {
        setAlerts((prev) => [
          {
            id: `${event.id}-alert`,
            areaId: area.id,
            areaName: area.name,
            deviceName: device.name,
            message: `Novo alerta automático: ${device.name} exige inspeção imediata`,
            severity: area.status === 'critical' ? 'error' : 'warning',
            acknowledgedAt: null,
          },
          ...prev,
        ]);
      }
    }, 2200);
      { id: 'S-307', type: 'sensor', name: 'Sensor Temperatura C', top: '48%', left: '30%' },
      { id: 'D-219', type: 'device', name: 'Exaustor Principal', top: '24%', left: '68%' },
    ],
    plants: [
      {
        id: 'PL-078',
        name: 'Pimentão Vermelho',
        sensorReadings: { moisture: 18, temperature: 39, conductivity: 2.8 },
        alerts: ['Murcha severa e perda de turgor em 30% das plantas'],
      },
    ],
    alerts: ['Temperatura acima de 38°C', 'Falha intermitente no exaustor principal'],
  },
];


const randomNumberInRange = (min, max, decimalPlaces = 1) => {
  const multiplier = 10 ** decimalPlaces;
  return Math.round((Math.random() * (max - min) + min) * multiplier) / multiplier;
};

const buildInitialMeasurements = () =>
  greenhouseAreas.reduce((acc, area) => {
    area.devices.forEach((device) => {
      if (device.type === 'sensor') {
        const metric = device.name.toLowerCase().includes('temperatura') ? 'temperature' : 'soilMoisture';
        acc[device.id] = {
          metric,
          value: metric === 'temperature' ? randomNumberInRange(21, 38) : randomNumberInRange(22, 74),
          updatedAt: new Date().toISOString(),
        };
      } else {
        acc[device.id] = {
          metric: 'status',
          online: true,
          updatedAt: new Date().toISOString(),
        };
      }
    });

    return acc;
  }, {});

const getUpdatedMeasurement = (previousMeasurement) => {
  if (previousMeasurement.metric === 'temperature') {
    const nextValue = Math.max(12, Math.min(42, previousMeasurement.value + randomNumberInRange(-1.5, 1.5)));
    return { ...previousMeasurement, value: Number(nextValue.toFixed(1)), updatedAt: new Date().toISOString() };
  }

  if (previousMeasurement.metric === 'soilMoisture') {
    const nextValue = Math.max(10, Math.min(95, previousMeasurement.value + randomNumberInRange(-3, 3)));
    return { ...previousMeasurement, value: Number(nextValue.toFixed(1)), updatedAt: new Date().toISOString() };
  }

  const toggledOnline = Math.random() > 0.96 ? !previousMeasurement.online : previousMeasurement.online;
  return { ...previousMeasurement, online: toggledOnline, updatedAt: new Date().toISOString() };
};

function getSensorStatus(readings) {
  if (!readings) return null;

  const isCritical = readings.moisture < 25 || readings.temperature > 37 || readings.conductivity > 2.5;
  if (isCritical) return 'critical';

  const isAttention = readings.moisture < 40 || readings.temperature > 31 || readings.conductivity < 1;
  if (isAttention) return 'attention';

  return 'healthy';
}

function getPlantSensorAlerts(readings) {
  if (!readings) return [];

  const sensorAlerts = [];

  if (readings.moisture < 40) sensorAlerts.push(`Umidade de solo baixa (${readings.moisture}%)`);
  if (readings.temperature > 31) sensorAlerts.push(`Temperatura acima da faixa ideal (${readings.temperature}°C)`);
  if (readings.conductivity < 1 || readings.conductivity > 2.5) {
    sensorAlerts.push(`Condutividade fora da faixa recomendada (${readings.conductivity} mS/cm)`);
  }

  return sensorAlerts;
}
const getPlantSensorIncidents = (plant, area) => {
  if (!plant.sensorReadings) return [];

  const incidents = [];
  const { moisture, temperature, conductivity } = plant.sensorReadings;

  if (moisture < 25) {
    incidents.push({
      title: `Umidade crítica em ${plant.name}`,
      description: `Umidade de solo em ${moisture}% no ${area.name}.`,
      severity: 'high',
      type: 'sensor',
    });
  } else if (moisture < 40) {
    incidents.push({
      title: `Umidade abaixo do ideal em ${plant.name}`,
      description: `Umidade de solo em ${moisture}% no ${area.name}.`,
      severity: 'medium',
      type: 'sensor',
    });
  }

  if (temperature > 37) {
    incidents.push({
      title: `Temperatura crítica em ${plant.name}`,
      description: `Temperatura em ${temperature}°C no ${area.name}.`,
      severity: 'high',
      type: 'ambiente',
    });
  } else if (temperature > 31) {
    incidents.push({
      title: `Temperatura acima do ideal em ${plant.name}`,
      description: `Temperatura em ${temperature}°C no ${area.name}.`,
      severity: 'medium',
      type: 'ambiente',
    });
  }

  if (conductivity < 1 || conductivity > 2.5) {
    incidents.push({
      title: `Condutividade fora da faixa em ${plant.name}`,
      description: `Condutividade em ${conductivity} mS/cm no ${area.name}.`,
      severity: conductivity > 2.7 ? 'high' : 'medium',
      type: 'sensor',
    });
  }

  return incidents;
};

const severityRank = { high: 3, medium: 2, low: 1 };

export default function StatusPage() {
  const initialManualStatus = useMemo(
    () =>
      greenhouseAreas.flatMap((area) => area.plants).reduce((acc, plant) => {
        acc[plant.id] = plant.manualStatus;
        return acc;
      }, {}),
    []
  );
  const [manualPlantStatus, setManualPlantStatus] = useState(initialManualStatus);
  const [measurementsByDevice, setMeasurementsByDevice] = useState(() => buildInitialMeasurements());
  const [lastRefreshAt, setLastRefreshAt] = useState(new Date().toISOString());
  const [selectedArea, setSelectedArea] = useState('all');
  const [alertTypeFilter, setAlertTypeFilter] = useState('all');

  useEffect(() => {
    const interval = setInterval(() => {
      setMeasurementsByDevice((previous) =>
        Object.fromEntries(Object.entries(previous).map(([deviceId, measurement]) => [deviceId, getUpdatedMeasurement(measurement)]))
      );
      setLastRefreshAt(new Date().toISOString());
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const areaLookup = useMemo(
    () => greenhouseAreas.reduce((acc, area) => ({ ...acc, [area.id]: area }), {}),
    []
  );

  const filteredEvents = useMemo(
    () => (selectedArea === 'all' ? events : events.filter((event) => event.areaId === selectedArea)),
    [events, selectedArea]
  );

  const filteredAlerts = useMemo(
    () => (selectedArea === 'all' ? alerts : alerts.filter((alert) => alert.areaId === selectedArea)),
    [alerts, selectedArea]
  );

  const activeAlerts = filteredAlerts.filter((alert) => !alert.acknowledgedAt);
  const ackedAlerts = filteredAlerts.filter((alert) => alert.acknowledgedAt);

  const totalDevices = greenhouseAreas.reduce((acc, area) => acc + area.devices.length, 0);

  const handleAck = (alertId) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              acknowledgedAt: new Date().toISOString(),
            }
          : alert
      )
    );
  };
  const filteredAreas = useMemo(() => {
    if (selectedArea === 'all') return greenhouseAreas;
    return greenhouseAreas.filter((area) => area.id === selectedArea);
  }, [selectedArea]);

  const prioritizedIncidents = useMemo(() => {
    const incidents = [];

    filteredAreas.forEach((area) => {
      area.alerts.forEach((alertText, index) => {
        incidents.push({
          id: `${area.id}-area-${index}`,
          title: `Alerta da área ${area.name}`,
          description: alertText,
          severity: area.status === 'critical' ? 'high' : area.status === 'warning' ? 'medium' : 'low',
          type: alertText.toLowerCase().includes('falha') ? 'operacao' : 'ambiente',
          areaName: area.name,
        });
      });

      area.devices.forEach((device) => {
        const measurement = measurementsByDevice[device.id];
        if (device.type === 'device' && measurement && measurement.online === false) {
          incidents.push({
            id: `${area.id}-${device.id}-offline`,
            title: `Dispositivo offline (${device.id})`,
            description: `${device.name} sem comunicação no ${area.name}.`,
            severity: 'high',
            type: 'device',
            areaName: area.name,
          });
        }
      });

      area.plants.forEach((plant, index) => {
        plant.alerts.forEach((alertText) => {
          incidents.push({
            id: `${area.id}-${plant.id}-manual-${index}`,
            title: `Inspeção manual: ${plant.name}`,
            description: alertText,
            severity: area.status === 'critical' ? 'high' : 'medium',
            type: 'planta',
            areaName: area.name,
          });
        });

        getPlantSensorIncidents(plant, area).forEach((incident, incidentIndex) => {
          incidents.push({
            id: `${area.id}-${plant.id}-sensor-${incidentIndex}`,
            ...incident,
            areaName: area.name,
          });
        });
      });
    });

    return incidents.sort((a, b) => severityRank[b.severity] - severityRank[a.severity] || a.areaName.localeCompare(b.areaName));
  }, [filteredAreas, measurementsByDevice]);

  const severityCards = useMemo(
    () => ({
      high: prioritizedIncidents.filter((incident) => incident.severity === 'high').length,
      medium: prioritizedIncidents.filter((incident) => incident.severity === 'medium').length,
      low: prioritizedIncidents.filter((incident) => incident.severity === 'low').length,
    }),
    [prioritizedIncidents]
  );
  const totalPlants = greenhouseAreas.reduce((acc, area) => acc + area.plants.length, 0);

  const visibleIncidents = useMemo(() => {
    if (alertTypeFilter === 'all') return prioritizedIncidents;
    return prioritizedIncidents.filter((incident) => incident.type === alertTypeFilter);
  }, [alertTypeFilter, prioritizedIncidents]);

  return (
    <Page title="War room operacional">
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">War room de operação</Typography>
            <Typography color="text.secondary">
              Visão central para múltiplas hortas/dispositivos, eventos em streaming e ack de alertas.
          <Stack spacing={1}>
            <Typography variant="h4">Monitoramento e alertas operacionais</Typography>
            <Typography color="text.secondary">
              Painel com priorização de incidentes, alertas por criticidade e filtros por tipo de alerta.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Atualização automática a cada 6s • Última atualização: {dateTimeFormatter.format(new Date(lastRefreshAt))}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Hortas monitoradas
                  </Typography>
                  <Typography variant="h3">{greenhouseAreas.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Dispositivos
                  </Typography>
                  <Typography variant="h3">{totalDevices}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Alertas ativos
                  </Typography>
                  <Typography variant="h3" color={activeAlerts.length ? 'error.main' : 'success.main'}>
                    {activeAlerts.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Eventos recebidos
                  </Typography>
                  <Typography variant="h3">{filteredEvents.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="war-room-area-filter">Filtrar horta</InputLabel>
                <Select
                  labelId="war-room-area-filter"
                  label="Filtrar horta"
                  value={selectedArea}
                  onChange={(event) => setSelectedArea(event.target.value)}
                >
                  <MenuItem value="all">Todas</MenuItem>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="area-filter-label">Área</InputLabel>
                <Select
                  labelId="area-filter-label"
                  value={selectedArea}
                  label="Área"
                  onChange={(event) => setSelectedArea(event.target.value)}
                >
                  <MenuItem value="all">Todas as áreas</MenuItem>
                  {greenhouseAreas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {Object.entries(areaStatusConfig).map(([status, config]) => (
                  <Chip key={status} color={config.color} icon={<config.icon fontSize="small" />} label={config.label} />
                ))}
                <Chip icon={<SensorsIcon fontSize="small" />} label="Sensores" variant="outlined" />
                <Chip icon={<RouterIcon fontSize="small" />} label="Atuadores" variant="outlined" />
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Mapa de hortas e dispositivos
                  </Typography>
                  <Stack spacing={1.2}>
                    {greenhouseAreas
                      .filter((area) => selectedArea === 'all' || area.id === selectedArea)
                      .map((area) => (
                        <Card key={area.id} variant="outlined">
                          <CardContent sx={{ py: 1.5 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                              <Typography fontWeight={700}>{area.name}</Typography>
                              <Chip size="small" color={areaStatusConfig[area.status].color} label={areaStatusConfig[area.status].label} />
                            </Stack>
                            <Stack spacing={0.5}>
                              {area.devices.map((device) => (
                                <Typography key={device.id} variant="body2" color="text.secondary">
                                  • {device.name} ({device.id}) — {device.connectionStatus}
                                </Typography>
                              ))}
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h6">Lista de eventos em streaming</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Atualização automática a cada ~2.2s
                      </Typography>
                    </Box>
                    <Chip icon={<AccessTimeRoundedIcon />} label={`Último: ${events[0] ? dateTimeFormatter.format(new Date(events[0].createdAt)) : '-'}`} />
                  </Stack>
                  <Stack spacing={1.2}>
                    {filteredEvents.length === 0 && <Alert severity="info">Aguardando eventos...</Alert>}
                    {filteredEvents.map((event) => (
                      <Alert key={event.id} severity={event.severity === 'success' ? 'success' : event.severity === 'warning' ? 'warning' : 'info'}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                          <Typography variant="body2">
                            <strong>{event.areaName}</strong> • {event.deviceName} — {event.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dateTimeFormatter.format(new Date(event.createdAt))}
                          </Typography>
                        </Stack>
                      </Alert>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

            {filteredAreas.map((area) => {
              const config = areaStatusConfig[area.status];
              const scopedDevices = area.devices.filter((device) => {
                if (viewMode === 'sensor') {
                  return device.type === 'sensor';
                }
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Ack de alertas
              </Typography>

              {activeAlerts.length === 0 ? (
                <Alert icon={<TaskAltRoundedIcon />} severity="success" sx={{ mb: 2 }}>
                  Nenhum alerta pendente para ack no filtro atual.
                </Alert>
              ) : (
                <Stack spacing={1.2} sx={{ mb: 2 }}>
                  {activeAlerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      severity={alert.severity === 'error' ? 'error' : 'warning'}
                      icon={<NotificationsActiveRoundedIcon />}
                      action={
                        <Button color="inherit" size="small" onClick={() => handleAck(alert.id)}>
                          ACK
                        </Button>
                      }
                    >
                      <Typography variant="body2">
                        <strong>{alert.areaName}</strong> • {alert.deviceName} — {alert.message}
                      </Typography>
                    </Alert>
                  ))}
                </Stack>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Histórico de alertas com ack ({ackedAlerts.length})
              </Typography>
              <Stack spacing={1}>
                {ackedAlerts.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Ainda não há alertas reconhecidos.
                  </Typography>
                )}
                {ackedAlerts.map((alert) => (
                  <Alert key={alert.id} severity="success" variant="outlined" icon={<TaskAltRoundedIcon />}>
                    <Typography variant="body2">
                      <strong>{alert.areaName}</strong> • {alert.message} — ack em{' '}
                      {dateTimeFormatter.format(new Date(alert.acknowledgedAt))}
                    </Typography>
                  </Alert>
                ))}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="alert-type-filter-label">Tipo de alerta</InputLabel>
                <Select
                  labelId="alert-type-filter-label"
                  value={alertTypeFilter}
                  label="Tipo de alerta"
                  onChange={(event) => setAlertTypeFilter(event.target.value)}
                >
                  <MenuItem value="all">Todos os tipos</MenuItem>
                  {Object.entries(alertTypeConfig).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {Object.entries(severityCards).map(([severity, total]) => (
              <Grid key={severity} item xs={12} md={4}>
                <Card variant="outlined" sx={{ borderColor: `${severityConfig[severity].color}.main` }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Alertas de criticidade {severityConfig[severity].label.toLowerCase()}
                    </Typography>
                    <Typography variant="h3" sx={{ color: `${severityConfig[severity].color}.main`, mt: 1 }}>
                      {total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Incidentes priorizados</Typography>
                {visibleIncidents.length === 0 ? (
                  <Alert severity="success">Nenhum incidente para o filtro selecionado.</Alert>
                ) : (
                  visibleIncidents.map((incident, index) => (
                    <Card key={incident.id} variant="outlined">
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Chip size="small" color="default" label={`Prioridade #${index + 1}`} />
                            <Chip size="small" color={severityConfig[incident.severity].color} label={severityConfig[incident.severity].label} />
                            <Chip size="small" variant="outlined" label={alertTypeConfig[incident.type]} />
                            <Chip size="small" variant="outlined" label={incident.areaName} />
                          </Stack>
                          <Typography variant="subtitle2">{incident.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {incident.description}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>

          <Typography variant="caption" color="text.secondary">
            Fonte de contexto das áreas: {Object.keys(areaLookup).length} áreas cadastradas no ambiente de demonstração.
          </Typography>
          <Grid container spacing={2}>
            {filteredAreas.map((area) => {
              const config = areaStatusConfig[area.status];

              return (
                <Grid item key={area.id} xs={12} md={area.size.md}>
                  <Card sx={{ border: 1, borderColor: config.borderColor, bgcolor: config.bgColor }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">{area.name}</Typography>
                        <Chip size="small" icon={<config.icon fontSize="small" />} label={config.label} color={config.color} />
                      </Stack>

                      <Box
                        sx={{
                          position: 'relative',
                          borderRadius: 2,
                          bgcolor: 'background.paper',
                          border: '1px dashed',
                          borderColor: 'divider',
                          minHeight: 170,
                          p: 1,
                        }}
                      >
                        {area.devices.map((device) => {
                          const measurement = measurementsByDevice[device.id];
                          const isSensor = device.type === 'sensor';

                          return (
                            <Box
                              key={device.id}
                              sx={{
                                position: 'absolute',
                                top: device.top,
                                left: device.left,
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              <Chip
                                size="small"
                                icon={isSensor ? <SensorsIcon fontSize="small" /> : <RouterIcon fontSize="small" />}
                                label={device.id}
                                color={isSensor ? 'primary' : measurement?.online === false ? 'error' : 'success'}
                                variant={isSensor ? 'filled' : 'outlined'}
                              />
                            </Box>
                          );
                        })}
                      </Box>

                      <Stack spacing={1} sx={{ mt: 2 }}>
                        {area.devices.map((device) => {
                          const connectionConfig = connectionStateConfig[device.connectionStatus];
                          const signalConfig = device.signalQuality ? signalQualityConfig[device.signalQuality] : null;
                          const isWireless = device.batteryLevel !== null;

                          return (
                            <Card key={`${area.id}-${device.id}`} variant="outlined" sx={{ bgcolor: 'background.default' }}>
                              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                <Stack spacing={1}>
                                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Typography variant="subtitle2">
                                      {device.id} — {device.name}
                                    </Typography>
                                    <Chip
                                      size="small"
                                      label={connectionConfig.label}
                                      color={connectionConfig.color}
                                      variant={device.connectionStatus === 'online' ? 'filled' : 'outlined'}
                                    />
                                  </Stack>

                                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                    <Chip size="small" label={`Último contato: ${device.lastContact}`} variant="outlined" />

                                    {signalConfig && (
                                      <Chip
                                        size="small"
                                        icon={<SignalCellularAltRoundedIcon fontSize="small" />}
                                        label={`Sinal: ${signalConfig.label}`}
                                        color={signalConfig.color}
                                        variant="outlined"
                                      />
                                    )}

                                    <Chip
                                      size="small"
                                      icon={
                                        isWireless ? (
                                          <Battery4BarRoundedIcon fontSize="small" />
                                        ) : (
                                          <UsbRoundedIcon fontSize="small" />
                                        )
                                      }
                                      label={isWireless ? `Bateria: ${device.batteryLevel}%` : 'Sem fio: não'}
                                      color={isWireless ? 'primary' : 'default'}
                                      variant="outlined"
                                    />

                                    <Chip
                                      size="small"
                                      icon={<MemoryRoundedIcon fontSize="small" />}
                                      label={`Firmware: ${device.firmware}`}
                                      variant="outlined"
                                    />
                                  </Stack>
                                </Stack>
                              </CardContent>
                            </Card>
                          );
                        })}

                        {scopedDevices.map((device) => {
                          const measurement = measurementsByDevice[device.id];

                          return (
                            <Typography key={`${area.id}-${device.id}`} variant="body2" color="text.secondary">
                              • {device.id} — {device.name} • {measurement ? getMeasurementLabel(device, measurement) : 'Sem leitura'} •{' '}
                              {measurement ? dateTimeFormatter.format(new Date(measurement.updatedAt)) : '-'}
                            </Typography>
                          );
                        })}
                      </Stack>

                      {area.alerts.length > 0 && (
                        <Stack spacing={1} sx={{ mt: 2 }}>
                          {area.alerts.map((alertText) => (
                            <Alert key={`${area.id}-${alertText}`} severity={area.status === 'critical' ? 'error' : 'warning'}>
                              {alertText}
                            </Alert>
                          ))}
                        </Stack>
                      )}

                      <Stack spacing={2} sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">Status das plantas</Typography>
                        {area.plants.map((plant) => {
                          const manualStatus = manualPlantStatus[plant.id] || plant.manualStatus;
                          const sensorStatus = getSensorStatus(plant.sensorReadings);
                          const finalStatus =
                            sensorStatus && statusPriority[sensorStatus] > statusPriority[manualStatus]
                              ? sensorStatus
                              : manualStatus;
                          const plantAlerts = [...getPlantSensorAlerts(plant.sensorReadings), ...plant.alerts];

                          return (
                            <Card key={plant.id} variant="outlined" sx={{ borderColor: 'divider' }}>
                              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Stack spacing={1.2}>
                                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                      {plant.name}
                                    </Typography>
                                    <Chip
                                      size="small"
                                      color={manualStatusConfig[finalStatus].color}
                                      label={`Condição atual: ${manualStatusConfig[finalStatus].label}`}
                                    />
                                  </Stack>

                                  <ToggleButtonGroup
                                    exclusive
                                    size="small"
                                    value={manualStatus}
                                    onChange={(_, nextValue) => {
                                      if (!nextValue) return;
                                      setManualPlantStatus((prev) => ({ ...prev, [plant.id]: nextValue }));
                                    }}
                                  >
                                    {Object.entries(manualStatusConfig).map(([status, config]) => (
                                      <ToggleButton key={`${plant.id}-${status}`} value={status}>
                                        {config.label}
                                      </ToggleButton>
                                    ))}
                                  </ToggleButtonGroup>

                                  {plant.sensorReadings ? (
                                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                      <Chip size="small" variant="outlined" label={`Umidade: ${plant.sensorReadings.moisture}%`} />
                                      <Chip size="small" variant="outlined" label={`Temperatura: ${plant.sensorReadings.temperature}°C`} />
                                      <Chip
                                        size="small"
                                        variant="outlined"
                                        label={`Condutividade: ${plant.sensorReadings.conductivity} mS/cm`}
                                      />
                                    </Stack>
                                  ) : (
                                    <Typography variant="caption" color="text.secondary">
                                      Sem telemetria recente para esta planta.
                                    </Typography>
                                  )}

                                  {plantAlerts.length > 0 && (
                                    <Stack spacing={0.8}>
                                      {plantAlerts.map((plantAlert) => (
                                        <Alert key={`${plant.id}-${plantAlert}`} severity={finalStatus === 'critical' ? 'error' : 'warning'}>
                                          {plantAlert}
                                        </Alert>
                                      ))}
                                    </Stack>
                                  )}
                                </Stack>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </Page>
  );
}
