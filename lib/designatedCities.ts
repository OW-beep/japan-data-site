/**
 * 政令指定都市20市(データ上の表記: 「都道府県 市名」)。
 * 新たに指定された市が出たらここに追加する。
 * /ranking/large-cities と /articles/designated-cities-comparison で共用。
 */
export const DESIGNATED_CITIES = [
  "北海道 札幌市",
  "宮城県 仙台市",
  "埼玉県 さいたま市",
  "千葉県 千葉市",
  "神奈川県 横浜市",
  "神奈川県 川崎市",
  "神奈川県 相模原市",
  "新潟県 新潟市",
  "静岡県 静岡市",
  "静岡県 浜松市",
  "愛知県 名古屋市",
  "京都府 京都市",
  "大阪府 大阪市",
  "大阪府 堺市",
  "兵庫県 神戸市",
  "岡山県 岡山市",
  "広島県 広島市",
  "福岡県 北九州市",
  "福岡県 福岡市",
  "熊本県 熊本市",
] as const;

export function normalizeCityName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function isDesignatedCity(name: string): boolean {
  return (DESIGNATED_CITIES as readonly string[]).includes(
    normalizeCityName(name)
  );
}
