import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/island-villages";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Life on Japan's Island Villages, in Data: From 45,000 People to 168 | Japan Municipal Data",
  description:
    "Japan's island municipalities range from Sado City (45,378 people, 44% elderly) to Aogashima Village — 168 people living inside a volcano caldera, the smallest municipality in Japan. Census data on ageing, density and empty houses across the islands.",
  openGraph: {
    title: "Life on Japan's Island Villages, in Data",
    description:
      "168 people inside a volcano; an island village where only 14.6% are elderly. The data behind Japan's island municipalities.",
    images: ["/images/og-default.png"],
  },
};

const ISLANDS: [string, string, string, string, string][] = [
  ["Sado City", "Niigata", "45,378", "44.4%", "60"],
  ["Amami City", "Kagoshima", "38,380", "35.5%", "134"],
  ["Goto City", "Nagasaki", "31,441", "44.0%", "82"],
  ["Tsushima City", "Nagasaki", "25,310", "42.4%", "40"],
  ["Iki City", "Nagasaki", "22,306", "41.0%", "179"],
  ["Shinkamigoto", "Nagasaki", "15,518", "47.3%", "82"],
  ["Yakushima", "Kagoshima", "10,693", "38.8%", "22"],
  ["Hachijo Town", "Tokyo", "6,466", "38.5%", "97"],
  ["Taketomi", "Okinawa", "3,952", "24.9%", "12"],
  ["Naoshima", "Kagawa", "2,931", "31.4%", "218"],
  ["Ogasawara Village", "Tokyo", "2,711", "14.6%", "26"],
  ["Ama Town", "Shimane", "2,347", "35.8%", "68"],
  ["Ojika Town", "Nagasaki", "2,016", "53.2%", "90"],
  ["Toshima Village", "Kagoshima", "641", "29.3%", "7"],
  ["Aogashima Village", "Tokyo", "168", "22.6%", "28"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Island villages
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Life on Japan&apos;s Island Villages, in Data
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published August 4, 2026</p>
      <p style={lead}>
        Japan is an archipelago of some 14,000 islands, and hundreds of its
        municipalities are island governments. They span an extraordinary
        range: Sado, a small city of 45,378 off the Niigata coast — and, 358
        km south of Tokyo, a village of <strong>168 people living inside the
        caldera of an active volcano</strong>. The census lets us compare
        them all on the same terms.
      </p>

      <section style={card}>
        <h2 style={h2}>Island municipalities at a glance (2025 census)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipality</th>
                <th style={thR}>Population</th>
                <th style={thR}>Aged 65+</th>
                <th style={thR}>People / km²</th>
              </tr>
            </thead>
            <tbody>
              {ISLANDS.map(([n, p, pop, a, d]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{pop}</td>
                  <td style={tdR}>{a}</td>
                  <td style={tdR}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          The big Sea-of-Japan and East-China-Sea islands — Sado, Goto,
          Tsushima, Shinkamigoto — are old: 41–47% elderly, with vacancy
          rates of 22–32% in the housing data. Ojika Town (Nagasaki), at
          53.2% elderly, is majority-old. This is the standard island pattern:
          the ferry takes the young to the mainland for high school, and many
          never come back.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>The exceptions — and what causes them</h2>
        <p style={para}>
          <strong>Aogashima Village</strong> (Tokyo) is Japan&apos;s smallest
          municipality: 168 residents on a volcanic island whose village sits
          inside a double caldera, reachable by a weekly-ish boat or a
          helicopter from Hachijojima. At 22.6% elderly it is younger than
          mainland Japan — a tiny community of officials, teachers, farmers
          and returnees, where a handful of families swings the statistics.
        </p>
        <p style={para}>
          <strong>Ogasawara Village</strong> is the extreme: 2,711 people on
          islands 1,000 km south of Tokyo, and an elderly share of just
          14.6% — half the national figure and the youngest profile of any
          island municipality. The population is buoyed by researchers,
          Self-Defense Forces and coast guard families, and tourism staff on
          rotation. <strong>Taketomi</strong> (Okinawa, 24.9% elderly) stays
          young on resort tourism across its nine inhabited islands, and{" "}
          <strong>Toshima Village</strong> (Kagoshima) — 641 people scattered
          across seven islands, at 7 people per km² — is one of the two
          villages in our{" "}
          <Link prefetch={false} href="/en/youngest-towns" style={link}>
            youngest towns
          </Link>{" "}
          ranking, thanks to its island school programme. Naoshima (Kagawa),
          the art island, pairs a moderate 31.4% elderly share with the
          strongest public finances on this list.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          The pattern generalises: islands age by default, and stay young
          only where a specific engine — a research station, a resort, a
          school programme, an art triennale — imports working-age people.
          Geography sets the baseline; policy and industry write the
          exceptions.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Visiting with the data in mind</h2>
        <p style={{ ...para, marginBottom: 0 }}>
          Sado&apos;s 28.0% housing vacancy and Shinkamigoto&apos;s 31.6%
          mean these islands also appear, indirectly, in our{" "}
          <Link prefetch={false} href="/en/akiya" style={link}>
            akiya guide
          </Link>{" "}
          — empty houses on islands are plentiful but come with ferry
          timetables, typhoon seasons and mainland hospital runs attached.
          For pure travel, our{" "}
          <Link prefetch={false} href="/en/hidden-gems" style={link}>
            hidden-gem towns
          </Link>{" "}
          guide covers the preserved-streetscape end of rural Japan. Either
          way, the numbers above are the honest backdrop: island Japan is
          beautiful, ageing, and — in a few specific places — quietly
          reinventing itself.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Population and age shares are from the 2025 national census;
          density and vacancy figures from the 2020 census and housing
          statistics, as compiled in our municipal database. Island
          municipalities are those whose territory consists of offshore
          islands (selected list). The full dataset, in Japanese, is behind
          the{" "}
          <Link prefetch={false} href="/ranking/population" style={link}>
            population ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/youngest-towns" style={link}>
            Japan&apos;s youngest towns
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/oldest-towns" style={link}>
            Japan&apos;s oldest towns
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/emptiest-places" style={link}>
            Japan&apos;s emptiest places
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/hidden-gems" style={link}>
            3 towns the crowds haven&apos;t found yet
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
