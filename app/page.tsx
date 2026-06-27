import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import RankingSection from "@/components/home/RankingSection";
import ArticleSection from "@/components/home/ArticleSection";
import CategorySection from "@/components/home/CategorySection";
import PrefectureSection from "@/components/home/PrefectureSection";
import SearchSection from "@/components/home/SearchSection";
import OpenDataSection from "@/components/home/OpenDataSection";
import SitemapSection from "@/components/home/SitemapSection";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "40px 24px 80px",
      }}
    >
      <Hero />

      <Stats />

      <RankingSection />

      <ArticleSection />

      <CategorySection />

      <PrefectureSection />

      <SearchSection />

      <OpenDataSection />

      <SitemapSection />
    </main>
  );
}