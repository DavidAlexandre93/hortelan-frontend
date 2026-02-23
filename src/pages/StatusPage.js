import { useMemo, useState } from 'react';
import { useEffect, useMemo, useState } from 'react';
import SensorsIcon from '@mui/icons-material/Sensors';
import RouterIcon from '@mui/icons-material/Router';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import Page from '../components/Page';

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
        manualStatus: 'healthy',
        sensorReadings: { moisture: 56, temperature: 24, conductivity: 1.7 },
        alerts: [],
      },
      {
        id: 'PL-002',
        name: 'Manjericão',
        manualStatus: 'attention',
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
        manualStatus: 'attention',
        sensorReadings: { moisture: 29, temperature: 31, conductivity: 0.8 },
        alerts: ['Pontas queimadas em folhas externas'],
      },
      {
        id: 'PL-032',
        name: 'Rúcula',
        manualStatus: 'healthy',
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
        manualStatus: 'critical',
        sensorReadings: { moisture: 18, temperature: 39, conductivity: 2.8 },
        alerts: ['Murcha severa e perda de turgor em 30% das plantas'],
      },
    ],
    alerts: ['Temperatura acima de 38°C', 'Falha intermitente no exaustor principal'],
  },
  {
    id: 'B2',
    name: 'Área de Compostagem',
    status: 'normal',
    size: { xs: 12, md: 8 },
    devices: [
      { id: 'S-412', type: 'sensor', name: 'Sensor pH D', top: '54%', left: '22%' },
      { id: 'D-333', type: 'device', name: 'Misturador', top: '42%', left: '64%' },
      { id: 'S-413', type: 'sensor', name: 'Sensor Umidade D', top: '70%', left: '82%' },
    ],
    plants: [
      {
        id: 'PL-144',
        name: 'Couve Manteiga',
        manualStatus: 'healthy',
        sensorReadings: { moisture: 62, temperature: 23, conductivity: 1.5 },
        alerts: [],
      },
    ],
    alerts: [],
  },
];

const actuatorControls = [
  {
    id: 'water-pump',
    label: 'Bomba de água',
    description: 'Pressurização principal para irrigação por setores.',
    enabled: true,
    phase: 'MVP',
  },
  {
    id: 'solenoid-valve',
    label: 'Válvula / solenoide',
    description: 'Abertura e fechamento por zona para controle fino da rega.',
    enabled: true,
    phase: 'MVP',
  },
  {
    id: 'grow-light',
    label: 'Iluminação grow / LED',
    description: 'Complemento de fotoperíodo para ambientes internos e estufas.',
    enabled: true,
    phase: 'MVP',
  },
  {
    id: 'ventilation',
    label: 'Ventilação / exaustor',
    description: 'Renovação de ar e redução de calor em horários críticos.',
    enabled: true,
    phase: 'MVP',
  },
  {
    id: 'nebulization',
    label: 'Nebulização',
    description: 'Aumento pontual de umidade para mudas e berçários.',
    enabled: false,
    phase: 'Release 2',
  },
  {
    id: 'doser',
    label: 'Dosador',
    description: 'Fertirrigação e correção de pH automatizadas por receita.',
    enabled: false,
    phase: 'Fase avançada',
  },
];
const manualStatusConfig = {
  healthy: { label: 'Saudável', color: 'success' },
  attention: { label: 'Atenção', color: 'warning' },
  critical: { label: 'Crítico', color: 'error' },
};

const statusPriority = { healthy: 1, attention: 2, critical: 3 };

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

  const totalDevices = greenhouseAreas.reduce((acc, area) => acc + area.devices.length, 0);
  const totalAlerts = greenhouseAreas.reduce((acc, area) => acc + area.alerts.length, 0);
  const totalPlants = greenhouseAreas.reduce((acc, area) => acc + area.plants.length, 0);
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'medium',
});

const randomNumberInRange = (min, max, decimalPlaces = 1) => {
  const multiplier = 10 ** decimalPlaces;
  return Math.round((Math.random() * (max - min) + min) * multiplier) / multiplier;
};

