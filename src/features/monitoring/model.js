import { createId } from '../../utils/createId';

export const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
export const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export const monitoringContentSx = {
  '& .MuiCard-root': {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  '& .MuiCardContent-root': {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    '&:last-child': {
      pb: 3,
    },
  },
  '& .MuiPaper-root': {
    height: '100%',
  },
};

export const cropCatalog = {
  'Alface Crespa': { family: 'Folhosas', cycle: '45-60 dias' },
  'Alface Americana': { family: 'Folhosas', cycle: '55-70 dias' },
  'Tomate Cereja': { family: 'Solanáceas', cycle: '90-110 dias' },
  Manjericão: { family: 'Aromáticas', cycle: '60-90 dias' },
  Rúcula: { family: 'Folhosas', cycle: '35-45 dias' },
  'Couve Manteiga': { family: 'Brássicas', cycle: '75-95 dias' },
};

export const regionalSeasonality = {
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

export const rotationByFamily = {
  Folhosas: ['Frutos', 'Leguminosas', 'Raízes'],
  Solanáceas: ['Folhosas', 'Leguminosas', 'Brássicas'],
  Aromáticas: ['Folhosas', 'Frutos', 'Brássicas'],
  Brássicas: ['Leguminosas', 'Raízes', 'Frutos'],
};

export const eventTypeOptions = [
  { value: 'rega', label: 'Rega' },
  { value: 'poda', label: 'Poda' },
  { value: 'adubacao', label: 'Adubação' },
  { value: 'praga', label: 'Praga' },
  { value: 'colheita', label: 'Colheita' },
];

export const baseTasksByPhase = {
  Germinação: ['Monitorar umidade diariamente', 'Verificar incidência de luz indireta'],
  Crescimento: ['Adubar com composto orgânico', 'Inspecionar sinais de pragas'],
  Floração: ['Ajustar irrigação para manter constância', 'Reforçar tutoramento dos ramos'],
  Colheita: ['Planejar colheita escalonada', 'Registrar produtividade da semana'],
};

export const sensorWidgets = [
  {
    title: 'Sensor de umidade do solo',
    total: 68,
    icon1: 'carbon:soil-moisture-field',
    color: 'primary',
  },
  {
    title: 'Sensor de temperatura ambiente',
    total: 24,
    icon1: 'mdi:temperature-celsius',
    color: 'info',
  },
  {
    title: 'Sensor de umidade do ar',
    total: 57,
    icon1: 'mdi:water-percent',
    color: 'warning',
  },
  {
    title: 'Sensor de luminosidade',
    total: 410,
    icon1: 'ph:sun',
    color: 'error',
  },
  {
    title: 'Sensor de pH',
    total: 6.4,
    icon1: 'material-symbols:water-ph',
    color: 'success',
  },
  {
    title: 'Sensor de EC / condutividade (fase avançada)',
    total: 1.8,
    icon1: 'mdi:chart-timeline-variant',
    color: 'secondary',
  },
  {
    title: 'Sensor de nível de água / reservatório',
    total: 72,
    icon1: 'icon-park:water-level',
    color: 'primary',
  },
  {
    title: 'Sensor de fluxo (fase avançada)',
    total: 14,
    icon1: 'mdi:waves-arrow-right',
    color: 'info',
  },
];

export const gardenStatusList = [
  { id: 'g-01', nome: 'Estufa A', umidade: 71, temperatura: 26, alertas: 1, tarefasPendentes: 2 },
  { id: 'g-02', nome: 'Canteiro B', umidade: 62, temperatura: 24, alertas: 0, tarefasPendentes: 1 },
  { id: 'g-03', nome: 'Hidroponia', umidade: 78, temperatura: 22, alertas: 2, tarefasPendentes: 3 },
  { id: 'g-04', nome: 'Jardim Vertical', umidade: 59, temperatura: 27, alertas: 1, tarefasPendentes: 2 },
];

export const pendingTasks = [
  { id: 'pt-1', titulo: 'Reforçar irrigação no Canteiro B', prioridade: 'Alta', horta: 'Canteiro B' },
  { id: 'pt-2', titulo: 'Inspecionar foco de pragas na Hidroponia', prioridade: 'Alta', horta: 'Hidroponia' },
  { id: 'pt-3', titulo: 'Calibrar sensor de umidade da Estufa A', prioridade: 'Média', horta: 'Estufa A' },
  { id: 'pt-4', titulo: 'Verificar reservatório do Jardim Vertical', prioridade: 'Média', horta: 'Jardim Vertical' },
  { id: 'pt-5', titulo: 'Planejar poda de manutenção', prioridade: 'Baixa', horta: 'Estufa A' },
];

export const responsaveisAgenda = ['Ana', 'Bruno', 'Carla', 'Equipe Hidroponia'];

export const periodicidadeOptions = ['Única', 'Diária', 'Semanal', 'Quinzenal', 'Mensal'];

export const climaOptions = ['Ameno', 'Seco', 'Chuvoso'];

export const estacaoOptions = ['Verão', 'Outono', 'Inverno', 'Primavera'];

export const rotinaBasePorEspecie = {
  'Alface Crespa': ['Rega leve diária', 'Verificação de pragas 2x por semana', 'Colheita entre 45 e 60 dias'],
  'Alface Americana': ['Rega em horários frescos', 'Adubação quinzenal', 'Poda de folhas externas quando necessário'],
  'Tomate Cereja': ['Tutoramento semanal', 'Poda de brotos laterais', 'Adubação rica em potássio a cada 15 dias'],
  Manjericão: ['Poda de ponteiros semanal', 'Rega moderada diária', 'Colheita frequente para estimular novos ramos'],
  Rúcula: ['Rega curta diária', 'Adubação leve semanal', 'Colheita escalonada por folhas'],
  'Couve Manteiga': ['Rega 3x por semana', 'Controle de lagartas', 'Colheita contínua de folhas maduras'],
};

export const tiposTarefaBase = [
  'Rega',
  'Adubação',
  'Poda',
  'Troca de água (hidroponia)',
  'Limpeza de reservatório',
  'Verificação de pragas',
  'Colheita',
  'Replantio',
];

export const automationSensors = [
  { value: 'umidadeSolo', label: 'Umidade do solo (%)' },
  { value: 'temperatura', label: 'Temperatura ambiente (°C)' },
  { value: 'umidadeAr', label: 'Umidade do ar (%)' },
  { value: 'luminosidade', label: 'Luminosidade (lux)' },
  { value: 'nivelReservatorio', label: 'Nível do reservatório (%)' },
  { value: 'fluxo', label: 'Fluxo de água (L/min)' },
];

export const automationOperators = ['<', '<=', '=', '>=', '>'];

export const dependencyStatuses = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'ok', label: 'Saudável' },
  { value: 'critico', label: 'Crítico' },
];

