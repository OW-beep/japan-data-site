/**
 * 「独自の加工データ」: 警察庁の交通事故データ(令和7年)と、国勢調査の人口・年齢・昼間人口、
 * 人口密度を、自治体ごとに結びつけた表。事故×人口の記事(昼間人口あたり・致死率・自転車)が共用する。
 *
 * 元データ:
 *   - 事故: data/traffic-accident-municipal.json(警察庁。scripts/processTrafficAccident.ts で作成)
 *   - 人口・年齢: 令和7年国勢調査(data/population-2025.json)。なければ令和2年国勢調査
 *   - 昼間人口・夜間人口・人口密度: 令和2年国勢調査(サイトの自治体データ)
 * 事故のなかった自治体は 0 件として扱う。
 */
import { getMunicipalities } from "./municipalities";
import { getAccidentByCode } from "./trafficAccident";
import { getAgeGroups2025 } from "./population2025";

export type DerivedRow = {
  code: string;
  name: string;
  /** 人口(令和7年があればそれ、なければ令和2年) */
  population: number;
  /** 令和2年国勢調査の夜間人口(昼間人口と同じ年で比べるため) */
  nightPop2020: number;
  /** 令和2年国勢調査の昼間人口(取れない自治体は null) */
  daytimePop2020: number | null;
  /** 人口密度(人/km²、令和2年) */
  density: number | null;
  /** 高齢化率(%) */
  aging: number | null;
  accidents: number;
  fatalAccidents: number;
  bicycleAccidents: number;
  pedestrianAccidents: number;
};

export type DerivedData = {
  rows: DerivedRow[];
  /** 人口・高齢化率が令和7年国勢調査かどうか */
  use2025: boolean;
  popLabel: string;
};

export function getDerivedData(): DerivedData {
  const cities = getMunicipalities();
  const covered = cities.filter((c) => getAgeGroups2025(c.code) != null).length;
  const use2025 = cities.length > 0 && covered / cities.length >= 0.9;

  const rows: DerivedRow[] = cities.map((c) => {
    const a = getAccidentByCode(c.code);
    const g = use2025 ? getAgeGroups2025(c.code) : null;
    const population = g?.population ?? c.population;
    const aging =
      g && g.population > 0
        ? (g.elderly / g.population) * 100
        : c.population > 0 && c.elderlyPopulation != null
          ? (c.elderlyPopulation / c.population) * 100
          : null;
    return {
      code: c.code,
      name: c.name,
      population,
      nightPop2020: c.nighttimePopulation ?? c.population,
      daytimePop2020: c.daytimePopulation ?? null,
      density: c.populationDensity ?? null,
      aging,
      accidents: a.accidents,
      fatalAccidents: a.fatalAccidents,
      bicycleAccidents: a.bicycleAccidents,
      pedestrianAccidents: a.pedestrianAccidents,
    };
  });

  return {
    rows,
    use2025,
    popLabel: use2025 ? "令和7年国勢調査" : "令和2年国勢調査",
  };
}

/** 人口密度の区分(人/km²) */
export const DENSITY_EDGES = [0, 100, 500, 2000, 5000, Infinity];

export function densityLabel(lo: number, hi: number): string {
  if (lo === 0) return `${hi.toLocaleString()}人/km²未満`;
  if (hi === Infinity) return `${lo.toLocaleString()}人/km²以上`;
  return `${lo.toLocaleString()}〜${hi.toLocaleString()}人/km²未満`;
}
