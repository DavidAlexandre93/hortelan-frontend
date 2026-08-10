import { createId } from '../../utils/createId';
import MonitoringAnalytics from '../../features/monitoring/MonitoringAnalytics';
import MonitoringOverview from '../../features/monitoring/MonitoringOverview';
import ClimateIntelligence from '../../features/monitoring/ClimateIntelligence';
import AutomationRulesSection from '../../features/monitoring/AutomationRulesSection';
import SensorHealthSection from '../../features/monitoring/SensorHealthSection';
import TaskAgendaSection from '../../features/monitoring/TaskAgendaSection';
import IrrigationAutomationSection from '../../features/monitoring/IrrigationAutomationSection';
import PlantingPlannerSection from '../../features/monitoring/PlantingPlannerSection';
import { useState } from 'react';
// @mui
import { Box, Container, GridLegacy as Grid, Typography } from '@mui/material';

// components
import Page from '../../components/Page';
import useAuth from '../../auth/useAuth';
import {
  buildRotationInsights,
  buildSeasonOutlook,
  evaluateConditionRules,
  getClimateIntelligence,
  getHighlightedSensors,
  getRoutineRecommendations,
  getDateInputRange,
  getSeasonWindow,
  partitionAgendaTasks,
  sortTasksByPriority,
  summarizeGardens,
} from '../../features/monitoring/domain';
// ----------------------------------------------------------------------

import {
  monthFormatter,
  monitoringContentSx,
  cropCatalog,
  regionalSeasonality,
  rotationByFamily,
  baseTasksByPhase,
  sensorWidgets,
  gardenStatusList,
  pendingTasks,
  rotinaBasePorEspecie,
  conditionRuleTemplates,
  climaExternoAtual,
  activeDevices,
  createInitialAgendaTasks,
  cultivationPhases,
  gardenSectors,
  recentAlerts,
  recommendedActions,
  sectorStatuses,
  speciesOptions,
} from '../../features/monitoring/model';

