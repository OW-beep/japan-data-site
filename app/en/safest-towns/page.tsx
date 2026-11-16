import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/safest-towns";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Where Is Japan Safest? Crime Data by Prefecture, Read Honestly | Japan Municipal Data",
  description:
    "Japan does not publish crime rates by town — it publishes them by prefecture. Iwate records 2.46 recognised penal-code offences per 1,000 residents; Osaka records 9.15. What the safest-prefecture data can and cannot tell you about choosing a town.",
  openGraph: {
    title: "Where Is Japan Safest?",
    description:
      "The safest prefectures record under 3 crimes per 1,000 residents; Osaka records 9.15. An honest guide to Japan's crime statistics.",
    images: ["/images/og-default.png"],
  },
};

const SAFEST: [string, string][] = [
  ["Iwate", "2.46"],
  ["Akita", "2.63"],
  ["Oita", "2.73"],
  ["Yamagata", "2.90"],
  ["Nagasaki", "2.99"],
  ["Shimane", "3.01"],
  ["Yamaguchi", "3.22"],
  ["Kumamoto", "3.61"],
  ["Fukui", "3.82"],
  ["Tokushima", "3.85"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Safest towns
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Where Is Japan Safest? What the Data Actually Says
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published September 8, 2026</p>
      <p style={lead}>
        Japan has a global reputation for safety, and the numbers support it —
        but &quot;safe&quot; is not evenly spread. One honesty note before the
        ranking: <strong>Japan does not publish crime statistics by
        municipality.</strong> The official series covers prefectures. Anyone
        selling you a &quot;safest towns in Japan&quot; list with town-level
        crime rates is inventing precision the data does not have. What we can
        do — and do here — is rank the prefectures properly, then read them
        together with the town-level data that does exist.
      </p>

      <section style={card}>
        <h2 style={h2}>The safest prefectures (recognised offences per 1,000 residents, 2023)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Prefecture</th>
                <th style={thR}>Offences per 1,000 residents</th>
              </tr>
            </thead>
            <tbody>
              {SAFEST.map(([n, v]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{n}</td>
                  <td style={tdR}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          At the other end, Osaka records 9.15 offences per 1,000 residents —
          3.7 times Iwate&apos;s rate — followed by Gunma (7.01), Ibaraki
          (7.00), Hyogo (6.94) and Saitama (6.77). Even the &quot;worst&quot;
          figure, it is worth saying, would be unremarkably low in most
          countries: this is a ranking of variations within one of the
          world&apos;s safest societies.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>What the safest prefectures have in common</h2>
        <p style={para}>
          The top of the table is rural, northern or island Japan: three
          Tohoku prefectures (Iwate, Akita, Yamagata), two in Kyushu (Oita,
          Nagasaki, Kumamoto), Shimane and Yamaguchi in western Honshu. These
          are prefectures of small cities, farming towns and — not
          coincidentally — some of the{" "}
          <Link prefetch={false} href="/en/oldest-towns" style={link}>
            oldest populations in the country
          </Link>
          . Recorded crime skews young and urban everywhere in the world;
          Japan is no exception. Dense nightlife and retail districts generate
          theft and bicycle crime reports that a village of 1,300 simply does
          not have the opportunity to produce.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          Read together with our{" "}
          <Link prefetch={false} href="/en/emptiest-places" style={link}>
            emptiest places
          </Link>{" "}
          ranking, the practical translation for someone choosing a town is:
          within the safest prefectures, smaller and quieter towns are where
          the already-low prefectural rates are most likely to overstate, not
          understate, your actual exposure. The trade-off is the familiar one —
          the same rurality that suppresses crime also thins out hospitals,
          trains and jobs.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>What prefecture data cannot tell you</h2>
        <p style={{ ...para, marginBottom: 0 }}>
          A prefecture is a big unit. Nagasaki&apos;s 2.99 covers both the
          port city of Nagasaki and farming villages an hour away; Iwate&apos;s
          2.46 averages Morioka with mountain towns. Rates also count
          offences known to police, so they partly measure reporting
          behaviour, and they say nothing about traffic safety, natural
          disaster risk or how a place feels at night. Use this ranking as a
          first filter — it reliably separates Osaka-style urban exposure from
          rural Tohoku — then evaluate specific towns on the things that are
          measured locally: population trend, services, and your own visit.
          For scale, our{" "}
          <Link prefetch={false} href="/en/biggest-cities" style={link}>
            biggest cities guide
          </Link>{" "}
          shows what life at the dense end of Japan looks like in numbers.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Crime figures are recognised penal-code offences per 1,000
          residents by prefecture (2023), from the national Social and
          Demographic Statistics system (総務省「社会・人口統計体系」),
          as compiled in our database. The full dataset, in Japanese, is
          behind the{" "}
          <Link prefetch={false} href="/ranking/crime-rate" style={link}>
            crime-rate ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/emptiest-places" style={link}>
            Japan&apos;s emptiest places
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/oldest-towns" style={link}>
            Japan&apos;s oldest towns
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/biggest-cities" style={link}>
            Japan&apos;s biggest cities
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
