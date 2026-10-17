import { NextResponse } from "next/server";

import { getAgriCity } from "@/lib/agriCity";
import { searchRakutenItems } from "@/lib/rakuten";

/**
 * 自治体ページの楽天ブロック用データ。
 * ページを開いてブロックの近くまでスクロールされたときだけブラウザから呼ばれる
 * (ビルド時にAPIを何百回も呼ばないため。components/city/LazyGifts.tsx)。
 *
 * 検索語は、その自治体の「強み」(lib/agriCity.ts)から、ここで決める。
 * 呼び出し側から任意のキーワードを受け取らないので、楽天APIの枠を他の用途に使われることはない。
 * 結果はCDNにキャッシュされるので、同じ自治体への2回目以降は楽天APIを呼ばない。
 *
 * 商品が見つからなかったときは、検索語を段階的に広げる。どの段階でも、結果は
 * 「商品名か販売元(自治体名)に、その市町村名(または県名)が書かれているもの」だけに絞る。
 * 楽天の検索は語を緩く照合するため、絞らないと別の自治体の商品が混ざる(実際に混ざった)。
 *   1. ふるさと納税 {強みの品目} {市町村名}(強み1〜2番目の品目ごと)  → 見出し「{市町村名}の{品目}を楽天市場で見る」
 *   2. ふるさと納税 {市町村名}(品目を問わない)                      → 見出し「{市町村名}のふるさと納税を楽天市場で見る」
 *   3. ふるさと納税 {強み1番目の品目} {都道府県名}(県名で絞る)         → 見出し「{都道府県名}産の{品目}を楽天市場で見る」
 * 3は市町村単位ではないので、見出しもそれに合わせる(実際と違う産地を名乗らないため)。
 *
 * 動作確認: ブラウザで /api/city-gifts/23231(田原市)を開く。
 *   reason が "keys_missing" → 環境変数 RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY が未設定
 *   reason が "no_results"   → 楽天側で該当商品が0件(Vercelのログに [rakuten] の詳細が出る)
 */
const OK = "public, s-maxage=21600, stale-while-revalidate=86400";
const MISS = "public, s-maxage=3600";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const a = /^\d{5}$/.test(code) ? getAgriCity(code) : null;
  const top = a?.strengths[0];
  if (!a || !top) {
    return NextResponse.json({ items: [], reason: "no_strength" }, { headers: { "Cache-Control": OK } });
  }
  if (!process.env.RAKUTEN_APP_ID || !process.env.RAKUTEN_ACCESS_KEY) {
    // キー未設定。設定してもすぐ反映されるよう、長くキャッシュしない
    return NextResponse.json({ items: [], reason: "keys_missing" }, { headers: { "Cache-Control": "no-store" } });
  }

  const fits = (it: { name: string; shopName: string }, word: string) => it.name.includes(word) || it.shopName.includes(word);

  const attempts: { keyword: string; heading: string; word: string }[] = [
    ...a.strengths.slice(0, 2).map((st) => ({
      keyword: `ふるさと納税 ${st.product} ${a.city}`,
      heading: `${a.city}の${st.product}を楽天市場で見る`,
      word: a.city,
    })),
    { keyword: `ふるさと納税 ${a.city}`, heading: `${a.city}のふるさと納税を楽天市場で見る`, word: a.city },
    { keyword: `ふるさと納税 ${top.product} ${a.pref}`, heading: `${a.pref}産の${top.product}を楽天市場で見る`, word: a.pref },
  ];
  for (const t of attempts) {
    // 絞り込みで減るので、多め(10件)に取って、条件に合う上位3件を使う
    // ブラウザを待たせすぎないよう、やり直しは2回・短い待ちにする(ビルド用の長い待ちは使わない)
    const found = await searchRakutenItems(t.keyword, 10, { maxAttempts: 2, backoff429Ms: 1500 });
    const items = (found ?? []).filter((it) => fits(it, t.word)).slice(0, 3);
    if (items.length > 0) {
      return NextResponse.json({ items, heading: t.heading }, { headers: { "Cache-Control": OK } });
    }
  }
  return NextResponse.json({ items: [], reason: "no_results" }, { headers: { "Cache-Control": MISS } });
}
