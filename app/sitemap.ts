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
    "/ranking/marriage-rate",
    "/ranking/daycare",
    "/ranking/restaurant",
    "/ranking/library",
    "/ranking/vacant-house",
    "/prefecture",
    "/search",
    "/compare",
    "/articles",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
  ];

  const cityPages = cities.map((c) => ({
    url: `${baseUrl}/city/${c.code}`,
    lastModified: new Date(),
  }));

  const prefecturePages = getPrefectures().map((pref) => ({
    url: `${baseUrl}/prefecture/${encodeURIComponent(pref)}`,
    lastModified: new Date(),
  }));

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
    "/articles/marriage-rate-analysis",
    "/articles/vacant-house-analysis",
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