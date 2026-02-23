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
  Grid,
  Stack,
  Switch,
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
                        {area.devices.map((device) => (
                          <Typography key={`${area.id}-${device.id}`} variant="body2" color="text.secondary">
                            • {device.id} — {device.name}
                          </Typography>
                        ))}
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
