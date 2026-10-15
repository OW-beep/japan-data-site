/**
 * 令和7年国勢調査(確定値)の人口を、サイトの City 型に差し込んだ一覧を返す。
 *
 * 目的: 「100万人都市」「人口○万人以上の都市」のような、人口だけで並べるページを
 * 令和2年(2020年)のまま放置しないための共通部品。
 * (面積・高齢化率など他の項目は2020年のままなので、人口以外の指標と混ぜる
 *  ページでは使わないこと。人口だけを使うページ専用。)
 *
 * 2025年の値が9割以上の自治体で取れていないときは、自動的に2020年の人口に戻る。
 */
import { getCities } from "./getCities";
import { getMunicipalities, isDesignatedCityWard } from "./municipalities";
import { getPopulationBasis } from "./population2025";
import type { City } from "./City";

export type CityWithPop = City & {
  /** 令和2年国勢調査の人口(比較用) */
  pop2020: number;
};

function apply(list: City[]): { rows: CityWithPop[]; label: string; use2025: boolean; year: string } {
  const basis = getPopulationBasis(getCities().map((c) => c.code));
  const rows = list.map((c) => ({
    ...c,
    pop2020: c.population,
    population: basis.population(c.code, c.population),
  }));
  return { rows, label: basis.label, use2025: basis.use2025, year: basis.use2025 ? "2025" : "2020" };
}

/** 実在する自治体(政令市の区・特別区部の集計行を除く)。人口ランキング用 */
export function getMunicipalitiesPop() {
  return apply(getMunicipalities());
}

/**
 * 「100万人都市」用。東京都特別区部を1つの都市として数え、政令市の区は除く。
 * (individual の特別区も含むが、100万人を超える区は存在しない)
 */
export function getCitiesPopWithTokyo23() {
  return apply(getCities().filter((c) => !isDesignatedCityWard(c.name)));
}

/** 「県 市」→「市」 */
export function shortName(name: string): string {
  return name.trim().split(/\s+/).pop() ?? name;
}

/** 「市」(町村・特別区ではない)か。政令市は「〜市」で終わる */
export function isShi(name: string): boolean {
  return shortName(name).endsWith("市");
}

/** 2020→2025 の増減率(%) */
export function changePct(c: CityWithPop): number {
  return c.pop2020 > 0 ? ((c.population - c.pop2020) / c.pop2020) * 100 : 0;
}
