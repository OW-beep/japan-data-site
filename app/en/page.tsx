import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Japan Municipal Data in English — Akiya, Tokyo Wards, Shrinking Towns, Hometown Tax | Japan Municipal Data",
  description:
    "English guides built on official data for all 1,741 Japanese municipalities: akiya (empty houses), Tokyo's 23 wards compared, the fastest-shrinking and richest towns, the furusato nozei hometown tax, 2050 population projections, and preserved historic towns the crowds haven't found.",
  openGraph: {
    title: "Japan Municipal Data — English",
    description:
      "Data-first English guides to Japan's 1,741 municipalities: akiya, Tokyo wards, shrinking towns, income, land prices and the hometown tax.",
    images: ["/images/og-default.png"],
  },
};

const ARTICLES = [
  {
    href: "/en/akiya",
    title: "Akiya in Japan: Where the Empty Houses Really Are",
    desc: "Japan has 9 million empty homes — but the highest vacancy rates are in rich resort towns, not dying villages. A data-first guide to towns where akiya are plentiful, land is cheap, and life still works.",
  },
  {
    href: "/en/growing-towns",
    title: "Japan Is Shrinking — But These Towns Are Still Growing",
    desc: "Nine in ten municipalities lost population between the 2020 and 2025 censuses. The 169 that grew — a science city, a childcare-first commuter city, central Tokyo — show where Japan's future is being built. Plus an honest look at 'towns that pay you to move'.",
  },
  {
    href: "/en/hidden-gems",
    title: "3 Japanese Towns the Crowds Haven't Found Yet",
    desc: "Miyama's thatched-roof village, the Edo post town of Ouchi-juku, and Tsumago-juku on the Nakasendo — preserved historic towns selected with census data, not travel hype.",
  },
  {
    href: "/en/tokyo-wards",
    title: "Tokyo's 23 Wards, Compared",
    desc: "Tokyo's centre is 23 separate municipalities holding 9.94 million people. Population, density, ageing and income for every ward — from Setagaya's near-million residents to Minato's ¥18.1 million average income, 4.6 times Adachi's.",
  },
  {
    href: "/en/future-2050",
    title: "Japan in 2050: The Projection Map",
    desc: "Official projections say 338 municipalities will lose more than half their population by 2050 — and only 77 will grow. The two ends of Japan's future map, from Nanmoku Village (index 25.2) to Tokyo's Chuo Ward (124.7).",
  },
  {
    href: "/en/furusato-hometown-tax",
    title: "Furusato Nozei: Japan's Hometown Tax, Explained",
    desc: "Japan's hometown-tax system moved ¥1.31 trillion across 59 million donations in FY2025. How it works, which towns receive the most — and the village that takes in ¥3.06 million per resident.",
  },
  {
    href: "/en/company-towns",
    title: "Where Japan's New Companies Are Born",
    desc: "Shibuya gained a net 4,428 companies in a year. Per resident, though, Japan's startup boomtowns are ski villages — Niseko, Hakuba, Nozawa Onsen. Registry data for every municipality, plus the 646 towns losing companies.",
  },
  {
    href: "/en/daytime-population",
    title: "The Ward That Multiplies by 13.5 Every Morning",
    desc: "Chiyoda Ward sleeps 66,680 people and hosts 903,780 by day — a daytime ratio of 1,355%. Japan's census extremes, from a nuclear-recovery town at 589% to bedroom towns that empty to 67%.",
  },
  {
    href: "/en/youngest-towns",
    title: "Where Japan's Children Are",
    desc: "Children are 24.7% of Mishima Village and under 3% of Japan's oldest towns. The youngest municipalities in the 2025 census — Okinawa's cities, Kumamoto's chip belt, and two island villages that recruit schoolchildren on purpose.",
  },
  {
    href: "/en/shrinking-towns",
    title: "The Fastest-Shrinking Towns in Japan",
    desc: "Between the 2020 and 2025 censuses, 1,571 of 1,740 municipalities lost people. The steepest falls — Suzu and Wajima after the Noto earthquake, Yubari at −23.5% — and the three forces behind them.",
  },
  {
    href: "/en/fiscal-health",
    title: "Fiscal Strength: The Towns That Fund Themselves",
    desc: "Only 70 of 1,717 municipalities can fund standard services from their own taxes. The fiscal-strength ranking — nuclear plants, ports, resorts — and why a rich town hall doesn't always mean a growing town.",
  },
  {
    href: "/en/farming-towns",
    title: "Japan's Farming Powerhouses",
    desc: "Tahara City produces ¥93.4 billion of farm output a year. The top 10 agricultural municipalities, and the villages where farming is worth over ¥4 million per resident.",
  },
  {
    href: "/en/oldest-towns",
    title: "Japan's Oldest Towns",
    desc: "In Nanmoku Village, 68.9% of residents are 65 or older and 2.3% are children. 111 municipalities are already majority-elderly; by 2050, projections say 557. What life looks like at the front of the world's ageing curve.",
  },
  {
    href: "/en/richest-towns",
    title: "Japan's Richest Municipalities by Income",
    desc: "Average taxable income peaks at ¥18.1 million in Tokyo's Minato Ward — but #8 is Sarufutsu, a scallop-fishing village of 2,611 people in northern Hokkaido. The income ranking with the national average (¥3.88M) for scale.",
  },
  {
    href: "/en/island-villages",
    title: "Life on Japan's Island Villages, in Data",
    desc: "From Sado City (45,378 people) to Aogashima — 168 people living inside a volcano caldera, Japan's smallest municipality. Ageing, density and empty houses across the islands, and the exceptions that stay young.",
  },
  {
    href: "/en/names-trivia",
    title: "Animal Names Hidden in Japan's Towns",
    desc: "61 municipalities have an animal in their name: Bear City, Deer City, Crane City — even a Salmon River Village. Plus Japan's longest place names (7 characters) and the famous one-character city of Tsu.",
  },
  {
    href: "/en/most-expensive-land",
    title: "Japan's Most Expensive Land",
    desc: "Central Tokyo monopolises the top 10 — Minato Ward averages ¥4.47 million per m². The first non-Tokyo names, and the small Saitama city whose land beats Kyoto's on pure scarcity.",
  },
  {
    href: "/en/safest-towns",
    title: "Where Is Japan Safest? What the Data Actually Says",
    desc: "Crime statistics in Japan are published by prefecture, not by town. The honest ranking: Iwate records 2.46 offences per 1,000 residents, Osaka 9.15 — and why small-town Japan feels safe for structural reasons.",
  },
  {
    href: "/en/recycling-champions",
    title: "Japan's Recycling Champions",
    desc: "The median municipality recycles 17.5% of its waste; Hidaka City reports 99.7%, and Osaki Town's 27-category sorting system is studied worldwide. The reported-rate ranking, with an honest note on what the numbers count.",
  },
  {
    href: "/en/cheapest-land",
    title: "The Cheapest Land in Japan",
    desc: "Residential land averages ¥556 per m² in Tenei Village — about $4. The cheapest municipalities in the official land-price data, what a plot actually costs, and why the cheapest town also tops the hometown-tax ranking.",
  },
  {
    href: "/en/highest-towns",
    title: "Japan's Highest Towns",
    desc: "Kawakami Village averages 1,615 m of elevation — every part of it is highland. The highest municipalities by average elevation, computed from the national mesh dataset, plus the towns that hold Mt Fuji's summit.",
  },
  {
    href: "/en/emptiest-places",
    title: "Japan's Emptiest Places",
    desc: "Hinoemata Village: 504 people in 390 km² — 1.3 people per square kilometre, against 23,182 in Tokyo's densest ward. The least dense municipalities in Japan and what fills the space instead.",
  },
  {
    href: "/en/biggest-cities",
    title: "Japan's Biggest Cities in 2025",
    desc: "Yokohama (3.75 million) is Japan's largest city — because Tokyo's wards count separately. The top 14 municipalities in the 2025 census with growth and ageing compared: Fukuoka booms, Kitakyushu is the oldest big city.",
  },
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/" style={{ color: "#2563eb" }}>
          {SITE_NAME} (Japanese)
        </Link>
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 16 }}>
        Japan, town by town — in data
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.9, color: "#374151", marginBottom: 28 }}>
        We publish official statistics for all <strong>1,741 Japanese
        municipalities</strong> — population, ageing, finances, land prices,
        vacant homes. Most of the site is in Japanese; these English guides
        are where we put the data to work on the questions international
        readers actually ask.
      </p>

      {ARTICLES.map((a) => (
        <section key={a.href} style={card}>
          <h2 style={{ fontSize: 21, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.45 }}>
            <Link prefetch={false} href={a.href} style={{ color: "#111827", textDecoration: "none" }}>
              {a.title}
            </Link>
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.85, color: "#374151", margin: "0 0 10px" }}>{a.desc}</p>
          <Link prefetch={false} href={a.href} style={{ color: "#2563eb", fontSize: 15 }}>
            Read the guide →
          </Link>
        </section>
      ))}

      <section style={card}>
        <h2 style={{ fontSize: 21, fontWeight: 800, margin: "0 0 8px" }}>The full data (in Japanese)</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.85, color: "#374151", margin: "0 0 10px" }}>
          Rankings for every municipality — population, land prices, vacancy
          rates, ageing, income and more — are published in Japanese. The
          tables themselves are readable without Japanese: start from the{" "}
          <Link prefetch={false} href="/ranking/population" style={{ color: "#2563eb", textDecoration: "underline" }}>
            population ranking
          </Link>{" "}
          or the{" "}
          <Link prefetch={false} href="/ranking" style={{ color: "#2563eb", textDecoration: "underline" }}>
            ranking index
          </Link>
          .
        </p>
      </section>

      <p style={{ fontSize: 12, color: "#9ca3af" }}>
        {SITE_NAME} — data on all 1,741 Japanese municipalities, from official statistics.
      </p>
    </main>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 22px 16px", marginBottom: 20 };
