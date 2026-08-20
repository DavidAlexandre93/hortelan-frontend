import PropTypes from 'prop-types';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  GridLegacy as Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { automationOperators, automationSensors, dependencyStatuses } from './model';

export default function AutomationRulesSection({ controller }) {
  const {
    automationDraft,
    setAutomationDraft,
    salvarAutomacao,
    atualizarCondicaoAutomacao,
    removerCondicaoAutomacao,
    adicionarCondicaoAutomacao,
    atualizarDependenciaAutomacao,
    removerDependenciaAutomacao,
    adicionarDependenciaAutomacao,
    automationRules,
  } = controller;

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 1.5 }}>
              Motor de automações por regras
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configure condição + horário, múltiplas condições (AND/OR) e dependências entre sensores antes da
              execução.
            </Typography>

            <Grid container spacing={1.5}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Nome da automação"
                  size="small"
                  fullWidth
                  value={automationDraft.nome}
                  onChange={(event) => setAutomationDraft((prev) => ({ ...prev, nome: event.target.value }))}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl size="small" fullWidth>
                  <InputLabel id="logica-automacao-label">Combinação</InputLabel>
                  <Select
                    labelId="logica-automacao-label"
                    label="Combinação"
                    value={automationDraft.logica}
                    onChange={(event) => setAutomationDraft((prev) => ({ ...prev, logica: event.target.value }))}
                  >
                    <MenuItem value="AND">AND</MenuItem>
                    <MenuItem value="OR">OR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={2}>
                <TextField
                  label="Início"
                  type="time"
                  size="small"
                  fullWidth
                  value={automationDraft.janelaInicio}
                  onChange={(event) => setAutomationDraft((prev) => ({ ...prev, janelaInicio: event.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={6} md={2}>
                <TextField
                  label="Fim"
                  type="time"
                  size="small"
                  fullWidth
                  value={automationDraft.janelaFim}
                  onChange={(event) => setAutomationDraft((prev) => ({ ...prev, janelaFim: event.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Button variant="contained" fullWidth onClick={salvarAutomacao}>
                  Salvar regra
                </Button>
              </Grid>

              <Grid item xs={12} md={7}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Condições da regra
                </Typography>
                <Stack spacing={1}>
                  {automationDraft.condicoes.map((condicao, index) => (
                    <Stack
                      key={`condicao-${index}`}
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      alignItems={{ xs: 'stretch', sm: 'center' }}
                    >
                      <FormControl size="small" sx={{ minWidth: { sm: 180 } }}>
                        <InputLabel id={`condicao-sensor-${index}`}>Sensor</InputLabel>
                        <Select
                          labelId={`condicao-sensor-${index}`}
                          label="Sensor"
                          value={condicao.sensor}
                          onChange={(event) => atualizarCondicaoAutomacao(index, 'sensor', event.target.value)}
                        >
                          {automationSensors.map((sensor) => (
                            <MenuItem key={sensor.value} value={sensor.value}>
                              {sensor.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: { sm: 90 } }}>
                        <InputLabel id={`condicao-operador-${index}`}>Op.</InputLabel>
                        <Select
                          labelId={`condicao-operador-${index}`}
                          label="Op."
                          value={condicao.operador}
                          onChange={(event) => atualizarCondicaoAutomacao(index, 'operador', event.target.value)}
                        >
                          {automationOperators.map((operator) => (
                            <MenuItem key={operator} value={operator}>
                              {operator}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        size="small"
                        label="Valor"
                        value={condicao.valor}
                        onChange={(event) => atualizarCondicaoAutomacao(index, 'valor', event.target.value)}
                      />
                      <IconButton
                        aria-label="Remover condição"
                        onClick={() => removerCondicaoAutomacao(index)}
                        disabled={automationDraft.condicoes.length === 1}
                      >
                        <DeleteOutlineOutlined fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={adicionarCondicaoAutomacao}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Adicionar condição
                  </Button>
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Dependência entre sensores
                </Typography>
                <Stack spacing={1}>
                  {automationDraft.dependencias.map((dependencia, index) => (
                    <Stack
                      key={`dependencia-${index}`}
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      alignItems={{ xs: 'stretch', sm: 'center' }}
                    >
                      <FormControl size="small" sx={{ minWidth: { sm: 180 } }}>
                        <InputLabel id={`dependencia-sensor-${index}`}>Sensor</InputLabel>
                        <Select
                          labelId={`dependencia-sensor-${index}`}
                          label="Sensor"
                          value={dependencia.sensor}
                          onChange={(event) => atualizarDependenciaAutomacao(index, 'sensor', event.target.value)}
                        >
                          {automationSensors.map((sensor) => (
                            <MenuItem key={sensor.value} value={sensor.value}>
                              {sensor.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: { sm: 120 } }}>
                        <InputLabel id={`dependencia-status-${index}`}>Status</InputLabel>
                        <Select
                          labelId={`dependencia-status-${index}`}
                          label="Status"
                          value={dependencia.status}
                          onChange={(event) => atualizarDependenciaAutomacao(index, 'status', event.target.value)}
                        >
                          {dependencyStatuses.map((status) => (
                            <MenuItem key={status.value} value={status.value}>
                              {status.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <IconButton
                        aria-label="Remover dependência"
                        onClick={() => removerDependenciaAutomacao(index)}
                        disabled={automationDraft.dependencias.length === 1}
                      >
                        <DeleteOutlineOutlined fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={adicionarDependenciaAutomacao}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Adicionar dependência
                  </Button>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={`Janela ativa: ${automationDraft.janelaInicio} - ${automationDraft.janelaFim}`}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`Condições: ${automationDraft.condicoes.length} (${automationDraft.logica})`}
                    color="secondary"
                    variant="outlined"
                  />
                  <Chip
                    label={`Dependências: ${automationDraft.dependencias.length}`}
                    color="info"
                    variant="outlined"
                  />
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Regras criadas nesta sessão
            </Typography>
            {automationRules.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nenhuma regra salva ainda.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {automationRules.map((rule) => (
                  <Card key={rule.id} variant="outlined">
                    <CardContent sx={{ py: 1.5 }}>
                      <Typography variant="subtitle2">{rule.nome}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Executa entre {rule.janelaInicio} e {rule.janelaFim} quando {rule.condicoes.length}{' '}
                        condição(ões) ({rule.logica}) e {rule.dependencias.length} dependência(s) forem atendidas.
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

AutomationRulesSection.propTypes = { controller: PropTypes.object.isRequired };
