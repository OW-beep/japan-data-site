import Hero from "@/components/home/Hero";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import PurposeSection from "@/components/home/PurposeSection";
import OriginalIndexSection from "@/components/home/OriginalIndexSection";
import RankingSection from "@/components/home/RankingSection";
import HighlightsSection from "@/components/home/HighlightsSection";
import AboutSection from "@/components/home/AboutSection";
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
export default function Home() {
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

      <AboutSection />
    </main>
  );
}
