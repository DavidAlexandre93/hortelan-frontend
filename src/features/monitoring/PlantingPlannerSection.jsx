import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  GridLegacy as Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { dateTimeFormatter, eventTypeOptions, monthFormatter } from './model';

export default function PlantingPlannerSection({ controller }) {
  const {
    region,
    setRegion,
    regionOptions,
    opcoesEspecie,
    fasesCultivo,
    setores,
    novaPlanta,
    onChangeCampo,
    adicionarPlanta,
    janelaAtual,
    mesEscolhido,
    statusJanela,
    proximosMeses,
    rotationInsights,
    plantas,
    novoEventoPorPlanta,
    atualizarNovoEvento,
    adicionarEvento,
    novaFotoPorPlanta,
    atualizarNovaFoto,
    adicionarFoto,
    novaObservacaoPorPlanta,
    atualizarNovaObservacao,
    adicionarObservacao,
    novaTarefaPorPlanta,
    atualizarNovaTarefa,
    adicionarTarefa,
    alternarTarefa,
  } = controller;

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} sx={{ mb: 3 }}>
              <Typography variant="h5">Planejamento de plantio inteligente</Typography>
              <FormControl fullWidth sx={{ maxWidth: { md: 320 } }}>
                <InputLabel id="regiao-label">Sazonalidade por região</InputLabel>
                <Select
                  labelId="regiao-label"
                  label="Sazonalidade por região"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                >
                  {regionOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Typography variant="h5" sx={{ mb: 2 }}>
              Adicionar planta manualmente
            </Typography>

            <Box component="form" onSubmit={adicionarPlanta}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="especie-label">Espécie / variedade</InputLabel>
                    <Select
                      labelId="especie-label"
                      label="Espécie / variedade"
                      value={novaPlanta.especie}
                      onChange={onChangeCampo('especie')}
                    >
                      {opcoesEspecie.map((especie) => (
                        <MenuItem key={especie} value={especie}>
                          {especie}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Data de plantio"
                    type="date"
                    value={novaPlanta.dataPlantio}
                    onChange={onChangeCampo('dataPlantio')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Quantidade"
                    type="number"
                    value={novaPlanta.quantidade}
                    onChange={onChangeCampo('quantidade')}
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="fase-cultivo-label">Fase do cultivo</InputLabel>
                    <Select
                      labelId="fase-cultivo-label"
                      label="Fase do cultivo"
                      value={novaPlanta.faseCultivo}
                      onChange={onChangeCampo('faseCultivo')}
                    >
                      {fasesCultivo.map((fase) => (
                        <MenuItem key={fase} value={fase}>
                          {fase}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel id="setor-label">Canteiro</InputLabel>
                    <Select
                      labelId="setor-label"
                      label="Canteiro"
                      value={novaPlanta.setor}
                      onChange={onChangeCampo('setor')}
                    >
                      {setores.map((setor) => (
                        <MenuItem key={setor} value={setor}>
                          {setor}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button fullWidth type="submit" variant="contained" sx={{ height: '100%' }}>
                    Adicionar
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Recomendação de janela de plantio
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {novaPlanta.especie
                    ? `${novaPlanta.especie} • meses ideais para ${region}: ${janelaAtual
                        .map((month) => monthFormatter.format(new Date(2024, month - 1, 1)))
                        .join(', ')}`
                    : 'Selecione uma espécie para visualizar os meses recomendados por região.'}
                </Typography>
                <Alert severity={mesEscolhido && janelaAtual.includes(mesEscolhido) ? 'success' : 'warning'}>
                  {statusJanela}
                </Alert>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Planejamento por calendário (próximos 6 meses)
                </Typography>
                <Grid container spacing={1.5}>
                  {proximosMeses.map((periodo) => (
                    <Grid item xs={12} md={6} lg={4} key={`${periodo.month}-${periodo.label}`}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', mb: 1 }}>
                            {periodo.label}
                          </Typography>
                          <Stack direction="row" gap={1} flexWrap="wrap">
                            {periodo.recomendadas.map((item) => (
                              <Chip
                                key={`${periodo.label}-${item}`}
                                label={item}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Rotação de cultura (fase avançada)
                </Typography>
                <Grid container spacing={1.5}>
                  {rotationInsights.map((insight) => (
                    <Grid item xs={12} md={4} key={insight.setor}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2">{insight.setor}</Typography>
                          <Chip
                            label={insight.status}
                            size="small"
                            sx={{ my: 1 }}
                            color={insight.status.includes('Risco') ? 'warning' : 'success'}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {insight.recomendacao}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            <Stack spacing={1.2} sx={{ mt: 3 }}>
              {plantas.length === 0 ? (
                <Typography color="text.secondary">Nenhuma planta cadastrada manualmente até o momento.</Typography>
              ) : (
                plantas.map((planta) => {
                  const draftEvento = novoEventoPorPlanta[planta.id] || { tipo: '', data: '', detalhes: '' };
                  const draftFoto = novaFotoPorPlanta[planta.id] || { data: '', url: '', legenda: '' };
                  const draftObservacao = novaObservacaoPorPlanta[planta.id] || { data: '', texto: '' };
                  const draftTarefa = novaTarefaPorPlanta[planta.id] || '';
                  const tarefasPendentes = planta.tarefas.filter((tarefa) => !tarefa.concluida);
                  const ultimoEvento = planta.eventos[0];
                  const ultimaFoto = planta.fotos[0];
                  const condicoes = [
                    {
                      label: `Fase: ${planta.faseCultivo}`,
                      color: planta.faseCultivo === 'Colheita' ? 'success' : 'info',
                    },
                    {
                      label: `${tarefasPendentes.length} tarefa(s) pendente(s)`,
                      color: tarefasPendentes.length > 0 ? 'warning' : 'success',
                    },
                    {
                      label: ultimoEvento
                        ? `Último cuidado: ${eventTypeOptions.find((option) => option.value === ultimoEvento.tipo)?.label || 'Registro manual'}`
                        : 'Sem cuidado registrado',
                      color: ultimoEvento ? 'primary' : 'default',
                    },
                    {
                      label: ultimaFoto ? `Última foto em ${ultimaFoto.data}` : 'Sem foto de evolução',
                      color: ultimaFoto ? 'secondary' : 'default',
                    },
                  ];

                  const timeline = [
                    ...planta.eventos.map((evento) => ({
                      id: evento.id,
                      tipo: 'evento',
                      data: evento.data,
                      titulo: eventTypeOptions.find((option) => option.value === evento.tipo)?.label || evento.tipo,
                      descricao: evento.detalhes,
                    })),
                    ...planta.fotos.map((foto) => ({
                      id: foto.id,
                      tipo: 'foto',
                      data: foto.data,
                      titulo: 'Foto de evolução',
                      descricao: foto.legenda || 'Sem legenda',
                      url: foto.url,
                    })),
                    ...planta.observacoes.map((observacao) => ({
                      id: observacao.id,
                      tipo: 'observacao',
                      data: observacao.data,
                      titulo: 'Observação do usuário',
                      descricao: observacao.texto,
                    })),
                  ].sort((a, b) => new Date(`${b.data}T00:00:00`) - new Date(`${a.data}T00:00:00`));

                  return (
                    <Card key={planta.id} variant="outlined">
                      <CardContent sx={{ py: 2 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                          <Typography variant="subtitle1">{planta.especie}</Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip label={`Plantio: ${planta.dataPlantio}`} size="small" />
                            <Chip label={`Qtd: ${planta.quantidade}`} size="small" color="primary" variant="outlined" />
                            <Chip label={planta.faseCultivo} size="small" color="success" />
                            <Chip label={planta.setor} size="small" />
                            <Chip
                              label={`Família: ${planta.familia}`}
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                            <Chip label={`Ciclo: ${planta.ciclo}`} size="small" color="info" variant="outlined" />
                          </Stack>
                        </Stack>

                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Condições atuais relacionadas à planta
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              {condicoes.map((item) => (
                                <Chip
                                  key={item.label}
                                  size="small"
                                  label={item.label}
                                  color={item.color}
                                  variant="outlined"
                                />
                              ))}
                            </Stack>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Histórico de cuidados
                            </Typography>
                            <Stack spacing={1}>
                              <FormControl size="small" fullWidth>
                                <InputLabel id={`tipo-evento-${planta.id}`}>Tipo</InputLabel>
                                <Select
                                  labelId={`tipo-evento-${planta.id}`}
                                  label="Tipo"
                                  value={draftEvento.tipo}
                                  onChange={(event) => atualizarNovoEvento(planta.id, 'tipo', event.target.value)}
                                >
                                  {eventTypeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <TextField
                                size="small"
                                label="Data"
                                type="date"
                                value={draftEvento.data}
                                onChange={(event) => atualizarNovoEvento(planta.id, 'data', event.target.value)}
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                size="small"
                                label="Detalhes"
                                value={draftEvento.detalhes}
                                onChange={(event) => atualizarNovoEvento(planta.id, 'detalhes', event.target.value)}
                              />
                              <Button size="small" variant="contained" onClick={() => adicionarEvento(planta.id)}>
                                Salvar evento
                              </Button>
                              {planta.eventos.length > 0 ? (
                                <Stack spacing={0.75}>
                                  {planta.eventos.slice(0, 3).map((evento) => (
                                    <Typography key={evento.id} variant="caption" color="text.secondary">
                                      {evento.data} •{' '}
                                      {eventTypeOptions.find((option) => option.value === evento.tipo)?.label ||
                                        evento.tipo}
                                    </Typography>
                                  ))}
                                </Stack>
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  Nenhum cuidado registrado até o momento.
                                </Typography>
                              )}
                            </Stack>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Fotos de evolução
                            </Typography>
                            <Stack spacing={1}>
                              <TextField
                                size="small"
                                label="Data"
                                type="date"
                                value={draftFoto.data}
                                onChange={(event) => atualizarNovaFoto(planta.id, { data: event.target.value })}
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                size="small"
                                label="URL da foto"
                                value={draftFoto.url}
                                onChange={(event) => atualizarNovaFoto(planta.id, { url: event.target.value })}
                              />
                              <TextField
                                size="small"
                                label="Legenda"
                                value={draftFoto.legenda}
                                onChange={(event) => atualizarNovaFoto(planta.id, { legenda: event.target.value })}
                              />
                              <Button size="small" variant="contained" onClick={() => adicionarFoto(planta.id)}>
                                Salvar foto
                              </Button>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Próximas tarefas
                            </Typography>
                            <Stack spacing={1}>
                              <TextField
                                size="small"
                                label="Nova tarefa"
                                value={draftTarefa}
                                onChange={(event) => atualizarNovaTarefa(planta.id, event.target.value)}
                              />
                              <Button size="small" variant="contained" onClick={() => adicionarTarefa(planta.id)}>
                                Adicionar tarefa
                              </Button>
                              {planta.tarefas.length > 0 ? (
                                <Stack spacing={0.25}>
                                  {planta.tarefas.slice(0, 4).map((tarefa) => (
                                    <Stack key={tarefa.id} direction="row" spacing={0.5} alignItems="center">
                                      <Checkbox
                                        size="small"
                                        checked={tarefa.concluida}
                                        onChange={() => alternarTarefa(planta.id, tarefa.id)}
                                      />
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ textDecoration: tarefa.concluida ? 'line-through' : 'none' }}
                                      >
                                        {tarefa.titulo}
                                      </Typography>
                                    </Stack>
                                  ))}
                                </Stack>
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  Nenhuma tarefa cadastrada.
                                </Typography>
                              )}
                            </Stack>
                          </Grid>
                        </Grid>

                        <Card variant="outlined" sx={{ mt: 2 }}>
                          <CardContent>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Observações de evolução
                            </Typography>
                            <Stack spacing={1}>
                              <TextField
                                size="small"
                                label="Data"
                                type="date"
                                value={draftObservacao.data}
                                onChange={(event) => atualizarNovaObservacao(planta.id, { data: event.target.value })}
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                size="small"
                                label="Observação"
                                multiline
                                minRows={2}
                                value={draftObservacao.texto}
                                onChange={(event) => atualizarNovaObservacao(planta.id, { texto: event.target.value })}
                              />
                              <Button size="small" variant="contained" onClick={() => adicionarObservacao(planta.id)}>
                                Salvar observação
                              </Button>
                            </Stack>
                          </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ mt: 2, bgcolor: 'background.neutral' }}>
                          <CardContent>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Linha do tempo da planta
                            </Typography>
                            {timeline.length === 0 ? (
                              <Typography variant="body2" color="text.secondary">
                                Ainda não há registros de eventos, fotos ou observações para esta planta.
                              </Typography>
                            ) : (
                              <Stack spacing={1.2}>
                                {timeline.map((item) => (
                                  <Card key={item.id} variant="outlined">
                                    <CardContent sx={{ py: 1.5 }}>
                                      <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        justifyContent="space-between"
                                        spacing={1}
                                      >
                                        <Stack direction="row" spacing={1} alignItems="center">
                                          <Chip
                                            size="small"
                                            color={
                                              item.tipo === 'evento'
                                                ? 'primary'
                                                : item.tipo === 'foto'
                                                  ? 'secondary'
                                                  : 'default'
                                            }
                                            label={item.tipo}
                                          />
                                          <Typography variant="subtitle2">{item.titulo}</Typography>
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary">
                                          {dateTimeFormatter.format(new Date(`${item.data}T00:00:00`))}
                                        </Typography>
                                      </Stack>
                                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {item.descricao}
                                      </Typography>
                                      {item.url ? (
                                        <Box
                                          component="a"
                                          href={item.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          sx={{ fontSize: 12 }}
                                        >
                                          Abrir foto
                                        </Box>
                                      ) : null}
                                    </CardContent>
                                  </Card>
                                ))}
                              </Stack>
                            )}
                          </CardContent>
                        </Card>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

PlantingPlannerSection.propTypes = { controller: PropTypes.object.isRequired };
