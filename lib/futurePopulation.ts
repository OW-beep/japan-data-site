/**
 * 将来推計人口(国立社会保障・人口問題研究所『日本の地域別将来推計人口(令和5(2023)年推計)』)。
 *
 * data/future-population.json は scripts/build_future_population.py で作る。
 * 推計の基準は令和2(2020)年の国勢調査で、2050年まで5年ごと。出生中位・死亡中位の仮定。
 * 「将来の見通し」であり、確定した未来ではない。2025年の推計値と、令和7年国勢調査の実績は、比べられる。
 *
 * 福島県「浜通り地域」の13市町村には、個別の推計がない(いわき市・南相馬市・大熊町など)。
 */
import raw from "@/data/future-population.json";
import { getPopulation2025 } from "@/lib/population2025";

export const FUTURE_YEARS = [2020, 2025, 2030, 2035, 2040, 2045, 2050] as const;

type Row = { n: string; k: string; p: number[]; c: number[]; w: number[]; e: number[]; o: number[] };
type Data = { meta: { source: string; url: string; assumption: string; baseYear: number }; values: Record<string, Row> };

const DATA = raw as unknown as Data;

export const FUTURE_META = DATA.meta;

/** 個別の推計がない、福島県浜通り地域の13市町村 */
export const HAMADORI_NAMES = [
  "いわき市",
  "相馬市",
  "南相馬市",
  "広野町",
  "楢葉町",
  "富岡町",
  "川内村",
  "大熊町",
  "双葉町",
  "浪江町",
  "葛尾村",
  "新地町",
  "飯舘村",
];

export type FutureSeries = {
  code: string;
  /** 2020, 2025, ..., 2050 の順 */
  pop: number[];
  /** 0〜14歳の割合(%) */
  child: number[];
  /** 15〜64歳の割合(%) */
  working: number[];
  /** 65歳以上の割合(%) */
  elderly: number[];
  /** 75歳以上の割合(%) */
  old75: number[];
};

export function getFuture(code: string): FutureSeries | null {
  const r = DATA.values[code];
  if (!r) return null;
  return { code, pop: r.p, child: r.c, working: r.w, elderly: r.e, old75: r.o };
}

/** 2050年の人口(2020年=100) */
export function popIndex2050(f: FutureSeries): number {
  return (f.pop[6] / f.pop[0]) * 100;
}

/**
 * 令和7年国勢調査の実績が、2025年の推計より何%多いか(マイナスは少ない)。
 * 推計は2020年の国勢調査を基準にしているので、5年間の動きが、推計とどれだけ違ったかを表す。
 */
export function estimateGap2025(code: string): number | null {
  const f = getFuture(code);
  const actual = getPopulation2025(code);
  if (!f || actual == null || f.pop[1] <= 0) return null;
  return ((actual - f.pop[1]) / f.pop[1]) * 100;
}

let rankCache: { sorted: { code: string; v: number }[]; median: number } | null = null;

/**
 * 2050年の推計人口(2020年=100)の、全国の市区町村の中での順位(高い順)と中央値。
 * 対象は、推計がある市町村と特別区(政令市の区は除く)。
 */
export function futureRank(code: string): { rank: number; total: number; median: number } | null {
  if (!rankCache) {
    const rows: { code: string; v: number }[] = [];
    for (const [c, r] of Object.entries(DATA.values)) {
      if (r.k === "a" || c === "13100") continue;
      if (r.k === "0" && !(c >= "13101" && c <= "13123")) continue;
      rows.push({ code: c, v: (r.p[6] / r.p[0]) * 100 });
    }
    rows.sort((a, b) => b.v - a.v);
    const mid = Math.floor(rows.length / 2);
    rankCache = { sorted: rows, median: rows.length ? rows[mid].v : 0 };
  }
  const i = rankCache.sorted.findIndex((r) => r.code === code);
  if (i < 0) return null;
  return { rank: i + 1, total: rankCache.sorted.length, median: rankCache.median };
}

export type FutureRow = FutureSeries & {
  name: string;
  /** a=都道府県, 0=政令市の区(東京23区を含む), 1=政令市, 2=その他の市, 3=町村, 9=浜通り地域 */
  kind: string;
};

/** 推計がある全団体(都道府県を除く)。市の数のしきい値の集計などに使う */
export function futureRows(): FutureRow[] {
  return Object.entries(DATA.values)
    .filter(([, r]) => r.k !== "a")
    .map(([code, r]) => ({ code, name: r.n, kind: r.k, pop: r.p, child: r.c, working: r.w, elderly: r.e, old75: r.o }));
}

/** 5年ごとの推計値のあいだを直線でつなぎ、人口が threshold を下回る年を返す(下回らなければ null) */
export function crossingYear(pop: number[], threshold: number): number | null {
  for (let i = 0; i < pop.length - 1; i++) {
    if (pop[i] >= threshold && pop[i + 1] < threshold) {
      const f = (pop[i] - threshold) / (pop[i] - pop[i + 1]);
      return FUTURE_YEARS[i] + 5 * f;
    }
  }
  return null;
}