export const diasSemana = [
  { value: 'seg', label: 'Seg' },
  { value: 'ter', label: 'Ter' },
  { value: 'qua', label: 'Qua' },
  { value: 'qui', label: 'Qui' },
  { value: 'sex', label: 'Sex' },
  { value: 'sab', label: 'Sáb' },
  { value: 'dom', label: 'Dom' },
];

export const conditionRuleTemplates = [
  {
    id: 'regra-umidade',
    label: 'Se umidade do solo < X, ligar bomba',
    sensor: 'umidadeSolo',
    sensorLabel: 'Umidade do solo',
    thresholdLabel: 'Limite de umidade (%)',
    comparator: 'lt',
    threshold: 60,
    actionLabel: 'Ligar bomba de irrigação',
  },
  {
    id: 'regra-temperatura',
    label: 'Se temperatura > Y, ligar ventilação',
    sensor: 'temperatura',
    sensorLabel: 'Temperatura',
    thresholdLabel: 'Limite de temperatura (°C)',
    comparator: 'gt',
    threshold: 28,
    actionLabel: 'Ligar ventilação',
  },
  {
    id: 'regra-reservatorio',
    label: 'Se reservatório baixo, enviar alerta',
    sensor: 'reservatorio',
    sensorLabel: 'Nível do reservatório',
    thresholdLabel: 'Nível mínimo do reservatório (%)',
    comparator: 'lt',
    threshold: 30,
    actionLabel: 'Enviar alerta para responsáveis',
  },
];

