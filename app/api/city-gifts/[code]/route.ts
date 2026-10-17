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
 * 結果はCDNに6時間キャッシュされるので、同じ自治体への2回目以降は楽天APIを呼ばない。
 */
const OK = "public, s-maxage=21600, stale-while-revalidate=86400";
const RETRY_SOON = "public, s-maxage=300";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const a = /^\d{5}$/.test(code) ? getAgriCity(code) : null;
  const top = a?.strengths[0];
  if (!a || !top) {
    return NextResponse.json({ items: [] }, { headers: { "Cache-Control": OK } });
  }
  const items = await searchRakutenItems(`ふるさと納税 ${top.product} ${a.city}`, 3);
  // null は取得失敗。短い時間でやり直せるよう、長くキャッシュしない
  return NextResponse.json({ items: items ?? [] }, { headers: { "Cache-Control": items ? OK : RETRY_SOON } });
}
