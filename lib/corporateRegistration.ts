import { getCities } from "@/lib/getCities";
import raw from "@/data/corporate-registration.json";

type RawRow = {
  code: string;
  newCount: number;
  closeCount: number;
  netGrowth: number;
};

const RAW = raw as RawRow[];

export type CorporateGrowthCity = {
  code: string;
  name: string;
  newCount: number;
  closeCount: number;
  netGrowth: number;
  population: number | null;
  netGrowthPer1000: number | null;
};

/**
 * 国税庁「法人番号公表サイト」の全件データをもとに集計した、
 * 市区町村別の新設法人数・閉鎖法人数・純増数(直近12か月)。
 *
 * 出典: 国税庁 法人番号公表サイト
 *       https://www.houjin-bangou.nta.go.jp/
 *
 * 注: ごく一部の自治体コードは本サイトの市区町村マスタと
 * 一致しないため除外している(全体の0.5%程度)。
 */
export function getCorporateGrowthRanking(): CorporateGrowthCity[] {
  const byCode = new Map(getCities().map((c) => [c.code, c]));

  return RAW.filter((r) => byCode.has(r.code)).map((r) => {
    const city = byCode.get(r.code)!;
    return {
      code: r.code,
      name: city.name,
      newCount: r.newCount,
      closeCount: r.closeCount,
      netGrowth: r.netGrowth,
      population: city.population,
      netGrowthPer1000:
        city.population && city.population > 0
          ? (r.netGrowth / city.population) * 1000
          : null,
    };
  });
}
