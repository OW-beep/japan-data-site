export type City = {
  code: string;
  name: string;

  population: number;
  childPopulation: number;
  elderlyPopulation: number;

  // 面積(km²)
  area: number | null;

  // 人口密度(人/km²)
  populationDensity: number | null;

  // 今後追加予定
  financialIndex?: number | null;
};