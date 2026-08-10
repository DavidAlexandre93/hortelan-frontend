import { describe, expect, it } from 'vitest';
import {
  buildRotationInsights,
  buildSeasonOutlook,
  evaluateConditionRule,
  getDateInputRange,
  getNextRotationFamily,
  getSeasonWindow,
  getSuggestedSpecies,
  partitionAgendaTasks,
  sortTasksByPriority,
  summarizeGardens,
} from './domain';

describe('monitoring domain', () => {
  it('avalia operadores de automacao sem coercoes ambiguas', () => {
    expect(evaluateConditionRule({ comparator: 'lt', threshold: 40 }, 35)).toBe(true);
    expect(evaluateConditionRule({ comparator: 'gte', threshold: 40 }, '40')).toBe(true);
    expect(evaluateConditionRule({ comparator: 'eq', threshold: 40 }, 41)).toBe(false);
    expect(evaluateConditionRule(null, 10)).toBe(false);
  });

  it('calcula janela e sugestoes sazonais com fallback seguro', () => {
    const seasonality = { Sudeste: { Alface: [4, 5], Tomate: [8, 9] } };
    expect(getSeasonWindow(seasonality, 'Sudeste', 'Alface')).toEqual([4, 5]);
    expect(getSeasonWindow(seasonality, 'Norte', 'Alface')).toEqual([]);
    expect(getSuggestedSpecies(seasonality, 'Sudeste', ['Alface', 'Tomate'], 5)).toEqual(['Alface']);
  });

  it('sugere rotacao conhecida ou fallback conservador', () => {
    expect(getNextRotationFamily({ Folhosas: ['Raizes'] }, 'Folhosas')).toEqual(['Raizes']);
    expect(getNextRotationFamily({}, 'Desconhecida')).toEqual(['Folhosas']);
  });

  it('gera datas e previsao sazonal de forma deterministica', () => {
    const referenceDate = new Date('2026-08-10T12:00:00Z');
    expect(getDateInputRange(referenceDate)).toEqual({
      today: '2026-08-10',
      tomorrow: '2026-08-11',
      twoDaysAgo: '2026-08-08',
    });
    const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' });
    const outlook = buildSeasonOutlook({
      seasonality: { Sudeste: { Alface: [8, 9] } },
      region: 'Sudeste',
      species: ['Alface'],
      referenceDate,
      formatter,
    });
    expect(outlook).toHaveLength(6);
    expect(outlook[0]).toMatchObject({ month: 8, recomendadas: ['Alface'] });
  });

  it('calcula rotacao, indicadores e prioridade sem mutar as entradas', () => {
    const plants = [
      { setor: 'A', familia: 'Folhosas' },
      { setor: 'A', familia: 'Folhosas' },
    ];
    expect(buildRotationInsights({ sectors: ['A', 'B'], plants, rotations: { Folhosas: ['Raizes'] } })).toEqual([
      expect.objectContaining({ setor: 'A', status: 'Risco de repeticao de familia' }),
      expect.objectContaining({ setor: 'B', status: 'Sem historico ainda' }),
    ]);
    expect(
      summarizeGardens([
        { umidade: 60, temperatura: 22, alertas: 1 },
        { umidade: 80, temperatura: 24, alertas: 2 },
      ])
    ).toEqual({ averageHumidity: 70, averageTemperature: 23, activeAlerts: 3 });
    const tasks = [
      { id: 'low', prioridade: 'Baixa' },
      { id: 'high', prioridade: 'Alta' },
    ];
    expect(sortTasksByPriority(tasks).map((task) => task.id)).toEqual(['high', 'low']);
    expect(tasks[0].id).toBe('low');
  });

  it('particiona a agenda e calcula a conclusao', () => {
    const result = partitionAgendaTasks(
      [
        { id: 'overdue', vencimento: '2026-08-09', concluida: false },
        { id: 'today', vencimento: '2026-08-10', concluida: false },
        { id: 'upcoming', vencimento: '2026-08-11', concluida: false },
        { id: 'done', vencimento: '2026-08-08', concluida: true },
      ],
      '2026-08-10'
    );
    expect(result.overdue[0].id).toBe('overdue');
    expect(result.today[0].id).toBe('today');
    expect(result.upcoming[0].id).toBe('upcoming');
    expect(result.completionRate).toBe(25);
  });
});
