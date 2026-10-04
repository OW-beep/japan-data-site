import type { MetadataRoute } from "next";
import cities from "@/data/cities.json";
import { getPrefectures } from "@/lib/getPrefecture";
import { SITE_URL } from "@/lib/site";
import { articleEntries } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const staticPages = [
    "",
    "/ranking",
    "/ranking/population",
    "/ranking/birth-rate",
    "/ranking/child",
    "/ranking/aging",
    "/ranking/density",
    "/ranking/area",
    "/ranking/finance",
    "/ranking/decline",
    "/ranking/household",
    "/ranking/household-size",
    "/ranking/doctors",
    "/ranking/unemployment",
    "/ranking/manufacturing",
    "/ranking/tax-ratio",
    "/ranking/school-crowding",
    "/ranking/welfare-ratio",
    "/ranking/habitable-density",
    "/ranking/natural-change",
    "/ranking/decrease",
    "/ranking/sparse-density",
    "/ranking/foreign-population",
    "/ranking/retail-access",
    "/ranking/balance-ratio",
    "/ranking/debt-service-ratio",
    "/ranking/education-expense",
    "/ranking/marriage-rate",
    "/ranking/divorce-rate",
    "/ranking/daycare",
    "/ranking/restaurant",
    "/ranking/library",
    "/ranking/vacant-house",
    "/ranking/capital-elevation",
    "/ranking/real-estate-price",
    "/ranking/corporate-growth",
    "/ranking/furusato-nozei",
    "/ranking/daytime-ratio",
    "/ranking/elderly-home",
    "/ranking/dentist",
    "/ranking/pharmacist",
    "/ranking/hospital",
    "/ranking/income",
    "/ranking/crime-rate",
    "/ranking/traffic-accident-rate",
    "/ranking/fiscal-health-composite",
    "/ranking/elderly-support-composite",
    "/ranking/industry-diversity-index",
    "/ranking/young-family-attractiveness-index",
    "/ranking/living-infrastructure-index",
    "/ranking/bedroom-town-finance",
    "/ranking/retail-store",
    "/ranking/young-adult-migration",
    "/ranking/recycling-rate",
    "/ranking/community-center",
    "/ranking/large-cities",
    "/ranking/churn",
    "/ranking/traffic-accident-city",
    "/ranking/icy-road-accident",
    "/ranking/aging-gap",
    "/prefecture",
    "/search",
    "/compare",
    "/articles",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    "/reports",
  ];

  // /city と /prefecture は審査期間中 noindex にしているため、
  // sitemap からも一時的に除外する(cities.json / getPrefectures は
  // 現在未使用だが、noindex解除時にすぐ復元できるよう import は残す)。
  const cityPages: MetadataRoute.Sitemap = [];
  const prefecturePages: MetadataRoute.Sitemap = [];
  void cities;
  void getPrefectures;

  // 記事は lib/articles.ts を単一の情報源にする。
  // lastModified には公開日を使う(ビルドのたびに「全ページ更新」と
  // 申告すると、Googleが lastmod を信頼しなくなるため)。
  const articlePages: MetadataRoute.Sitemap = articleEntries.map((a) => ({
    url: `${baseUrl}/articles/${a.slug}`,
    lastModified: new Date(`${a.date}T00:00:00+09:00`),
  }));

  return [
    ...staticPages.map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: new Date(),
    })),
    ...articlePages,
    ...prefecturePages,
    ...cityPages,
  ];
}