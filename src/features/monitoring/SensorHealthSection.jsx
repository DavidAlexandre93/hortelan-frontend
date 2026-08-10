import PropTypes from 'prop-types';
import { Alert, Box, Card, CardContent, Chip, GridLegacy as Grid, Stack, Typography } from '@mui/material';
import BlockchainPanel from '../../components/BlockchainPanel';
import Iconify from '../../components/Iconify';
import { AppWidgetSummary } from '../../sections/@dashboard/app';

export default function SensorHealthSection({ controller }) {
  const { statusSetores, sensoresDestaque, dispositivosAtivos, proximasAcoes, alertasRecentes } = controller;

  return (
    <>
      <Grid item xs={12}>
        <BlockchainPanel />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Status dos setores
            </Typography>
            <Stack spacing={1.5}>
              {statusSetores.map((setor) => (
                <Box key={setor.nome}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="subtitle2">{setor.nome}</Typography>
                    <Chip label={setor.status} color={setor.color} size="small" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {setor.detalhe}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Sensores em destaque
            </Typography>
            <Stack spacing={1.5}>
              {sensoresDestaque.map((sensor) => (
                <Stack key={sensor.title} direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon={sensor.icon1} width={20} height={20} />
                    <Typography variant="body2">{sensor.title}</Typography>
                  </Stack>
                  <Chip label={sensor.leitura} size="small" color={sensor.color} variant="outlined" />
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <AppWidgetSummary
          title="Dispositivos ativos"
          total={dispositivosAtivos.ativos}
          color="success"
          icon1="mdi:access-point-network"
          sx={{ height: '100%' }}
        />
        <Card variant="outlined" sx={{ mt: 1.5 }}>
          <CardContent sx={{ py: 1.5 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Offline
              </Typography>
              <Typography variant="subtitle2">{dispositivosAtivos.offline}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Automações ativas
              </Typography>
              <Typography variant="subtitle2">{dispositivosAtivos.automacoes}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Próximas ações recomendadas
            </Typography>
            <Stack spacing={1}>
              {proximasAcoes.map((acao) => (
                <Alert
                  key={acao}
                  severity="info"
                  icon={<Iconify icon="mdi:clipboard-text-clock-outline" width={20} height={20} />}
                >
                  {acao}
                </Alert>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Alertas recentes
            </Typography>
            <Stack spacing={1}>
              {alertasRecentes.map((alerta) => (
                <Alert key={alerta.mensagem} severity={alerta.severidade}>
                  {alerta.mensagem}
                </Alert>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

SensorHealthSection.propTypes = { controller: PropTypes.object.isRequired };
