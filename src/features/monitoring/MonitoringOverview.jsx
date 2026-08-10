import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  FormGroup,
  GridLegacy as Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { AppSensorAnalytics, AppWidgetSummary } from '../../sections/@dashboard/app';
import { gardenStatusList } from './model';

export default function MonitoringOverview({ enabledWidgets, onToggleWidget, metrics, tasks }) {
  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Widgets personalizáveis do dashboard
            </Typography>
            <FormGroup row sx={{ rowGap: 1, columnGap: 1, '& .MuiFormControlLabel-root': { mr: 1 } }}>
              <FormControlLabel
                control={<Switch checked={enabledWidgets.resumoHortas} onChange={onToggleWidget('resumoHortas')} />}
                label="Resumo das hortas"
              />
              <FormControlLabel
                control={<Switch checked={enabledWidgets.indicadores} onChange={onToggleWidget('indicadores')} />}
                label="Indicadores principais"
              />
              <FormControlLabel
                control={
                  <Switch checked={enabledWidgets.tarefasPendentes} onChange={onToggleWidget('tarefasPendentes')} />
                }
                label="Tarefas pendentes"
              />
            </FormGroup>
          </CardContent>
        </Card>
      </Grid>

      {enabledWidgets.indicadores && (
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'grid',
              width: '100%',
              gap: 3,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
            }}
          >
            <AppWidgetSummary
              title="Umidade média"
              total={metrics.humidity}
              icon1="carbon:soil-moisture-field"
              color="primary"
            />

            <AppWidgetSummary
              title="Temperatura média"
              total={metrics.temperature}
              icon1="mdi:temperature-celsius"
              color="warning"
            />

            <AppWidgetSummary title="Alertas ativos" total={metrics.alerts} icon1="icon-park:alarm" color="error" />
          </Box>
        </Grid>
      )}

      {enabledWidgets.resumoHortas && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Resumo do status de todas as hortas
              </Typography>
              <Grid container spacing={2}>
                {gardenStatusList.map((horta) => (
                  <Grid item xs={12} md={6} lg={3} key={horta.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1">{horta.nome}</Typography>
                        <Stack spacing={1} sx={{ mt: 1.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            Umidade: <strong>{horta.umidade}%</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Temperatura: <strong>{horta.temperatura}°C</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Alertas: <strong>{horta.alertas}</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tarefas pendentes: <strong>{horta.tarefasPendentes}</strong>
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}

      {enabledWidgets.tarefasPendentes && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Visão rápida de tarefas pendentes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Priorização automática por impacto operacional.
              </Typography>
              <List disablePadding>
                {tasks.map((task, index) => (
                  <ListItem key={task.id} disableGutters divider={index < tasks.length - 1}>
                    <ListItemText
                      primary={task.titulo}
                      secondary={`Horta: ${task.horta}`}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                    />
                    <Chip
                      size="small"
                      label={task.prioridade}
                      color={task.prioridade === 'Alta' ? 'error' : task.prioridade === 'Média' ? 'warning' : 'default'}
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      )}

      <Grid item xs={12}>
        <AppSensorAnalytics />
      </Grid>
    </>
  );
}

MonitoringOverview.propTypes = {
  enabledWidgets: PropTypes.objectOf(PropTypes.bool).isRequired,
  metrics: PropTypes.shape({
    alerts: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    temperature: PropTypes.number.isRequired,
  }).isRequired,
  onToggleWidget: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
};