export const climaExternoAtual = {
  local: 'Campinas - SP',
  atualizadoEm: 'Hoje, 14:30',
  temperatura: 31,
  umidade: 42,
  chuvaChance: 78,
  vento: 19,
  insolacao: 4.7,
  condicao: 'Nuvens carregadas com pancadas isoladas no fim da tarde',
};

export const previsaoClimatica = [
  { periodo: 'Agora', temp: 31, chuva: 45, condicao: 'Nublado' },
  { periodo: '18h', temp: 29, chuva: 78, condicao: 'Chuva fraca' },
  { periodo: '21h', temp: 25, chuva: 62, condicao: 'Chuva moderada' },
  { periodo: 'Amanhã', temp: 27, chuva: 35, condicao: 'Parcialmente nublado' },
];

export const historicoClimaticoCorrelacionado = [
  {
    periodo: 'Semana 14',
    produtividade: '+4%',
    clima: 'Temperatura estável (24-27°C) e chuva leve',
    evento: 'Melhor desenvolvimento vegetativo.',
  },
  {
    periodo: 'Semana 15',
    produtividade: '-11%',
    clima: 'Pico de calor (36°C) por 3 dias',
    evento: 'Murcha no Canteiro B e aumento do consumo de água.',
  },
  {
    periodo: 'Semana 16',
    produtividade: '+2%',
    clima: 'Frente fria com mínima de 13°C',
    evento: 'Crescimento mais lento em mudas recém-transplantadas.',
  },
];

export const speciesOptions = Object.keys(cropCatalog);
export const cultivationPhases = ['Germinação', 'Crescimento', 'Floração', 'Colheita'];
export const gardenSectors = ['Canteiro A', 'Canteiro B', 'Canteiro C'];

export const sectorStatuses = [
  { nome: 'Canteiro A', status: 'Saudável', color: 'success', detalhe: 'Irrigação e clima dentro da meta.' },
  {
    nome: 'Canteiro B',
    status: 'Atenção',
    color: 'warning',
    detalhe: 'Queda de umidade prevista para as próximas 2h.',
  },
  { nome: 'Canteiro C', status: 'Crítico', color: 'error', detalhe: 'Sensor de pH fora da faixa recomendada.' },
];

export const activeDevices = { ativos: 18, offline: 2, automacoes: 9 };
export const recommendedActions = [
  'Programar irrigação do Canteiro B para 18:00.',
  'Revisar dosagem de nutrientes no reservatório principal.',
  'Validar cobertura de luminosidade na estufa até o fim da tarde.',
];
export const recentAlerts = [
  { severidade: 'warning', mensagem: 'Queda de umidade detectada no Canteiro B há 12 minutos.' },
  { severidade: 'error', mensagem: 'Leitura de pH fora da faixa ideal no Canteiro C há 27 minutos.' },
  { severidade: 'info', mensagem: 'Novo ciclo de irrigação concluído com sucesso no Canteiro A.' },
];

export function createInitialAgendaTasks({ today, tomorrow, twoDaysAgo }) {
  const task = (payload) => ({
    id: createId('agenda'),
    concluida: false,
    observacoes: [],
    fotos: [],
    insumos: [],
    ...payload,
  });
  const checklist = (texto) => ({ id: createId('checklist'), texto, concluido: false });
  return [
    task({
      tipo: 'Rega',
      titulo: 'Rega das mudas da Estufa A',
      descricao: 'Aplicar rega leve no início da manhã.',
      periodicidade: 'Diária',
      responsavel: 'Ana',
      vencimento: today,
      checklist: [checklist('Conferir umidade antes de regar'), checklist('Registrar volume de água aplicado')],
    }),
    task({
      tipo: 'Verificação de pragas',
      titulo: 'Inspeção visual no canteiro B',
      descricao: 'Verificar sinais de pulgões e manchas foliares.',
      periodicidade: 'Semanal',
      responsavel: 'Bruno',
      vencimento: twoDaysAgo,
      checklist: [checklist('Inspecionar verso das folhas')],
    }),
    task({
      tipo: 'Troca de água (hidroponia)',
      titulo: 'Troca parcial da solução nutritiva',
      descricao: 'Renovar 30% do reservatório.',
      periodicidade: 'Quinzenal',
      responsavel: 'Equipe Hidroponia',
      vencimento: tomorrow,
      checklist: [checklist('Medição de pH após troca')],
    }),
  ];
}
