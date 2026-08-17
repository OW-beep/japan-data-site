import type { MetadataRoute } from "next";
import cities from "@/data/cities.json";
import { getPrefectures } from "@/lib/getPrefecture";
import { SITE_URL } from "@/lib/site";

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
    "/ranking/daycare",
    "/ranking/restaurant",
    "/ranking/library",
    "/ranking/vacant-house",
    "/ranking/daytime-ratio",
    "/ranking/elderly-home",
    "/ranking/dentist",
    "/ranking/retail-store",
    "/ranking/young-adult-migration",
    "/ranking/recycling-rate",
    "/ranking/community-center",
    "/prefecture",
    "/search",
    "/compare",
    "/articles",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
  ];

  // /city と /prefecture は審査期間中 noindex にしているため、
  // sitemap からも一時的に除外する(cities.json / getPrefectures は
  // 現在未使用だが、noindex解除時にすぐ復元できるよう import は残す)。
  const cityPages: MetadataRoute.Sitemap = [];
  const prefecturePages: MetadataRoute.Sitemap = [];
  void cities;
  void getPrefectures;

  const articlePages = [
    "/articles/birth-rate",
    "/articles/population-concentration",
    "/articles/million-cities",
    "/articles/youngest-municipalities",
    "/articles/child-top50",
    "/articles/population-about",
    "/articles/population-top50",
    "/articles/aging-top50",
    "/articles/decline",
    "/articles/density-analysis",
    "/articles/area-analysis",
    "/articles/finance-analysis",
    "/articles/household-analysis",
    "/articles/population-finance",
    "/articles/prefecture-composite",
    "/articles/aging-gap",
    "/articles/aging-finance",
    "/articles/density-aging",
    "/articles/migration-child",
    "/articles/household-aging-ushape",
    "/articles/density-finance",
    "/articles/child-finance",
    "/articles/doctors-analysis",
    "/articles/unemployment-analysis",
    "/articles/industry-structure",
    "/articles/tax-composition",
    "/articles/school-crowding",
    "/articles/welfare-aging",
    "/articles/habitable-density",
    "/articles/natural-change",
    "/articles/foreign-population",
    "/articles/shopping-access",
    "/articles/daycare-access",
    "/articles/restaurant-density",
    "/articles/balance-ratio-analysis",
    "/articles/debt-service-ratio-analysis",
    "/articles/fiscal-health-composite",
    "/articles/elderly-support-composite",
    "/articles/industry-diversity-index",
    "/articles/young-family-attractiveness-index",
    "/articles/living-infrastructure-index",
    "/articles/education-expense-analysis",
    "/articles/marriage-rate-analysis",
    "/articles/vacant-house-analysis",
    "/articles/daytime-ratio-analysis",
    "/articles/elderly-home-analysis",
    "/articles/young-adult-migration-analysis",
    "/articles/recycling-rate-analysis",
    "/articles/community-center-analysis",
  ].map((p) => ({
    url: `${baseUrl}${p}`,
    lastModified: new Date(),
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