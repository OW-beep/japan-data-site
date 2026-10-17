import { searchRakutenItems } from "@/lib/rakuten";
import RakutenGiftsView from "@/components/RakutenGiftsView";

type Props = {
  /** 楽天市場での検索キーワード */
  keyword: string;
  /** 見出し(例:「楽天市場で見る」) */
  heading?: string;
  hits?: number;
};

/**
 * 楽天市場の商品を画像付きで表示するアフィリエイトブロック。
 * サーバーコンポーネント(async)として、ページ側で直接 <RakutenGifts .../> と
 * 書くだけで使える。RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY が未設定、または
 * 該当キーワードで商品が見つからなかった場合は何も表示しない
 * (記事ページ自体を壊さないため)。
 *
 * ページ数が多い場所(自治体ページ)では、ビルド時のAPI呼び出しを避けるため
 * components/city/LazyGifts.tsx を使う。
 */
export default async function RakutenGifts({ keyword, heading = "楽天市場で見る", hits = 3 }: Props) {
  const items = await searchRakutenItems(keyword, hits);
  if (!items || items.length === 0) return null;
  return <RakutenGiftsView items={items} heading={heading} />;
}
