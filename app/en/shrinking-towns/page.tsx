import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/shrinking-towns";

export const metadata = {
  alternates: { canonical: PATH },
  title: "The Fastest-Shrinking Towns in Japan: What the 2025 Census Revealed | Japan Municipal Data",
  description:
    "Between the 2020 and 2025 censuses, 1,571 of Japan's 1,740 municipalities lost population and the median town shrank 7%. The fastest decliners — Suzu, Wajima, Yubari — and the big cities quietly losing tens of thousands, ranked from census data.",
  openGraph: {
    title: "The Fastest-Shrinking Towns in Japan",
    description:
      "Suzu lost a third of its people in five years. The 2025 census decline table, from fastest-shrinking villages to big cities losing 30,000+ residents.",
    images: ["/images/og-default.png"],
  },
};

const FASTEST: [string, string, string, string, string][] = [
  ["Suzu", "Ishikawa", "12,929", "8,459", "−34.6%"],
  ["Tonaki", "Okinawa", "346", "233", "−32.7%"],
  ["Wajima", "Ishikawa", "24,608", "17,649", "−28.3%"],
  ["Yubari", "Hokkaido", "7,334", "5,610", "−23.5%"],
  ["Nanmoku", "Gunma", "1,611", "1,260", "−21.8%"],
  ["Kanna", "Gunma", "1,645", "1,317", "−19.9%"],
  ["Nakagawa", "Hokkaido", "1,528", "1,230", "−19.5%"],
  ["Kaminoseki", "Yamaguchi", "2,342", "1,889", "−19.3%"],
  ["Imabetsu", "Aomori", "2,334", "1,888", "−19.1%"],
  ["Noto", "Ishikawa", "15,687", "12,719", "−18.9%"],
];

const BIGGEST_LOSSES: [string, string, string][] = [
  ["Kitakyushu", "Fukuoka", "−35,437"],
  ["Shizuoka", "Shizuoka", "−34,608"],
  ["Kyoto", "Kyoto", "−33,661"],
  ["Kobe", "Hyogo", "−30,155"],
  ["Niigata", "Niigata", "−30,136"],
  ["Hiroshima", "Hiroshima", "−28,839"],
  ["Iwaki", "Fukushima", "−26,766"],
  ["Nagasaki", "Nagasaki", "−26,725"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Shrinking towns
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        The Fastest-Shrinking Towns in Japan
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published November 12, 2026</p>
      <p style={lead}>
        Japan&apos;s 2025 census confirmed the direction of travel: of the
        country&apos;s 1,740 municipalities, <strong>1,571 lost population in
        five years and only 169 grew</strong>. The median municipality shrank
        by 7.0%, and 495 towns lost more than a tenth of their people. This is
        the other end of the league table from our guide to the{" "}
        <Link prefetch={false} href="/en/growing-towns" style={link}>
          towns that are still growing
        </Link>{" "}
        — the places where decline is fastest, and what is driving it.
      </p>

      <section style={card}>
        <h2 style={h2}>The fastest declines, 2020 → 2025</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Town</th>
                <th style={thR}>2020</th>
                <th style={thR}>2025</th>
                <th style={thR}>Change</th>
              </tr>
            </thead>
            <tbody>
              {FASTEST.map(([n, p, a, b, ch]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{a}</td>
                  <td style={tdR}>{b}</td>
                  <td style={tdR}>{ch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={para}>
          Three of the top ten are on the Noto Peninsula in Ishikawa. Suzu,
          Wajima and Noto Town were still ageing farming and fishing
          communities when the January 2024 Noto Peninsula earthquake destroyed
          housing and infrastructure; the census captured the displacement that
          followed, with Suzu losing more than a third of its residents in five
          years. Disaster did not create their decline — it compressed twenty
          years of it into two.
        </p>
        <p style={para}>
          Yubari (Hokkaido) is the long-running case study. A coal city that
          once held 120,000 people, it became Japan&apos;s most famous
          municipal bankruptcy in 2007. Two decades on it is still shrinking
          faster than almost anywhere — down another 23.5% to 5,610 residents.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>The big cities are shrinking too — just quietly</h2>
        <p style={para}>
          Ranked by the number of people lost rather than the percentage, the
          table fills with famous cities:
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>City</th>
                <th style={thR}>Residents lost, 2020→25</th>
              </tr>
            </thead>
            <tbody>
              {BIGGEST_LOSSES.map(([n, p, v]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Kyoto lost 33,661 residents in five years — the population of a small
          city — even as its streets filled with tourists. The mechanism is
          different from the villages: not abandonment, but ageing, small
          households and young families priced out to the suburbs.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Decline and ageing feed each other</h2>
        <p style={para}>
          Cross-reference this table with our ranking of Japan&apos;s{" "}
          <Link prefetch={false} href="/en/oldest-towns" style={link}>
            oldest towns
          </Link>{" "}
          and the same names recur. Nanmoku (Gunma), the fastest-shrinking
          village on this list after the disaster towns, is also the oldest
          municipality in Japan: 68.9% of its 1,260 residents are over 65, and
          children under 15 are 2.3% — roughly 29 children in the whole
          village. Each year deaths outnumber births by a wide margin, schools
          consolidate, the bus thins out, and the remaining young families have
          one more reason to leave. Demographers call this the shrinking
          spiral, and the census shows it operating in hundreds of towns at
          once: 111 municipalities are already majority-elderly.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          The official projections in our{" "}
          <Link prefetch={false} href="/en/future-2050" style={link}>
            Japan in 2050
          </Link>{" "}
          guide extend the same curves forward. The towns on this page are
          where those projections bite first.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Population change is computed from the 2020 and 2025 national
          censuses (Statistics Bureau of Japan) for all 1,740 municipalities in
          our database (designated-city wards are counted within their cities;
          Tokyo&apos;s special wards individually). The full dataset, in
          Japanese, is behind the{" "}
          <Link prefetch={false} href="/ranking/decrease" style={link}>
            population-decrease ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/growing-towns" style={link}>
            Japan is shrinking — but these towns are growing
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/oldest-towns" style={link}>
            Japan&apos;s oldest towns
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/future-2050" style={link}>
            Japan in 2050: the projection map
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/emptiest-places" style={link}>
            Japan&apos;s emptiest places
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
