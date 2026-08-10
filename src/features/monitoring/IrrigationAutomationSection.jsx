import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  GridLegacy as Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { diasSemana } from './model';

export default function IrrigationAutomationSection({ controller }) {
  const {
    programacao,
    atualizarProgramacao,
    alternarDiaRecorrencia,
    salvarProgramacao,
    agendamentosAtivos,
    evaluatedConditionRules,
    onThresholdChange,
    onToggleConditionRule,
    triggeredRules,
  } = controller;

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Programador de automações
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configure rega por horário, iluminação por ciclo, ventilação periódica e calendários recorrentes.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Rega por horário"
                  type="time"
                  value={programacao.irrigacaoHora}
                  onChange={(event) => atualizarProgramacao('irrigacaoHora', event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Iluminação - início"
                  type="time"
                  value={programacao.iluminacaoInicio}
                  onChange={(event) => atualizarProgramacao('iluminacaoInicio', event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Iluminação - fim"
                  type="time"
                  value={programacao.iluminacaoFim}
                  onChange={(event) => atualizarProgramacao('iluminacaoFim', event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Ventilação (intervalo min)"
                  type="number"
                  value={programacao.ventilacaoIntervalo}
                  onChange={(event) => atualizarProgramacao('ventilacaoIntervalo', Number(event.target.value))}
                  inputProps={{ min: 5 }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Ventilação (duração min)"
                  type="number"
                  value={programacao.ventilacaoDuracao}
                  onChange={(event) => atualizarProgramacao('ventilacaoDuracao', Number(event.target.value))}
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12} md={9}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Calendário recorrente
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {diasSemana.map((dia) => (
                    <Chip
                      key={dia.value}
                      clickable
                      color={programacao.recorrencia.includes(dia.value) ? 'primary' : 'default'}
                      variant={programacao.recorrencia.includes(dia.value) ? 'filled' : 'outlined'}
                      label={dia.label}
                      onClick={() => alternarDiaRecorrencia(dia.value)}
                    />
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" onClick={salvarProgramacao}>
                  Salvar programação
                </Button>
              </Grid>
            </Grid>

            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                  Programações ativas
                </Typography>
                {agendamentosAtivos.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma programação salva ainda.
                  </Typography>
                ) : (
                  <Stack spacing={1.2}>
                    {agendamentosAtivos.map((item) => (
                      <Card key={item.id} variant="outlined">
                        <CardContent sx={{ py: 1.5 }}>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between">
                            <Typography variant="body2">
                              Rega às <strong>{item.irrigacaoHora}</strong> • Luz de{' '}
                              <strong>{item.iluminacaoInicio}</strong> até <strong>{item.iluminacaoFim}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Ventilação a cada {item.ventilacaoIntervalo} min por {item.ventilacaoDuracao} min
                            </Typography>
                          </Stack>
                          <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mt: 1 }}>
                            {item.recorrencia.map((dia) => (
                              <Chip
                                key={`${item.id}-${dia}`}
                                size="small"
                                label={diasSemana.find((opt) => opt.value === dia)?.label || dia}
                              />
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
              <Typography variant="h5">Regras por condição (if/then)</Typography>
              <Chip
                color={triggeredRules.length > 0 ? 'warning' : 'success'}
                label={
                  triggeredRules.length > 0
                    ? `${triggeredRules.length} ação(ões) pronta(s) para execução`
                    : 'Nenhuma condição acionada no momento'
                }
              />
            </Stack>

            <Grid container spacing={2}>
              {evaluatedConditionRules.map((rule) => (
                <Grid item xs={12} md={4} key={rule.id}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Stack spacing={1.5}>
                        <FormControlLabel
                          control={<Switch checked={rule.enabled} onChange={onToggleConditionRule(rule.id)} />}
                          label={rule.label}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Leitura atual de {rule.sensorLabel.toLowerCase()}: <strong>{rule.currentValue}</strong>
                          {rule.sensor === 'temperatura' ? ' °C' : ' %'}
                        </Typography>
                        <TextField
                          label={rule.thresholdLabel}
                          type="number"
                          value={rule.threshold}
                          onChange={onThresholdChange(rule.id)}
                          disabled={!rule.enabled}
                          fullWidth
                        />
                        <Alert severity={rule.triggered ? 'warning' : 'success'}>
                          {rule.triggered
                            ? `Condição verdadeira → ${rule.actionLabel}`
                            : 'Condição falsa → aguardar próxima leitura'}
                        </Alert>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {triggeredRules.length > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Ações recomendadas agora: {triggeredRules.map((rule) => rule.actionLabel).join(' • ')}.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

IrrigationAutomationSection.propTypes = { controller: PropTypes.object.isRequired };
