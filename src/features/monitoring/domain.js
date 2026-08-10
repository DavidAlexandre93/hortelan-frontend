export function evaluateConditionRule(rule, currentValue) {
  if (!rule || !Number.isFinite(Number(currentValue))) return false;
  const value = Number(currentValue);
  const threshold = Number(rule.threshold);

  if (rule.comparator === 'gt') return value > threshold;
  if (rule.comparator === 'gte') return value >= threshold;
  if (rule.comparator === 'lte') return value <= threshold;
  if (rule.comparator === 'eq') return value === threshold;
  return value < threshold;
}

export function getSeasonWindow(seasonality, region, species) {
  return seasonality?.[region]?.[species] || [];
}

export function getSuggestedSpecies(seasonality, region, species, month) {
  return species.filter((name) => getSeasonWindow(seasonality, region, name).includes(month));
}

export function getNextRotationFamily(rotationByFamily, currentFamily) {
  return rotationByFamily[currentFamily] || ['Folhosas'];
}

export function formatDateInput(date) {
  return date.toISOString().slice(0, 10);
}

export function getDateInputRange(referenceDate = new Date()) {
  const date = new Date(referenceDate);
  const relativeDate = (offset) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
  return {
    today: formatDateInput(date),
    tomorrow: formatDateInput(relativeDate(1)),
    twoDaysAgo: formatDateInput(relativeDate(-2)),
  };
}

export function buildSeasonOutlook({ seasonality, region, species, referenceDate = new Date(), formatter }) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(referenceDate);
    date.setMonth(date.getMonth() + index);
    const month = date.getMonth() + 1;
    return {
      month,
      label: formatter.format(date),
      recomendadas: getSuggestedSpecies(seasonality, region, species, month),
    };
  });
}

export function buildRotationInsights({ sectors, plants, rotations }) {
  return sectors.map((setor) => {
    const history = plants.filter((plant) => plant.setor === setor);
    const recent = history[0];
    if (!recent) {
      return {
        setor,
        status: 'Sem historico ainda',
        recomendacao: 'Registre ao menos um plantio para habilitar a rotacao inteligente.',
      };
    }

    const nextFamilies = getNextRotationFamily(rotations, recent.familia);
    const repeatedFamily = history[1]?.familia === recent.familia;
    return {
      setor,
      status: repeatedFamily ? 'Risco de repeticao de familia' : 'Rotacao saudavel',
      recomendacao: repeatedFamily
        ? `Evite novo ciclo de ${recent.familia}. Priorize ${nextFamilies.join(', ')}.`
        : `Proxima rotacao sugerida: ${nextFamilies.join(', ')}.`,
    };
  });
}

export function summarizeGardens(gardens) {
  if (!gardens.length) return { averageHumidity: 0, averageTemperature: 0, activeAlerts: 0 };
  return {
    averageHumidity: Math.round(gardens.reduce((total, garden) => total + garden.umidade, 0) / gardens.length),
    averageTemperature: Number(
      (gardens.reduce((total, garden) => total + garden.temperatura, 0) / gardens.length).toFixed(1)
    ),
    activeAlerts: gardens.reduce((total, garden) => total + garden.alertas, 0),
  };
}

export function sortTasksByPriority(tasks) {
  const priorities = { Alta: 0, Media: 1, Média: 1, Baixa: 2 };
  return [...tasks].sort((a, b) => (priorities[a.prioridade] ?? 3) - (priorities[b.prioridade] ?? 3));
}

export function partitionAgendaTasks(tasks, today) {
  const pending = tasks.filter((task) => !task.concluida);
  const completed = tasks.length - pending.length;
  return {
    today: pending.filter((task) => task.vencimento === today),
    overdue: pending.filter((task) => task.vencimento < today),
    upcoming: pending
      .filter((task) => task.vencimento > today)
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento)),
    completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
  };
}

