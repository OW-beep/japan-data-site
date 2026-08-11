import Hero from "@/components/home/Hero";

import PurposeSection from "@/components/home/PurposeSection";

import FeaturedArticlesSection from "@/components/home/FeaturedArticlesSection";

import NewArrivalsSection from "@/components/home/NewArrivalsSection";

import ArticlesSection from "@/components/home/ArticlesSection";

import RankingSection from "@/components/home/RankingSection";

import PrefectureSection from "@/components/home/PrefectureSection";

import AboutSection from "@/components/home/AboutSection";

export const metadata = {
  alternates: { canonical: "/" },
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
