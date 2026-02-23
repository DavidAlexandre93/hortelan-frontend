import SensorsIcon from '@mui/icons-material/Sensors';
import RouterIcon from '@mui/icons-material/Router';
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import Battery4BarRoundedIcon from '@mui/icons-material/Battery4BarRounded';
import UsbRoundedIcon from '@mui/icons-material/UsbRounded';
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded';
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
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import Page from '../components/Page';

const signalQualityConfig = {
  excelente: { label: 'Excelente', color: 'success' },
  boa: { label: 'Boa', color: 'success' },
  moderada: { label: 'Moderada', color: 'warning' },
  fraca: { label: 'Fraca', color: 'error' },
};

const connectionStateConfig = {
  online: { label: 'Online', color: 'success' },
  offline: { label: 'Offline', color: 'default' },
};

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
      {
        id: 'S-101',
        type: 'sensor',
        name: 'Sensor Solo A',
        top: '28%',
        left: '18%',
        connectionStatus: 'online',
        lastContact: 'há 20s',
        signalQuality: 'excelente',
        batteryLevel: 88,
        firmware: 'v2.4.1',
      },
      {
        id: 'S-102',
        type: 'sensor',
        name: 'Sensor Clima A',
        top: '62%',
        left: '42%',
        connectionStatus: 'online',
        lastContact: 'há 1min',
        signalQuality: 'boa',
        batteryLevel: 73,
        firmware: 'v2.3.9',
      },
      {
        id: 'D-014',
        type: 'device',
        name: 'Bomba de Irrigação',
        top: '18%',
        left: '74%',
        connectionStatus: 'online',
        lastContact: 'há 9s',
        signalQuality: null,
        batteryLevel: null,
        firmware: 'v1.8.0',
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
      {
        id: 'S-205',
        type: 'sensor',
        name: 'Sensor Umidade B',
        top: '36%',
        left: '20%',
        connectionStatus: 'offline',
        lastContact: 'há 17min',
        signalQuality: 'fraca',
        batteryLevel: 14,
        firmware: 'v2.2.7',
      },
      {
        id: 'D-118',
        type: 'device',
        name: 'Válvula Setor 2',
        top: '68%',
        left: '58%',
        connectionStatus: 'online',
        lastContact: 'há 12s',
        signalQuality: 'moderada',
        batteryLevel: null,
        firmware: 'v1.6.4',
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
      {
        id: 'S-307',
        type: 'sensor',
        name: 'Sensor Temperatura C',
        top: '48%',
        left: '30%',
        connectionStatus: 'online',
        lastContact: 'há 34s',
        signalQuality: 'boa',
        batteryLevel: 62,
        firmware: 'v2.1.5',
      },
      {
        id: 'D-219',
        type: 'device',
        name: 'Exaustor Principal',
        top: '24%',
        left: '68%',
        connectionStatus: 'offline',
        lastContact: 'há 4min',
        signalQuality: null,
        batteryLevel: null,
        firmware: 'v1.4.2',
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
      {
        id: 'S-412',
        type: 'sensor',
        name: 'Sensor pH D',
        top: '54%',
        left: '22%',
        connectionStatus: 'online',
        lastContact: 'há 42s',
        signalQuality: 'excelente',
        batteryLevel: 91,
        firmware: 'v2.5.0',
      },
      {
        id: 'D-333',
        type: 'device',
        name: 'Misturador',
        top: '42%',
        left: '64%',
        connectionStatus: 'online',
        lastContact: 'há 7s',
        signalQuality: null,
        batteryLevel: null,
        firmware: 'v1.3.8',
      },
      {
        id: 'S-413',
        type: 'sensor',
        name: 'Sensor Umidade D',
        top: '70%',
        left: '82%',
        connectionStatus: 'online',
        lastContact: 'há 25s',
        signalQuality: 'boa',
        batteryLevel: 67,
        firmware: 'v2.3.1',
      },
    ],
    alerts: [],
  },
];

export default function StatusPage() {
  const totalDevices = greenhouseAreas.reduce((acc, area) => acc + area.devices.length, 0);
  const totalAlerts = greenhouseAreas.reduce((acc, area) => acc + area.alerts.length, 0);

  return (
    <Page title="Status por Área">
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">Layout operacional das áreas</Typography>
            <Typography color="text.secondary">
              Visualização espacial com posicionamento de sensores/dispositivos e status em tempo real por área.
            </Typography>
          </Stack>

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
            {greenhouseAreas.map((area) => {
              const config = areaStatusConfig[area.status];

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
                        {area.devices.map((device) => {
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
                                color={isSensor ? 'primary' : 'default'}
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
