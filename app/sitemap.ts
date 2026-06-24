import cities from "@/data/cities.json";

export default function sitemap() {
  const baseUrl = "https://your-domain.com";

  const cityUrls = cities.map((c) => ({
    url: `${baseUrl}/city/${c.code}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/ranking`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/ranking/population`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    ...cityUrls,
  ];
}