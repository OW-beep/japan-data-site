import { getCities } from "@/lib/getCities";
import type { City } from "@/lib/City";

/**
 * 政令指定都市の「区」(例: 神奈川県 横浜市 港北区)は、
 * 独立した地方公共団体ではなく市の内部組織なので、
 * 自治体同士を比較するランキングの対象には含めない。
 *
 * データ上は "県 市 区" のように名前が3つの単語に
 * 分かれているので、それで判定する。
 * (東京都の特別区は "東京都 千代田区" のように2語のみで、
 *  区自身が独立した地方公共団体のため対象外にはしない)
 */
export function isDesignatedCityWard(name: string): boolean {
  return name.trim().split(/\s+/).length === 3;
}

/**
 * 「東京都 特別区部」は23特別区の合計値を表す集計上の行で、
 * 実在する自治体ではない。これを含めたまま各特別区
 * (千代田区、中央区…)も同時にランキングに入れると、
 * 同じ人口が二重にカウントされてしまうため除外する。
 */
const AGGREGATE_ONLY_ENTRIES = ["東京都 特別区部"];

function isAggregateEntry(name: string): boolean {
  return AGGREGATE_ONLY_ENTRIES.includes(name.trim());
}

/**
 * ランキング表示用に、実在する自治体だけを返す。
 * (政令指定都市の区、および東京都の集計行を除いた一覧)
 */
export function getMunicipalities(): City[] {
  return getCities().filter(
    (c) => !isDesignatedCityWard(c.name) && !isAggregateEntry(c.name)
  );
}

/**
 * 指定した市(例: "神奈川県 横浜市")に属する区の一覧を返す。
 * 市の個別ページで「区ごとの内訳」として使う。
 */
export function getWardsOf(cityFullName: string): City[] {
  const prefix = `${cityFullName.trim()} `;
  return getCities().filter(
    (c) => isDesignatedCityWard(c.name) && c.name.startsWith(prefix)
  );
}
