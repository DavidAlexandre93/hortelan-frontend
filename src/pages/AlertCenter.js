import { useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import Page from '../components/Page';

const alertTypes = [
  'Sensor offline',
  'Bateria fraca',
  'Umidade fora da faixa',
  'Temperatura fora da faixa',
  'Reservatório baixo',
  'Falha de automação',
  'Tarefa atrasada',
  'Risco climático',
];

const alertsSeed = [
  {
    id: 'ALT-001',
    title: 'Sensor de umidade sem comunicação',
    type: 'Sensor offline',
    severity: 'Crítica',
    garden: 'Horta Estufa A',
    status: 'ativo',
    source: 'gateway-01',
    time: '10:42',
  },
  {
    id: 'ALT-002',
    title: 'Nível do reservatório abaixo de 20%',
    type: 'Reservatório baixo',
    severity: 'Alta',
    garden: 'Hidroponia Norte',
    status: 'ativo',
    source: 'sensor-reservatorio',
    time: '10:15',
  },
  {
    id: 'ALT-003',
    title: 'Bateria do nó LoRa em 12%',
    type: 'Bateria fraca',
    severity: 'Média',
    garden: 'Canteiro B',
    status: 'ativo',
    source: 'lora-node-07',
    time: '09:57',
  },
  {
    id: 'ALT-004',
    title: 'Umidade do solo fora da faixa alvo',
    type: 'Umidade fora da faixa',
    severity: 'Alta',
    garden: 'Jardim Vertical',
    status: 'resolvido',
    source: 'sensor-umidade-03',
    time: 'Ontem 18:24',
  },
  {
    id: 'ALT-005',
    title: 'Irrigação automática não executada',
    type: 'Falha de automação',
    severity: 'Crítica',
    garden: 'Horta Estufa A',
    status: 'ativo',
    source: 'automation-engine',
    time: '09:40',
  },
  {
    id: 'ALT-006',
    title: 'Risco climático de geada nas próximas 6h',
    type: 'Risco climático',
    severity: 'Alta',
    garden: 'Campo Sul',
    status: 'resolvido',
    source: 'weather-api',
    time: 'Ontem 06:10',
  },
  {
    id: 'ALT-007',
    title: 'Tarefa de inspeção sanitária atrasada',
    type: 'Tarefa atrasada',
    severity: 'Baixa',
    garden: 'Canteiro B',
    status: 'ativo',
    source: 'agenda',
    time: '08:05',
  },
  {
    id: 'ALT-008',
    title: 'Temperatura acima de 34°C',
    type: 'Temperatura fora da faixa',
    severity: 'Crítica',
    garden: 'Hidroponia Norte',
    status: 'ativo',
    source: 'sensor-temp-11',
    time: '10:28',
  },
];

const incidentsSeed = [
  {
    id: 'INC-13',
    title: 'Intermitência no gateway da Estufa A',
    owner: 'Carla Mendes',
    status: 'em análise',
    resolutionTime: '02h 18m',
    comments: ['Reinício remoto executado', 'Aguardando troca da fonte'],
  },
  {
    id: 'INC-14',
    title: 'Falha recorrente da automação da bomba 2',
    owner: 'Diego Rocha',
    status: 'aberto',
    resolutionTime: '00h 46m',
    comments: ['Incidente aberto automaticamente por escalonamento crítico'],
  },
  {
    id: 'INC-10',
    title: 'Risco climático tratado com manta térmica',
    owner: 'Equipe Campo Sul',
    status: 'resolvido',
    resolutionTime: '05h 10m',
    comments: ['Ação preventiva concluída sem perda de cultivo'],
  },
];

const severityColors = {
  Crítica: 'error',
  Alta: 'warning',
  Média: 'info',
  Baixa: 'default',
};

export default function AlertCenter() {
  const [tab, setTab] = useState('ativos');
  const [query, setQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [gardenFilter, setGardenFilter] = useState('todos');
  const [policy, setPolicy] = useState({
    webPush: true,
    email: true,
    inApp: true,
    whatsappSms: false,
    silenceWindow: true,
    escalation: true,
    maxFrequencyPerHour: 3,
    silenceByType: true,
  });

  const gardens = useMemo(() => ['todos', ...new Set(alertsSeed.map((alert) => alert.garden))], []);

  const filteredAlerts = useMemo(
    () =>
      alertsSeed.filter((alert) => {
        const isActiveTab = tab === 'ativos' ? alert.status === 'ativo' : alert.status === 'resolvido';
        const severityMatch = severityFilter === 'todos' || alert.severity === severityFilter;
        const typeMatch = typeFilter === 'todos' || alert.type === typeFilter;
        const gardenMatch = gardenFilter === 'todos' || alert.garden === gardenFilter;
        const searchValue = `${alert.id} ${alert.title} ${alert.type} ${alert.garden} ${alert.source}`.toLowerCase();
        const searchMatch = searchValue.includes(query.toLowerCase());

        return isActiveTab && severityMatch && typeMatch && gardenMatch && searchMatch;
      }),
    [gardenFilter, query, severityFilter, tab, typeFilter]
  );

  return (
    <Page title="Central de Alertas">
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Central de alertas
            </Typography>
            <Typography color="text.secondary">
              Monitore alertas ativos, histórico resolvido, políticas de notificação e gestão de incidentes em um único painel.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Stack spacing={2.5}>
                    <Tabs value={tab} onChange={(_, value) => setTab(value)}>
                      <Tab value="ativos" label="Alertas ativos" />
                      <Tab value="resolvidos" label="Alertas resolvidos" />
                    </Tabs>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Busca de alertas"
                          placeholder="ID, fonte, título..."
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Criticidade</InputLabel>
                          <Select value={severityFilter} label="Criticidade" onChange={(event) => setSeverityFilter(event.target.value)}>
                            <MenuItem value="todos">Todas</MenuItem>
                            <MenuItem value="Crítica">Crítica</MenuItem>
                            <MenuItem value="Alta">Alta</MenuItem>
                            <MenuItem value="Média">Média</MenuItem>
                            <MenuItem value="Baixa">Baixa</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6} lg={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Tipo</InputLabel>
                          <Select value={typeFilter} label="Tipo" onChange={(event) => setTypeFilter(event.target.value)}>
                            <MenuItem value="todos">Todos</MenuItem>
                            {alertTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6} lg={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Horta</InputLabel>
                          <Select value={gardenFilter} label="Horta" onChange={(event) => setGardenFilter(event.target.value)}>
                            {gardens.map((garden) => (
                              <MenuItem key={garden} value={garden}>
                                {garden === 'todos' ? 'Todas' : garden}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <List disablePadding>
                      {filteredAlerts.map((alert) => (
                        <ListItem key={alert.id} divider secondaryAction={<Chip size="small" label={alert.severity} color={severityColors[alert.severity]} />}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: alert.status === 'ativo' ? 'warning.lighter' : 'success.lighter' }}>
                              {alert.status === 'ativo' ? <WarningAmberRoundedIcon color="warning" /> : <CheckCircleRoundedIcon color="success" />}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${alert.id} • ${alert.title}`}
                            secondary={`${alert.type} • ${alert.garden} • origem: ${alert.source} • ${alert.time}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                    {filteredAlerts.length === 0 && <Alert severity="info">Nenhum alerta encontrado para os filtros aplicados.</Alert>}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                <Card>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Typography variant="h6">Tipos de alerta monitorados</Typography>
                      <Stack direction="row" gap={1} flexWrap="wrap">
                        {alertTypes.map((type) => (
                          <Chip key={type} label={type} variant="outlined" size="small" />
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Typography variant="h6">Notificações</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">Web push (navegador)</Typography>
                        <Switch checked={policy.webPush} onChange={(event) => setPolicy((prev) => ({ ...prev, webPush: event.target.checked }))} />
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">E-mail</Typography>
                        <Switch checked={policy.email} onChange={(event) => setPolicy((prev) => ({ ...prev, email: event.target.checked }))} />
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">In-app</Typography>
                        <Switch checked={policy.inApp} onChange={(event) => setPolicy((prev) => ({ ...prev, inApp: event.target.checked }))} />
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">WhatsApp/SMS (futuro)</Typography>
                        <Switch
                          checked={policy.whatsappSms}
                          onChange={(event) => setPolicy((prev) => ({ ...prev, whatsappSms: event.target.checked }))}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Typography variant="h6">Política de notificações</Typography>
                      <Alert severity="warning" icon={<ErrorOutlineRoundedIcon />}>
                        Silenciamento por tipo e janela de silêncio entre 22:00 e 06:00.
                      </Alert>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">Silenciar tipos específicos</Typography>
                        <Switch checked={policy.silenceByType} onChange={(event) => setPolicy((prev) => ({ ...prev, silenceByType: event.target.checked }))} />
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">Horário de silêncio</Typography>
                        <Switch
                          checked={policy.silenceWindow}
                          onChange={(event) => setPolicy((prev) => ({ ...prev, silenceWindow: event.target.checked }))}
                        />
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">Escalonamento crítico persistente</Typography>
                        <Switch
                          checked={policy.escalation}
                          onChange={(event) => setPolicy((prev) => ({ ...prev, escalation: event.target.checked }))}
                        />
                      </Stack>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Frequência máxima ({policy.maxFrequencyPerHour} notificação(ões)/hora)
                        </Typography>
                        <Slider
                          value={policy.maxFrequencyPerHour}
                          min={1}
                          max={10}
                          valueLabelDisplay="auto"
                          onChange={(_, value) => setPolicy((prev) => ({ ...prev, maxFrequencyPerHour: value }))}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Gestão de incidentes (fase avançada)</Typography>
                <Typography variant="body2" color="text.secondary">
                  Fluxo operacional: abrir incidente, atribuir responsável, registrar comentários internos, atualizar status e acompanhar tempo de resolução.
                </Typography>
                <Divider />
                <List disablePadding>
                  {incidentsSeed.map((incident) => (
                    <ListItem
                      key={incident.id}
                      divider
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <Chip label={incident.status} color={incident.status === 'resolvido' ? 'success' : 'warning'} size="small" />
                          <Chip label={`TTR ${incident.resolutionTime}`} variant="outlined" size="small" />
                        </Stack>
                      }
                    >
                      <ListItemText
                        primary={`${incident.id} • ${incident.title}`}
                        secondary={
                          <>
                            Responsável: {incident.owner}
                            <br />
                            Comentários: {incident.comments.join(' • ')}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}
