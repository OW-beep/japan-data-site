/**
 * ランキングの解説で使う「他の指標との関係」の設定。
 *
 * ページごとに、意味のある比較対象を1〜2個選び、全自治体の値から相関係数を計算する。
 * どの組み合わせでも、結果(強い・弱い)はデータが決める。弱ければ「ほとんど関係がない」と書く。
 * 相関は因果関係ではないので、文章は「傾向」と表現する(components/ranking/RankingCommentary.tsx)。
 */
import { getMunicipalities } from "./municipalities";
import { pearson, type AnalysisRow } from "./rankingAnalysis";

type C = ReturnType<typeof getMunicipalities>[number];
export type CompareVar = { label: string; get: (c: C) => number | null };

const ratio = (a: number | null | undefined, b: number | null | undefined, k = 1): number | null =>
  a != null && b != null && b > 0 ? (a / b) * k : null;

const V = {
  aging: { label: "高齢化率", get: (c) => ratio(c.elderlyPopulation, c.population, 100) },
  finance: { label: "財政力指数", get: (c) => c.financeIndex ?? null },
  balance: { label: "経常収支比率", get: (c) => c.ordinaryBalanceRatio ?? null },
  density: { label: "人口密度", get: (c) => ratio(c.population, c.area) },
  secondary: {
    label: "第2次産業就業者の割合",
    get: (c) =>
      ratio(
        c.secondaryIndustryWorkers,
        (c.primaryIndustryWorkers ?? 0) + (c.secondaryIndustryWorkers ?? 0) + (c.tertiaryIndustryWorkers ?? 0),
        100
      ),
  },
  daytime: { label: "昼夜間人口比率", get: (c) => ratio(c.daytimePopulation, c.nighttimePopulation, 100) },
  restaurant: { label: "人口あたり飲食店数", get: (c) => ratio(c.restaurantCount, c.population, 1000) },
  doctors: { label: "人口あたり医師数", get: (c) => ratio(c.doctorsCount, c.population, 100_000) },
} satisfies Record<string, CompareVar>;

export const COMPARE: Record<string, CompareVar[]> = {
  finance: [V.aging, V.density],
  "balance-ratio": [V.finance, V.aging],
  "debt-service-ratio": [V.finance, V.density],
  "tax-ratio": [V.finance, V.aging],
  "welfare-ratio": [V.aging, V.finance],
  "education-expense": [V.aging, V.finance],
  unemployment: [V.secondary, V.aging],
  manufacturing: [V.finance, V.aging],
  "daytime-ratio": [V.finance, V.restaurant],
  restaurant: [V.daytime, V.aging],
  "retail-store": [V.density, V.aging],
  "retail-access": [V.aging, V.density],
  doctors: [V.aging, V.density],
  dentist: [V.density, V.aging],
  pharmacist: [V.density, V.aging],
  hospital: [V.aging, V.density],
  "elderly-home": [V.aging, V.density],
  household: [V.aging, V.density],
  "household-size": [V.aging, V.density],
  "community-center": [V.aging, V.density],
  decrease: [V.aging, V.finance],
  area: [V.density, V.finance],
  "foreign-population": [V.secondary, V.density],
  "divorce-rate": [V.aging, V.density],
  "natural-change": [V.aging, V.finance],
  decline: [V.density, V.aging],
  "young-adult-migration": [V.density, V.aging],
  "recycling-rate": [V.density, V.aging],
  "fiscal-health-composite": [V.aging, V.density],
  "elderly-support-composite": [V.doctors, V.density],
  "industry-diversity-index": [V.secondary, V.density],
  "young-family-attractiveness-index": [V.aging, V.density],
  "living-infrastructure-index": [V.density, V.aging],
  "bedroom-town-finance": [V.finance, V.density],
};

let byName: Map<string, C> | null = null;
function cityMap(): Map<string, C> {
  if (!byName) byName = new Map(getMunicipalities().map((c) => [c.name, c]));
  return byName;
}

/** ランキングの値と、比較対象の指標の相関係数(名前で突き合わせ。50自治体未満なら null) */
export function compareWith(rows: AnalysisRow[], v: CompareVar): { r: number; n: number } | null {
  const m = cityMap();
  const xs: number[] = [];
  const ys: number[] = [];
  for (const row of rows) {
    const c = m.get(row.name);
    if (!c) continue;
    const x = v.get(c);
    if (x == null || !Number.isFinite(x)) continue;
    xs.push(x);
    ys.push(row.value);
  }
  if (xs.length < 50) return null;
  const r = pearson(xs, ys);
  return r == null ? null : { r, n: xs.length };
}
