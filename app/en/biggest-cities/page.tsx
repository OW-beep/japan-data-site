import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/biggest-cities";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Japan's Biggest Cities in 2025: A Data Guide to the Top 14 | Japan Municipal Data",
  description:
    "Yokohama (3.75 million) is Japan's largest city — because Tokyo's 23 wards, 9.94 million people, count separately. The top 14 municipalities in the 2025 census with growth and ageing compared: Fukuoka is booming, Kitakyushu is the oldest big city in Japan.",
  openGraph: {
    title: "Japan's Biggest Cities in 2025",
    description:
      "The top 14 municipalities ranked by 2025 census population — with the growers, the shrinkers, and the oldest big city in Japan.",
    images: ["/images/og-default.png"],
  },
};

const BIGGEST: [string, string, string, string, string][] = [
  ["Yokohama", "Kanagawa", "3,750,952", "−0.7%", "25.0%"],
  ["Osaka", "Osaka", "2,805,371", "+1.9%", "23.0%"],
  ["Nagoya", "Aichi", "2,345,186", "+0.6%", "24.0%"],
  ["Sapporo", "Hokkaido", "1,961,996", "−0.6%", "28.7%"],
  ["Fukuoka", "Fukuoka", "1,662,793", "+3.1%", "21.5%"],
  ["Kawasaki", "Kanagawa", "1,559,571", "+1.4%", "20.3%"],
  ["Kobe", "Hyogo", "1,494,997", "−2.0%", "28.2%"],
  ["Kyoto", "Kyoto", "1,430,062", "−2.3%", "27.1%"],
  ["Saitama", "Saitama", "1,344,865", "+1.6%", "23.3%"],
  ["Hiroshima", "Hiroshima", "1,171,915", "−2.4%", "26.3%"],
  ["Sendai", "Miyagi", "1,096,146", "−0.1%", "24.7%"],
  ["Chiba", "Chiba", "994,846", "+2.0%", "26.0%"],
  ["Setagaya Ward", "Tokyo", "954,737", "+1.2%", "20.6%"],
  ["Kitakyushu", "Fukuoka", "903,592", "−3.8%", "31.2%"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Biggest cities
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Japan&apos;s Biggest Cities in 2025
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published July 7, 2026</p>
      <p style={lead}>
        The largest city in Japan is Yokohama, with 3.75 million people. That
        surprises visitors who assume the answer is Tokyo — but Tokyo is a
        prefecture of 14 million whose centre is divided into 23 special
        wards, each a municipality in its own right. Counted together, the
        wards hold <strong>9.94 million people</strong>; counted separately,
        as Japanese statistics do, the biggest of them (Setagaya) ranks only
        13th. Here is the top 14 as the 2025 census actually records it.
      </p>

      <section style={card}>
        <h2 style={h2}>The top 14 municipalities (2025 census)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>City</th>
                <th style={thR}>Population</th>
                <th style={thR}>Change 2020→25</th>
                <th style={thR}>Aged 65+</th>
              </tr>
            </thead>
            <tbody>
              {BIGGEST.map(([n, p, pop, ch, a]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{pop}</td>
                  <td style={tdR}>{ch}</td>
                  <td style={tdR}>{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Eleven cities exceed one million residents; Chiba, at 994,846, is
          next in line — and still growing at +2.0%.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Two leagues inside the table</h2>
        <p style={para}>
          Read the change column and the table splits in two. The growers are
          Fukuoka (+3.1% — the fastest big-city growth in Japan, powered by
          startups, universities and Kyushu&apos;s gateway role), Chiba
          (+2.0%), Osaka (+1.9%), Saitama (+1.6%) and Kawasaki (+1.4%). The
          shrinkers are the older industrial and regional capitals: Kitakyushu
          (−3.8%), Hiroshima (−2.4%), Kyoto (−2.3%) and Kobe (−2.0%). Even
          Yokohama slipped 0.7%.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          The ageing column tells the same story in advance. Kitakyushu, a
          former steel city, is the oldest big city in Japan at 31.2%
          elderly — above the national average of 28.7% — while Kawasaki, a
          young commuter-and-tech city between Tokyo and Yokohama, is the
          youngest at 20.3%. Sapporo (28.7%) shows that even a two-million
          city in the north ages at village-like speed once its growth stops.
          Size, in other words, no longer protects a Japanese city; momentum
          does. Our{" "}
          <Link prefetch={false} href="/en/growing-towns" style={link}>
            growing towns
          </Link>{" "}
          guide and the{" "}
          <Link prefetch={false} href="/en/daytime-population" style={link}>
            daytime population
          </Link>{" "}
          ranking show the same forces from other angles.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>A note on Tokyo</h2>
        <p style={{ ...para, marginBottom: 0 }}>
          Because the 23 wards are separate municipalities, &quot;Tokyo&quot;
          never appears in rankings like this one — a statistical quirk that
          understates the capital in every international comparison. We give
          the wards their own full treatment in{" "}
          <Link prefetch={false} href="/en/tokyo-wards" style={link}>
            Tokyo&apos;s 23 wards, compared
          </Link>
          : Setagaya alone has more residents than all but 12 cities in
          Japan, and the smallest ward, Chiyoda, multiplies its population
          13-fold every working day.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Populations are from the 2025 national census (Statistics Bureau of
          Japan); change is against the 2020 census; age shares are computed
          from the 2025 census age groups. Designated cities are counted as
          whole cities; Tokyo&apos;s special wards individually, per Japanese
          statistical convention. The full dataset, in Japanese, is behind
          the{" "}
          <Link prefetch={false} href="/ranking/population" style={link}>
            population ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/tokyo-wards" style={link}>
            Tokyo&apos;s 23 wards, compared
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/daytime-population" style={link}>
            Daytime population extremes
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/growing-towns" style={link}>
            Japan is shrinking — but these towns are growing
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/company-towns" style={link}>
            Where Japan&apos;s new companies are born
          </Link>
        </p>
      </section>

      <p style={{ fontSize: 12, color: "#9ca3af" }}>
        {SITE_NAME} — data on all 1,741 Japanese municipalities, from official statistics.
      </p>
    </main>
  );
}

const lead: React.CSSProperties = { fontSize: 17, lineHeight: 1.9, color: "#374151", marginBottom: 28 };
const card: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 22px 8px", marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.45 };
const para: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.9, color: "#374151" };
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14, margin: "8px 0 14px" };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thR: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdR: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
