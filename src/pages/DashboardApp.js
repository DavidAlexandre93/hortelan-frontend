import { faker } from '@faker-js/faker';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

const cropCatalog = {
  'Alface Crespa': { family: 'Folhosas', cycle: '45-60 dias' },
  'Alface Americana': { family: 'Folhosas', cycle: '55-70 dias' },
  'Tomate Cereja': { family: 'Solanáceas', cycle: '90-110 dias' },
  Manjericão: { family: 'Aromáticas', cycle: '60-90 dias' },
  Rúcula: { family: 'Folhosas', cycle: '35-45 dias' },
  'Couve Manteiga': { family: 'Brássicas', cycle: '75-95 dias' },
};

const regionalSeasonality = {
  Sudeste: {
    'Alface Crespa': [2, 3, 4, 5, 6, 7, 8, 9],
    'Alface Americana': [2, 3, 4, 5, 6, 7, 8, 9],
    'Tomate Cereja': [8, 9, 10, 11, 12, 1],
    Manjericão: [9, 10, 11, 12, 1, 2, 3],
    Rúcula: [3, 4, 5, 6, 7, 8, 9, 10],
    'Couve Manteiga': [3, 4, 5, 6, 7, 8],
  },
  Sul: {
    'Alface Crespa': [1, 2, 3, 4, 8, 9, 10, 11, 12],
    'Alface Americana': [1, 2, 3, 4, 8, 9, 10, 11, 12],
    'Tomate Cereja': [9, 10, 11, 12, 1],
    Manjericão: [10, 11, 12, 1, 2, 3],
    Rúcula: [2, 3, 4, 5, 6, 7, 8, 9],
    'Couve Manteiga': [2, 3, 4, 5, 6, 7, 8],
  },
  Nordeste: {
    'Alface Crespa': [3, 4, 5, 6, 7, 8, 9, 10],
    'Alface Americana': [3, 4, 5, 6, 7, 8, 9, 10],
    'Tomate Cereja': [4, 5, 6, 7, 8, 9],
    Manjericão: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    Rúcula: [4, 5, 6, 7, 8, 9, 10],
    'Couve Manteiga': [4, 5, 6, 7, 8, 9],
  },
};

const rotationByFamily = {
  Folhosas: ['Frutos', 'Leguminosas', 'Raízes'],
  Solanáceas: ['Folhosas', 'Leguminosas', 'Brássicas'],
  Aromáticas: ['Folhosas', 'Frutos', 'Brássicas'],
  Brássicas: ['Leguminosas', 'Raízes', 'Frutos'],
};

const eventTypeOptions = [
  { value: 'rega', label: 'Rega' },
  { value: 'poda', label: 'Poda' },
  { value: 'adubacao', label: 'Adubação' },
  { value: 'praga', label: 'Praga' },
  { value: 'colheita', label: 'Colheita' },
];