export default function DashboardApp() {
  const { user } = useAuth();
  const today = new Date();
  const { today: todayString, tomorrow: tomorrowString, twoDaysAgo: twoDaysAgoString } = getDateInputRange(today);
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
  const [enabledWidgets, setEnabledWidgets] = useState({
    resumoHortas: true,
    indicadores: true,
    tarefasPendentes: true,
  });
  const [novaTarefaPorPlanta, setNovaTarefaPorPlanta] = useState({});
  const [automationDraft, setAutomationDraft] = useState({
    nome: 'Rega inteligente da manhã',
    logica: 'AND',
    janelaInicio: '06:00',
    janelaFim: '09:00',
    condicoes: [{ sensor: 'umidadeSolo', operador: '<=', valor: '40' }],
    dependencias: [{ sensor: 'nivelReservatorio', status: 'ok' }],
  });
  const [automationRules, setAutomationRules] = useState([]);
  const [programacao, setProgramacao] = useState({
    irrigacaoHora: '06:00',
    iluminacaoInicio: '07:00',
    iluminacaoFim: '19:00',
    ventilacaoIntervalo: 30,
    ventilacaoDuracao: 8,
    recorrencia: ['seg', 'qua', 'sex'],
  });
  const [agendamentosAtivos, setAgendamentosAtivos] = useState([]);
  const [conditionRules, setConditionRules] = useState(
    conditionRuleTemplates.map((rule) => ({ ...rule, enabled: true }))
  );
  const [agendaTarefas, setAgendaTarefas] = useState(() =>
    createInitialAgendaTasks({ today: todayString, tomorrow: tomorrowString, twoDaysAgo: twoDaysAgoString })
  );
  const [novaTarefaAgenda, setNovaTarefaAgenda] = useState({
    tipo: 'Rega',
    titulo: '',
    descricao: '',
    periodicidade: 'Semanal',
    responsavel: 'Ana',
    vencimento: todayString,
    checklist: [],
  });
  const [novoChecklistItem, setNovoChecklistItem] = useState('');
  const [evidenciaDraftPorTarefa, setEvidenciaDraftPorTarefa] = useState({});
  const [filtroRotina, setFiltroRotina] = useState({ especie: 'Alface Crespa', clima: 'Ameno', estacao: 'Primavera' });

  const opcoesEspecie = speciesOptions;
  const fasesCultivo = cultivationPhases;
  const setores = gardenSectors;
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
        id: createId('planta'),
        ...novaPlanta,
        familia: cropCatalog[novaPlanta.especie].family,
        ciclo: cropCatalog[novaPlanta.especie].cycle,
        eventos: [],
        fotos: [],
        observacoes: [],
        tarefas: (baseTasksByPhase[novaPlanta.faseCultivo] || []).map((titulo) => ({
          id: createId('tarefa'),
          titulo,
          concluida: false,
          prioridade: 'média',
        })),
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
                  id: createId('alerta'),
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
                  id: createId('colheita'),
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
                  id: createId('analise'),
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

  const atualizarNovaTarefa = (plantaId, value) => {
    setNovaTarefaPorPlanta((prev) => ({
      ...prev,
      [plantaId]: value,
    }));
  };

  const atualizarCondicaoAutomacao = (index, field, value) => {
    setAutomationDraft((prev) => ({
      ...prev,
      condicoes: prev.condicoes.map((condicao, condicaoIndex) =>
        condicaoIndex === index ? { ...condicao, [field]: value } : condicao
      ),
    }));
  };

  const adicionarCondicaoAutomacao = () => {
    setAutomationDraft((prev) => ({
      ...prev,
      condicoes: [...prev.condicoes, { sensor: 'temperatura', operador: '>=', valor: '22' }],
    }));
  };

  const removerCondicaoAutomacao = (index) => {
    setAutomationDraft((prev) => ({
      ...prev,
      condicoes: prev.condicoes.filter((_, condicaoIndex) => condicaoIndex !== index),
    }));
  };

  const atualizarDependenciaAutomacao = (index, field, value) => {
    setAutomationDraft((prev) => ({
      ...prev,
      dependencias: prev.dependencias.map((dependencia, dependenciaIndex) =>
        dependenciaIndex === index ? { ...dependencia, [field]: value } : dependencia
      ),
    }));
  };

  const adicionarDependenciaAutomacao = () => {
    setAutomationDraft((prev) => ({
      ...prev,
      dependencias: [...prev.dependencias, { sensor: 'fluxo', status: 'online' }],
    }));
  };

  const removerDependenciaAutomacao = (index) => {
    setAutomationDraft((prev) => ({
      ...prev,
      dependencias: prev.dependencias.filter((_, dependenciaIndex) => dependenciaIndex !== index),
    }));
  };

  const salvarAutomacao = () => {
    if (!automationDraft.nome || automationDraft.condicoes.length === 0) {
      return;
    }

    setAutomationRules((prev) => [
      {
        id: createId('automacao'),
        ...automationDraft,
      },
      ...prev,
    ]);
  };

  const adicionarTarefa = (plantaId) => {
    const titulo = (novaTarefaPorPlanta[plantaId] || '').trim();
    if (!titulo) return;

    setPlantas((prev) =>
      prev.map((planta) =>
        planta.id === plantaId
          ? {
              ...planta,
              tarefas: [
                {
                  id: createId('tarefa'),
                  titulo,
                  concluida: false,
                  prioridade: 'média',
                },
                ...planta.tarefas,
              ],
            }
          : planta
      )
    );

    atualizarNovaTarefa(plantaId, '');
  };

  const alternarTarefa = (plantaId, tarefaId) => {
    setPlantas((prev) =>
      prev.map((planta) =>
        planta.id === plantaId
          ? {
              ...planta,
              tarefas: planta.tarefas.map((tarefa) =>
                tarefa.id === tarefaId ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
              ),
            }
          : planta
      )
    );
  };

  const atualizarProgramacao = (field, value) => {
    setProgramacao((prev) => ({ ...prev, [field]: value }));
  };

  const alternarDiaRecorrencia = (dia) => {
    setProgramacao((prev) => ({
      ...prev,
      recorrencia: prev.recorrencia.includes(dia)
        ? prev.recorrencia.filter((item) => item !== dia)
        : [...prev.recorrencia, dia],
    }));
  };

  const salvarProgramacao = () => {
    if (
      !programacao.irrigacaoHora ||
      !programacao.iluminacaoInicio ||
      !programacao.iluminacaoFim ||
      programacao.recorrencia.length === 0
    ) {
      return;
    }

    setAgendamentosAtivos((prev) => [
      {
        id: createId('irrigacao'),
        ...programacao,
      },
      ...prev,
    ]);
  };

  const janelaAtual = getSeasonWindow(regionalSeasonality, region, novaPlanta.especie);
  const mesEscolhido = novaPlanta.dataPlantio ? new Date(`${novaPlanta.dataPlantio}T00:00:00`).getMonth() + 1 : null;

  const statusJanela = !mesEscolhido
    ? 'Selecione uma data para validar a janela de plantio.'
    : janelaAtual.includes(mesEscolhido)
      ? 'Janela ideal para plantio nesta região.'
      : 'Fora da janela ideal. Considere ajustar a data ou utilizar ambiente protegido.';

  const proximosMeses = buildSeasonOutlook({
    seasonality: regionalSeasonality,
    region,
    species: opcoesEspecie,
    referenceDate: today,
    formatter: monthFormatter,
  });

  const rotationInsights = buildRotationInsights({ sectors: setores, plants: plantas, rotations: rotationByFamily });

  const statusSetores = sectorStatuses;
  const sensoresDestaque = getHighlightedSensors(sensorWidgets);
  const dispositivosAtivos = activeDevices;
  const proximasAcoes = recommendedActions;
  const alertasRecentes = recentAlerts;

  const {
    averageHumidity: indicadorMedioUmidade,
    averageTemperature: indicadorMediaTemperatura,
    activeAlerts: indicadorAlertasAtivos,
  } = summarizeGardens(gardenStatusList);

  const tarefasOrdenadas = sortTasksByPriority(pendingTasks);

  const onToggleWidget = (widgetKey) => (event) => {
    setEnabledWidgets((prev) => ({
      ...prev,
      [widgetKey]: event.target.checked,
    }));
  };

  const currentSensorReadings = {
    umidadeSolo: indicadorMedioUmidade,
    temperatura: indicadorMediaTemperatura,
    reservatorio: 26,
  };
  const evaluatedConditionRules = evaluateConditionRules(conditionRules, currentSensorReadings);

  const triggeredRules = evaluatedConditionRules.filter((rule) => rule.triggered);

  const {
    recommendations: recomendacoesClimaticas,
    rules: regrasClimaticas,
    alerts: alertasClimaticos,
  } = getClimateIntelligence(climaExternoAtual);

  const onThresholdChange = (ruleId) => (event) => {
    const parsedValue = Number(event.target.value);

    setConditionRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              threshold: Number.isNaN(parsedValue) ? rule.threshold : parsedValue,
            }
          : rule
      )
    );
  };

  const onToggleConditionRule = (ruleId) => (event) => {
    setConditionRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              enabled: event.target.checked,
            }
          : rule
      )
    );
  };

  const adicionarItemChecklist = () => {
    const texto = novoChecklistItem.trim();
    if (!texto) return;

    setNovaTarefaAgenda((prev) => ({
      ...prev,
      checklist: [...prev.checklist, { id: createId('checklist'), texto, concluido: false }],
    }));
    setNovoChecklistItem('');
  };

  const criarTarefaAgenda = () => {
    if (!novaTarefaAgenda.titulo.trim() || !novaTarefaAgenda.vencimento) return;

    setAgendaTarefas((prev) => [
      {
        id: createId('agenda'),
        ...novaTarefaAgenda,
        titulo: novaTarefaAgenda.titulo.trim(),
        descricao: novaTarefaAgenda.descricao.trim(),
        concluida: false,
        observacoes: [],
        fotos: [],
        insumos: [],
      },
      ...prev,
    ]);

    setNovaTarefaAgenda({
      tipo: 'Rega',
      titulo: '',
      descricao: '',
      periodicidade: 'Semanal',
      responsavel: 'Ana',
      vencimento: todayString,
      checklist: [],
    });
  };

  const alternarChecklistDaTarefa = (tarefaId, checklistId) => {
    setAgendaTarefas((prev) =>
      prev.map((tarefa) =>
        tarefa.id === tarefaId
          ? {
              ...tarefa,
              checklist: tarefa.checklist.map((item) =>
                item.id === checklistId ? { ...item, concluido: !item.concluido } : item
              ),
            }
          : tarefa
      )
    );
  };

  const marcarTarefaConcluida = (tarefaId) => {
    setAgendaTarefas((prev) =>
      prev.map((tarefa) => (tarefa.id === tarefaId ? { ...tarefa, concluida: true } : tarefa))
    );
  };

  const atualizarEvidenciaDraft = (tarefaId, field, value) => {
    setEvidenciaDraftPorTarefa((prev) => ({
      ...prev,
      [tarefaId]: {
        observacao: prev[tarefaId]?.observacao || '',
        foto: prev[tarefaId]?.foto || '',
        insumo: prev[tarefaId]?.insumo || '',
        [field]: value,
      },
    }));
  };

  const registrarEvidencia = (tarefaId) => {
    const draft = evidenciaDraftPorTarefa[tarefaId];
    if (!draft) return;

    setAgendaTarefas((prev) =>
      prev.map((tarefa) =>
        tarefa.id === tarefaId
          ? {
              ...tarefa,
              observacoes: draft.observacao ? [draft.observacao, ...tarefa.observacoes] : tarefa.observacoes,
              fotos: draft.foto ? [draft.foto, ...tarefa.fotos] : tarefa.fotos,
              insumos: draft.insumo ? [draft.insumo, ...tarefa.insumos] : tarefa.insumos,
            }
          : tarefa
      )
    );

    setEvidenciaDraftPorTarefa((prev) => ({ ...prev, [tarefaId]: { observacao: '', foto: '', insumo: '' } }));
  };

  const reagendarTarefa = (tarefaId, novaData) => {
    if (!novaData) return;
    setAgendaTarefas((prev) =>
      prev.map((tarefa) => (tarefa.id === tarefaId ? { ...tarefa, vencimento: novaData } : tarefa))
    );
  };

  const {
    today: tarefasDoDia,
    overdue: tarefasAtrasadas,
    upcoming: proximasTarefas,
    completionRate: taxaConclusao,
  } = partitionAgendaTasks(agendaTarefas, todayString);
  const sugestoesEspecie = rotinaBasePorEspecie[filtroRotina.especie] || [];
  const {
    climate: ajusteClima,
    season: ajusteEstacao,
    history: ajusteHistorico,
  } = getRoutineRecommendations(filtroRotina, taxaConclusao);

  return (
    <Page title="Dashboard">
      <Container maxWidth={false} sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box
          component="section"
          sx={{
            mb: 4,
            p: { xs: 2.5, sm: 3 },
            border: 1,
            borderColor: 'primary.main',
            borderLeft: 6,
            borderLeftColor: 'info.light',
            borderRadius: 1,
            bgcolor: 'primary.dark',
            color: 'common.white',
          }}
        >
          <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 0 }}>
            Centro de operação
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
            Olá, {user?.name || 'Usuário'}
          </Typography>
          <Typography sx={{ maxWidth: 700, opacity: 0.92 }}>
            Bem-vindo ao painel inteligente da Hortelan. Acompanhe sensores, automações e alertas em tempo real para
            elevar produtividade com decisões baseadas em dados.
          </Typography>
        </Box>

        <Box sx={monitoringContentSx}>
          <Grid container spacing={3}>
            <MonitoringOverview
              enabledWidgets={enabledWidgets}
              onToggleWidget={onToggleWidget}
              metrics={{
                humidity: indicadorMedioUmidade,
                temperature: indicadorMediaTemperatura,
                alerts: indicadorAlertasAtivos,
              }}
              tasks={tarefasOrdenadas}
            />
            <ClimateIntelligence
              recommendations={recomendacoesClimaticas}
              alerts={alertasClimaticos}
              rules={regrasClimaticas}
            />
            <AutomationRulesSection
              controller={{
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
              }}
            />
            <SensorHealthSection
              controller={{ statusSetores, sensoresDestaque, dispositivosAtivos, proximasAcoes, alertasRecentes }}
            />
            <TaskAgendaSection
              controller={{
                novaTarefaAgenda,
                setNovaTarefaAgenda,
                novoChecklistItem,
                setNovoChecklistItem,
                agendaTarefas,
                adicionarItemChecklist,
                criarTarefaAgenda,
                tarefasDoDia,
                tarefasAtrasadas,
                proximasTarefas,
                alternarChecklistDaTarefa,
                marcarTarefaConcluida,
                evidenciaDraftPorTarefa,
                atualizarEvidenciaDraft,
                registrarEvidencia,
                reagendarTarefa,
                filtroRotina,
                setFiltroRotina,
                sugestoesEspecie,
                ajusteClima,
                ajusteEstacao,
                ajusteHistorico,
                taxaConclusao,
                opcoesEspecie,
              }}
            />
            <IrrigationAutomationSection
              controller={{
                programacao,
                atualizarProgramacao,
                alternarDiaRecorrencia,
                salvarProgramacao,
                agendamentosAtivos,
                evaluatedConditionRules,
                onThresholdChange,
                onToggleConditionRule,
                triggeredRules,
              }}
            />
            <PlantingPlannerSection
              controller={{
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
              }}
            />
            <MonitoringAnalytics />
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
