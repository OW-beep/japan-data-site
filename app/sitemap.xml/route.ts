import cities from "@/data/cities.json";

export async function GET() {
  const baseUrl = "https://your-domain.com";

  const urls = [
    "/",
    "/ranking/population",
    "/ranking/child",
    "/ranking/aging",
    "/ranking/decline",
    "/privacy",
    "/contact",
  ];

  const cityUrls = cities.slice(0, 2000).map(
    (c) => `/city/${c.code}`
  );

  const all = [...urls, ...cityUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (u) => `
  <url>
    <loc>${baseUrl}${u}</loc>
  </url>`
  )
  .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}