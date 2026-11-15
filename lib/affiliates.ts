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
  | "realestate" // 不動産売却の一括査定(地価・不動産ページ向け)
  | "career" // 転職サービス(所得・仕事・産業のページ向け)
  | "care" // 介護施設の紹介・相談(高齢化・医療・介護のページ向け)
  | "car"; // 車の買取・乗り換えの見積もり(軽自動車・運転のページ向け)

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
  career: null,
  care: null,
  car: null,
};

/**
 * 各トピックの枠の上に出す、読者向けの短い説明(広告であることは、枠の見出しの「PR」で示す)。
 * 広告の有無で、記事の分析結果や、ランキングの順位は変わらない。
 * 言い切れること(価格や効果の保証)は書かない。
 */
export const AFFILIATE_COPY: Record<AffiliateTopic, { title: string; lead: string }> = {
  furusato: {
    title: "ふるさと納税の返礼品を探す",
    lead: "寄付先や返礼品は、ポータルサイトで、地域・使い道・金額から探せます。控除上限額の範囲内で、選んでください。",
  },
  moving: {
    title: "引っ越しの見積もりを比べる",
    lead: "引っ越しの料金は、時期や荷物の量、距離で変わります。同じ条件で、複数の会社の見積もりを比べると、料金の幅が分かります。",
  },
  realestate: {
    title: "家や土地の相場を、複数の会社で確かめる",
    lead: "不動産の査定額は、会社によって違います。売却や住み替えを考えるなら、複数の会社に査定を依頼して、相場の幅を知る方法があります。",
  },
  career: {
    title: "仕事の求人と給与の相場を確かめる",
    lead: "住む街だけでなく、働く場所の求人や給与の水準も、暮らしの条件です。転職サービスで、希望の職種の求人と、給与の幅を確認できます。",
  },
  care: {
    title: "介護施設を、条件で比べる",
    lead: "介護施設は、種類によって、費用や入所の条件が違います。紹介・相談のサービスで、条件に合う施設を比べる方法があります。まずは、お住まいの地域の地域包括支援センターにも、相談してください。",
  },
  car: {
    title: "車の売却・乗り換えの見積もりを比べる",
    lead: "車の買取額は、会社によって違います。手放す、乗り換えるなどを考えるときは、複数社の査定を比べる方法があります。",
  },
};
