
export interface SubstanceData {
  temp: number;
  waterDensity: number;
  standardDensity: number;
  waterVolume: number;
  standardVolume: number;
}

export enum SubstanceType {
  WATER = 'Vatten',
  STANDARD = 'Andra ämnen'
}
