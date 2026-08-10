import PropTypes from 'prop-types';
import {
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  GridLegacy as Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { climaExternoAtual, historicoClimaticoCorrelacionado, previsaoClimatica } from './model';

export default function ClimateIntelligence({
  recommendations: recomendacoesClimaticas,
  alerts: alertasClimaticos,
  rules: regrasClimaticas,
}) {
  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Inteligência climática externa
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Dados externos integrados para ajustar recomendações, irrigação e alertas preventivos.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Stack spacing={1.5}>
                  <Chip label={`Local: ${climaExternoAtual.local}`} color="primary" variant="outlined" />
                  <Typography variant="body2" color="text.secondary">
                    Atualizado em {climaExternoAtual.atualizadoEm}
                  </Typography>
                  <Typography variant="body2">{climaExternoAtual.condicao}</Typography>
                  <Divider />
                  <Typography variant="body2">Temperatura externa: {climaExternoAtual.temperatura} °C</Typography>
                  <Typography variant="body2">Umidade externa: {climaExternoAtual.umidade}%</Typography>
                  <Typography variant="body2">Previsão de chuva: {climaExternoAtual.chuvaChance}%</Typography>
                  <Typography variant="body2">Velocidade do vento: {climaExternoAtual.vento} km/h</Typography>
                  <Typography variant="body2">Insolação: {climaExternoAtual.insolacao} kWh/m²</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Impacto no cultivo e recomendações
                </Typography>
                <Stack spacing={1}>
                  {recomendacoesClimaticas.map((item) => (
                    <Alert key={item} severity="success" variant="outlined">
                      {item}
                    </Alert>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Alertas climáticos ativos
                </Typography>
                {alertasClimaticos.length === 0 ? (
                  <Alert severity="success">Sem alertas de frio/calor ou chuva no momento.</Alert>
                ) : (
                  <Stack spacing={1}>
                    {alertasClimaticos.map((alerta) => (
                      <Alert key={alerta.mensagem} severity={alerta.tipo}>
                        {alerta.mensagem}
                      </Alert>
                    ))}
                  </Stack>
                )}
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 0.5 }} />
                <Typography variant="subtitle2" sx={{ mb: 1.5, mt: 1 }}>
                  Regras com clima externo
                </Typography>
                <Grid container spacing={1.5}>
                  {regrasClimaticas.map((item) => (
                    <Grid key={item.regra} item xs={12} md={4}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">{item.regra}</Typography>
                            <Chip
                              size="small"
                              label={item.status}
                              color={
                                item.status === 'Ativada'
                                  ? 'success'
                                  : item.status === 'Inativa'
                                    ? 'default'
                                    : 'warning'
                              }
                            />
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {item.detalhe}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Previsão climática de curto prazo
                </Typography>
                <List disablePadding>
                  {previsaoClimatica.map((item, index) => (
                    <ListItem key={item.periodo} disableGutters divider={index < previsaoClimatica.length - 1}>
                      <ListItemText
                        primary={`${item.periodo} • ${item.condicao}`}
                        secondary={`Temp: ${item.temp}°C • Chuva: ${item.chuva}%`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Histórico climático correlacionado
                </Typography>
                <List disablePadding>
                  {historicoClimaticoCorrelacionado.map((item, index) => (
                    <ListItem
                      key={item.periodo}
                      disableGutters
                      divider={index < historicoClimaticoCorrelacionado.length - 1}
                    >
                      <ListItemText
                        primary={`${item.periodo} • Produtividade ${item.produtividade}`}
                        secondary={`${item.clima}. ${item.evento}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

ClimateIntelligence.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  recommendations: PropTypes.arrayOf(PropTypes.string).isRequired,
  rules: PropTypes.arrayOf(PropTypes.object).isRequired,
};
