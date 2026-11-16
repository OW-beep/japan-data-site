import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/future-2050";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Japan in 2050: The Projection Map — Towns That Halve, Wards That Grow | Japan Municipal Data",
  description:
    "Official projections say 338 of Japan's municipalities will lose more than half their population by 2050, while only 77 grow. Nanmoku Village falls to a quarter of its size; Tokyo's Chuo Ward grows 25%. The extremes of the 2050 map, from IPSS data.",
  openGraph: {
    title: "Japan in 2050: The Projection Map",
    description:
      "338 towns projected to more than halve by 2050; 77 projected to grow. The two ends of Japan's official future map.",
    images: ["/images/og-default.png"],
  },
};

const LOWEST: [string, string, string, string, string][] = [
  ["Nanmoku", "Gunma", "1,611", "406", "25.2"],
  ["Kuma", "Kumamoto", "2,433", "650", "26.7"],
  ["Nosegawa", "Nara", "357", "98", "27.5"],
  ["Utashinai", "Hokkaido", "2,989", "838", "28.0"],
  ["Mitsue", "Nara", "3,192", "909", "28.5"],
  ["Soni", "Nara", "1,528", "446", "29.2"],
  ["Yubari", "Hokkaido", "7,334", "2,154", "29.4"],
  ["Higashiyoshino", "Nara", "1,502", "442", "29.4"],
  ["Imabetsu", "Aomori", "2,374", "703", "29.6"],
];

const HIGHEST: [string, string, string, string, string][] = [
  ["Chuo Ward", "Tokyo", "169,179", "210,897", "124.7"],
  ["Nagareyama", "Chiba", "199,849", "241,539", "120.9"],
  ["Minato Ward", "Tokyo", "260,486", "312,556", "120.0"],
  ["Chiyoda Ward", "Tokyo", "66,680", "79,828", "119.7"],
  ["Nakagusuku", "Okinawa", "22,131", "26,076", "117.8"],
  ["Inzai", "Chiba", "92,769", "108,333", "116.8"],
  ["Taito Ward", "Tokyo", "198,999", "230,216", "115.7"],
  ["Tsukubamirai", "Ibaraki", "49,010", "55,384", "113.0"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Japan in 2050
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Japan in 2050: The Projection Map
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published November 10, 2026</p>
      <p style={lead}>
        Japan&apos;s National Institute of Population and Social Security
        Research projects every municipality&apos;s population to 2050. The
        national picture is decline — but the local picture is polarisation.{" "}
        <strong>338 of 1,728 municipalities are projected to lose more than
        half their people by 2050; only 77 are projected to grow.</strong>{" "}
        These are the two ends of the map.
      </p>

      <section style={card}>
        <h2 style={h2}>Projected to shrink the most (2050 population as % of 2020)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Town</th>
                <th style={thR}>2020</th>
                <th style={thR}>2050</th>
                <th style={thR}>Index</th>
              </tr>
            </thead>
            <tbody>
              {LOWEST.map(([n, p, a, b, i]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{a}</td>
                  <td style={tdR}>{b}</td>
                  <td style={tdR}>{i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Nanmoku Village (Gunma) — already Japan&apos;s{" "}
          <Link prefetch={false} href="/en/oldest-towns" style={link}>
            oldest municipality
          </Link>{" "}
          at 68.9% elderly — is projected to fall from 1,611 people to 406,
          with 72% of the remainder aged 65 or over. Nara&apos;s mountain
          villages fill much of the list. Yubari (Hokkaido), the former coal
          city under fiscal reconstruction, falls below 30% of its 2020 size
          even from its already-shrunken base. The most extreme age profile
          in the projections belongs to Kasagi Town (Kyoto): by 2050, 76.3%
          of its residents are projected to be elderly.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Projected to grow</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipality</th>
                <th style={thR}>2020</th>
                <th style={thR}>2050</th>
                <th style={thR}>Index</th>
              </tr>
            </thead>
            <tbody>
              {HIGHEST.map(([n, p, a, b, i]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{a}</td>
                  <td style={tdR}>{b}</td>
                  <td style={tdR}>{i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Growth concentrates in three places: central Tokyo&apos;s tower
          districts (Chuo, Minato, Chiyoda, Taito), the Chiba–Ibaraki commuter
          frontier (Nagareyama, Inzai, Tsukubamirai), and Okinawa
          (Nakagusuku). Every one of them is already on our{" "}
          <Link prefetch={false} href="/en/growing-towns" style={link}>
            growing towns
          </Link>{" "}
          list for 2020–2025 — momentum, in these projections, is mostly the
          present extrapolated.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Projections are scenarios, not fate</h2>
        <p style={{ ...para, marginBottom: 0 }}>
          Two honest caveats. First, these projections (published 2023) assume
          fertility, mortality and migration patterns continue — they are the
          future if nothing changes, published precisely so that towns can
          change it. Second, reality has already diverged in places: the 2025
          census showed some projected shrinkers stabilising and some growers
          cooling, which is why we publish the projections alongside the{" "}
          <Link prefetch={false} href="/en/shrinking-towns" style={link}>
            actual 2020→2025 changes
          </Link>
          . The 13 municipalities of Fukushima&apos;s Hamadori coast have no
          individual projections at all — a blank on the map that is itself
          information about how uncertain recovery makes forecasting. Treat
          the index as a planning baseline: the towns at the bottom of this
          table are not doomed, but they are the places where doing nothing
          has a printed price.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Projections are the National Institute of Population and Social
          Security Research&apos;s 2023 regional population projections
          (base: 2020 census), index = projected 2050 population ÷ 2020
          population × 100, computed for the 1,728 municipalities with
          published estimates. The full dataset, in Japanese, appears in the
          future-population section of each municipality&apos;s page on this
          site, reachable from the{" "}
          <Link prefetch={false} href="/ranking/population" style={link}>
            population ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/oldest-towns" style={link}>
            Japan&apos;s oldest towns
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/shrinking-towns" style={link}>
            The fastest-shrinking towns in Japan
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/growing-towns" style={link}>
            Japan is shrinking — but these towns are growing
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/youngest-towns" style={link}>
            Where Japan&apos;s children are
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