export default function DashboardApp() {
  const theme = useTheme();
  const [region, setRegion] = useState('Sudeste');
  const [plantas, setPlantas] = useState([]);
  const [novaPlanta, setNovaPlanta] = useState({
    especie: '',
    dataPlantio: '',
    quantidade: '',
    faseCultivo: '',
    setor: 'Canteiro A',
  });
  const [novoEventoPorPlanta, setNovoEventoPorPlanta] = useState({});
  const [novaFotoPorPlanta, setNovaFotoPorPlanta] = useState({});
  const [novaObservacaoPorPlanta, setNovaObservacaoPorPlanta] = useState({});

  const opcoesEspecie = [
    'Alface Crespa',
    'Alface Americana',
    'Tomate Cereja',
    'Manjericão',
    'Rúcula',
    'Couve Manteiga',
  ];

  const fasesCultivo = ['Germinação', 'Crescimento', 'Floração', 'Colheita'];
  const setores = ['Canteiro A', 'Canteiro B', 'Canteiro C'];
  const regionOptions = Object.keys(regionalSeasonality);

  const onChangeCampo = (field) => (event) => {
    setNovaPlanta((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const adicionarPlanta = (event) => {
    event.preventDefault();

    if (!novaPlanta.especie || !novaPlanta.dataPlantio || !novaPlanta.quantidade || !novaPlanta.faseCultivo) {
      return;
    }

    setPlantas((prev) => [
      {
        id: faker.datatype.uuid(),
        ...novaPlanta,
        familia: cropCatalog[novaPlanta.especie].family,
        ciclo: cropCatalog[novaPlanta.especie].cycle,
        eventos: [],
        fotos: [],
        observacoes: [],
      },
      ...prev,
    ]);

    setNovaPlanta({
      especie: '',
      dataPlantio: '',
      quantidade: '',
      faseCultivo: '',
      setor: 'Canteiro A',
    });
  };

  const atualizarNovoEvento = (plantaId, field, value) => {
    setNovoEventoPorPlanta((prev) => ({
      ...prev,
      [plantaId]: {
        tipo: prev[plantaId]?.tipo || '',
        data: prev[plantaId]?.data || '',
        detalhes: prev[plantaId]?.detalhes || '',
        [field]: value,
      },
    }));
  };

  const atualizarNovaFoto = (plantaId, value) => {
    setNovaFotoPorPlanta((prev) => ({
      ...prev,
      [plantaId]: {
        data: prev[plantaId]?.data || '',
        url: prev[plantaId]?.url || '',
        legenda: prev[plantaId]?.legenda || '',
        ...value,
      },
    }));
  };

  const atualizarNovaObservacao = (plantaId, value) => {
    setNovaObservacaoPorPlanta((prev) => ({
      ...prev,
      [plantaId]: {
        data: prev[plantaId]?.data || '',
        texto: prev[plantaId]?.texto || '',
        ...value,
      },
    }));
  };

  const adicionarEvento = (plantaId) => {
    const draft = novoEventoPorPlanta[plantaId];

    if (!draft?.tipo || !draft?.data || !draft?.detalhes) {
      return;
    }

    setPlantas((prev) =>
      prev.map((planta) =>
        planta.id === plantaId
          ? {
              ...planta,
              eventos: [
                {
                  id: faker.datatype.uuid(),
                  tipo: draft.tipo,
                  data: draft.data,
                  detalhes: draft.detalhes,
                },
                ...planta.eventos,
              ],
            }
          : planta
      )
    );

    setNovoEventoPorPlanta((prev) => ({
      ...prev,
      [plantaId]: { tipo: '', data: '', detalhes: '' },
    }));
  };

  const adicionarFoto = (plantaId) => {
    const draft = novaFotoPorPlanta[plantaId];

    if (!draft?.data || !draft?.url) {
      return;
    }

    setPlantas((prev) =>
      prev.map((planta) =>
        planta.id === plantaId
          ? {
              ...planta,
              fotos: [
                {
                  id: faker.datatype.uuid(),
                  data: draft.data,
                  url: draft.url,
                  legenda: draft.legenda || '',
                },
                ...planta.fotos,
              ],
            }
          : planta
      )
    );

    setNovaFotoPorPlanta((prev) => ({
      ...prev,
      [plantaId]: { data: '', url: '', legenda: '' },
    }));
  };

  const adicionarObservacao = (plantaId) => {
    const draft = novaObservacaoPorPlanta[plantaId];

    if (!draft?.data || !draft?.texto) {
      return;
    }

    setPlantas((prev) =>
      prev.map((planta) =>
        planta.id === plantaId
          ? {
              ...planta,
              observacoes: [
                {
                  id: faker.datatype.uuid(),
                  data: draft.data,
                  texto: draft.texto,
                },
                ...planta.observacoes,
              ],
            }
          : planta
      )
    );

    setNovaObservacaoPorPlanta((prev) => ({
      ...prev,
      [plantaId]: { data: '', texto: '' },
    }));
  };

  const janelaAtual = regionalSeasonality[region][novaPlanta.especie] || [];
  const mesEscolhido = novaPlanta.dataPlantio ? new Date(`${novaPlanta.dataPlantio}T00:00:00`).getMonth() + 1 : null;

  const statusJanela = !mesEscolhido
    ? 'Selecione uma data para validar a janela de plantio.'
    : janelaAtual.includes(mesEscolhido)
    ? 'Janela ideal para plantio nesta região.'
    : 'Fora da janela ideal. Considere ajustar a data ou utilizar ambiente protegido.';

  const proximosMeses = [...Array(6)].map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() + index);
    const month = date.getMonth() + 1;

    const recomendadas = opcoesEspecie.filter((species) => regionalSeasonality[region][species].includes(month));

    return {
      month,
      label: monthFormatter.format(date),
      recomendadas,
    };
  });

  const rotationInsights = setores.map((setor) => {
    const historico = plantas.filter((planta) => planta.setor === setor);
    const recente = historico[0];

    if (!recente) {
      return {
        setor,
        status: 'Sem histórico ainda',
        recomendacao: 'Registre ao menos um plantio para habilitar a rotação inteligente.',
      };
    }

    const proximaFamilia = rotationByFamily[recente.familia] || ['Folhosas'];
    const repeticao = historico[1] && historico[1].familia === recente.familia;

    return {
      setor,
      status: repeticao ? 'Risco de repetição de família' : 'Rotação saudável',
      recomendacao: repeticao
        ? `Evite novo ciclo de ${recente.familia}. Priorize ${proximaFamilia.join(', ')}.`
        : `Próxima rotação sugerida: ${proximaFamilia.join(', ')}.`,
    };
  });

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Welcome User to the Hortelan System
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} sx={{ mb: 3 }}>
                  <Typography variant="h5">Planejamento de plantio inteligente</Typography>
                  <FormControl sx={{ minWidth: 220 }}>
                    <InputLabel id="regiao-label">Sazonalidade por região</InputLabel>
                    <Select labelId="regiao-label" label="Sazonalidade por região" value={region} onChange={(event) => setRegion(event.target.value)}>
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
                        <Select labelId="setor-label" label="Canteiro" value={novaPlanta.setor} onChange={onChangeCampo('setor')}>
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
                    <Alert severity={mesEscolhido && janelaAtual.includes(mesEscolhido) ? 'success' : 'warning'}>{statusJanela}</Alert>
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
                                  <Chip key={`${periodo.label}-${item}`} label={item} size="small" color="success" variant="outlined" />
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
                                <Chip label={`Família: ${planta.familia}`} size="small" color="warning" variant="outlined" />
                                <Chip label={`Ciclo: ${planta.ciclo}`} size="small" color="info" variant="outlined" />
                              </Stack>
                            </Stack>

                            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                              <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Registro de eventos
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
                                  Observações do usuário
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
                              </Grid>
                            </Grid>

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
                                          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                              <Chip
                                                size="small"
                                                color={item.tipo === 'evento' ? 'primary' : item.tipo === 'foto' ? 'secondary' : 'default'}
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
                                            <Box component="a" href={item.url} target="_blank" rel="noopener noreferrer" sx={{ fontSize: 12 }}>
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

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Soil moisture" total={20} icon1={'carbon:soil-moisture-field'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Temperature and relative humidity" total={25} color="info" icon1={'mdi:temperature'} icon2={'mdi:humidity-outline'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="pH" total={7} color="success" icon1={'material-symbols:water-ph'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Lux" total={400} color="error" icon1={'ph:sun'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Garden performance analysis"
              subheader="(+47%) than last year"
              chartLabels={[
                '01/01/2022',
                '02/01/2022',
                '03/01/2022',
                '04/01/2022',
                '05/01/2022',
                '06/01/2022',
                '07/01/2022',
                '08/01/2022',
                '09/01/2022',
                '10/01/2022',
                '11/01/2022',
              ]}
              chartData={[
                {
                  name: 'Garden01',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Garden02',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 76, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Garden03',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current gardens"
              chartData={[
                { label: 'Garden01', value: 4344 },
                { label: 'Garden02', value: 5435 },
                { label: 'Garden03', value: 1443 },
                { label: 'Garden04', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.red[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Total cost gardens"
              subheader="(+47%) than last month"
              chartData={[
                { label: 'Garden01', value: 400 },
                { label: 'Garden02', value: 430 },
                { label: 'Garden03', value: 448 },
                { label: 'Garden04', value: 470 },
                { label: 'Garden05', value: 540 },
                { label: 'Garden06', value: 580 },
                { label: 'Garden07', value: 690 },
                { label: 'Garden08', value: 1100 },
                { label: 'Garden09', value: 1200 },
                { label: 'Garden10', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Gardens active"
              chartLabels={['Temperature °C/°F', 'Umidity %', 'Lúmen lux', 'pH', 'Battery', 'Reservoir']}
              chartData={[
                { name: 'Garden01', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Garden02', data: [20, 50, 40, 80, 70, 80] },
                { name: 'Garden03', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="Relevant community information"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: 'Relevant post in community',
                description: 'Visit the community to learn more',
                image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Garden Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  'Garden01 registered',
                  'Purchase of accessories',
                  'Support request made',
                  'Garden02 registered',
                  'Post made in community',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Infrastructure monitoring"
              list={[
                {
                  name: 'Water level',
                  value: 10,
                  icon: <Iconify icon={'icon-park:water-level'} color="#1877F2" width={32} height={32} />,
                },
                {
                  name: 'Battery level',
                  value: 100,
                  icon: <Iconify icon={'emojione:battery'} color="#DF3E30" width={32} height={32} />,
                },
                {
                  name: 'Pest Alert',
                  value: 0,
                  icon: <Iconify icon={'icon-park:bug'} color="#006097" width={32} height={32} />,
                },
                {
                  name: 'Notifications',
                  value: 0,
                  icon: <Iconify icon={'streamline-emojis:bell'} color="#1C9CEA" width={32} height={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks to be carried out in the Garden"
              list={[
                { id: '1', label: 'Schedule a professional to carry out pruning' },
                { id: '2', label: 'Make an appointment with a professional to carry out pest control' },
                { id: '3', label: 'Move plants to another location' },
                { id: '4', label: 'Set soil humidity to 70%' },
                { id: '5', label: 'Change water in the reservoir' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
