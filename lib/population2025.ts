/**
 * 令和7年国勢調査(確定値)の市区町村別人口。
 *
 * データの作り方: `npm run fetch:census2025`(scripts/fetchCensus2025.ts)
 *   → data/population-2025.json に [総人口, 15歳未満, 65歳以上] を保存する。
 *
 * ファイルが空(未取得)のときは、すべて「2020年の人口を使う」動きに戻るので、
 * 取得前でもサイトは壊れない。取得すると、使っているページが自動で切り替わる。
 */
import raw from "@/data/population-2025.json";

type Raw = {
  meta: { source: string; statsDataId: string; fetchedAt: string; coverage: number } | null;
  values: Record<string, [number, number | null, number | null]>;
};

const data = raw as unknown as Raw;

export const POP2025_LABEL = "令和7年国勢調査";
export const POP2020_LABEL = "令和2年国勢調査";

export function getPopulation2025(code: string): number | undefined {
  return data.values[code]?.[0];
}

/** 令和7年国勢調査の人口・15歳未満・65歳以上。年齢まで取れていない自治体は null */
export function getAgeGroups2025(
  code: string
): { population: number; child: number; elderly: number } | null {
  const v = data.values[code];
  if (!v || v[1] == null || v[2] == null) return null;
  return { population: v[0], child: v[1], elderly: v[2] };
}

export type PopulationBasis = {
  use2025: boolean;
  /** 2025年の人口があれば優先し、なければ fallback(2020年の人口)を返す */
  population: (code: string, fallback: number) => number;
  /** 「令和7年国勢調査」または「令和2年国勢調査」 */
  label: string;
  /** 年のずれの注記文(事故件数は令和7年) */
  yearNote: string;
};

/**
 * サイト側の自治体コードのうち9割以上に2025年の人口があるときだけ2025年を使う。
 * (一部しか入っていない状態で、2020年と2025年が混ざるのを防ぐ)
 */
export function getPopulationBasis(siteCodes: Iterable<string>): PopulationBasis {
  const codes = [...siteCodes];
  const have = codes.filter((c) => data.values[c] != null).length;
  const use2025 = codes.length > 0 && have / codes.length >= 0.9;
  return {
    use2025,
    population: (code, fallback) =>
      use2025 ? (data.values[code]?.[0] ?? fallback) : fallback,
    label: use2025 ? POP2025_LABEL : POP2020_LABEL,
    yearNote: use2025
      ? "人口は令和7年国勢調査(確定値)、事故件数は令和7年です。調査時点(2025年10月1日)がそろっているため、年のずれはほとんどありません。"
      : "人口は令和2年国勢調査、事故件数は令和7年です。年がずれているため、人口が大きく変わった自治体では、実際の値と差が出ることがあります。",
  };
}
