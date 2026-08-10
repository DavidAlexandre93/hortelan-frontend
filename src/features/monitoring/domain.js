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
