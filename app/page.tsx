import Hero from "@/components/home/Hero";
import SiteIntroduction from "@/components/home/SiteIntroduction";
import Stats from "@/components/home/Stats";

import CategorySection from "@/components/home/CategorySection";

import RankingSection from "@/components/home/RankingSection";

import LatestArticles from "@/components/home/LatestArticles";

import PrefectureSection from "@/components/home/PrefectureSection";

import SearchSection from "@/components/home/SearchSection";

import WhyTrust from "@/components/home/WhyTrust";

import OpenDataSection from "@/components/home/OpenDataSection";

import ArticleSection from "@/components/home/ArticleSection";

import SitemapSection from "@/components/home/SitemapSection";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "24px 20px 80px",
      }}
    >
      <Hero />

      <SiteIntroduction />

      <Stats />

      <CategorySection />

      <RankingSection />

      <LatestArticles />

      <PrefectureSection />

      <SearchSection />

      <WhyTrust />

      <OpenDataSection />

      <ArticleSection />

      <SitemapSection />
    </main>
  );
}