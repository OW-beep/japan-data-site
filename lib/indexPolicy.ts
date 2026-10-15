/**
 * 自治体ページ(/city/[code])のindex方針。段階的に広げる。
 *
 *  第1段階(現在): 人口10万人以上の市・特別区(約270ページ)だけ index。
 *                  それ以外と、政令指定都市の区は noindex のまま(follow は維持)。
 *  第2段階: 第1段階の「登録済み・表示回数」を2〜4週間見て、問題なければ
 *           CITY_INDEX_MIN_POP を 50000 に下げる(環境変数、再デプロイだけで変更可)。
 *
 * 判定の人口は令和7年国勢調査(取れていなければ令和2年)。
 * 政令指定都市の区は独立した自治体ではなく中身が薄くなるため、人口にかかわらず対象外。
 */
import { getCityInsight } from "./cityInsight";

export const CITY_INDEX_MIN_POP = Number(process.env.CITY_INDEX_MIN_POP ?? 100_000);

export function isCityIndexable(code: string): boolean {
  const ins = getCityInsight(code);
  if (!ins) return false; // 政令指定都市の区・集計行など
  return ins.pop >= CITY_INDEX_MIN_POP;
}
