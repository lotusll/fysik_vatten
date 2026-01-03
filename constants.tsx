
export const TEMPERATURE_RANGE = { min: -5, max: 20 };
export const DEFAULT_TEMP = 10;

export interface Substance {
  id: string;
  name: string;
  baseDensity: number; // kg/m3 at 0C
  expansionCoeff: number; // simplified linear coefficient
  color: string;
}

export const SUBSTANCES: Substance[] = [
  { id: 'ethanol', name: 'Etanol (Sprit)', baseDensity: 806, expansionCoeff: 1.1, color: '#f59e0b' },
  { id: 'oil', name: 'Matolja', baseDensity: 920, expansionCoeff: 0.7, color: '#84cc16' },
  { id: 'mercury', name: 'Kvicksilver', baseDensity: 13593, expansionCoeff: 2.4, color: '#94a3b8' },
  { id: 'generic', name: 'Standardämne', baseDensity: 900, expansionCoeff: 0.5, color: '#fbbf24' }
];

// Water peaks at ~4°C
export const calculateWaterDensity = (t: number): number => {
  if (t < 0) return 916.7; // Ice density (approx)
  // Simplified realistic formula for water density anomaly
  // Max density ~999.97 at 3.98C
  return 1000 - 0.008 * Math.pow(t - 4, 2);
};

// Linear decrease in density as temp rises for normal substances
export const calculateSubstanceDensity = (substance: Substance, t: number): number => {
  return substance.baseDensity - (substance.expansionCoeff * t);
};

export const calculateVolume = (density: number, mass: number = 1000): number => {
  return mass / density;
};
