import citiesData from "@/data/cities.json";
import type { City } from "./City";

const cities = citiesData as City[];

export function getCityRanking(code: string) {
  const city = cities.find((c) => c.code === code);

  if (!city) return null;

  // =========================
  // 全国順位
  // =========================

  const populationRank =
    [...cities]
      .sort((a, b) => b.population - a.population)
      .findIndex((c) => c.code === code) + 1;

  const areaRank =
    [...cities]
      .sort((a, b) => (b.area ?? 0) - (a.area ?? 0))
      .findIndex((c) => c.code === code) + 1;

  const densityRank =
    [...cities]
      .sort(
        (a, b) =>
          (b.populationDensity ?? 0) -
          (a.populationDensity ?? 0)
      )
      .findIndex((c) => c.code === code) + 1;

  const childRank =
    [...cities]
      .sort(
        (a, b) =>
          (b.childPopulation ?? 0) -
          (a.childPopulation ?? 0)
      )
      .findIndex((c) => c.code === code) + 1;

  const birthRateRank =
    city.birthRate == null
      ? 0
      : [...cities]
          .filter((c) => c.birthRate != null)
          .sort(
            (a, b) =>
              (b.birthRate ?? 0) -
              (a.birthRate ?? 0)
          )
          .findIndex((c) => c.code === code) + 1;

  const agingRateRank =
    city.agingRate == null
      ? 0
      : [...cities]
          .filter((c) => c.agingRate != null)
          .sort(
            (a, b) =>
              (b.agingRate ?? 0) -
              (a.agingRate ?? 0)
          )
          .findIndex((c) => c.code === code) + 1;

  const financeRank =
    city.financeIndex == null
      ? 0
      : [...cities]
          .filter((c) => c.financeIndex != null)
          .sort(
            (a, b) =>
              (b.financeIndex ?? 0) -
              (a.financeIndex ?? 0)
          )
          .findIndex((c) => c.code === code) + 1;

  // =========================
  // 都道府県順位
  // =========================

  const pref = city.name.split(" ")[0];

  const prefCities = cities.filter((c) =>
    c.name.startsWith(pref + " ")
  );

  const prefPopulationRank =
    [...prefCities]
      .sort((a, b) => b.population - a.population)
      .findIndex((c) => c.code === code) + 1;

  const prefAreaRank =
    [...prefCities]
      .sort((a, b) => (b.area ?? 0) - (a.area ?? 0))
      .findIndex((c) => c.code === code) + 1;

  const prefDensityRank =
    [...prefCities]
      .sort(
        (a, b) =>
          (b.populationDensity ?? 0) -
          (a.populationDensity ?? 0)
      )
      .findIndex((c) => c.code === code) + 1;

  const prefChildRank =
    [...prefCities]
      .sort(
        (a, b) =>
          (b.childPopulation ?? 0) -
          (a.childPopulation ?? 0)
      )
      .findIndex((c) => c.code === code) + 1;

  const prefBirthRateRank =
    city.birthRate == null
      ? 0
      : [...prefCities]
          .filter((c) => c.birthRate != null)
          .sort(
            (a, b) =>
              (b.birthRate ?? 0) -
              (a.birthRate ?? 0)
          )
          .findIndex((c) => c.code === code) + 1;

  const prefAgingRateRank =
    city.agingRate == null
      ? 0
      : [...prefCities]
          .filter((c) => c.agingRate != null)
          .sort(
            (a, b) =>
              (b.agingRate ?? 0) -
              (a.agingRate ?? 0)
          )
          .findIndex((c) => c.code === code) + 1;

  const prefFinanceRank =
    city.financeIndex == null
      ? 0
      : [...prefCities]
          .filter((c) => c.financeIndex != null)
          .sort(
            (a, b) =>
              (b.financeIndex ?? 0) -
              (a.financeIndex ?? 0)
          )
          .findIndex((c) => c.code === code) + 1;

  return {
    national: [
      { label: "人口", value: `${populationRank}位` },
      { label: "面積", value: `${areaRank}位` },
      { label: "人口密度", value: `${densityRank}位` },
      { label: "子ども人口", value: `${childRank}位` },
      {
        label: "出生率",
        value: birthRateRank > 0 ? `${birthRateRank}位` : "-",
      },
      {
        label: "高齢化率",
        value: agingRateRank > 0 ? `${agingRateRank}位` : "-",
      },
      {
        label: "財政力指数",
        value: financeRank > 0 ? `${financeRank}位` : "-",
      },
    ],

    prefecture: [
      { label: "人口", value: `${prefPopulationRank}位` },
      { label: "面積", value: `${prefAreaRank}位` },
      { label: "人口密度", value: `${prefDensityRank}位` },
      { label: "子ども人口", value: `${prefChildRank}位` },
      {
        label: "出生率",
        value: prefBirthRateRank > 0 ? `${prefBirthRateRank}位` : "-",
      },
      {
        label: "高齢化率",
        value: prefAgingRateRank > 0 ? `${prefAgingRateRank}位` : "-",
      },
      {
        label: "財政力指数",
        value: prefFinanceRank > 0 ? `${prefFinanceRank}位` : "-",
      },
    ],

    summary: {
      national: {
        population: populationRank,
        area: areaRank,
        density: densityRank,
        child: childRank,
        birthRate: birthRateRank,
        agingRate: agingRateRank,
        finance: financeRank,
      },

      prefecture: {
        population: prefPopulationRank,
        area: prefAreaRank,
        density: prefDensityRank,
        child: prefChildRank,
        birthRate: prefBirthRateRank,
        agingRate: prefAgingRateRank,
        finance: prefFinanceRank,
      },
    },
  };
}