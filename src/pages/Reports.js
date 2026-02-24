import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import Page from '../components/Page';

const operationalRows = [
  {
    period: 'Semana atual',
    waterConsumptionLiters: 1280,
    actuatorUsageHours: 34.5,
    automationRuns: 46,
    alertsByCategory: {
      Irrigação: 6,
      Energia: 2,
      Clima: 4,
      Comunicação: 3,
    },
  },
  {
    period: 'Últimos 30 dias',
    waterConsumptionLiters: 4910,
    actuatorUsageHours: 121.2,
    automationRuns: 178,
    alertsByCategory: {
      Irrigação: 19,
      Energia: 7,
      Clima: 15,
      Comunicação: 9,
    },
  },
];

const cultivationRows = [
  {
    plant: 'Alface Crespa #A12',
    evolution: 'Transplante → Desenvolvimento vegetativo',
    survivalRate: 96,
    harvestLeadTimeDays: 24,
    productivityKg: 1.8,
  },
  {
    plant: 'Tomate Cereja #T03',
    evolution: 'Floração estável',
    survivalRate: 91,
    harvestLeadTimeDays: 35,
    productivityKg: 4.2,
  },
  {
    plant: 'Manjericão #M09',
    evolution: 'Poda de formação concluída',
    survivalRate: 98,
    harvestLeadTimeDays: 12,
    productivityKg: 0.9,
  },
];

const maintenanceRows = [
  {
    period: 'Semana atual',
    supplyReplacements: 5,
    deviceFailures: 2,
    manualInterventions: 9,
    preventiveTasksDone: 7,
  },
  {
    period: 'Últimos 30 dias',
    supplyReplacements: 16,
    deviceFailures: 6,
    manualInterventions: 31,
    preventiveTasksDone: 23,
  },
];

const unifiedHistoryRows = [
  {
    timestamp: 'Hoje 10:42',
    type: 'sensor',
    title: 'Sensor de umidade S-12 registrou 34%',
    detail: 'Leitura abaixo da faixa ideal para canteiro B.',
  },
  {
    timestamp: 'Hoje 10:45',
    type: 'automation',
    title: 'Automação de irrigação executada',
    detail: 'Bomba 2 ligada por 8 minutos conforme regra de estresse hídrico.',
  },
  {
    timestamp: 'Hoje 11:02',
    type: 'alert',
    title: 'Alerta crítico: reservatório abaixo de 20%',
    detail: 'Notificação enviada para equipe operacional.',
  },
  {
    timestamp: 'Hoje 11:18',
    type: 'task',
    title: 'Tarefa manual concluída: reposição de nutrientes',
    detail: 'Operador: João Lima.',
  },
  {
    timestamp: 'Hoje 11:30',
    type: 'photo',
    title: 'Foto adicionada ao lote Alface A12',
    detail: 'Registro visual da evolução após poda de folhas externas.',
  },
];

const historyTypeLabel = {
  sensor: 'Sensor',
  automation: 'Automação',
  alert: 'Alerta',
  task: 'Tarefa',
  photo: 'Foto',
};

const institutionalUnits = [
  {
    unit: 'Escola Municipal Aurora',
    profile: 'Coordenador',
    gardens: 6,
    activeParticipants: 128,
    resourcesUsage: 'Água 1.240 L • Energia 93 kWh',
    productionHarvest: '84 kg colhidos no mês',
    sustainabilityEducation: '12 oficinas • 96% de presença média',
  },
  {
    unit: 'Condomínio Jardim das Flores',
    profile: 'Operador local',
    gardens: 4,
    activeParticipants: 42,
    resourcesUsage: 'Água 690 L • Energia 41 kWh',
    productionHarvest: '38 kg colhidos no mês',
    sustainabilityEducation: '8 mutirões • 72 famílias envolvidas',
  },
  {
    unit: 'Projeto Social Semeando Futuro',
    profile: 'Monitor',
    gardens: 5,
    activeParticipants: 67,
    resourcesUsage: 'Água 910 L • Energia 58 kWh',
    productionHarvest: '53 kg colhidos no mês',
    sustainabilityEducation: '15 aulas práticas • 4 trilhas ativas',
  },
];

const institutionalProfiles = ['Coordenador', 'Monitor', 'Operador local', 'Visualizador/Gestor'];

