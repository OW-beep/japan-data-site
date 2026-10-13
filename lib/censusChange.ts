/**
 * 「独自の加工データ」: 令和2年(2020年)と令和7年(2025年)の国勢調査を、自治体ごとに結びつけた表。
 * 人口・子ども(15歳未満)・高齢者(65歳以上)・その他(15〜64歳)の5年間の変化の記事が共用する。
 *
 * 元データ:
 *   - 2020年: サイトの自治体データ(令和2年国勢調査。SSDSE)
 *   - 2025年: 令和7年国勢調査(人口等基本集計・確定値。scripts/fetchCensus2025.ts → data/population-2025.json)
 * 令和7年の年齢(15歳未満・65歳以上)まで取れた自治体だけを対象にする。
 */
import { getMunicipalities } from "./municipalities";
import { getAgeGroups2025 } from "./population2025";
import { prefectureOf } from "./rankingAnalysis";

export type ChangeRow = {
  code: string;
  name: string;
  pref: string;
  pop20: number;
  pop25: number;
  child20: number;
  child25: number;
  eld20: number;
  eld25: number;
  /** 15〜64歳(総人口 − 15歳未満 − 65歳以上。年齢不詳を含む) */
  work20: number;
  work25: number;
};

export type CensusChange = {
  rows: ChangeRow[];
  /** 令和7年の年齢まで取れた自治体が、サイトの自治体の9割以上で、データが十分にあるか */
  ok: boolean;
};

export function getCensusChange(): CensusChange {
  const cities = getMunicipalities();
  const rows: ChangeRow[] = [];

  for (const c of cities) {
    const g = getAgeGroups2025(c.code);
    if (!g) continue;
    if (!(c.population > 0) || c.childPopulation == null || c.elderlyPopulation == null) continue;
    const work20 = c.population - c.childPopulation - c.elderlyPopulation;
    const work25 = g.population - g.child - g.elderly;
    if (work20 < 0 || work25 < 0) continue;
    rows.push({
      code: c.code,
      name: c.name,
      pref: prefectureOf(c.name),
      pop20: c.population,
      pop25: g.population,
      child20: c.childPopulation,
      child25: g.child,
      eld20: c.elderlyPopulation,
      eld25: g.elderly,
      work20,
      work25,
    });
  }

  const ok = cities.length > 0 && rows.length / cities.length >= 0.9 && rows.length >= 300;
  return { rows, ok };
}

/** 増減率(%)。基準が0のときは null */
export function pctChange(from: number, to: number): number | null {
  return from > 0 ? ((to - from) / from) * 100 : null;
}

/** 符号つきの数字(+1.2 / -3.4) */
export function signed(n: number, digits = 1): string {
  const s = n.toFixed(digits);
  return n > 0 ? `+${s}` : s;
}

export type PrefChange = {
  pref: string;
  count: number;
  pop20: number;
  pop25: number;
  child20: number;
  child25: number;
  eld20: number;
  eld25: number;
  /** 総人口が増えた自治体の数 */
  popIncreased: number;
};

/** 都道府県ごとの合計(サイトの自治体の合算) */
export function aggregatePrefs(rows: ChangeRow[]): PrefChange[] {
  const map = new Map<string, PrefChange>();
  for (const r of rows) {
    const cur =
      map.get(r.pref) ??
      ({ pref: r.pref, count: 0, pop20: 0, pop25: 0, child20: 0, child25: 0, eld20: 0, eld25: 0, popIncreased: 0 } as PrefChange);
    cur.count++;
    cur.pop20 += r.pop20;
    cur.pop25 += r.pop25;
    cur.child20 += r.child20;
    cur.child25 += r.child25;
    cur.eld20 += r.eld20;
    cur.eld25 += r.eld25;
    if (r.pop25 > r.pop20) cur.popIncreased++;
    map.set(r.pref, cur);
  }
  return [...map.values()];
}

export function sum(rows: ChangeRow[], pick: (r: ChangeRow) => number): number {
  return rows.reduce((s, r) => s + pick(r), 0);
}
