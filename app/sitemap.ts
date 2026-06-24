import type { MetadataRoute } from "next";
import cities from "@/data/cities.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://japan-data-site.vercel.app";

  const staticPages = [
    "",
    "/ranking/population",
    "/ranking/child",
    "/ranking/aging",
    "/ranking/decline",
    "/privacy",
    "/contact",
  ];

  const cityPages = cities.map((c) => ({
    url: `${baseUrl}/city/${c.code}`,
    lastModified: new Date(),
  }));

  return [
    ...staticPages.map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: new Date(),
    })),
    ...cityPages,
  ];
}