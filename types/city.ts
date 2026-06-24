export type City = {
  code: string;
  name: string;

  population: number;

  childPopulation?: number;
  elderlyPopulation?: number;

  year?: number;
};