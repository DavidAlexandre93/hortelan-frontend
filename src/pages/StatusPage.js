import { useEffect, useMemo, useState } from 'react';
import SensorsIcon from '@mui/icons-material/Sensors';
import RouterIcon from '@mui/icons-material/Router';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
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
  normal: {
    label: 'Normal',
    color: 'success',
    bgColor: 'success.lighter',
    borderColor: 'success.light',
    icon: CheckCircleRoundedIcon,
  },
  warning: {
    label: 'Atenção',
    color: 'warning',
    bgColor: 'warning.lighter',
    borderColor: 'warning.light',
    icon: WarningAmberRoundedIcon,
  },
  critical: {
    label: 'Crítico',
    color: 'error',
    bgColor: 'error.lighter',
    borderColor: 'error.light',
    icon: ErrorRoundedIcon,
  },
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
    size: { xs: 12, md: 7 },
    devices: [
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
    size: { xs: 12, md: 5 },
    devices: [
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
    size: { xs: 12, md: 4 },
    devices: [
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

  const visibleIncidents = useMemo(() => {
    if (alertTypeFilter === 'all') return prioritizedIncidents;
    return prioritizedIncidents.filter((incident) => incident.type === alertTypeFilter);
  }, [alertTypeFilter, prioritizedIncidents]);

  return (
    <Page title="Status por Área">
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">Monitoramento e alertas operacionais</Typography>
            <Typography color="text.secondary">
              Painel com priorização de incidentes, alertas por criticidade e filtros por tipo de alerta.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Atualização automática a cada 6s • Última atualização: {dateTimeFormatter.format(new Date(lastRefreshAt))}
            </Typography>
          </Stack>

          <Grid container spacing={2}>
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
