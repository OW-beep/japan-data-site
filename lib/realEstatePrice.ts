import { getMunicipalities } from "@/lib/municipalities";
import raw from "@/data/real-estate-price.json";

type RawRow = {
  code: string;
  name: string;
  landPricePerSqm: number | null;
  landSampleSize: number;
  condoPricePerSqm: number | null;
  condoSampleSize: number;
};

const RAW = raw as RawRow[];

export type RealEstatePriceCity = {
  code: string;
  name: string;
  landPricePerSqm: number | null;
  landSampleSize: number;
  condoPricePerSqm: number | null;
  condoSampleSize: number;
};

/**
 * 不動産情報ライブラリ(国土交通省)の取引価格情報API(XIT001)から
 * 集計した、市区町村別の実勢価格(直近1年分の取引平均)。
 *
 * 出典: 国土交通省「不動産情報ライブラリ」
 *       https://www.reinfolib.mlit.go.jp/
 *
 * 注: 令和6年の浜松市行政区再編(7区→3区)など、ごく一部の
 * 自治体コードは本サイトの市区町村マスタと一致しないため
 * 除外している(全体の0.2%未満)。
 */
export function getRealEstatePriceRanking(): RealEstatePriceCity[] {
  const byCode = new Map(getMunicipalities().map((c) => [c.code, c.name]));

  return RAW.filter((r) => {
    const code5 = r.code.padStart(5, "0");
    return byCode.has(code5);
  }).map((r) => {
    const code5 = r.code.padStart(5, "0");
    return {
      code: code5,
      name: byCode.get(code5) as string,
      landPricePerSqm: r.landPricePerSqm,
      landSampleSize: r.landSampleSize,
      condoPricePerSqm: r.condoPricePerSqm,
      condoSampleSize: r.condoSampleSize,
    };
  });
}
