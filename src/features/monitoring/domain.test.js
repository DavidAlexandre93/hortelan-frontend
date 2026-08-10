import { describe, expect, it } from 'vitest';
import { evaluateConditionRule, getNextRotationFamily, getSeasonWindow, getSuggestedSpecies } from './domain';

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
});
