import cities from "@/data/cities.json";

export function getCityRanking(code: string) {
  const city = cities.find((c: any) => c.code === code);

  if (!city) return null;

  // 全国順位

  const populationRank =
    [...cities]
      .sort(
        (a: any, b: any) =>
          b.population - a.population
      )
      .findIndex(
        (c: any) => c.code === code
      ) + 1;

  const areaRank =
    [...cities]
      .sort(
        (a: any, b: any) =>
          (b.area ?? 0) - (a.area ?? 0)
      )
      .findIndex(
        (c: any) => c.code === code
      ) + 1;

  const densityRank =
    [...cities]
      .sort(
        (a: any, b: any) =>
          (b.populationDensity ?? 0) -
          (a.populationDensity ?? 0)
      )
      .findIndex(
        (c: any) => c.code === code
      ) + 1;

  // 都道府県順位

  const prefCities = cities.filter(
    (c: any) =>
      c.prefecture === city.prefecture
  );

  const prefPopulationRank =
    [...prefCities]
      .sort(
        (a: any, b: any) =>
          b.population - a.population
      )
      .findIndex(
        (c: any) => c.code === code
      ) + 1;

  const prefAreaRank =
    [...prefCities]
      .sort(
        (a: any, b: any) =>
          (b.area ?? 0) - (a.area ?? 0)
      )
      .findIndex(
        (c: any) => c.code === code
      ) + 1;

  const prefDensityRank =
    [...prefCities]
      .sort(
        (a: any, b: any) =>
          (b.populationDensity ?? 0) -
          (a.populationDensity ?? 0)
      )
      .findIndex(
        (c: any) => c.code === code
      ) + 1;

  return {
    national: [
      {
        label: "人口",
        value: `${populationRank}位`,
      },
      {
        label: "面積",
        value: `${areaRank}位`,
      },
      {
        label: "人口密度",
        value: `${densityRank}位`,
      },
    ],

    prefecture: [
      {
        label: "人口",
        value: `${prefPopulationRank}位`,
      },
      {
        label: "面積",
        value: `${prefAreaRank}位`,
      },
      {
        label: "人口密度",
        value: `${prefDensityRank}位`,
      },
    ],
  };
}