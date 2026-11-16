import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/emptiest-places";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Japan's Emptiest Places: Villages With One Person per Square Kilometre | Japan Municipal Data",
  description:
    "Hinoemata Village has 504 people spread over 390 km² — 1.3 people per km², against 23,182 in Tokyo's Toshima Ward. The least densely populated municipalities in Japan, why they are so empty, and what fills the space instead.",
  openGraph: {
    title: "Japan's Emptiest Places",
    description:
      "1.3 people per square kilometre. Japan's least dense municipalities are mountain and snow-country villages larger than cities.",
    images: ["/images/og-default.png"],
  },
};

const EMPTIEST: [string, string, string, string, string][] = [
  ["Hinoemata", "Fukushima", "504", "390 km²", "1.3"],
  ["Kamikitayama", "Nara", "444", "274 km²", "1.6"],
  ["Horokanai", "Hokkaido", "1,370", "767 km²", "1.8"],
  ["Shimukappu", "Hokkaido", "1,306", "571 km²", "2.3"],
  ["Otaki", "Nagano", "715", "311 km²", "2.3"],
  ["Nosegawa", "Nara", "357", "155 km²", "2.3"],
  ["Otoineppu", "Hokkaido", "706", "276 km²", "2.6"],
  ["Nakagawa", "Hokkaido", "1,528", "595 km²", "2.6"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Emptiest places
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Japan&apos;s Emptiest Places
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published July 21, 2026</p>
      <p style={lead}>
        Japan&apos;s crowded image — packed trains, dense wards — is real but
        regional. Toshima Ward in Tokyo packs 23,182 people into each square
        kilometre. At the other end of the same country are municipalities
        where the density rounds to <strong>one person per square
        kilometre</strong>, and the average resident&apos;s nearest neighbour
        is a forest away. These are the emptiest local governments in Japan.
      </p>

      <section style={card}>
        <h2 style={h2}>The least densely populated municipalities in Japan</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Town</th>
                <th style={thR}>Population</th>
                <th style={thR}>Area</th>
                <th style={thR}>People / km²</th>
              </tr>
            </thead>
            <tbody>
              {EMPTIEST.map(([n, p, pop, a, d]) => (
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
          Hinoemata Village (Fukushima) is the emptiest municipality in
          Japan: 504 people in 390 km² of mountain terrain — an area larger
          than all 23 Tokyo wards&apos; eastern half, holding fewer people
          than a single city apartment block. Horokanai (Hokkaido) is the
          giant of the list: 767 km², bigger than Tokyo&apos;s 23 wards
          combined, with 1,370 residents.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Why so empty? Mountains, snow — and the map itself</h2>
        <p style={para}>
          Two of the causes are physical. Most of these municipalities are
          90%+ forest and mountain: Hinoemata is the gateway to the Oze
          highland marshes, Otaki sits under Mt Ontake, and the Hokkaido
          entries add some of the heaviest snowfall on earth (Horokanai is
          famous in Japan for soba buckwheat grown in that snow country, and
          for record low temperatures). The third cause is administrative:
          the great Heisei-era municipal mergers stitched whole valleys into
          single towns, so the &quot;town&quot; on this list is often a
          dozen scattered hamlets sharing one office. The emptiness is real,
          but it is spread across a map drawn generously.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          Cross-referencing our{" "}
          <Link prefetch={false} href="/en/highest-towns" style={link}>
            highest towns
          </Link>{" "}
          ranking shows the same names from the other direction — Hinoemata
          also averages 1,372 m of elevation. Altitude and emptiness are two
          measurements of the same terrain. And emptiness predicts the
          future: most of this list is also on the{" "}
          <Link prefetch={false} href="/en/shrinking-towns" style={link}>
            fastest-shrinking
          </Link>{" "}
          table, because a village of 500 has no demographic margin at all.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>What fills the space</h2>
        <p style={{ ...para, marginBottom: 0 }}>
          Not nothing. These municipalities administer national-park
          trailheads, headwater forests that supply city water, ski fields,
          hydroelectric catchments and some of Japan&apos;s last old-growth
          beech forest. Their mayors govern territories the size of small
          countries with staffs of a few dozen. For visitors, they are the
          trailheads and onsen hamlets at the end of the bus line; for Japan,
          they are the watershed. If you go, go as Hinoemata&apos;s 504
          residents would want: the village runs much of the Oze gateway
          infrastructure, and staying in its inns is the local economy.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Density is census population divided by municipal area (2020
          national census and official area figures), for all 1,740
          municipalities. The full dataset, in Japanese, is behind the{" "}
          <Link prefetch={false} href="/ranking/density" style={link}>
            population-density ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/highest-towns" style={link}>
            Japan&apos;s highest towns
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/shrinking-towns" style={link}>
            The fastest-shrinking towns in Japan
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/safest-towns" style={link}>
            Where is Japan safest?
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/island-villages" style={link}>
            Life on Japan&apos;s island villages
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
