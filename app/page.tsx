import Hero from "@/components/home/Hero";

import PurposeSection from "@/components/home/PurposeSection";

import FeaturedArticlesSection from "@/components/home/FeaturedArticlesSection";

import NewArrivalsSection from "@/components/home/NewArrivalsSection";

import ArticlesSection from "@/components/home/ArticlesSection";

import RankingSection from "@/components/home/RankingSection";

import PrefectureSection from "@/components/home/PrefectureSection";

import AboutSection from "@/components/home/AboutSection";

import SitemapSection from "@/components/home/SitemapSection";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "20px 20px 56px",
      }}
    >
      <Hero />

      <PurposeSection />

      <FeaturedArticlesSection />

      <NewArrivalsSection />

      <ArticlesSection />

      <RankingSection />

      <PrefectureSection />

      <AboutSection />

      <SitemapSection />
    </main>
  );
}
