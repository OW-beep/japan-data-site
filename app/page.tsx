import Hero from "@/components/home/Hero";

import PurposeSection from "@/components/home/PurposeSection";

import NicheReadsSection from "@/components/home/NicheReadsSection";

import FeaturedArticlesSection from "@/components/home/FeaturedArticlesSection";

import NewArrivalsSection from "@/components/home/NewArrivalsSection";

import ArticlesSection from "@/components/home/ArticlesSection";

import RankingSection from "@/components/home/RankingSection";

import PrefectureSection from "@/components/home/PrefectureSection";

import AboutSection from "@/components/home/AboutSection";

export const metadata = {
  alternates: { canonical: "/" },
  title: {
    absolute:
      "全国自治体データランキング｜人口・出生率・高齢化率を市区町村別に比較",
  },
};

import SitemapSection from "@/components/home/SitemapSection";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/site";

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
        }}
      />

      <Hero />

      <NewArrivalsSection />

      <PurposeSection />

      <NicheReadsSection />

      <FeaturedArticlesSection />

      <ArticlesSection />

      <RankingSection />

      <PrefectureSection />

      <AboutSection />

      <SitemapSection />
    </main>
  );
}