export function getHighlightedSensors(sensors, limit = 3) {
  return [...sensors]
    .sort((a, b) => Number(b.total) - Number(a.total))
    .slice(0, limit)
    .map((sensor) => ({
      ...sensor,
      leitura: `${sensor.total} ${sensor.title.includes('pH') || sensor.title.includes('EC') ? 'un.' : 'pontos'}`,
    }));
}

export function evaluateConditionRules(rules, readings) {
  return rules.map((rule) => {
    const currentValue = readings[rule.sensor];
    return {
      ...rule,
      currentValue,
      triggered: rule.enabled && evaluateConditionRule(rule, currentValue),
    };
  });
}

export function getClimateIntelligence(weather) {
  const recommendations = [
    weather.chuvaChance >= 60
      ? 'Alta chance de chuva: priorize irrigacao minima e preserve agua do reservatorio.'
      : 'Baixa chance de chuva: mantenha o ciclo normal de irrigacao das areas externas.',
    weather.temperatura >= 33
      ? 'Onda de calor detectada: aplique irrigacao curta no inicio da tarde.'
      : 'Sem onda de calor no momento: monitore somente picos apos 14h.',
    weather.umidade <= 40
      ? 'Umidade externa baixa: acompanhe o estresse hidrico em mudas novas.'
      : 'Umidade externa adequada para manter a transpiracao controlada.',
  ];
  const rules = [
    {
      regra: 'Pular rega se houver previsao de chuva',
      status: weather.chuvaChance >= 70 ? 'Ativada' : 'Inativa',
      detalhe:
        weather.chuvaChance >= 70
          ? 'A proxima irrigacao externa das 18:00 foi suspensa automaticamente.'
          : 'Sem bloqueio de irrigacao por chuva nas proximas horas.',
    },
    {
      regra: 'Reforcar irrigacao em onda de calor',
      status: weather.temperatura >= 34 ? 'Ativada' : 'Monitorando',
      detalhe:
        weather.temperatura >= 34
          ? 'Pulsos extras de 4 min foram sugeridos para os setores externos.'
          : 'Temperatura alta, mas abaixo do gatilho de onda de calor.',
    },
    {
      regra: 'Ajustar iluminacao em dias nublados (fase avancada)',
      status: weather.insolacao <= 5 ? 'Sugerida' : 'Inativa',
      detalhe:
        weather.insolacao <= 5
          ? 'Adicionar 45 min ao ciclo de iluminacao suplementar da estufa.'
          : 'Insolacao natural suficiente para manter o ciclo atual.',
    },
  ];
  const alerts = [
    weather.temperatura >= 35
      ? { tipo: 'error', mensagem: 'Calor extremo: proteja mudas sensiveis e reforce o sombreamento.' }
      : null,
    weather.temperatura <= 10
      ? { tipo: 'warning', mensagem: 'Frio intenso: avalie manta termica para hortas externas.' }
      : null,
    weather.chuvaChance >= 70
      ? { tipo: 'info', mensagem: 'Chuva prevista: ciclos externos foram pausados para evitar encharcamento.' }
      : null,
  ].filter(Boolean);
  return { recommendations, rules, alerts };
}

export function getRoutineRecommendations(filters, completionRate) {
  const climate =
    filters.clima === 'Seco'
      ? 'Aumente a frequencia de rega e priorize cobertura para reduzir evaporacao.'
      : filters.clima === 'Chuvoso'
        ? 'Reduza regas manuais e reforce inspecoes de fungos e drenagem.'
        : 'Mantenha o plano padrao e monitore os sensores diariamente.';
  const season =
    filters.estacao === 'Verao' || filters.estacao === 'Verão'
      ? 'Antecipe tarefas para o inicio da manha e fim da tarde.'
      : filters.estacao === 'Inverno'
        ? 'Amplie o intervalo entre regas e acompanhe a luminosidade.'
        : 'Ajuste a rotina gradualmente conforme temperatura e umidade.';
  const history =
    completionRate >= 75
      ? 'Historico saudavel: amplie automacoes e mantenha auditoria semanal.'
      : 'Ha acumulo de tarefas: simplifique o checklist e redistribua responsaveis.';
  return { climate, season, history };
}
