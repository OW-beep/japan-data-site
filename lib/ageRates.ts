/**
 * 高齢化率・子ども人口割合を、令和7年国勢調査(確定値)で計算した一覧。
 * 2025年の年齢別人口が9割以上の自治体でそろっていないときは、令和2年に自動で戻る。
 * (個別の自治体だけ2025年で、他が2020年、という混在は作らない)
 */
import { getMunicipalities } from "./municipalities";
import { getAgeGroups2025, getPopulationBasis } from "./population2025";
import type { City } from "./City";

export type AgeRow = City & {
  /** この基準年の人口・65歳以上・15歳未満 */
  pop: number;
  elderly: number;
  child: number;
  elderlyRate: number;
  childRate: number;
  /** 令和2年国勢調査の値(比較用) */
  elderlyRate2020: number;
  childRate2020: number;
};

export function getAgeRows(): { rows: AgeRow[]; label: string; use2025: boolean } {
  const cities = getMunicipalities();
  const basis = getPopulationBasis(cities.map((c) => c.code));
  const have = cities.filter((c) => getAgeGroups2025(c.code)).length;
  const use2025 = basis.use2025 && have / cities.length >= 0.9;

  const rows: AgeRow[] = [];
  for (const c of cities) {
    if (!(c.population > 0) || c.elderlyPopulation == null || c.childPopulation == null) continue;
    const g = use2025 ? getAgeGroups2025(c.code) : null;
    if (use2025 && !g) continue;
    const pop = g ? g.population : c.population;
    const elderly = g ? g.elderly : c.elderlyPopulation;
    const child = g ? g.child : c.childPopulation;
    if (!(pop > 0)) continue;
    rows.push({
      ...c,
      pop,
      elderly,
      child,
      elderlyRate: (elderly / pop) * 100,
      childRate: (child / pop) * 100,
      elderlyRate2020: (c.elderlyPopulation / c.population) * 100,
      childRate2020: (c.childPopulation / c.population) * 100,
    });
  }
  return { rows, label: use2025 ? "令和7年国勢調査" : "令和2年国勢調査", use2025 };
}

/** 全自治体を合算した全国の割合(%)。2025と2020 */
export function nationalRates(rows: AgeRow[]) {
  const sum = (f: (r: AgeRow) => number) => rows.reduce((s, r) => s + f(r), 0);
  const pop = sum((r) => r.pop);
  const pop20 = sum((r) => r.population);
  return {
    elderly: (sum((r) => r.elderly) / pop) * 100,
    child: (sum((r) => r.child) / pop) * 100,
    elderly2020: (sum((r) => r.elderlyPopulation ?? 0) / pop20) * 100,
    child2020: (sum((r) => r.childPopulation ?? 0) / pop20) * 100,
  };
}
