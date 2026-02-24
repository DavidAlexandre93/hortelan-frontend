import { useEffect, useMemo, useState } from 'react';
import SensorsIcon from '@mui/icons-material/Sensors';
import RouterIcon from '@mui/icons-material/Router';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import {
  Alert,
  Box,
  Button,
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

const greenhouseAreas = [
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

const streamTemplates = [
  { type: 'telemetry', severity: 'info', text: 'Medição recebida' },
  { type: 'alert', severity: 'warning', text: 'Alerta ativo detectado' },
  { type: 'connectivity', severity: 'info', text: 'Heartbeat de conectividade' },
  { type: 'actuator', severity: 'success', text: 'Ação de atuador confirmada' },
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildInitialAlerts() {
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

function buildInitialActuators() {
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

export default function StatusPage() {
  const [selectedArea, setSelectedArea] = useState('all');
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState(() => buildInitialAlerts());
  const [actuators, setActuators] = useState(() => buildInitialActuators());
  const [automationSuspendedAt, setAutomationSuspendedAt] = useState(null);
  const [interventions, setInterventions] = useState([]);

  const automationSuspended = Boolean(automationSuspendedAt);

  useEffect(() => {
    const interval = setInterval(() => {
      const area = randomItem(greenhouseAreas);
      const device = randomItem(area.devices);
      const availableTemplates = automationSuspended
        ? streamTemplates.filter((template) => template.type !== 'actuator')
        : streamTemplates;
      const template = randomItem(availableTemplates);
      const createdAt = new Date().toISOString();

      const event = {
        id: `${createdAt}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt,
        areaId: area.id,
        areaName: area.name,
        deviceName: device.name,
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

    return () => clearInterval(interval);
  }, [automationSuspended]);

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
  const filteredActuators = selectedArea === 'all' ? actuators : actuators.filter((actuator) => actuator.areaId === selectedArea);
  const filteredInterventions = selectedArea === 'all'
    ? interventions
    : interventions.filter((entry) => entry.areaId === selectedArea || entry.areaId === 'global');

  const totalDevices = greenhouseAreas.reduce((acc, area) => acc + area.devices.length, 0);
  const offlineDevices = greenhouseAreas.reduce(
    (acc, area) => acc + area.devices.filter((device) => device.connectionStatus === 'offline').length,
    0
  );

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

  const appendIntervention = ({ areaId = 'global', areaName = 'Todas as áreas', type, description, deviceName = '-' }) => {
    const createdAt = new Date().toISOString();

    setInterventions((prev) => [
      {
        id: `${createdAt}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt,
        areaId,
        areaName,
        type,
        description,
        deviceName,
      },
      ...prev,
    ]);
  };

  const handleActuatorToggle = (actuatorId) => {
    setActuators((prev) =>
      prev.map((actuator) => {
        if (actuator.id !== actuatorId) {
          return actuator;
        }

        const nextState = !actuator.isOn;
        appendIntervention({
          areaId: actuator.areaId,
          areaName: actuator.areaName,
          type: nextState ? 'LIGAR_ATUADOR' : 'DESLIGAR_ATUADOR',
          description: `Atuador ${nextState ? 'ligado' : 'desligado'} manualmente`,
          deviceName: actuator.name,
        });

        return {
          ...actuator,
          isOn: nextState,
        };
      })
    );
  };

  const handleSuspendAutomation = () => {
    if (automationSuspended) {
      return;
    }

    const suspendedAt = new Date().toISOString();
    setAutomationSuspendedAt(suspendedAt);
    appendIntervention({
      type: 'SUSPENDER_AUTOMACAO',
      description: 'Automação suspensa temporariamente por intervenção manual',
    });
  };

  const handleResumeAutomation = () => {
    if (!automationSuspended) {
      return;
    }

    setAutomationSuspendedAt(null);
    appendIntervention({
      type: 'RETOMAR_AUTOMACAO',
      description: 'Automação retomada e controle automático restabelecido',
    });
  };

  return (
    <Page title="Status operacional">
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Monitoramento em tempo real
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Painel consolidado de estufas, sensores, atuadores e fluxo de eventos.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Áreas monitoradas
                  </Typography>
                  <Typography variant="h4">{greenhouseAreas.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dispositivos totais
                  </Typography>
                  <Typography variant="h4">{totalDevices}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dispositivos offline
                  </Typography>
                  <Typography variant="h4" color={offlineDevices > 0 ? 'error.main' : 'success.main'}>
                    {offlineDevices}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Alertas pendentes
                  </Typography>
                  <Typography variant="h4">{activeAlerts.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="status-area-filter-label">Filtrar área</InputLabel>
                <Select
                  labelId="status-area-filter-label"
                  value={selectedArea}
                  label="Filtrar área"
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
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Controles manuais e automação
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Ligue/desligue atuadores manualmente e suspenda ou retome a automação quando necessário.
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="warning"
                      startIcon={<PauseCircleFilledRoundedIcon />}
                      onClick={handleSuspendAutomation}
                      disabled={automationSuspended}
                    >
                      Suspender automação
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="success"
                      startIcon={<PlayCircleFilledRoundedIcon />}
                      onClick={handleResumeAutomation}
                      disabled={!automationSuspended}
                    >
                      Retomar automação
                    </Button>
                  </Stack>

                  <Alert severity={automationSuspended ? 'warning' : 'success'} sx={{ mb: 2 }}>
                    {automationSuspended
                      ? `Automação pausada desde ${dateTimeFormatter.format(new Date(automationSuspendedAt))}`
                      : 'Automação ativa e monitorando atuadores automaticamente.'}
                  </Alert>

                  <Stack spacing={1}>
                    {filteredActuators.map((actuator) => (
                      <Card key={actuator.id} variant="outlined">
                        <CardContent sx={{ py: 1.5 }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <Box>
                              <Typography variant="body2" fontWeight={700}>
                                {actuator.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {actuator.areaName} • {actuator.id}
                              </Typography>
                            </Box>
                            <Button
                              size="small"
                              variant={actuator.isOn ? 'contained' : 'outlined'}
                              color={actuator.isOn ? 'error' : 'primary'}
                              startIcon={<PowerSettingsNewRoundedIcon fontSize="small" />}
                              onClick={() => handleActuatorToggle(actuator.id)}
                            >
                              {actuator.isOn ? 'Desligar' : 'Ligar'}
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

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
                    <Chip
                      icon={<AccessTimeRoundedIcon />}
                      label={`Último: ${events[0] ? dateTimeFormatter.format(new Date(events[0].createdAt)) : '-'}`}
                    />
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

          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <HistoryRoundedIcon color="action" />
                <Typography variant="h6">Registro de intervenções manuais</Typography>
              </Stack>

              <Stack spacing={1.2}>
                {filteredInterventions.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma intervenção manual registrada no filtro atual.
                  </Typography>
                )}
                {filteredInterventions.map((entry) => (
                  <Alert key={entry.id} severity="info">
                    <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} flexWrap="wrap">
                      <Typography variant="body2">
                        <strong>{entry.type}</strong> • {entry.areaName} • {entry.deviceName} — {entry.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dateTimeFormatter.format(new Date(entry.createdAt))}
                      </Typography>
                    </Stack>
                  </Alert>
                ))}
              </Stack>
            </CardContent>
          </Card>

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
                  <Alert key={alert.id} severity="success" icon={<TaskAltRoundedIcon />}>
                    <Typography variant="body2">
                      {alert.areaName} • {alert.deviceName} reconhecido em{' '}
                      {dateTimeFormatter.format(new Date(alert.acknowledgedAt))}
                    </Typography>
                  </Alert>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}
