/**
 * 自治体ページ(/city/[code])のindex方針。
 *
 * index するページ:
 *   ・人口 CITY_INDEX_MIN_POP(既定 10万人)以上の市・特別区
 *   ・アフィリエイトを載せているページ(農業産出額の「強み」がある自治体。components/city/CityStrengths.tsx)
 * それ以外と、政令指定都市の区は noindex のまま(follow は維持)。
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
  return ins.pop >= CITY_INDEX_MIN_POP || cityHasAffiliate(code);
}
