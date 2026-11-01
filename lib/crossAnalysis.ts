/**
 * 2つの指標の「掛け合わせ」分析。
 *
 * 全自治体について、指標Xと指標Yの値を取り出し、直線回帰(対数目盛の指標は対数に変換して回帰)で
 * 「Xから予想されるY」を求める。実際のYが予想から大きく外れた自治体を、「意外な自治体」として返す。
 *
 * 注意: 「予想から外れている」ことと、「その理由」は別。理由はこのデータからは分からない。
 * 表示側(components/CrossInsight.tsx)は、理由を断定しない書き方にする。
 */
import { getMunicipalities } from "./municipalities";
import { METRICS, type MetricKey } from "./metrics";
import { pearson } from "./rankingAnalysis";

export type CrossPoint = {
  code: string;
  name: string;
  population: number;
  x: number;
  y: number;
};

export type Surprise = CrossPoint & { expectedY: number; z: number };

export type CrossResult = {
  xKey: MetricKey;
  yKey: MetricKey;
  logX: boolean;
  logY: boolean;
  points: CrossPoint[];
  n: number;
  /** 相関係数(対数目盛の指標は、対数に変換した値での相関) */
  r: number;
  slope: number;
  intercept: number;
  /** Yが予想を大きく上回る自治体 */
  above: Surprise[];
  /** Yが予想を大きく下回る自治体 */
  below: Surprise[];
  /** 回帰直線の値を、元の目盛のYで返す */
  predict: (x: number) => number;
};

const cache = new Map<string, CrossResult | null>();

/** 人口がこの値に満たない自治体は、値が不安定なので、掛け合わせの対象から外す */
export const CROSS_MIN_POPULATION = 3000;

export function analyzeCross(
  xKey: MetricKey,
  yKey: MetricKey,
  minPopulation = CROSS_MIN_POPULATION
): CrossResult | null {
  const ck = `${xKey}|${yKey}|${minPopulation}`;
  if (cache.has(ck)) return cache.get(ck) ?? null;

  const xm = METRICS[xKey] as (typeof METRICS)[MetricKey] & { log?: boolean };
  const ym = METRICS[yKey] as (typeof METRICS)[MetricKey] & { log?: boolean };
  const logX = !!xm.log;
  const logY = !!ym.log;
  const tx = (v: number) => (logX ? Math.log10(v) : v);
  const ty = (v: number) => (logY ? Math.log10(v) : v);

  const points: CrossPoint[] = [];
  for (const c of getMunicipalities()) {
    if (c.population < minPopulation) continue;
    const x = xm.get(c);
    const y = ym.get(c);
    if (x == null || y == null || !Number.isFinite(x) || !Number.isFinite(y)) continue;
    if ((logX && x <= 0) || (logY && y <= 0)) continue;
    points.push({ code: c.code, name: c.name, population: c.population, x, y });
  }
  if (points.length < 100) {
    cache.set(ck, null);
    return null;
  }

  const xs = points.map((p) => tx(p.x));
  const ys = points.map((p) => ty(p.y));
  const r = pearson(xs, ys);
  if (r == null) {
    cache.set(ck, null);
    return null;
  }

  const n = points.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  if (sxx === 0) {
    cache.set(ck, null);
    return null;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;

  const resid = ys.map((y, i) => y - (intercept + slope * xs[i]));
  const sd = Math.sqrt(resid.reduce((s, v) => s + v * v, 0) / Math.max(1, n - 2));
  const expected = (i: number) => {
    const e = intercept + slope * xs[i];
    return logY ? 10 ** e : e;
  };

  const scored: Surprise[] = points.map((p, i) => ({
    ...p,
    expectedY: expected(i),
    z: sd > 0 ? resid[i] / sd : 0,
  }));
  const THRESH = 2;
  const above = scored.filter((s) => s.z >= THRESH).sort((a, b) => b.z - a.z).slice(0, 3);
  const below = scored.filter((s) => s.z <= -THRESH).sort((a, b) => a.z - b.z).slice(0, 3);

  const result: CrossResult = {
    xKey,
    yKey,
    logX,
    logY,
    points,
    n,
    r,
    slope,
    intercept,
    above,
    below,
    predict: (x) => {
      const e = intercept + slope * tx(x);
      return logY ? 10 ** e : e;
    },
  };
  cache.set(ck, result);
  return result;
}

/** 都道府県名を除いた、市区町村の表示名(「東京都 千代田区」→「千代田区」) */
export function shortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1];
}

/** 都道府県名つきの表示名(同名の自治体を区別するため) */
export function fullName(name: string): string {
  return name.trim().replace(/\s+/g, "");
}
