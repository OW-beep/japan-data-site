import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import { getMunicipalities } from "@/lib/municipalities";
import { getCities2025 } from "@/lib/city2025";
import { SITE_NAME } from "@/lib/site";

const PATH = "/en/foreign-residents";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Foreign Residents Are Quietly Slowing Japan's Population Decline | Japan Municipal Data",
  description:
    "Across all 1,740 Japanese municipalities, towns with more foreign residents shrank more slowly between the 2020 and 2025 censuses (correlation 0.30). The reason is not a wave of arrivals — it is the age structure. Census cross-analysis, with the honest caveats.",
  openGraph: {
    title: "Foreign Residents Are Quietly Slowing Japan's Population Decline",
    description:
      "The quarter of municipalities with the fewest foreign residents lost 8.6% of their people in five years. The quarter with the most lost 3.9%. Here is what the census says is going on.",
    images: ["/images/og-default.png"],
  },
};

// 表示用の英語名マップ(数値はすべて lib のデータから実計算する)
const EXAMPLES: { code: string; en: string; pref: string }[] = [
  { code: "20304", en: "Kawakami Village", pref: "Nagano" },
  { code: "10524", en: "Oizumi Town", pref: "Gunma" },
  { code: "20305", en: "Minamimaki Village", pref: "Nagano" },
  { code: "01463", en: "Shimukappu Village", pref: "Hokkaido" },
  { code: "13116", en: "Toshima Ward", pref: "Tokyo" },
  { code: "11223", en: "Warabi City", pref: "Saitama" },
  { code: "21211", en: "Minokamo City", pref: "Gifu" },
  { code: "13104", en: "Shinjuku Ward", pref: "Tokyo" },
  { code: "08211", en: "Joso City", pref: "Ibaraki" },
  { code: "23227", en: "Takahama City", pref: "Aichi" },
];

const fmtChg = (v: number) => `${v > 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}%`;

