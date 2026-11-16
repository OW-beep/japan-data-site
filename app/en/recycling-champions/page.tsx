import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/recycling-champions";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Japan's Recycling Champions: Towns Reporting 99% Recycling Rates | Japan Municipal Data",
  description:
    "The median Japanese municipality recycles 17.5% of its waste — but Hidaka City reports 99.7% and Osaki Town's 27-category sorting system is studied worldwide. The reported recycling-rate ranking for 1,717 municipalities, with an honest note on what the numbers count.",
  openGraph: {
    title: "Japan's Recycling Champions",
    description:
      "99.7% reported recycling in Hidaka City; 27 sorting categories in Osaki Town. Japan's waste champions, ranked — with the caveats.",
    images: ["/images/og-default.png"],
  },
};

const TOP: [string, string, string, string][] = [
  ["Hidaka", "Saitama", "99.7%", "54,571"],
  ["Nakatoso", "Kochi", "99.6%", "6,002"],
  ["Mine", "Yamaguchi", "97.2%", "23,247"],
  ["Miyawaka", "Fukuoka", "94.7%", "26,298"],
  ["Kurate", "Fukuoka", "94.3%", "15,080"],
  ["Rusutsu", "Hokkaido", "88.1%", "1,911"],
  ["Tokigawa", "Saitama", "86.3%", "10,540"],
  ["Kimobetsu", "Hokkaido", "86.3%", "2,156"],
  ["Ranzan", "Saitama", "86.2%", "17,889"],
  ["Ogawa", "Saitama", "85.7%", "28,524"],
  ["Osaki", "Kagoshima", "83.0%", "12,385"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Recycling champions
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Japan&apos;s Recycling Champions
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published August 11, 2026</p>
      <p style={lead}>
        Japan&apos;s meticulous kerbside sorting is famous, but the results
        vary enormously by town. The median municipality reports a recycling
        rate of just <strong>17.5%</strong>. The champions report numbers
        that look impossible — 99.7% — and one small town in Kagoshima has
        become a pilgrimage site for waste officials from around the world.
        Here is the ranking, plus an honest note on what these percentages
        actually count.
      </p>

      <section style={card}>
        <h2 style={h2}>Highest reported recycling rates</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Town</th>
                <th style={thR}>Recycling rate</th>
                <th style={thR}>Population</th>
              </tr>
            </thead>
            <tbody>
              {TOP.map(([n, p, r, pop]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{r}</td>
                  <td style={tdR}>{pop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Two clusters stand out. Saitama — Tokyo&apos;s northern neighbour —
          places four towns in the top 11, reflecting strict prefecture-wide
          sorting culture and dense group-collection networks. And small
          towns dominate generally: of the leaders, only Hidaka and Miyawaka
          exceed 25,000 residents. Small systems can collect, sort and account
          for waste streams that a metropolis cannot track as tightly.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Osaki Town: the 27-category system</h2>
        <p style={para}>
          Osaki Town (Kagoshima, 83.0%) is the name the waste world knows.
          Faced with a filling landfill in the late 1990s, the town built a
          system in which residents sort household waste into around 27
          categories; food scraps are composted with pruned branches into
          soil sold back to farmers, and the residual landfill stream shrank
          to a fraction of its former size. The &quot;Osaki system&quot; has
          been studied and adapted abroad, including in Indonesia. Its rate
          here is not even the highest on the list — a reminder that the
          percentage alone doesn&apos;t capture how a system is built.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          A methodological honesty note: these are rates as reported in the
          national municipal statistics, and municipalities differ in what
          they count — group collections by neighbourhood associations,
          composting, and in some definitions thermal recovery can be treated
          differently. Read the table as &quot;reported performance under
          local rules&quot;, not as a perfectly uniform laboratory measure.
          Even with that caveat, the gap between 17.5% (median) and 80%+
          (leaders) is far too large to be bookkeeping: the leaders really
          do divert the overwhelming majority of their waste stream.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Recycling rates are as reported in the Ministry of the
          Environment&apos;s municipal waste statistics, compiled for 1,717
          municipalities in our database; the median is computed across the
          same set. The full dataset, in Japanese, is behind the{" "}
          <Link prefetch={false} href="/ranking/recycling-rate" style={link}>
            recycling-rate ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/safest-towns" style={link}>
            Where is Japan safest?
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/akiya" style={link}>
            The truth about Japan&apos;s empty houses
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/hidden-gems" style={link}>
            3 towns the crowds haven&apos;t found yet
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/fiscal-health" style={link}>
            Fiscal strength: the towns that fund themselves
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
