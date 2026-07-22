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
    "/prefecture",
    "/search",
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