const educationalModuleFutureScope = [
  'Trilhas de atividades por faixa etária e objetivo pedagógico',
  'Conteúdo pedagógico alinhado à BNCC e metas ESG institucionais',
  'Registro de atividades em sala/projeto com fotos, presença e evidências',
];

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [tab, setTab] = useState('operacional');
  const [historyFilter, setHistoryFilter] = useState('todos');

  const historyRows = useMemo(
    () =>
      unifiedHistoryRows.filter((item) => {
        if (historyFilter === 'todos') return true;
        return item.type === historyFilter;
      }),
    [historyFilter]
  );

  const exportCsv = () => {
    const csvLines = [
      'categoria,periodo,referencia,metrica,valor',
      ...operationalRows.map((row) => `operacional,${row.period},-,consumo_agua_litros,${row.waterConsumptionLiters}`),
      ...operationalRows.map((row) => `operacional,${row.period},-,tempo_uso_atuadores_horas,${row.actuatorUsageHours}`),
      ...operationalRows.map((row) => `operacional,${row.period},-,execucoes_automacao,${row.automationRuns}`),
      ...maintenanceRows.map((row) => `manutencao,${row.period},-,troca_insumos,${row.supplyReplacements}`),
      ...maintenanceRows.map((row) => `manutencao,${row.period},-,falhas_dispositivo,${row.deviceFailures}`),
      ...maintenanceRows.map((row) => `manutencao,${row.period},-,intervencoes_manuais,${row.manualInterventions}`),
      ...maintenanceRows.map((row) => `manutencao,${row.period},-,preventivas_executadas,${row.preventiveTasksDone}`),
      ...cultivationRows.map((row) => `cultivo,-,${row.plant},taxa_sobrevivencia_pct,${row.survivalRate}`),
      ...cultivationRows.map((row) => `cultivo,-,${row.plant},tempo_ate_colheita_dias,${row.harvestLeadTimeDays}`),
      ...cultivationRows.map((row) => `cultivo,-,${row.plant},produtividade_kg,${row.productivityKg}`),
    ];

    downloadFile(csvLines.join('\n'), `relatorio-hortelan-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
  };

  const exportPdfSummary = () => {
    const summaryHtml = `
      <html>
        <head><title>Resumo de Relatórios Hortelan</title></head>
        <body style="font-family: Arial, sans-serif; padding: 24px;">
          <h1>Resumo de Relatórios Hortelan</h1>
          <p>Gerado em ${new Date().toLocaleString('pt-BR')}.</p>
          <h2>Operacional</h2>
          <ul>
            ${operationalRows
              .map(
                (row) =>
                  `<li><strong>${row.period}</strong>: ${row.waterConsumptionLiters}L de água, ${row.actuatorUsageHours}h de atuadores, ${row.automationRuns} execuções de automação.</li>`
              )
              .join('')}
          </ul>
          <h2>Cultivo</h2>
          <ul>
            ${cultivationRows
              .map(
                (row) =>
                  `<li><strong>${row.plant}</strong>: sobrevivência ${row.survivalRate}%, colheita em ${row.harvestLeadTimeDays} dias, produtividade ${row.productivityKg}kg.</li>`
              )
              .join('')}
          </ul>
          <h2>Manutenção</h2>
          <ul>
            ${maintenanceRows
              .map(
                (row) =>
                  `<li><strong>${row.period}</strong>: ${row.supplyReplacements} trocas de insumos, ${row.deviceFailures} falhas de dispositivo, ${row.preventiveTasksDone} preventivas executadas.</li>`
              )
              .join('')}
          </ul>
          <p><em>Use Salvar como PDF no diálogo de impressão para finalizar a exportação.</em></p>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
    if (!printWindow) return;
    printWindow.document.write(summaryHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Page title="Relatórios">
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Relatórios e histórico unificado
            </Typography>
            <Typography color="text.secondary">
              Consolide indicadores operacionais, de cultivo e manutenção; exporte dados e acompanhe uma linha do tempo única da horta.
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button variant="contained" startIcon={<DownloadRoundedIcon />} onClick={exportCsv}>
                    Exportar CSV
                  </Button>
                  <Button variant="outlined" startIcon={<PictureAsPdfRoundedIcon />} onClick={exportPdfSummary}>
                    Exportar PDF (resumo)
                  </Button>
                  <Button variant="outlined" disabled>
                    Exportar XLSX (fase futura)
                  </Button>
                  <Button variant="outlined" disabled>
                    Compartilhar link (fase futura)
                  </Button>
                </Stack>
                <Chip label="Exportação XLSX e compartilhamento serão liberados em roadmap futuro." color="warning" variant="outlined" />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Tabs value={tab} onChange={(_, value) => setTab(value)}>
                <Tab value="operacional" label="Relatórios operacionais" />
                <Tab value="cultivo" label="Relatórios de cultivo" />
                <Tab value="manutencao" label="Relatórios de manutenção" />
                <Tab value="institucional" label="Relatórios institucionais" />
                <Tab value="historico" icon={<TimelineRoundedIcon />} iconPosition="start" label="Histórico unificado" />
              </Tabs>

              <Divider sx={{ my: 2 }} />

              {tab === 'operacional' && (
                <Grid container spacing={2}>
                  {operationalRows.map((row) => (
                    <Grid item xs={12} md={6} key={row.period}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={1.5}>
                            <Typography variant="h6">{row.period}</Typography>
                            <Typography>Consumo de água por período: {row.waterConsumptionLiters} L</Typography>
                            <Typography>Tempo de uso de atuadores: {row.actuatorUsageHours} h</Typography>
                            <Typography>Execuções de automação: {row.automationRuns}</Typography>
                            <Box>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Ocorrências/alertas por categoria
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {Object.entries(row.alertsByCategory).map(([category, count]) => (
                                  <Chip key={category} label={`${category}: ${count}`} size="small" />
                                ))}
                              </Stack>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {tab === 'cultivo' && (
                <Grid container spacing={2}>
                  {cultivationRows.map((row) => (
                    <Grid item xs={12} md={4} key={row.plant}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={1}>
                            <Typography variant="h6">{row.plant}</Typography>
                            <Typography>Evolução por planta: {row.evolution}</Typography>
                            <Typography>Taxa de sobrevivência: {row.survivalRate}%</Typography>
                            <Typography>Tempo até colheita: {row.harvestLeadTimeDays} dias</Typography>
                            <Typography>Produtividade/colheita: {row.productivityKg} kg</Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {tab === 'manutencao' && (
                <Grid container spacing={2}>
                  {maintenanceRows.map((row) => (
                    <Grid item xs={12} md={6} key={row.period}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={1}>
                            <Typography variant="h6">{row.period}</Typography>
                            <Typography>Trocas de insumos: {row.supplyReplacements}</Typography>
                            <Typography>Falhas por dispositivo: {row.deviceFailures}</Typography>
                            <Typography>Frequência de intervenções manuais: {row.manualInterventions}</Typography>
                            <Typography>Preventivas executadas: {row.preventiveTasksDone}</Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {tab === 'institucional' && (
                <Stack spacing={2}>
                  <Alert severity="success">
                    Visão institucional com múltiplas unidades (escolas, condomínios, empresas e projetos sociais) em um painel consolidado.
                  </Alert>

                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="h6">Perfis institucionais</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {institutionalProfiles.map((profile) => (
                            <Chip key={profile} label={profile} color="primary" variant="outlined" />
                          ))}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Grid container spacing={2}>
                    {institutionalUnits.map((row) => (
                      <Grid item xs={12} md={4} key={row.unit}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Stack spacing={1}>
                              <Typography variant="h6">{row.unit}</Typography>
                              <Chip label={`Perfil responsável: ${row.profile}`} size="small" sx={{ alignSelf: 'flex-start' }} />
                              <Typography>Hortas monitoradas: {row.gardens}</Typography>
                              <Typography>Engajamento: {row.activeParticipants} participantes ativos</Typography>
                              <Typography>Uso de recursos: {row.resourcesUsage}</Typography>
                              <Typography>Produção/colheita: {row.productionHarvest}</Typography>
                              <Typography>Sustentabilidade/educação: {row.sustainabilityEducation}</Typography>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Módulo educacional (fase futura)
                      </Typography>
                      <List dense>
                        {educationalModuleFutureScope.map((item) => (
                          <ListItem key={item} sx={{ px: 0 }}>
                            <ListItemText primary={`• ${item}`} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Stack>
              )}

              {tab === 'historico' && (
                <Stack spacing={2}>
                  <Alert severity="info">Linha do tempo da horta com sensores + tarefas + alertas + ações + fotos em um único feed.</Alert>

                  <TextField
                    size="small"
                    select
                    label="Filtrar tipo de evento"
                    value={historyFilter}
                    onChange={(event) => setHistoryFilter(event.target.value)}
                    sx={{ maxWidth: 300 }}
                  >
                    <MenuItem value="todos">Todos</MenuItem>
                    <MenuItem value="sensor">Sensores</MenuItem>
                    <MenuItem value="task">Tarefas</MenuItem>
                    <MenuItem value="alert">Alertas</MenuItem>
                    <MenuItem value="automation">Ações/Automação</MenuItem>
                    <MenuItem value="photo">Fotos</MenuItem>
                  </TextField>

                  <List>
                    {historyRows.map((row) => (
                      <ListItem key={`${row.timestamp}-${row.title}`} divider>
                        <ListItemText
                          primary={
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }}>
                              <Chip size="small" label={historyTypeLabel[row.type]} />
                              <Typography variant="subtitle2">{row.title}</Typography>
                            </Stack>
                          }
                          secondary={`${row.timestamp} • ${row.detail}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}
