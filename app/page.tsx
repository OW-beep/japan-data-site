import Hero from "@/components/home/Hero";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import PurposeSection from "@/components/home/PurposeSection";
import OriginalIndexSection from "@/components/home/OriginalIndexSection";
import RankingSection from "@/components/home/RankingSection";
import HighlightsSection from "@/components/home/HighlightsSection";
import AboutSection from "@/components/home/AboutSection";
import AffiliateRecommend from "@/components/AffiliateRecommend";
import RakutenGifts from "@/components/RakutenGifts";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
  title: {
    absolute:
      "全国自治体データランキング｜人口・出生率・高齢化率を市区町村別に比較",
  },
};

/**
 * トップページは「迷わず目的にたどり着ける」ことを優先して、セクションを絞っている。
 *   ヒーロー(検索ボックス) → 新着 → 目的から探す → 独自指標 → 人気ランキング → 注目の読み物 → 運営者情報
 *
 * 以前あった次のセクションはトップから外した(部品のファイルは残してある):
 *   記事の全件一覧(ArticlesSection)、都道府県の一覧(PrefectureSection)、
 *   サイトマップ(SitemapSection)、注目記事・ニッチな読み物(HighlightsSection に統合)。
 *   いずれも、ヘッダー・フッター・/articles・サイトマップから辿れる。
 */
export default async function Home() {
  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "20px 20px 56px",
      }}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
            "query-input": "required name=search_term_string",
          },
        }}
      />

      <Hero />

      <NewArrivalsSection />

      <PurposeSection />

      <OriginalIndexSection />

      <RankingSection />

      <HighlightsSection />

      {/* ふるさと納税の案内(広告)。読み物の後・運営者情報の前に置き、本文の邪魔をしない。
          A8の枠は lib/affiliates.ts の furusato が設定されている間だけ表示される。
          楽天の返礼品ブロックは、APIキーが未設定なら何も表示されない */}
      <section style={{ maxWidth: 760, margin: "8px auto 0" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
          ふるさと納税の申し込みは12月31日まで
        </h2>
        <p style={{ color: "#4b5563", lineHeight: 1.9, marginBottom: 4 }}>
          その年の控除に間に合わせるには、年内の申し込みと入金が必要です。
          当サイトのデータで寄付先を探すなら
          <a href="/ranking/furusato-nozei" style={{ color: "#2563eb" }}>
            ふるさと納税の受入額ランキング
          </a>
          も参考になります。
        </p>
        <AffiliateRecommend topics={["furusato"]} />
        <RakutenGifts
          keyword="ふるさと納税 返礼品"
          heading="楽天ふるさと納税で人気の返礼品"
          hits={3}
        />
      </section>

      <AboutSection />
    </main>
  );
}
