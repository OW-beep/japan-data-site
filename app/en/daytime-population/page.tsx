import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/daytime-population";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Daytime Population: The Ward That Multiplies by 13.5 Every Morning | Japan Municipal Data",
  description:
    "Chiyoda Ward sleeps 66,680 people and hosts 903,780 by day — a daytime population ratio of 1,355%. Japan's census counts both populations; here are the extremes, from nuclear-recovery towns at 589% to bedroom towns that empty to 67%.",
  openGraph: {
    title: "Daytime Population Extremes in Japan",
    description:
      "1,355%: Chiyoda Ward's population multiplies 13.5-fold every working day. The census extremes at both ends.",
    images: ["/images/og-default.png"],
  },
};

const TOP: [string, string, string, string, string][] = [
  ["Chiyoda Ward", "Tokyo", "66,680", "903,780", "1,355%"],
  ["Okuma", "Fukushima", "847", "4,985", "589%"],
  ["Chuo Ward", "Tokyo", "169,179", "633,390", "374%"],
  ["Minato Ward", "Tokyo", "260,486", "972,673", "373%"],
  ["Tobishima", "Aichi", "4,575", "12,923", "282%"],
  ["Shinjuku Ward", "Tokyo", "349,385", "793,802", "227%"],
  ["Shibuya Ward", "Tokyo", "243,883", "550,861", "226%"],
  ["Haga", "Tochigi", "14,961", "30,033", "201%"],
];

const BOTTOM: [string, string, string][] = [
  ["Shichigahama", "Miyagi", "67%"],
  ["Funahashi", "Toyama", "71%"],
  ["Nakayama", "Yamagata", "73%"],
  ["Komae", "Tokyo", "74%"],
  ["Yamabe", "Yamagata", "74%"],
  ["Fujimi", "Saitama", "75%"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Daytime population
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        The Ward That Multiplies by 13.5 Every Morning
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published October 20, 2026</p>
      <p style={lead}>
        Japan&apos;s census counts every municipality twice: the people who
        sleep there (nighttime population) and the people who are there on a
        weekday (daytime population, including workers and students). The
        ratio between the two produces the most extreme statistic in Japanese
        local data — a ward whose population grows <strong>13.5-fold</strong>{" "}
        between midnight and noon.
      </p>

      <section style={card}>
        <h2 style={h2}>Highest daytime-to-nighttime ratios (2020 census)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipality</th>
                <th style={thR}>Night</th>
                <th style={thR}>Day</th>
                <th style={thR}>Ratio</th>
              </tr>
            </thead>
            <tbody>
              {TOP.map(([n, p, ni, d, r]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{ni}</td>
                  <td style={tdR}>{d}</td>
                  <td style={tdR}>{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={para}>
          Chiyoda Ward — the Imperial Palace, the Diet, Kasumigaseki&apos;s
          ministries and the Marunouchi/Otemachi business district — sleeps
          66,680 and hosts 903,780 by day. Nearly a million people use its
          water, roads and emergency services; 7% of them pay its residence
          tax.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          Second place is not a city at all: Okuma Town (Fukushima), the
          evacuated town that hosts the Fukushima Daiichi plant, has 847
          registered residents and 4,985 daytime people — decommissioning and
          recovery workers bussed into a town still rebuilding its resident
          life. Tobishima Village (282%) shows the same effect from a port:
          4,575 residents, 12,923 daytime workers — the flip side of its #1
          ranking in our{" "}
          <Link prefetch={false} href="/en/fiscal-health" style={link}>
            fiscal strength
          </Link>{" "}
          table. Haga Town (Tochigi, 201%) is a factory town built around a
          major Honda plant and supplier parks.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>And the towns that empty out</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipality</th>
                <th style={thR}>Daytime ratio</th>
              </tr>
            </thead>
            <tbody>
              {BOTTOM.map(([n, p, r]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          At the bottom sit the bedroom communities: Shichigahama (Miyagi)
          keeps only 67% of its population during the day, and Komae — a
          dense residential city inside Tokyo itself — drops to 74% as its
          residents pour into the centre. The policy tension writes itself:
          daytime cities provide services for people who fund other
          municipalities, while bedroom towns fund schools and care for
          people who spend their working day elsewhere. Japan&apos;s
          hometown-tax system,{" "}
          <Link prefetch={false} href="/en/furusato-hometown-tax" style={link}>
            furusato nozei
          </Link>
          , is one long argument about exactly this imbalance.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Daytime and nighttime populations are from the 2020 national census
          (Statistics Bureau of Japan), which tracks commuters and students
          between municipalities; ratios are daytime ÷ nighttime × 100. The
          full dataset, in Japanese, is behind the{" "}
          <Link prefetch={false} href="/ranking/daytime-ratio" style={link}>
            daytime-ratio ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/tokyo-wards" style={link}>
            Tokyo&apos;s 23 wards, compared
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/company-towns" style={link}>
            Where Japan&apos;s new companies are born
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/fiscal-health" style={link}>
            Fiscal strength: the towns that fund themselves
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
