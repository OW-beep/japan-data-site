import { getMunicipalities } from "./municipalities";

export type PrefectureStats = {
  name: string;
  population: number;
  area: number;
  density: number;
  agingRate: number;
  childRatio: number;
  financeIndex: number | null;
  populationRank: number;
  densityRank: number;
  agingRank: number;
  childRank: number;
  cityCount: number;
};

let cache: PrefectureStats[] | null = null;

export function getAllPrefectureStats(): PrefectureStats[] {
  if (cache) return cache;

  const cities = getMunicipalities();

  const byPref = new Map<string, typeof cities>();

  for (const c of cities) {
    const pref = c.name.split(" ")[0];
    if (!byPref.has(pref)) byPref.set(pref, []);
    byPref.get(pref)!.push(c);
  }

  const stats: PrefectureStats[] = [];

  for (const [pref, list] of byPref) {
    const population = list.reduce((s, c) => s + c.population, 0);
    const area = list.reduce((s, c) => s + (c.area ?? 0), 0);
    const elderly = list.reduce(
      (s, c) => s + (c.elderlyPopulation ?? 0),
      0
    );
    const child = list.reduce(
      (s, c) => s + (c.childPopulation ?? 0),
      0
    );

    const financeList = list.filter((c) => c.financeIndex != null);
    const financeIndex =
      financeList.length > 0
        ? financeList.reduce((s, c) => s + (c.financeIndex ?? 0), 0) /
          financeList.length
        : null;

    stats.push({
      name: pref,
      population,
      area,
      density: area > 0 ? population / area : 0,
      agingRate: population > 0 ? (elderly / population) * 100 : 0,
      childRatio: population > 0 ? (child / population) * 100 : 0,
      financeIndex,
      populationRank: 0,
      densityRank: 0,
      agingRank: 0,
      childRank: 0,
      cityCount: list.length,
    });
  }

  const rank = (
    key: "population" | "density" | "agingRate" | "childRatio",
    field: "populationRank" | "densityRank" | "agingRank" | "childRank"
  ) => {
    const sorted = [...stats].sort((a, b) => b[key] - a[key]);
    sorted.forEach((s, i) => {
      const target = stats.find((x) => x.name === s.name)!;
      target[field] = i + 1;
    });
  };

  rank("population", "populationRank");
  rank("density", "densityRank");
  rank("agingRate", "agingRank");
  rank("childRatio", "childRank");

  cache = stats;
  return stats;
}

export function getPrefectureStats(
  prefName: string
): PrefectureStats | undefined {
  return getAllPrefectureStats().find((s) => s.name === prefName);
}