export default function Page() {
  const pop2025 = new Map(getCities2025().map((c) => [c.code, c.population]));
  const byCode = new Map(getMunicipalities().map((c) => [c.code, c]));
  const rows = getMunicipalities()
    .filter((c) => c.foreignPopulation != null && c.population > 0 && pop2025.has(c.code))
    .map((c) => ({
      share: ((c.foreignPopulation ?? 0) / c.population) * 100,
      chg: (((pop2025.get(c.code) as number) - c.population) / c.population) * 100,
    }));
  const sorted = [...rows].sort((a, b) => a.share - b.share);
  const qSize = Math.floor(rows.length / 4);
  const quartileLabels = ["Lowest quarter", "Second quarter", "Third quarter", "Highest quarter"];
  const quartiles = [0, 1, 2, 3].map((i) => {
    const g = sorted.slice(i * qSize, i === 3 ? rows.length : (i + 1) * qSize);
    return {
      label: quartileLabels[i],
      share: g.reduce((a, r) => a + r.share, 0) / g.length,
      chg: g.reduce((a, r) => a + r.chg, 0) / g.length,
    };
  });
  const ge5 = rows.filter((r) => r.share >= 5);
  const ge5Grew = (ge5.filter((r) => r.chg > 0).length / ge5.length) * 100;
  const allGrew = (rows.filter((r) => r.chg > 0).length / rows.length) * 100;
  const examples = EXAMPLES.map((e) => {
    const c = byCode.get(e.code);
    if (!c || c.foreignPopulation == null) return null;
    const p25 = pop2025.get(e.code) as number;
    return {
      ...e,
      share: ((c.foreignPopulation ?? 0) / c.population) * 100,
      chg: ((p25 - c.population) / c.population) * 100,
    };
  }).filter((x): x is NonNullable<typeof x> => x != null);

  const faq = [
    {
      q: "Which Japanese towns have the most foreign residents?",
      a: "By share of population, the highest in the 2020 census is Kawakami Village in Nagano (19.0%), a highland-vegetable farming village, followed by Oizumi Town in Gunma (17.6%), a manufacturing town long known for its Brazilian-Japanese community. Among larger places, Tokyo's Toshima Ward and Warabi City in Saitama both stand at 8.5%. In absolute numbers the big cities dominate, but the highest shares are mostly in working towns.",
    },
    {
      q: "Does a high foreign-resident share mean a town will grow?",
      a: "No. It means decline tends to be slower, which is a different claim. Of the 44 municipalities where foreign residents were at least 5% of the population in 2020, 36.4% grew over the next five years — far above the 9.7% national rate — but most still shrank, and the highest-share village of all, Kawakami, lost 3.9%. A correlation of 0.30 is a tendency across 1,740 municipalities, not a promise about any single town.",
    },
    {
      q: "If it is not mainly people moving in, why does the share matter?",
      a: "Because of age structure. The correlation between foreign-resident share and natural change (births minus deaths) is 0.29, while the correlation with net migration is only 0.10. Foreign residents are concentrated in the working-age generations, so towns where they live tend to record relatively more births and fewer deaths — natural decrease runs more slowly. The share is best read as a mirror of how many working-age people a town has.",
    },
    {
      q: "Where does this data come from?",
      a: "Japan's national censuses (Statistics Bureau of Japan). The foreign-resident share is from the 2020 census; population change compares the 2020 and 2025 censuses for all 1,740 municipalities, with Tokyo's special wards counted individually. The full analysis, including the breakdown by natural and social change, is published in Japanese on this site.",
    },
  ];

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Foreign residents
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Foreign Residents Are Quietly Slowing Japan&apos;s Population Decline
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published November 19, 2026</p>
      <p style={lead}>
        Between the 2020 and 2025 censuses, 1,571 of Japan&apos;s{" "}
        {rows.length.toLocaleString()} municipalities lost population. But
        cross-referencing the census&apos;s foreign-resident counts with what
        happened over the following five years turns up a pattern:{" "}
        <strong>municipalities with more foreign residents shrank more
        slowly</strong>. The obvious explanation — newcomers arriving — is
        mostly not the one the data supports. The real mechanism is quieter.
      </p>

      <section style={card}>
        <h2 style={h2}>The pattern, in three numbers</h2>
        <p style={para}>
          <strong>0.30</strong> is the correlation between a
          municipality&apos;s foreign-resident share in 2020 and its
          population change over the next five years, across all{" "}
          {rows.length.toLocaleString()} municipalities. A moderate
          correlation, not a law — but among cities and wards alone it rises
          to 0.41. Split municipalities into quarters by foreign share and
          the gradient is steady:
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipalities, by foreign-resident share (2020)</th>
                <th style={thR}>Average share</th>
                <th style={thR}>Average population change 2020→25</th>
              </tr>
            </thead>
            <tbody>
              {quartiles.map((g) => (
                <tr key={g.label}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{g.label}</td>
                  <td style={tdR}>{g.share.toFixed(2)}%</td>
                  <td style={tdR}>{fmtChg(g.chg)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Every quarter shrank on average — that is Japan&apos;s reality —
          but the quarter with the most foreign residents lost less than half
          as many people as the quarter with the fewest. Narrow the lens to
          the {ge5.length} municipalities where foreign residents were at
          least 5% of the population, and {ge5Grew.toFixed(1)}% of them
          actually grew, against {allGrew.toFixed(1)}% overall.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Where the share is highest</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipality</th>
                <th style={thR}>Foreign share (2020)</th>
                <th style={thR}>Population change 2020→25</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((d) => (
                <tr key={d.code}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {d.en}
                    <span style={{ color: "#6b7280", fontWeight: 400 }}> ({d.pref})</span>
                  </td>
                  <td style={tdR}>{d.share.toFixed(1)}%</td>
                  <td style={tdR}>{fmtChg(d.chg)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={para}>
          Two types of place appear. The first is <strong>urban</strong>:
          Tokyo wards such as Toshima and Shinjuku, and Warabi in Saitama,
          where jobs, universities and rail access draw young people of every
          nationality. The second is <strong>industrial</strong>: Oizumi,
          whose factories drew a Brazilian-Japanese community that now spans
          generations; manufacturing cities like Minokamo and Takahama; and
          farming or resort villages like Kawakami, Minamimaki and
          Shimukappu. What the two types share is not scenery or policy — it
          is a working-age population. Note Oizumi: a 17.6% share and still
          a small decline. The pattern is about the <em>speed</em> of
          decline, and even the slowest lane usually points down.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Why: it is the age structure, not the moving vans</h2>
        <p style={para}>
          Population change splits into natural change (births minus deaths)
          and social change (moving in minus moving out). Correlate the
          foreign share with each part separately and the answers diverge:
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Foreign-resident share, correlated with…</th>
                <th style={thR}>Correlation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>Natural change (births − deaths)</td>
                <td style={tdR}>0.29</td>
              </tr>
              <tr>
                <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>Social change (net migration)</td>
                <td style={tdR}>0.10</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={para}>
          Think of a town&apos;s population as water in a bathtub. Migration
          is people carrying buckets in and out. Births and deaths are the
          tap and the drain — and how fast the drain runs is set mostly by
          how old the town is. Foreign residents in Japan are concentrated
          in their 20s, 30s and 40s: the generations that have children and
          rarely die. Where they make up a visible share, more water comes
          from the tap and less goes down the drain — the level falls more
          slowly even if the buckets are roughly balanced.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          Read this way, the foreign share is less a cause than a{" "}
          <strong>mirror</strong> of how much of a town&apos;s population is
          of working and child-raising age — the same quality that marks the
          towns in our guide to{" "}
          <Link prefetch={false} href="/en/youngest-towns" style={link}>
            where Japan&apos;s children are
          </Link>
          .
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>The honest caveats</h2>
        <p style={para}>
          <strong>Correlation is not causation.</strong> This analysis cannot
          show that foreign residents <em>cause</em> slower decline. A third
          factor plausibly drives both: towns with living industries —
          factories, farms, resorts — offer jobs that attract foreign
          workers, and those same jobs keep a town viable for everyone.
        </p>
        <p style={para}>
          <strong>There are clear exceptions.</strong> Kawakami Village has
          the highest foreign share in Japan (19.0%) and still lost 3.9% of
          its people; Joso City in Ibaraki (7.8%) lost 4.8%. Seasonal farm
          labour does not by itself stop young people leaving for the city.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          <strong>And the shares are still small.</strong> The average
          municipality&apos;s foreign share is 1.35%; even the highest
          quarter averages just 3.01%. This is a modest demographic cushion,
          not a reversal of the trend documented in our guide to the{" "}
          <Link prefetch={false} href="/en/shrinking-towns" style={link}>
            fastest-shrinking towns
          </Link>
          .
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>What it means if you are watching — or moving to — Japan</h2>
        <p style={{ ...para, marginBottom: 0 }}>
          If you are researching towns to live in, treat an established
          foreign community as one useful signal among several: it usually
          means working-age life, a functioning local industry, and some
          local experience of residents who arrived from elsewhere. But read
          it alongside the fundamentals — the population trend itself and
          whether the town is growing or holding, as in our guide to the{" "}
          <Link prefetch={false} href="/en/growing-towns" style={link}>
            towns that are still growing
          </Link>
          . A high share in a fast-shrinking town (Kawakami is the standing
          example) is a different proposition from a moderate share in a
          stable one. The number shows where a town stands; it is not a
          grade, and it is not a forecast on its own.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Q&amp;A</h2>
        {faq.map((f) => (
          <p key={f.q} style={para}>
            <strong>Q. {f.q}</strong>
            <br />
            A. {f.a}
          </p>
        ))}
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Foreign-resident shares are from the 2020 national census;
          population change compares the 2020 and 2025 censuses, for all{" "}
          {rows.length.toLocaleString()} municipalities in our database
          (Tokyo&apos;s special wards counted individually, designated-city
          wards within their cities). Correlations are Pearson coefficients;
          the share is measured in 2020 and set against the five years that
          followed. Source: Statistics Bureau of Japan, national censuses of
          2020 and 2025. The full analysis is published in Japanese as{" "}
          <Link prefetch={false} href="/articles/foreign-population-cross-analysis" style={link}>
            the foreign-share × population-change cross-analysis
          </Link>
          , and every municipality&apos;s share is in the{" "}
          <Link prefetch={false} href="/ranking/foreign-population" style={link}>
            foreign-resident ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/growing-towns" style={link}>
            Japan is shrinking — but these towns are growing
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/shrinking-towns" style={link}>
            The fastest-shrinking towns in Japan
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/youngest-towns" style={link}>
            Where Japan&apos;s children are
          </Link>
          {" · "}
          <Link prefetch={false} href="/en" style={link}>
            All English guides
          </Link>
        </p>
      </section>

      <p style={{ fontSize: 12, color: "#9ca3af" }}>
        {SITE_NAME} — data on all 1,741 Japanese municipalities, from official statistics.
      </p>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
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
