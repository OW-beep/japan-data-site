import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/highest-towns";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Japan's Highest Towns: Living at 1,600 Metres | Japan Municipal Data",
  description:
    "Kawakami Village averages 1,615 m of elevation — every part of it is highland. The municipalities with the highest average elevation in Japan, computed from the national 1 km mesh elevation dataset, plus the towns that contain Mt Fuji's summit.",
  openGraph: {
    title: "Japan's Highest Towns by Elevation",
    description:
      "A whole village above 1,600 m. Japan's highest municipalities by average elevation — and the city of 56,000 people at 1,400 m.",
    images: ["/images/og-default.png"],
  },
};

const HIGHEST: [string, string, string, string, string][] = [
  ["Kawakami", "Nagano", "1,615 m", "2,567 m", "4,344"],
  ["Oshika", "Nagano", "1,526 m", "3,120 m", "1,023"],
  ["Miyada", "Nagano", "1,523 m", "2,954 m", "8,569"],
  ["Narusawa", "Yamanashi", "1,494 m", "3,549 m", "2,824"],
  ["Minamimaki", "Nagano", "1,470 m", "2,771 m", "1,611"],
  ["Katashina", "Gunma", "1,455 m", "2,558 m", "3,993"],
  ["Otaki", "Nagano", "1,454 m", "2,981 m", "715"],
  ["Kiso", "Nagano", "1,408 m", "2,371 m", "2,692"],
  ["Omachi", "Nagano", "1,407 m", "3,181 m", "26,029"],
  ["Chino", "Nagano", "1,402 m", "2,825 m", "56,400"],
  ["Hinoemata", "Fukushima", "1,372 m", "2,353 m", "504"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Highest towns
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Japan&apos;s Highest Towns
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published July 28, 2026</p>
      <p style={lead}>
        Two-thirds of Japan is mountainous, but most Japanese live near the
        sea. A few municipalities, though, sit entirely in the high country:
        in Kawakami Village (Nagano), the <em>average</em> elevation is{" "}
        <strong>1,615 metres</strong> — every field, school and road in the
        village is higher than most European ski resorts&apos; mid-stations.
        We computed average elevations for all 1,910 municipalities from the
        national elevation mesh dataset. Here is the top of Japan.
      </p>

      <section style={card}>
        <h2 style={h2}>Highest municipalities by average elevation</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Town</th>
                <th style={thR}>Average elevation</th>
                <th style={thR}>Highest point</th>
                <th style={thR}>Population</th>
              </tr>
            </thead>
            <tbody>
              {HIGHEST.map(([n, p, avg, hi, pop]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{avg}</td>
                  <td style={tdR}>{hi}</td>
                  <td style={tdR}>{pop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          In every municipality on this list, 100% of the land lies at meshes
          averaging 500 m or more. Nagano Prefecture — Japan&apos;s roof,
          holding the Northern, Central and Southern Alps — takes eight of
          the top ten places. And altitude is not only a village phenomenon:
          Chino City (Nagano) is a functioning city of 56,400 people at an
          average of 1,402 m, and Omachi (26,029 people) averages 1,407 m at
          the foot of the Tateyama-Kurobe Alpine Route.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>What altitude does to a town</h2>
        <p style={para}>
          Kawakami turns height into income: its cool highland climate makes
          it one of Japan&apos;s top lettuce producers, with farm output of
          ¥4.58 million per resident (see our{" "}
          <Link prefetch={false} href="/en/farming-towns" style={link}>
            farming powerhouses
          </Link>
          ). Narusawa Village spreads across the northern foothills of Mt
          Fuji — its highest mesh reaches 3,549 m, on the mountain&apos;s
          slopes.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          But the correlation runs the other way for population. Cross this
          table with our{" "}
          <Link prefetch={false} href="/en/emptiest-places" style={link}>
            emptiest places
          </Link>{" "}
          ranking and the same names recur — Hinoemata (average 1,372 m,
          density 1.3 people/km²), Otaki (1,454 m, 2.3/km²). Steep, high land
          grows lettuce, timber and scenery; it does not grow suburbs. The
          highest towns are, almost without exception, also among the
          emptiest and oldest — altitude is one of the deep variables behind
          Japan&apos;s whole demographic map.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>And the highest point of all?</h2>
        <p style={{ ...para, marginBottom: 0 }}>
          Ranked by highest point instead of average, the list belongs to Mt
          Fuji&apos;s neighbours: Oyama Town (Shizuoka) contains a mesh
          reaching 3,774 m — the summit area itself — followed by Fujiyoshida
          (Yamanashi, 3,754 m) and Fujinomiya (Shizuoka, 3,654 m). Matsumoto
          (Nagano, 3,192 m) reaches the summit ridge of Mt Yarigatake. Japan
          keeps its highest ground in municipal hands: even the top of Fuji
          belongs, administratively, to a town.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Elevations are our own aggregation of the Ministry of Land,
          Infrastructure, Transport and Tourism&apos;s National Land
          Numerical Information elevation/slope 3rd-order mesh dataset (1 km
          meshes, based on 10 m DEM data): each mesh is assigned to the
          municipality containing its centre point, and averages are computed
          across all meshes in the municipality. Figures describe terrain,
          not the elevation of the town centre. The full dataset, in
          Japanese, appears on each municipality&apos;s page on this site —
          for example{" "}
          <Link prefetch={false} href="/ranking/population" style={link}>
            the population ranking
          </Link>{" "}
          leads to all 1,740 municipality pages.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/emptiest-places" style={link}>
            Japan&apos;s emptiest places
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/farming-towns" style={link}>
            Japan&apos;s farming powerhouses
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/oldest-towns" style={link}>
            Japan&apos;s oldest towns
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/safest-towns" style={link}>
            Where is Japan safest?
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
