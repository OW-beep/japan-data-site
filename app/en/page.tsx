import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Japan Municipal Data in English — Akiya, Growing Towns, Hidden Gems | Japan Municipal Data",
  description:
    "English guides built on official data for all 1,741 Japanese municipalities: where akiya (empty houses) really are, which towns are still growing while Japan shrinks, and preserved historic towns the crowds haven't found.",
  openGraph: {
    title: "Japan Municipal Data — English",
    description:
      "Data-first English guides to Japan's towns: akiya, population trends, and hidden-gem historic towns.",
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
