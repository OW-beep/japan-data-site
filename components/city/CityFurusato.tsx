import LazyGifts from "@/components/city/LazyGifts";
import { getAgriCity } from "@/lib/agriCity";
import { getCity } from "@/lib/getCity";
import { getCityInsight } from "@/lib/cityInsight";

/**
 * 自治体ごとの「ふるさと納税 返礼品」楽天ブロック(その自治体自身の返礼品)。
 *
 * ・検索語は /api/city-gifts/[code] 側で「ふるさと納税 {市町村名}」に決め、
 *   その自治体の返礼品だけに絞って返す。0件なら何も表示しない。
 * ・農業の強みがある自治体では出さない。そちらは CityStrengths のブロックが
 *   「品目×市町村名」で出し、見つからなければ同じAPIが「ふるさと納税 {市町村名}」に
 *   広げて返すため、楽天ブロックが2つ並ぶことはない。
 * ・政令指定都市の区・集計行など、自治体そのものではないページでは出さない
 *   (ふるさと納税の寄付先は市町村単位のため)。
 * ・CityStrengths と同じく全自治体ページで表示する(index 対象かどうかは
 *   lib/indexPolicy.ts の人口基準のみで決まり、アフィリエイトの有無では変えない)。
 */
export default function CityFurusato({ code }: { code: string }) {
  const a = getAgriCity(code);
  if (a && a.strengths.length > 0) return null; // CityStrengths のブロックと重ねない

  if (!getCityInsight(code)) return null; // 区・集計行など

  const city = getCity(code);
  if (!city) return null;
  // name は「千葉県 船橋市」形式。見出しには自治体名(「船橋市」)だけを使う
  const short = city.name.split(" ").slice(1).join(" ") || city.name;

  return <LazyGifts code={code} heading={`${short}のふるさと納税 返礼品を楽天市場で見る`} />;
}
