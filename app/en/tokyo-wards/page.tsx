import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/tokyo-wards";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Tokyo's 23 Wards Compared: Population, Density, Income and Ageing | Japan Municipal Data",
  description:
    "Tokyo's 23 special wards are 23 separate municipalities holding 9.94 million people. Compared in one table: Setagaya is a near-million city, Minato averages ¥18.1M income, Adachi ¥3.9M — a 4.6x gap inside one 'city'. 2025 census and tax data.",
  openGraph: {
    title: "Tokyo's 23 Wards, Compared",
    description:
      "One city, 23 municipalities: income from ¥3.9M to ¥18.1M, density from 5,719 to 23,182 per km². The full ward table.",
    images: ["/images/og-default.png"],
  },
};

const WARDS: [string, string, string, string, string, string][] = [
  ["Setagaya", "954,737", "16,256", "20.6%", "10.8%", "¥6.81M"],
  ["Nerima", "760,819", "15,653", "21.5%", "10.7%", "¥4.76M"],
  ["Ota", "758,181", "12,093", "21.1%", "9.4%", "¥5.04M"],
  ["Edogawa", "704,696", "13,987", "20.7%", "10.8%", "¥4.19M"],
  ["Adachi", "701,667", "13,052", "23.8%", "9.7%", "¥3.90M"],
  ["Suginami", "597,038", "17,355", "20.1%", "9.5%", "¥5.92M"],
  ["Itabashi", "595,972", "18,140", "22.2%", "9.3%", "¥4.19M"],
  ["Koto", "553,502", "12,196", "20.0%", "11.3%", "¥5.35M"],
  ["Katsushika", "467,267", "13,020", "23.9%", "10.3%", "¥3.96M"],
  ["Shinagawa", "426,005", "18,490", "18.2%", "10.6%", "¥6.31M"],
  ["Kita", "367,827", "17,235", "22.5%", "9.9%", "¥4.47M"],
  ["Shinjuku", "361,357", "19,176", "17.4%", "7.6%", "¥6.97M"],
  ["Nakano", "354,853", "22,122", "18.2%", "8.1%", "¥5.02M"],
  ["Toshima", "305,516", "23,182", "18.6%", "8.4%", "¥5.37M"],
  ["Meguro", "286,082", "19,638", "19.7%", "10.5%", "¥7.70M"],
  ["Sumida", "285,038", "19,759", "20.5%", "9.3%", "¥4.60M"],
  ["Minato", "272,478", "12,794", "16.7%", "12.1%", "¥18.10M"],
  ["Bunkyo", "249,800", "21,264", "17.1%", "11.4%", "¥7.80M"],
  ["Shibuya", "238,826", "16,141", "15.8%", "7.6%", "¥13.94M"],
  ["Taito", "228,046", "20,914", "20.2%", "7.7%", "¥5.43M"],
  ["Arakawa", "226,291", "21,405", "21.2%", "9.9%", "¥4.41M"],
  ["Chuo", "181,841", "16,570", "14.2%", "13.7%", "¥8.82M"],
  ["Chiyoda", "66,270", "5,719", "16.2%", "12.9%", "¥12.91M"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Tokyo wards
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Tokyo&apos;s 23 Wards, Compared
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published November 15, 2026</p>
      <p style={lead}>
        &quot;Tokyo&quot; the city does not legally exist. Its centre is 23
        special wards — each a full municipality with its own mayor, assembly
        and budget — holding <strong>9.94 million people</strong> between
        them. They differ from each other as much as separate cities do:
        average taxpayer income runs from ¥3.90 million to ¥18.10 million
        inside the same urban fabric. Here they all are, in one table.
      </p>

      <section style={card}>
        <h2 style={h2}>All 23 wards: population, density, age, income</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Ward</th>
                <th style={thR}>Population (2025)</th>
                <th style={thR}>People / km²</th>
                <th style={thR}>Aged 65+</th>
                <th style={thR}>Under 15</th>
                <th style={thR}>Income / taxpayer</th>
              </tr>
            </thead>
            <tbody>
              {WARDS.map(([n, pop, d, a, c, inc]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{n}</td>
                  <td style={tdR}>{pop}</td>
                  <td style={tdR}>{d}</td>
                  <td style={tdR}>{a}</td>
                  <td style={tdR}>{c}</td>
                  <td style={tdR}>{inc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Setagaya, at 954,737 people, would be Japan&apos;s 13th-largest
          city in its own right. Chiyoda — palace, parliament, ministries —
          is the smallest ward by population (66,270) and by density
          (5,719/km²), yet holds the third-highest incomes and, as our{" "}
          <Link prefetch={false} href="/en/daytime-population" style={link}>
            daytime population
          </Link>{" "}
          guide shows, multiplies 13.5-fold every working day. Toshima
          (Ikebukuro) is the densest ward at 23,182 people per km² — denser
          than any municipality in Japan.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>The 4.6x gap inside one city</h2>
        <p style={para}>
          The income column is the table&apos;s sharpest edge. Minato
          Ward&apos;s taxpayers average ¥18.10 million — Japan&apos;s #1
          figure (see our{" "}
          <Link prefetch={false} href="/en/richest-towns" style={link}>
            richest municipalities
          </Link>{" "}
          ranking) — while Adachi&apos;s average ¥3.90 million, the lowest of
          the 23, sits near the national municipal median. Shibuya (¥13.94M)
          and Chiyoda (¥12.91M) complete a wealthy core; the north-eastern
          wards (Adachi, Katsushika ¥3.96M, Edogawa ¥4.19M) form the other
          pole. The same gradient appears in land prices — Minato also tops
          the{" "}
          <Link prefetch={false} href="/en/most-expensive-land" style={link}>
            most expensive land
          </Link>{" "}
          ranking at ¥4.47 million per m².
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          The age columns hold a surprise. The youngest ward by both measures
          is <strong>Chuo</strong>: lowest elderly share (14.2%) and the
          highest share of children (13.7%) — the Ginza/Harumi tower-mansion
          districts have filled with young families, inverting the assumption
          that central Tokyo is childless. The business-entertainment wards
          tell the opposite story: Shinjuku and Shibuya have the fewest
          children (7.6% each). And the oldest wards are not the centre but
          the residential north-east — Katsushika (23.9% elderly) and Adachi
          (23.8%) — ageing profiles closer to regional Japan than to the
          global-city image.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Why the wards matter for reading Japan</h2>
        <p style={{ ...para, marginBottom: 0 }}>
          Because the wards are municipalities, almost every Japanese
          statistic — income, crime context, fiscal strength, company
          formation — is published at ward level, and &quot;Tokyo&quot; as a
          single data point rarely exists. Anyone comparing Tokyo with other
          world cities using municipal data is really comparing these 23
          governments. Our{" "}
          <Link prefetch={false} href="/en/biggest-cities" style={link}>
            biggest cities
          </Link>{" "}
          and{" "}
          <Link prefetch={false} href="/en/company-towns" style={link}>
            company formation
          </Link>{" "}
          guides show how different the picture looks once the wards are
          counted properly.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Population and age shares are from the 2025 national census;
          density uses 2020 census population and official areas; income is
          average taxable income per taxpayer from the Ministry of Internal
          Affairs&apos; municipal tax statistics (FY2025 edition). The 23
          wards together: 9,944,109 residents (2025). Full ward data, in
          Japanese, is on each ward&apos;s page on this site, reachable from
          the{" "}
          <Link prefetch={false} href="/ranking/population" style={link}>
            population ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/daytime-population" style={link}>
            Daytime population extremes
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/richest-towns" style={link}>
            Japan&apos;s richest municipalities
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/most-expensive-land" style={link}>
            Japan&apos;s most expensive land
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/biggest-cities" style={link}>
            Japan&apos;s biggest cities in 2025
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
