import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/company-towns";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Where Japan's New Companies Are Born: The Registration Map | Japan Municipal Data",
  description:
    "Shibuya gained a net 4,428 companies in a year — but per resident, the boomtowns are ski villages: Niseko, Hakuba and Nozawa Onsen. National Tax Agency registry data for every municipality, and the 646 towns where companies are disappearing.",
  openGraph: {
    title: "Where Japan's New Companies Are Born",
    description:
      "Tokyo's wards dominate in absolute numbers. Per resident, Japan's company-creation boom is in the ski resorts.",
    images: ["/images/og-default.png"],
  },
};

const ABSOLUTE: [string, string, string, string][] = [
  ["Shibuya Ward", "Tokyo", "6,157", "+4,428"],
  ["Chuo Ward", "Tokyo", "4,818", "+2,810"],
  ["Chiyoda Ward", "Tokyo", "4,405", "+2,245"],
  ["Minato Ward", "Tokyo", "7,963", "+2,117"],
  ["Setagaya Ward", "Tokyo", "2,025", "+1,145"],
  ["Meguro Ward", "Tokyo", "1,221", "+771"],
  ["Shinagawa Ward", "Tokyo", "1,418", "+761"],
  ["Toshima Ward", "Tokyo", "1,473", "+761"],
];

const PER_CAPITA: [string, string, string][] = [
  ["Chiyoda Ward", "Tokyo", "+33.7"],
  ["Shibuya Ward", "Tokyo", "+18.2"],
  ["Chuo Ward", "Tokyo", "+16.6"],
  ["Minato Ward", "Tokyo", "+8.1"],
  ["Niseko Town", "Hokkaido", "+3.7"],
  ["Taketomi Town", "Okinawa", "+2.8"],
  ["Nozawa Onsen Village", "Nagano", "+2.7"],
  ["Hakuba Village", "Nagano", "+2.6"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Company towns
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Where Japan&apos;s New Companies Are Born
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published October 27, 2026</p>
      <p style={lead}>
        Every new company in Japan is registered, and the registry is public.
        Counting new registrations minus closures for the most recent
        12-month period draws a map of economic energy that census data
        can&apos;t: absolute numbers crown Tokyo&apos;s business wards, but
        per resident, the boomtowns of Japanese entrepreneurship are ski
        villages.
      </p>

      <section style={card}>
        <h2 style={h2}>Net company growth: the absolute leaders</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipality</th>
                <th style={thR}>New companies</th>
                <th style={thR}>Net change</th>
              </tr>
            </thead>
            <tbody>
              {ABSOLUTE.map(([n, p, nw, net]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{nw}</td>
                  <td style={tdR}>{net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Shibuya — startups, agencies, IT — added a net 4,428 companies in
          one year, more than most prefectures. Minato registered the most
          new companies of any municipality (7,963) but also closed many,
          netting +2,117. This is the same central-Tokyo cluster that tops
          the{" "}
          <Link prefetch={false} href="/en/daytime-population" style={link}>
            daytime population
          </Link>{" "}
          and{" "}
          <Link prefetch={false} href="/en/richest-towns" style={link}>
            income
          </Link>{" "}
          rankings.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Per 1,000 residents: the resort effect</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipality</th>
                <th style={thR}>Net change per 1,000 residents</th>
              </tr>
            </thead>
            <tbody>
              {PER_CAPITA.map(([n, p, v]) => (
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
          After the four central wards, the per-capita table belongs to
          tourism: Niseko (Hokkaido), Taketomi (Okinawa), Nozawa Onsen and
          Hakuba (Nagano) — ski and island resorts where foreign and domestic
          entrepreneurs register hotels, restaurants, guide services and
          property companies. Niseko&apos;s +3.7 per 1,000 residents, on a
          population of 5,074, means roughly one net new company for every
          270 residents in a single year. Resort demand is doing for these
          villages what factories once did for industrial towns — the same
          villages also show up younger and richer in the census than their
          neighbours.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>The other side of the ledger</h2>
        <p style={{ ...para, marginBottom: 0 }}>
          Of the 1,695 municipalities in the registry data,{" "}
          <strong>646 lost more companies than they gained</strong> in the
          same year. Company decline tracks population decline almost town
          for town: when the last construction firm, diner or wholesaler in a
          shrinking town closes, the registration data records it years
          before the census confirms the demographic result. Read together
          with our{" "}
          <Link prefetch={false} href="/en/shrinking-towns" style={link}>
            shrinking towns
          </Link>{" "}
          analysis, the registry is best understood as a leading indicator —
          Japan&apos;s economic map is being redrawn at the same speed as its
          population map, and the two maps are the same map.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Counts are computed from the National Tax Agency&apos;s corporate
          number registry (new registrations and closures over the most
          recent 12 months available at the time of writing), aggregated by
          the municipality of the registered head office. In the source data,
          designated cities are recorded by ward, so ward-level figures are
          shown for them and city-wide totals are not directly comparable.
          The full dataset, in Japanese, is behind the{" "}
          <Link prefetch={false} href="/ranking/corporate-growth" style={link}>
            corporate-growth ranking
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
          <Link prefetch={false} href="/en/richest-towns" style={link}>
            Japan&apos;s richest municipalities
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/farming-towns" style={link}>
            Japan&apos;s farming powerhouses
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
