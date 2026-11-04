/**
 * 市区町村別の課税状況(総務省『市町村税課税状況等の調』令和7年度)。
 *
 * data/taxable-income-r7.json は scripts/build_taxable_income.py で作る。
 * 令和7年度の課税は、令和6年中の所得にもとづく。住民税は1月1日の住所の市町村で課税されるので、
 * 勤務地ではなく、住んでいる場所の統計になる。政令指定都市は市全体で集計されていて、区ごとの値はない。
 */
import raw from "@/data/taxable-income-r7.json";

type Row = {
  n: string;
  /** 所得割の納税義務者数(人) */
  tp: number;
  /** 課税対象所得(千円) */
  ti: number;
  /** 株式等の所得(千円: 一般株式等譲渡+上場株式等譲渡+上場株式等配当) */
  st: number;
  sal: number;
  biz: number;
  farm: number;
  oth: number;
  hse: number;
  all: number;
  /** 軽自動車(四輪・乗用・自家用)の台数 */
  kei: number;
};
type Data = {
  meta: { source: string; url: string; fiscalYear: number; incomeYear: number; rows: number; note: string };
  values: Record<string, Row>;
};

const DATA = raw as unknown as Data;
export const TAX_META = DATA.meta;

export type TaxRow = Row & {
  code: string;
  /** 納税義務者1人あたりの課税対象所得(万円) */
  incomePerTaxpayer: number;
};

export function getTax(code: string): TaxRow | null {
  const r = DATA.values[code];
  if (!r || r.tp <= 0) return null;
  return { ...r, code, incomePerTaxpayer: r.ti / r.tp / 10 };
}

export function allTax(): TaxRow[] {
  return Object.keys(DATA.values)
    .map((c) => getTax(c))
    .filter((r): r is TaxRow => r != null);
}

/** 全体(全団体の合計)の、納税義務者1人あたりの課税対象所得(万円) */
export function nationalIncomePerTaxpayer(): number {
  let tp = 0;
  let ti = 0;
  for (const r of Object.values(DATA.values)) {
    tp += r.tp;
    ti += r.ti;
  }
  return ti / tp / 10;
}

let incomeRankCache: { sorted: { code: string; v: number }[]; median: number } | null = null;

/** 納税義務者1人あたりの課税対象所得の、全国の市区町村(データがあるもの)の中での順位(高い順)と中央値(万円) */
export function incomeRank(code: string): { rank: number; total: number; median: number } | null {
  if (!incomeRankCache) {
    const rows = allTax().map((r) => ({ code: r.code, v: r.incomePerTaxpayer }));
    rows.sort((a, b) => b.v - a.v);
    incomeRankCache = { sorted: rows, median: rows.length ? rows[Math.floor(rows.length / 2)].v : 0 };
  }
  const i = incomeRankCache.sorted.findIndex((r) => r.code === code);
  if (i < 0) return null;
  return { rank: i + 1, total: incomeRankCache.sorted.length, median: incomeRankCache.median };
}