const getMeasurementLabel = (device, measurement) => {
  if (device.type === 'sensor') {
    switch (measurement.metric) {
      case 'soilMoisture':
        return `Umidade do solo: ${measurement.value}%`;
      case 'temperature':
        return `Temperatura: ${measurement.value}°C`;
      case 'ph':
        return `pH: ${measurement.value}`;
      default:
        return `Leitura: ${measurement.value}`;
    }
  }

  return measurement.online ? 'Dispositivo online' : 'Dispositivo offline';
};

const buildInitialMeasurements = () =>
  greenhouseAreas.reduce((acc, area) => {
    area.devices.forEach((device) => {
      if (device.type === 'sensor') {
        let metric = 'soilMoisture';
        let value = randomNumberInRange(35, 80);

        if (device.name.toLowerCase().includes('temperatura') || device.name.toLowerCase().includes('clima')) {
          metric = 'temperature';
          value = randomNumberInRange(19, 35);
        }

        if (device.name.toLowerCase().includes('ph')) {
          metric = 'ph';
          value = randomNumberInRange(5.5, 7.4, 2);
        }

        acc[device.id] = {
          metric,
          value,
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

  if (previousMeasurement.metric === 'ph') {
    const nextValue = Math.max(4.8, Math.min(8.5, previousMeasurement.value + randomNumberInRange(-0.12, 0.12, 2)));
    return { ...previousMeasurement, value: Number(nextValue.toFixed(2)), updatedAt: new Date().toISOString() };
  }

  if (previousMeasurement.metric === 'soilMoisture') {
    const nextValue = Math.max(10, Math.min(95, previousMeasurement.value + randomNumberInRange(-2.4, 2.4)));
    return { ...previousMeasurement, value: Number(nextValue.toFixed(1)), updatedAt: new Date().toISOString() };
  }

  const toggledOnline = Math.random() > 0.95 ? !previousMeasurement.online : previousMeasurement.online;
  return { ...previousMeasurement, online: toggledOnline, updatedAt: new Date().toISOString() };
};

export default function StatusPage() {
  const [measurementsByDevice, setMeasurementsByDevice] = useState(() => buildInitialMeasurements());
  const [lastRefreshAt, setLastRefreshAt] = useState(new Date().toISOString());
  const [viewMode, setViewMode] = useState('area');
  const [selectedArea, setSelectedArea] = useState('all');

  useEffect(() => {
    const interval = setInterval(() => {
      setMeasurementsByDevice((previous) => {
        const updated = Object.fromEntries(
          Object.entries(previous).map(([deviceId, measurement]) => [deviceId, getUpdatedMeasurement(measurement)])
        );

        return updated;
      });

      setLastRefreshAt(new Date().toISOString());
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const filteredAreas = useMemo(() => {
    if (selectedArea === 'all') {
      return greenhouseAreas;
    }

    return greenhouseAreas.filter((area) => area.id === selectedArea);
  }, [selectedArea]);

  const totalDevices = greenhouseAreas.reduce((acc, area) => acc + area.devices.length, 0);
  const totalAlerts = greenhouseAreas.reduce((acc, area) => acc + area.alerts.length, 0);
  const totalSensors = greenhouseAreas.reduce(
    (acc, area) => acc + area.devices.filter((device) => device.type === 'sensor').length,
    0
  );

  return (
    <Page title="Status por Área">
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">Layout operacional das áreas</Typography>
            <Typography color="text.secondary">
              Visualização espacial com posicionamento de sensores/dispositivos e status em tempo real por área.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Atualização automática a cada 6s • Última atualização: {dateTimeFormatter.format(new Date(lastRefreshAt))}
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="view-mode-label">Visualização</InputLabel>
                <Select
                  labelId="view-mode-label"
                  value={viewMode}
                  label="Visualização"
                  onChange={(event) => setViewMode(event.target.value)}
                >
                  <MenuItem value="area">Por área</MenuItem>
                  <MenuItem value="sensor">Por sensor</MenuItem>
                  <MenuItem value="device">Por dispositivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="area-filter-label">Filtrar área</InputLabel>
                <Select
                  labelId="area-filter-label"
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
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Leitura em quase tempo real
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {viewMode === 'area' && 'Layout com todos os pontos e última medição por item.'}
                    {viewMode === 'sensor' && `Exibindo ${totalSensors} sensores com timestamps das medições.`}
                    {viewMode === 'device' && `Exibindo ${totalDevices - totalSensors} dispositivos com status atualizado.`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Áreas monitoradas
                  </Typography>
                  <Typography variant="h3">{greenhouseAreas.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Sensores e dispositivos
                  </Typography>
                  <Typography variant="h3">{totalDevices}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Alertas ativos
                  </Typography>
                  <Typography variant="h3" color={totalAlerts > 0 ? 'error.main' : 'success.main'}>
                    {totalAlerts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Plantas acompanhadas
                  </Typography>
                  <Typography variant="h3">{totalPlants}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {Object.entries(areaStatusConfig).map(([status, config]) => (
              <Chip
                key={status}
                color={config.color}
                variant="outlined"
                icon={<config.icon fontSize="small" />}
                label={`Status ${config.label}`}
              />
            ))}
            <Chip icon={<SensorsIcon fontSize="small" />} label="Sensor" variant="outlined" />
            <Chip icon={<RouterIcon fontSize="small" />} label="Dispositivo" variant="outlined" />
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h6">Painel de atuadores</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Controles disponibilizados para operação remota e automação por regras.
                      </Typography>
                    </Box>

                    {actuatorControls.map((actuator, index) => (
                      <Box key={actuator.id}>
                        {index > 0 && <Divider sx={{ mb: 1.5 }} />}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography variant="subtitle2">{actuator.label}</Typography>
                              <Chip size="small" label={actuator.phase} color="primary" variant="outlined" />
                            </Stack>
                            <Typography variant="caption" color="text.secondary">
                              {actuator.description}
                            </Typography>
                          </Box>
                          <FormControlLabel
                            control={<Switch defaultChecked={actuator.enabled} color="success" />}
                            label=""
                            sx={{ m: 0 }}
                          />
                        </Stack>
                      </Box>
                    ))}

                    <Button variant="contained">Acionar rotina manual</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {greenhouseAreas.map((area) => {
            {filteredAreas.map((area) => {
              const config = areaStatusConfig[area.status];
              const scopedDevices = area.devices.filter((device) => {
                if (viewMode === 'sensor') {
                  return device.type === 'sensor';
                }

                if (viewMode === 'device') {
                  return device.type === 'device';
                }

                return true;
              });

              if (scopedDevices.length === 0) {
                return null;
              }

              return (
                <Grid item key={area.id} xs={area.size.xs} md={area.size.md}>
                  <Card
                    sx={{
                      border: 1,
                      borderColor: config.borderColor,
                      bgcolor: config.bgColor,
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle1">{area.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Código: {area.id}
                          </Typography>
                        </Stack>
                        <Chip
                          size="small"
                          icon={<config.icon fontSize="small" />}
                          label={config.label}
                          color={config.color}
                        />
                      </Stack>

                      <Box
                        sx={{
                          position: 'relative',
                          borderRadius: 2,
                          bgcolor: 'background.paper',
                          border: '1px dashed',
                          borderColor: 'divider',
                          minHeight: 190,
                          p: 1,
                          overflow: 'hidden',
                        }}
                      >
                        {scopedDevices.map((device) => {
                          const isSensor = device.type === 'sensor';
                          const measurement = measurementsByDevice[device.id];

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
                                color={isSensor ? 'primary' : measurement?.online ? 'success' : 'error'}
                                variant={isSensor ? 'filled' : 'outlined'}
                              />
                            </Box>
                          );
                        })}
                      </Box>

                      <Stack spacing={1} sx={{ mt: 2 }}>
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
