import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Slider,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@mui/material';
import Page from '../components/Page';
import {
  getReliabilityState,
  logAutomationRun,
  logIntegrationFailure,
  logUserAction,
  registerFrontendUsage,
  updateFeatureFlag,
} from '../services/platformReliability';

const formatDate = (iso) => new Date(iso).toLocaleString('pt-BR');

export default function IntegrationsOps() {
  const [state, setState] = useState(() => getReliabilityState());

  const usageCards = useMemo(
    () => [
      { label: 'Sessões hoje', value: state.observability.frontendUsage.sessionsToday },
      { label: 'Usuários ativos', value: state.observability.frontendUsage.activeUsers },
      { label: 'Média por sessão (min)', value: state.observability.frontendUsage.avgSessionMinutes },
      { label: 'Ações por sessão', value: state.observability.frontendUsage.actionsPerSession },
    ],
    [state.observability.frontendUsage]
  );

  const applyState = (nextState) => {
    registerFrontendUsage(1);
    setState(getReliabilityState());
    return nextState;
  };

  return (
    <Page title="Logs, Observabilidade e Flags | Hortelan AgTech Ltda">
      <Stack spacing={3}>
        <Typography variant="h4">25. Integrações externas, confiabilidade e governança</Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                25.1 Logs e auditoria
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button size="small" variant="contained" onClick={() => applyState(logUserAction('Ajustou permissões da integração CRM'))}>
                  Log de ação
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => applyState(logAutomationRun('Sincronização ERP', 'success', 'Pedido #8831 sincronizado'))}
                >
                  Log automação
                </Button>
              </Stack>
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => applyState(logIntegrationFailure('WhatsApp API', 'critical', 'Token expirado durante envio'))}
              >
                Falha integração
              </Button>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle1">Trilha recente</Typography>
              <List dense>
                {state.logs.userActions.slice(0, 3).map((entry) => (
                  <ListItem key={entry.id}>
                    <ListItemText primary={`${entry.actor} · ${entry.action}`} secondary={formatDate(entry.timestamp)} />
                  </ListItem>
                ))}
                {state.logs.automations.slice(0, 2).map((entry) => (
                  <ListItem key={entry.id}>
                    <ListItemText
                      primary={`${entry.automation} · ${entry.status === 'success' ? 'Sucesso' : 'Falha'}`}
                      secondary={`${entry.detail} · ${formatDate(entry.timestamp)}`}
                    />
                  </ListItem>
                ))}
                {state.logs.integrationFailures.slice(0, 2).map((entry) => (
                  <ListItem key={entry.id}>
                    <ListItemText primary={`Falha em ${entry.integration} (${entry.severity})`} secondary={`${entry.detail} · ${formatDate(entry.timestamp)}`} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            25.2 Observabilidade
          </Typography>
          <Grid container spacing={2}>
            {usageCards.map((card) => (
              <Grid item xs={6} md={3} key={card.label}>
                <Box sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="caption">{card.label}</Typography>
                  <Typography variant="h5">{card.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Performance de páginas e disponibilidade de serviços
          </Typography>
          <Table size="small" sx={{ mt: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell>Página/Serviço</TableCell>
                <TableCell>p95/Latency</TableCell>
                <TableCell>CLS/Uptime</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.observability.pagePerformance.map((page) => (
                <TableRow key={page.page}>
                  <TableCell>{page.page}</TableCell>
                  <TableCell>{page.p95Ms} ms</TableCell>
                  <TableCell>{page.cls}</TableCell>
                  <TableCell>
                    <Chip label="ok" color="success" size="small" />
                  </TableCell>
                </TableRow>
              ))}
              {state.observability.serviceAvailability.map((service) => (
                <TableRow key={service.service}>
                  <TableCell>{service.service}</TableCell>
                  <TableCell>{service.latencyMs} ms</TableCell>
                  <TableCell>{service.uptime}%</TableCell>
                  <TableCell>
                    <Chip label={service.status} color={service.status === 'operational' ? 'success' : 'warning'} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            25.3 Feature flags (fase avançada)
          </Typography>
          <Stack spacing={2}>
            {state.featureFlags.flags.map((flag) => (
              <Box key={flag.key} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 1.5 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="subtitle2">{flag.name}</Typography>
                    <Typography variant="caption">Grupos: {flag.groups.join(', ')}</Typography>
                    <Typography variant="caption" display="block">
                      A/B: variante A {flag.abTest.variantA}% · variante B {flag.abTest.variantB}%
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2">Ativo</Typography>
                    <Switch
                      checked={flag.enabled}
                      onChange={(event) => {
                        updateFeatureFlag(flag.key, { enabled: event.target.checked });
                        logUserAction(`Alterou feature flag ${flag.key} para ${event.target.checked ? 'ativo' : 'inativo'}`);
                        setState(getReliabilityState());
                      }}
                    />
                  </Stack>
                </Stack>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Rollout gradual: {flag.rollout}%
                </Typography>
                <Slider
                  value={flag.rollout}
                  size="small"
                  onChange={(_, value) => {
                    updateFeatureFlag(flag.key, { rollout: value });
                    setState(getReliabilityState());
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Card>

        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            25.4 Backup e recuperação (infra)
          </Typography>
          <Typography variant="subtitle2">Backups de dados</Typography>
          <List dense>
            {state.backupRecovery.backups.map((backup) => (
              <ListItem key={backup.id}>
                <ListItemText primary={`${backup.scope} · ${backup.status}`} secondary={`Início ${formatDate(backup.startedAt)} · RPO ${backup.recoveryPoint}`} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle2">Recuperação de incidentes</Typography>
          <List dense>
            {state.backupRecovery.incidents.map((incident) => (
              <ListItem key={incident.id}>
                <ListItemText primary={`${incident.title} (${incident.status})`} secondary={`Tempo de recuperação: ${incident.recoveryTimeMinutes} min`} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle2">Versionamento de configurações críticas</Typography>
          <List dense>
            {state.backupRecovery.criticalConfigVersions.map((config) => (
              <ListItem key={config.name}>
                <ListItemText primary={`${config.name} · ${config.version}`} secondary={`${config.changedBy} · ${formatDate(config.changedAt)}`} />
              </ListItem>
            ))}
          </List>
        </Card>
      </Stack>
    </Page>
  );
}
