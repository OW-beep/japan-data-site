import { getMunicipalities } from "@/lib/municipalities";
import raw from "@/data/furusato-nozei-r7.json";

type FurusatoRow = {
  name: string;
  amountYen: number;
  count: number;
};

const RAW = raw as FurusatoRow[];

export type FurusatoNozeiCity = {
  name: string;
  amountYen: number;
  count: number;
  population: number | null;
  amountPerCapita: number | null;
};

/**
 * 総務省「ふるさと納税に関する現況調査結果」(令和8年度実施)の
 * 別紙データ(市区町村別受入額の推移)から、令和7年度(令和7年4月
 * 〜令和8年3月)の受入額・受入件数を取得し、人口データと結合する。
 *
 * 出典: 総務省 自治税務局市町村税課
 *       「ふるさと納税に関する現況調査結果(令和8年度実施)」
 */
export function getFurusatoNozeiRanking(): FurusatoNozeiCity[] {
  const populationByName = new Map(
    getMunicipalities().map((c) => [c.name, c.population])
  );

  return RAW.map((r) => {
    const population = populationByName.get(r.name) ?? null;
    return {
      name: r.name,
      amountYen: r.amountYen,
      count: r.count,
      population,
      amountPerCapita:
        population && population > 0 ? r.amountYen / population : null,
    };
  });
}

/** 全国計(令和7年度)。総務省公表値と一致することを確認済み。 */
export function getFurusatoNozeiNationalTotal() {
  const rows = RAW;
  return {
    amountYen: rows.reduce((s, r) => s + r.amountYen, 0),
    count: rows.reduce((s, r) => s + r.count, 0),
  };
}
