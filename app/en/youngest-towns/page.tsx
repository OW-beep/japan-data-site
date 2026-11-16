import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/youngest-towns";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Where Japan's Children Are: The Youngest Towns in the Country | Japan Municipal Data",
  description:
    "Only 10.8% of Japan is under 15 — but in Mishima Village 24.7% of residents are children, and Okinawa towns fill most of the top 10. The youngest municipalities in the 2025 census, and the two very different reasons they are young.",
  openGraph: {
    title: "Japan's Youngest Towns",
    description:
      "One in four residents is a child in Japan's youngest village. Okinawa and two island school programmes explain the top 10.",
    images: ["/images/og-default.png"],
  },
};

const YOUNGEST: [string, string, string, string, string][] = [
  ["Mishima", "Kagoshima", "361", "24.7%", "26.3%"],
  ["Toshima", "Kagoshima", "641", "20.1%", "29.3%"],
  ["Yaese", "Okinawa", "32,668", "19.5%", "23.7%"],
  ["Haebaru", "Okinawa", "41,483", "18.7%", "21.6%"],
  ["Kashima", "Kumamoto", "10,080", "18.7%", "24.9%"],
  ["Ginoza", "Okinawa", "6,279", "18.4%", "25.4%"],
  ["Tomigusuku", "Okinawa", "65,624", "17.9%", "21.9%"],
  ["Koshi", "Kumamoto", "64,314", "17.9%", "24.6%"],
  ["Nakagusuku", "Okinawa", "22,908", "17.8%", "21.0%"],
  ["Nanjo", "Okinawa", "45,312", "17.4%", "27.2%"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Youngest towns
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Where Japan&apos;s Children Are
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published October 13, 2026</p>
      <p style={lead}>
        Children under 15 are just 10.8% of Japan&apos;s population, and in
        the{" "}
        <Link prefetch={false} href="/en/oldest-towns" style={link}>
          oldest villages
        </Link>{" "}
        they are 2–3%. So where are Japan&apos;s children concentrated? The
        2025 census gives a strikingly geographic answer: one prefecture
        dominates the table, and the top two places are tiny island villages
        that import schoolchildren on purpose.
      </p>

      <section style={card}>
        <h2 style={h2}>The 10 youngest municipalities (share under 15, 2025 census)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Town</th>
                <th style={thR}>Population</th>
                <th style={thR}>Under 15</th>
                <th style={thR}>Aged 65+</th>
              </tr>
            </thead>
            <tbody>
              {YOUNGEST.map(([n, p, pop, c, a]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{pop}</td>
                  <td style={tdR}>{c}</td>
                  <td style={tdR}>{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Seven of the top ten are in Okinawa. The prefecture has Japan&apos;s
          highest birth rate, more multigenerational households, and a younger
          marriage profile — Tomigusuku and Nanjo are not villages but real
          cities of 45,000–66,000 people where nearly one resident in five is
          a child.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>The island exception: villages that recruit children</h2>
        <p style={para}>
          The top two entries are neither Okinawan nor ordinary. Mishima
          (24.7% children) and Toshima (20.1%) are Kagoshima island villages —
          chains of small volcanic islands south of Kyushu, with 361 and 641
          residents. Both run long-standing programmes that bring elementary
          and junior-high students from mainland cities to live and study on
          the islands (in Mishima&apos;s case, a well-known
          &quot;sea-and-mountain&quot; exchange study scheme). The children
          are counted as residents, the tiny schools stay open, and the
          villages buy themselves another generation. It is the most direct
          demographic engineering in Japan — and it only works because the
          absolute numbers are so small.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          Kashima and Koshi in Kumamoto tell a third story: they sit in the
          prefecture&apos;s semiconductor belt, where new chip plants have
          pulled in young engineering families. Jobs first, children second —
          the same recipe as the mainland&apos;s{" "}
          <Link prefetch={false} href="/en/growing-towns" style={link}>
            fastest-growing towns
          </Link>
          .
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Young now — and still young in 2050?</h2>
        <p style={{ ...para, marginBottom: 0 }}>
          Cross-checking with the official projections in our{" "}
          <Link prefetch={false} href="/en/future-2050" style={link}>
            2050 outlook
          </Link>
          , Nakagusuku (Okinawa) is projected to grow a further 17.8% by 2050
          — one of only 77 municipalities in Japan expected to be bigger in
          2050 than in 2020. Youth compounds: children become parents, schools
          stay viable, and the town keeps the services that attract the next
          cohort of families. The inverse is the trap documented in our{" "}
          <Link prefetch={false} href="/en/oldest-towns" style={link}>
            oldest towns
          </Link>{" "}
          ranking. Japan&apos;s demographic map is increasingly two maps, and
          this table is the brighter one.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Age shares are computed from the 2025 national census (Statistics
          Bureau of Japan) for all 1,740 municipalities. The full dataset, in
          Japanese, is behind the{" "}
          <Link prefetch={false} href="/ranking/child" style={link}>
            child-population ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/oldest-towns" style={link}>
            Japan&apos;s oldest towns
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/growing-towns" style={link}>
            Japan is shrinking — but these towns are growing
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/island-villages" style={link}>
            Life on Japan&apos;s island villages
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/future-2050" style={link}>
            Japan in 2050: the projection map
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
