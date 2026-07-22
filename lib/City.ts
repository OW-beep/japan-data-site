export type City = {
  code: string;
  name: string;

  population: number;
  childPopulation: number;
  elderlyPopulation: number;

  area: number | null;
  populationDensity: number | null;

  financeIndex: number | null;

  birthRate?: number | null;
  agingRate?: number | null;
  declineRate?: number | null;

  inMigrants?: number | null;
  outMigrants?: number | null;
  households?: number | null;
  singleHouseholds?: number | null;
};