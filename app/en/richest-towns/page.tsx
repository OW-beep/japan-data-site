import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/richest-towns";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Japan's Richest Municipalities — and the Scallop Village That Beats Most of Tokyo | Japan Municipal Data",
  description:
    "Average taxable income per taxpayer peaks at ¥18.1 million in Tokyo's Minato Ward — but #8 is Sarufutsu, a Hokkaido fishing village of 2,611 people. The income ranking for all 1,740 municipalities from official tax statistics, with the national average of ¥3.88 million for scale.",
  openGraph: {
    title: "Japan's Richest Municipalities by Income",
    description:
      "Minato Ward averages ¥18.1M per taxpayer. So why is a scallop-fishing village of 2,611 people ranked #8 in Japan?",
    images: ["/images/og-default.png"],
  },
};

const RICHEST: [string, string, string, string][] = [
  ["Minato Ward", "Tokyo", "¥18.10M", "~$120,700"],
  ["Shibuya Ward", "Tokyo", "¥13.94M", "~$92,900"],
  ["Chiyoda Ward", "Tokyo", "¥12.91M", "~$86,000"],
  ["Chuo Ward", "Tokyo", "¥8.82M", "~$58,800"],
  ["Bunkyo Ward", "Tokyo", "¥7.80M", "~$52,000"],
  ["Meguro Ward", "Tokyo", "¥7.70M", "~$51,300"],
  ["Ashiya", "Hyogo", "¥7.61M", "~$50,700"],
  ["Sarufutsu", "Hokkaido", "¥7.52M", "~$50,100"],
  ["Shinjuku Ward", "Tokyo", "¥6.97M", "~$46,400"],
  ["Setagaya Ward", "Tokyo", "¥6.81M", "~$45,400"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Richest towns
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Japan&apos;s Richest Municipalities by Income
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published September 15, 2026</p>
      <p style={lead}>
        Japanese tax statistics let us rank every municipality by the average
        taxable income of the people who actually pay income tax there. The
        national average is <strong>¥3.88 million per taxpayer</strong>; the
        median municipality sits at ¥3.10 million. The top of the table is
        mostly the Tokyo you would expect — plus one fishing village at the
        northern tip of Hokkaido that out-earns almost everywhere else in the
        country.
      </p>

      <section style={card}>
        <h2 style={h2}>The top 10 by average taxable income per taxpayer</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipality</th>
                <th style={thR}>Income per taxpayer</th>
                <th style={thR}>In dollars</th>
              </tr>
            </thead>
            <tbody>
              {RICHEST.map(([n, p, y, d]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{y}</td>
                  <td style={tdR}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Minato Ward — embassies, broadcasters, finance and IT headquarters —
          averages ¥18.10 million per taxpayer, 4.7 times the national figure.
          Ashiya (Hyogo), the classic wealthy residential city between Osaka
          and Kobe, is the only non-Tokyo entry in the top seven.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>#8: the scallop village</h2>
        <p style={para}>
          Sarufutsu Village, population 2,611, sits on the Sea of Okhotsk
          coast at Hokkaido&apos;s northern edge. Its taxpayers average ¥7.52
          million — ahead of Shinjuku and Setagaya. The reason is scallops:
          Sarufutsu&apos;s fishing cooperative runs one of Japan&apos;s most
          valuable scallop fisheries, and in good years the income of
          boat-owning households pulls the whole village&apos;s average up
          with it. It is a useful corrective to the assumption that rural
          Japan is uniformly poor: resource villages with a high-value catch
          (or, elsewhere, a power plant or a ski resort) can be genuinely
          prosperous — on a small, volatile base.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          Sarufutsu has a second claim to fame: its name contains the kanji
          for &quot;monkey&quot; (猿). It appears in our{" "}
          <Link prefetch={false} href="/en/names-trivia" style={link}>
            animal town-names
          </Link>{" "}
          guide too.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Income and land: the same map, twice</h2>
        <p style={{ ...para, marginBottom: 0 }}>
          Lay this ranking over our{" "}
          <Link prefetch={false} href="/en/most-expensive-land" style={link}>
            most expensive land
          </Link>{" "}
          table and the overlap is almost exact — Minato is #1 on both,
          Shibuya, Chiyoda and Chuo are top-five on both. High incomes bid up
          land; expensive land filters for high incomes. What income data
          adds is the places land prices miss: Sarufutsu&apos;s land is worth
          very little, and its wealth is income, not assets. Note also what
          this ranking is not: Japanese residence tax is levied where you
          live on January 1st, so these figures describe residents, not
          workplaces — which is why commuter-belt Ashiya and Musashino (Tokyo,
          #11 at ¥6.35 million) rank with the centre. Our{" "}
          <Link prefetch={false} href="/en/tokyo-wards" style={link}>
            Tokyo wards comparison
          </Link>{" "}
          shows the full spread inside the capital, and our{" "}
          <Link prefetch={false} href="/en/fiscal-health" style={link}>
            fiscal strength ranking
          </Link>{" "}
          shows what rich residents do — and don&apos;t do — for a town
          hall&apos;s own finances.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Figures are taxable income divided by the number of income-tax
          payers per municipality, from the Ministry of Internal Affairs&apos;
          municipal tax statistics (FY2025 edition, covering 2024 income),
          before deductions. Designated cities are aggregated at city level in
          the source; Tokyo&apos;s special wards are individual
          municipalities. Dollar figures use ¥150 = $1, rounded. The full
          dataset, in Japanese, is behind the{" "}
          <Link prefetch={false} href="/ranking/taxable-income" style={link}>
            taxable-income ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/most-expensive-land" style={link}>
            Japan&apos;s most expensive land
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/tokyo-wards" style={link}>
            Tokyo&apos;s 23 wards, compared
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/fiscal-health" style={link}>
            Fiscal strength: rich towns, poor towns
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/names-trivia" style={link}>
            Animal names hidden in Japan&apos;s towns
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
