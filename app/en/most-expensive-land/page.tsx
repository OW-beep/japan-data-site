import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/most-expensive-land";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Japan's Most Expensive Land: Inside Tokyo's ¥4.5 Million Square Metres | Japan Municipal Data",
  description:
    "Minato Ward trades residential land at an average of ¥4.47 million per m² — about $29,800. The top-10 most expensive municipalities are all Tokyo wards; the priciest town outside Tokyo, Ashiya, costs a tenth as much. Official transaction data, ranked.",
  openGraph: {
    title: "Japan's Most Expensive Land",
    description:
      "¥4.47 million for one square metre. Tokyo's wards sweep the top 10 — and the most expensive land outside Tokyo is 10x cheaper.",
    images: ["/images/og-default.png"],
  },
};

const TOP10: [string, string, string][] = [
  ["Minato Ward", "¥4,468,205", "~$29,800"],
  ["Chiyoda Ward", "¥3,390,909", "~$22,600"],
  ["Chuo Ward", "¥2,525,000", "~$16,800"],
  ["Shibuya Ward", "¥2,267,705", "~$15,100"],
  ["Taito Ward", "¥1,948,644", "~$13,000"],
  ["Bunkyo Ward", "¥1,570,411", "~$10,500"],
  ["Meguro Ward", "¥1,471,024", "~$9,800"],
  ["Shinjuku Ward", "¥1,443,421", "~$9,600"],
  ["Shinagawa Ward", "¥1,151,818", "~$7,700"],
  ["Koto Ward", "¥1,066,353", "~$7,100"],
];

const NON_TOKYO: [string, string, string][] = [
  ["Ashiya", "Hyogo", "¥452,382"],
  ["Urayasu", "Chiba", "¥437,387"],
  ["Warabi", "Saitama", "¥425,789"],
  ["Nishinomiya", "Hyogo", "¥328,771"],
  ["Toda", "Saitama", "¥321,231"],
  ["Suita", "Osaka", "¥318,968"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Most expensive land
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Japan&apos;s Most Expensive Land
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published August 25, 2026</p>
      <p style={lead}>
        One square metre of residential land in Tokyo&apos;s Minato Ward — a
        patch about the size of a bath towel — trades for an average of{" "}
        <strong>¥4.47 million (about $29,800)</strong>. Rank every Japanese
        municipality by transaction prices and the top ten is a clean sweep:
        all of them are central Tokyo wards. This page shows the full top ten,
        and the very different ranking that appears once you leave the
        capital.
      </p>

      <section style={card}>
        <h2 style={h2}>The top 10: all Tokyo, all the time</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipality</th>
                <th style={thR}>Land price (¥/m²)</th>
                <th style={thR}>In dollars</th>
              </tr>
            </thead>
            <tbody>
              {TOP10.map(([n, y, d]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{n}</td>
                  <td style={tdR}>{y}</td>
                  <td style={tdR}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          These are averages across each ward&apos;s recorded residential
          transactions in the most recent year, not trophy listings — which
          makes Minato&apos;s figure more remarkable, not less. A modest
          60 m² plot at the ward average costs about ¥268 million (roughly
          $1.8 million), before anything is built on it.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Outside Tokyo, prices fall off a cliff</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipality</th>
                <th style={thR}>Land price (¥/m²)</th>
              </tr>
            </thead>
            <tbody>
              {NON_TOKYO.map(([n, p, y]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={para}>
          The most expensive land outside Tokyo is in Ashiya (Hyogo) —
          Japan&apos;s archetypal wealthy residential city, and #7 on our{" "}
          <Link prefetch={false} href="/en/richest-towns" style={link}>
            income ranking
          </Link>{" "}
          — at ¥452,382/m². That is one-tenth of Minato&apos;s average.
          Urayasu (Chiba), home to Tokyo Disney Resort, and Warabi (Saitama),
          Japan&apos;s smallest city by area and one of its densest, follow.
          Even Osaka, a metropolis of 2.8 million, only places Suita — a
          northern suburb — at ¥318,968.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          The pattern is the story: Japan has one truly global land market
          (central Tokyo), a thin layer of wealthy suburbs elsewhere, and then
          a very steep drop to the national median of about ¥16,875/m² — and
          beyond that, to the{" "}
          <Link prefetch={false} href="/en/cheapest-land" style={link}>
            ¥556/m² of the cheapest towns
          </Link>
          . The ratio between the most and least expensive municipalities is
          roughly 8,000 to 1.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Land prices track income — with one twist</h2>
        <p style={{ ...para, marginBottom: 0 }}>
          Compare this table with per-taxpayer income and the same names
          recur: Minato is #1 on both lists (¥18.1 million average taxable
          income per taxpayer), and Shibuya, Chiyoda and Chuo sit in both top
          fives. Expensive land is, mostly, where high earners bid against
          each other. The twist is Warabi: a working-class, highly diverse
          commuter city whose land is expensive purely because it is 17
          minutes from Ikebukuro and almost entirely built up. Scarcity, not
          wealth, does the work there — a reminder that &quot;expensive&quot;
          and &quot;rich&quot; are cousins, not twins. Our{" "}
          <Link prefetch={false} href="/en/tokyo-wards" style={link}>
            ward-by-ward comparison of Tokyo
          </Link>{" "}
          puts income, density and land side by side.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Land prices are average residential transaction prices per m² from
          the Ministry of Land, Infrastructure, Transport and Tourism&apos;s
          Real Estate Information Library (most recent year). Municipalities
          are ranked as independent local governments; designated cities are
          represented at ward level in the source transactions, so their wards
          do not appear as single cities here. Dollar figures use ¥150 = $1,
          rounded. The full dataset, in Japanese, is behind the{" "}
          <Link prefetch={false} href="/ranking/real-estate-price" style={link}>
            land-price ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/cheapest-land" style={link}>
            The cheapest land in Japan
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/richest-towns" style={link}>
            Japan&apos;s richest municipalities
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/tokyo-wards" style={link}>
            Tokyo&apos;s 23 wards, compared
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/akiya" style={link}>
            Akiya: where the empty houses really are
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
