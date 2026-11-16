import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/oldest-towns";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Japan's Oldest Towns: Where Two in Three Residents Are Over 65 | Japan Municipal Data",
  description:
    "In Nanmoku Village, Gunma, 68.9% of residents are 65 or older and just 2.3% are children — against a national figure of 28.7%. The 10 oldest municipalities in Japan from the 2025 census, and what daily life looks like at the front line of ageing.",
  openGraph: {
    title: "Japan's Oldest Towns",
    description:
      "68.9% over 65. The 2025 census ranking of Japan's oldest municipalities — and the 111 towns already majority-elderly.",
    images: ["/images/og-default.png"],
  },
};

const OLDEST: [string, string, string, string, string][] = [
  ["Nanmoku", "Gunma", "1,260", "68.9%", "2.3%"],
  ["Kanna", "Gunma", "1,317", "64.9%", "3.4%"],
  ["Imabetsu", "Aomori", "1,888", "62.2%", "3.7%"],
  ["Mitsue", "Nara", "1,225", "62.0%", "4.8%"],
  ["Iitate", "Fukushima", "1,353", "61.4%", "3.5%"],
  ["Kaneyama", "Fukushima", "1,634", "60.7%", "4.7%"],
  ["Higashiyoshino", "Nara", "1,281", "60.3%", "4.2%"],
  ["Tenryu", "Nagano", "965", "60.3%", "7.6%"],
  ["Himeshima", "Oita", "1,503", "60.1%", "6.5%"],
  ["Otoyo", "Kochi", "2,762", "59.9%", "5.6%"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Oldest towns
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Japan&apos;s Oldest Towns
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published October 6, 2026</p>
      <p style={lead}>
        Japan is the oldest country in the world — 28.7% of its people are 65
        or older. But that national average hides places that are decades
        further down the road. In the oldest municipality in the country,{" "}
        <strong>more than two residents in three are pensioners</strong>, and
        children are a rounding error. These are the ten oldest towns in
        Japan in the 2025 census — a preview of what demographers elsewhere
        will be studying for years.
      </p>

      <section style={card}>
        <h2 style={h2}>The 10 oldest municipalities (share aged 65+, 2025 census)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Town</th>
                <th style={thR}>Population</th>
                <th style={thR}>Aged 65+</th>
                <th style={thR}>Under 15</th>
              </tr>
            </thead>
            <tbody>
              {OLDEST.map(([n, p, pop, a, c]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{pop}</td>
                  <td style={tdR}>{a}</td>
                  <td style={tdR}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Nanmoku Village in the Gunma mountains holds the record: 68.9%
          elderly, 2.3% children — roughly 29 children among 1,260 residents.
          Every town on this list is small, mountainous or island, and every
          one is in a region young people left for the cities two generations
          ago. In total, <strong>111 Japanese municipalities are now
          majority-elderly</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Two special cases: Iitate and Himeshima</h2>
        <p style={para}>
          Iitate Village (Fukushima, 61.4%) is not a natural experiment. The
          whole village was evacuated after the 2011 nuclear accident, and
          when the evacuation order was lifted years later, it was
          overwhelmingly the older residents who chose to return to their
          homes and fields. Its age profile records who came back, not just
          who was born there.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          Himeshima (Oita, 60.1%) is an island village in the Seto Inland Sea
          known inside Japan for a decades-old work-sharing system that kept
          employment — and community — alive long after similar islands
          emptied. It shows up again in our{" "}
          <Link prefetch={false} href="/en/island-villages" style={link}>
            island villages
          </Link>{" "}
          guide: island ageing is the rule, and the exceptions always have a
          specific mechanism behind them.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Oldest today, emptiest tomorrow</h2>
        <p style={para}>
          Ageing and shrinkage are the same process read at different speeds.
          Nanmoku is also on our{" "}
          <Link prefetch={false} href="/en/shrinking-towns" style={link}>
            fastest-shrinking towns
          </Link>{" "}
          list (−21.8% in five years), and the official projection in our{" "}
          <Link prefetch={false} href="/en/future-2050" style={link}>
            2050 outlook
          </Link>{" "}
          has it falling to about 406 people, 72% of them elderly. What these
          villages are working out now — demand-responsive buses instead of
          fixed routes, clinics staffed by visiting doctors, shopping
          delivered by the agricultural co-op, neighbours formally organised
          to check on each other — is the operating manual the rest of Japan
          will need. By 2050, 557 municipalities are projected to be
          majority-elderly; the 111 on today&apos;s list are simply first.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          The mirror image exists too: our{" "}
          <Link prefetch={false} href="/en/youngest-towns" style={link}>
            youngest towns
          </Link>{" "}
          ranking shows where Japan&apos;s children actually are — mostly
          Okinawa and a handful of island villages running school programmes.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Age shares are computed from the 2025 national census (Statistics
          Bureau of Japan): residents aged 65+ and under 15 as a share of each
          municipality&apos;s population, for all 1,740 municipalities. The
          full dataset, in Japanese, is behind the{" "}
          <Link prefetch={false} href="/ranking/aging" style={link}>
            ageing-rate ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/youngest-towns" style={link}>
            Japan&apos;s youngest towns
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/shrinking-towns" style={link}>
            The fastest-shrinking towns in Japan
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/future-2050" style={link}>
            Japan in 2050: the projection map
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
