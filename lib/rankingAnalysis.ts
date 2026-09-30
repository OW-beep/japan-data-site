/**
 * ランキングの「固有の解説」を作るための集計ロジック(純粋関数)。
 * 全自治体の値(rows)から、分布・人口規模別・都道府県別・大都市の位置づけ・
 * 人口との相関を計算する。文章はコンポーネント側で組み立てる。
 */
import { isDesignatedCity } from "./designatedCities";

export type AnalysisRow = {
  name: string; // 「都道府県 市名」
  population: number;
  value: number;
};

export type Direction = "high" | "low"; // 1位がどちら側か(high=数値が大きい順)

export function median(values: number[]): number {
  if (values.length === 0) return NaN;
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function quantile(values: number[], q: number): number {
  if (values.length === 0) return NaN;
  const s = [...values].sort((a, b) => a - b);
  const pos = (s.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return s[lo] + (s[hi] - s[lo]) * (pos - lo);
}

export function pearson(xs: number[], ys: number[]): number | null {
  const n = xs.length;
  if (n < 10 || ys.length !== n) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0,
    sxx = 0,
    syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    sxy += dx * dy;
    sxx += dx * dx;
    syy += dy * dy;
  }
  if (sxx === 0 || syy === 0) return null;
  return sxy / Math.sqrt(sxx * syy);
}

export const POPULATION_BANDS = [
  { label: "人口5,000人未満", min: 0, max: 5_000 },
  { label: "5,000人〜2万人未満", min: 5_000, max: 20_000 },
  { label: "2万人〜10万人未満", min: 20_000, max: 100_000 },
  { label: "10万人以上", min: 100_000, max: Infinity },
] as const;

export type BandStat = { label: string; count: number; median: number };

export function bandStats(rows: AnalysisRow[]): BandStat[] {
  return POPULATION_BANDS.map((b) => {
    const vals = rows
      .filter((r) => r.population >= b.min && r.population < b.max)
      .map((r) => r.value);
    return { label: b.label, count: vals.length, median: median(vals) };
  }).filter((b) => b.count > 0);
}

export function prefectureOf(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export type PrefStat = { pref: string; count: number; median: number };

/** 自治体数が minCount 以上の都道府県について、値の中央値を計算する */
export function prefectureStats(rows: AnalysisRow[], minCount = 5): PrefStat[] {
  const map = new Map<string, number[]>();
  for (const r of rows) {
    const p = prefectureOf(r.name);
    if (!map.has(p)) map.set(p, []);
    map.get(p)!.push(r.value);
  }
  return [...map.entries()]
    .filter(([, v]) => v.length >= minCount)
    .map(([pref, v]) => ({ pref, count: v.length, median: median(v) }));
}

/** ランキング上位 topN に占める都道府県の内訳(多い順) */
export function topConcentration(
  rows: AnalysisRow[],
  direction: Direction,
  topN: number
): { pref: string; count: number }[] {
  const sorted = [...rows].sort((a, b) =>
    direction === "high" ? b.value - a.value : a.value - b.value
  );
  const map = new Map<string, number>();
  for (const r of sorted.slice(0, topN)) {
    const p = prefectureOf(r.name);
    map.set(p, (map.get(p) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([pref, count]) => ({ pref, count }))
    .sort((a, b) => b.count - a.count || a.pref.localeCompare(b.pref));
}

export type BigCityStats = {
  designated: { count: number; median: number } | null;
  wards: { count: number; median: number } | null;
  overallMedian: number;
};

export function bigCityStats(rows: AnalysisRow[]): BigCityStats {
  const dv = rows.filter((r) => isDesignatedCity(r.name)).map((r) => r.value);
  const wv = rows
    .filter((r) => {
      const n = r.name.trim();
      return n.startsWith("東京都 ") && n.endsWith("区");
    })
    .map((r) => r.value);
  return {
    designated: dv.length >= 3 ? { count: dv.length, median: median(dv) } : null,
    wards: wv.length >= 5 ? { count: wv.length, median: median(wv) } : null,
    overallMedian: median(rows.map((r) => r.value)),
  };
}

/** 人口(対数)との相関係数 */
export function populationCorrelation(rows: AnalysisRow[]): number | null {
  const pts = rows.filter((r) => r.population > 0);
  return pearson(
    pts.map((r) => Math.log10(r.population)),
    pts.map((r) => r.value)
  );
}

export function describeCorrelation(r: number): string {
  const a = Math.abs(r);
  if (a < 0.2) return "ほとんど関係が見られません";
  const dir = r > 0 ? "人口が多い自治体ほど値が大きい" : "人口が多い自治体ほど値が小さい";
  if (a < 0.4) return `${dir}傾向がわずかにあります`;
  if (a < 0.6) return `${dir}傾向がはっきり見られます`;
  return `${dir}傾向が強く表れています`;
}
