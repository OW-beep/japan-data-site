import cities from "@/data/cities.json";

export function getCityRanking(code: string) {
  const city = cities.find((c: any) => c.code === code);

  if (!city) return null;

  const rank = (
    list: any[],
    key: string
  ) =>
    [...list]
      .filter((c) => c[key] != null)
      .sort(
        (a, b) =>
          (b[key] ?? 0) - (a[key] ?? 0)
      )
      .findIndex((c) => c.code === code) + 1;

  // -------------------
  // 全国順位
  // -------------------

  const populationRank = rank(
    cities,
    "population"
  );

  const areaRank = rank(
    cities,
    "area"
  );

  const densityRank = rank(
    cities,
    "populationDensity"
  );

  const childRank = rank(
    cities,
    "childPopulation"
  );

  const agingRank = rank(
    cities,
    "agingRate"
  );

  const birthRank = rank(
    cities,
    "birthRate"
  );

  // -------------------
  // 都道府県順位
  // -------------------

  const pref = city.name.split(" ")[0];

  const prefCities = cities.filter((c: any) =>
    c.name.startsWith(pref + " ")
  );

  const prefPopulationRank = rank(
    prefCities,
    "population"
  );

  const prefAreaRank = rank(
    prefCities,
    "area"
  );

  const prefDensityRank = rank(
    prefCities,
    "populationDensity"
  );

  const prefChildRank = rank(
    prefCities,
    "childPopulation"
  );

  const prefAgingRank = rank(
    prefCities,
    "agingRate"
  );

  const prefBirthRank = rank(
    prefCities,
    "birthRate"
  );

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
      {
        label: "子ども人口",
        value: `${childRank}位`,
      },
      {
        label: "高齢化率",
        value:
          agingRank > 0
            ? `${agingRank}位`
            : "-",
      },
      {
        label: "出生率",
        value:
          birthRank > 0
            ? `${birthRank}位`
            : "-",
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
      {
        label: "子ども人口",
        value: `${prefChildRank}位`,
      },
      {
        label: "高齢化率",
        value:
          prefAgingRank > 0
            ? `${prefAgingRank}位`
            : "-",
      },
      {
        label: "出生率",
        value:
          prefBirthRank > 0
            ? `${prefBirthRank}位`
            : "-",
      },
    ],
  };
}