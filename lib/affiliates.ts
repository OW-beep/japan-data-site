/**
 * アフィリエイト広告の設定(単一の情報源)。
 *
 * ASP(A8.net など)が発行したバナーコードをここに貼ると、該当トピックの
 * <AffiliateSlot topic="..." /> が置いてあるすべてのページに自動で表示される。
 * null のままなら何も表示されない(ページは壊れない)。
 *
 * 【重要】A8などの規約上、発行されたURL・a8mat値・トラッキングピクセルは
 * 改変せず、そのまま貼ること。改変すると成果が計測されず報酬が発生しない。
 *
 * 各トピックがどのページに置かれているかは、`grep -rn 'AffiliateSlot' app` で確認できる。
 */

export type A8BannerConfig = {
  href: string;
  imgSrc: string;
  width: number;
  height: number;
  trackingPixelSrc: string;
  /** バナー上の見出し */
  heading: string;
};

export type AffiliateTopic =
  | "furusato" // ふるさと納税(秋〜冬が最需要期)
  | "moving" // 引越し一括見積もり(比較・大都市ページ向け)
  | "realestate"; // 不動産売却の一括査定(地価・不動産ページ向け)

export const AFFILIATE_SLOTS: Record<AffiliateTopic, A8BannerConfig | null> = {
  // 既存の承認済みバナー(furusato-nozei-finance-analysis で使用中のものと同一)
  furusato: {
    href: "https://px.a8.net/svt/ejp?a8mat=4BCA77+EU1VYA+4PXI+BZ8OX",
    imgSrc:
      "https://www29.a8.net/svt/bgt?aid=260913571897&wid=003&eno=01&mid=s00000022023002012000&mc=1",
    width: 300,
    height: 250,
    trackingPixelSrc: "https://www18.a8.net/0.gif?a8mat=4BCA77+EU1VYA+4PXI+BZ8OX",
    heading: "ふるさと納税の返礼品を探す",
  },

  // ↓ 提携が承認されたら、ASPが発行したコードをそのまま貼る(未設定なら非表示)
  moving: null,
  realestate: null,
};
