/**
 * 自治体ページ(/city/[code])のindex方針。
 *
 * index するページ:
 *   ・人口 CITY_INDEX_MIN_POP(既定 10万人)以上の市・特別区
 * それ以外と、政令指定都市の区は noindex のまま(follow は維持)。
 *
 * 2026-11-16 変更: 以前は「アフィリエイト(楽天ブロック)が載る農業の
 * 強みのある自治体」も index していたが、index 対象の大半が
 * テンプレート型の自治体ページになる構成は、サイト全体の評価を
 * 下げる(AdSense「有用性の低いコンテンツ」の一因)と判断し、
 * 人口基準のみに一本化した。アフィリエイト表示自体は全ページで継続する。
 *
 * 人口 CITY_INDEX_MIN_POP は環境変数で変えられる(再デプロイだけ)。
 * 判定の人口は令和7年国勢調査(取れていなければ令和2年)。政令指定都市の区は対象外。
 */
import { getCityInsight } from "./cityInsight";
import { getAgriCity } from "./agriCity";

export const CITY_INDEX_MIN_POP = Number(process.env.CITY_INDEX_MIN_POP ?? 100_000);

/** そのページに、アフィリエイト(楽天の商品ブロック)が載るか */
export function cityHasAffiliate(code: string): boolean {
  if (!getCityInsight(code)) return false; // 政令指定都市の区など
  const a = getAgriCity(code);
  return !!a && a.strengths.length > 0;
}

export function isCityIndexable(code: string): boolean {
  const ins = getCityInsight(code);
  if (!ins) return false; // 政令指定都市の区・集計行など
  return ins.pop >= CITY_INDEX_MIN_POP;
}
