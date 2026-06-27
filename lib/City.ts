export type City = {
  code: string;
  name: string;

  population: number;
  childPopulation: number;
  elderlyPopulation: number;

  area: number | null;
  populationDensity: number | null;
  financialIndex: number | null;

  birthRate?: number | null;
  declineRate?: number | null;
};