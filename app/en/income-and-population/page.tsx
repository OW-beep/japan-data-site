import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import { getMunicipalities } from "@/lib/municipalities";
import { getCities2025 } from "@/lib/city2025";
import { allTax, nationalIncomePerTaxpayer } from "@/lib/taxableIncome";
import { SITE_NAME } from "@/lib/site";

const PATH = "/en/income-and-population";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Do Richer Towns in Japan Grow? Income × Population Across 1,740 Municipalities | Japan Municipal Data",
  description:
    "Cross-referencing taxable income per taxpayer with 2020→2025 population change across all 1,740 Japanese municipalities gives a correlation of 0.40: higher-income towns shrink more slowly, and 72.8% of the towns that grew sit in the top income quarter. But a rich town hall, rich residents and a growing town are three different things.",
  openGraph: {
    title: "Do Richer Towns in Japan Grow?",
    description:
      "The quarter of municipalities with the lowest taxable incomes lost 10.6% of their people in five years. The highest quarter lost 1.9%. What the tax records and the census say — with the exceptions kept in.",
    images: ["/images/og-default.png"],
  },
};

// 表示用の英語名マップ(数値はすべて lib のデータから実計算する)
const EXAMPLES: { code: string; en: string; pref: string }[] = [
  { code: "08220", en: "Tsukuba City", pref: "Ibaraki" },
  { code: "12220", en: "Nagareyama City", pref: "Chiba" },
  { code: "12231", en: "Inzai City", pref: "Chiba" },
  { code: "23238", en: "Nagakute City", pref: "Aichi" },
  { code: "13103", en: "Minato Ward", pref: "Tokyo" },
  { code: "13102", en: "Chuo Ward", pref: "Tokyo" },
  { code: "13113", en: "Shibuya Ward", pref: "Tokyo" },
  { code: "28206", en: "Ashiya City", pref: "Hyogo" },
  { code: "01511", en: "Sarufutsu Village", pref: "Hokkaido" },
  { code: "01463", en: "Shimukappu Village", pref: "Hokkaido" },
  { code: "32525", en: "Ama Town", pref: "Shimane" },
  { code: "23427", en: "Tobishima Village", pref: "Aichi" },
];

const fmtChg = (v: number) => `${v > 0 ? "+" : "−"}${Math.abs(v).toFixed(1)}%`;
const fmtInc = (manYen: number) => `¥${(manYen / 100).toFixed(2)}M`;

function pearson(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let cov = 0;
  let vx = 0;
  let vy = 0;
  for (let i = 0; i < n; i++) {
    cov += (xs[i] - mx) * (ys[i] - my);
    vx += (xs[i] - mx) ** 2;
    vy += (ys[i] - my) ** 2;
  }
  return cov / Math.sqrt(vx * vy);
}

export default function Page() {
  const pop2020 = new Map(getMunicipalities().map((c) => [c.code, c.population]));
  const pop2025 = new Map(getCities2025().map((c) => [c.code, c.population]));
  const rows = allTax()
    .filter((t) => t.code !== "13100" && pop2020.has(t.code) && pop2025.has(t.code))
    .map((t) => {
      const p20 = pop2020.get(t.code) as number;
      const p25 = pop2025.get(t.code) as number;
      const short = t.n.split(" ").pop() ?? t.n;
      return {
        code: t.code,
        inc: t.incomePerTaxpayer,
        chg: ((p25 - p20) / p20) * 100,
        urban: short.endsWith("市") || short.endsWith("区"),
      };
    });
  const byCode = new Map(rows.map((r) => [r.code, r]));

  const rAll = pearson(rows.map((r) => r.inc), rows.map((r) => r.chg));
  const urban = rows.filter((r) => r.urban);
  const rural = rows.filter((r) => !r.urban);
  const rUrban = pearson(urban.map((r) => r.inc), urban.map((r) => r.chg));
  const rRural = pearson(rural.map((r) => r.inc), rural.map((r) => r.chg));

  const sorted = [...rows].sort((a, b) => a.inc - b.inc);
  const qSize = Math.floor(rows.length / 4);
  const quartileLabels = ["Lowest quarter", "Second quarter", "Third quarter", "Highest quarter"];
  const quartiles = [0, 1, 2, 3].map((i) => {
    const g = sorted.slice(i * qSize, i === 3 ? rows.length : (i + 1) * qSize);
    return {
      label: quartileLabels[i],
      inc: g.reduce((a, r) => a + r.inc, 0) / g.length,
      chg: g.reduce((a, r) => a + r.chg, 0) / g.length,
      grew: (g.filter((r) => r.chg > 0).length / g.length) * 100,
    };
  });
  const topQuarterInc = sorted[qSize * 3].inc;
  const growers = rows.filter((r) => r.chg > 0);
  const growersTopShare = (growers.filter((r) => r.inc >= topQuarterInc).length / growers.length) * 100;
  const national = nationalIncomePerTaxpayer();

  const examples = EXAMPLES.map((e) => {
    const r = byCode.get(e.code);
    return r ? { ...e, inc: r.inc, chg: r.chg } : null;
  }).filter((x): x is NonNullable<typeof x> => x != null);
  const pick = (codes: string[]) => examples.filter((e) => codes.includes(e.code));

  const faq = [
    {
      q: "What exactly is “taxable income” in this data?",
      a: "It is the average taxable income per taxpayer in each municipality, from the Ministry of Internal Affairs' survey of municipal tax assessments (fiscal 2025, based on income earned in 2024). It covers salaries, business income and capital gains such as stock sales, before deductions, and it is counted per person with a tax liability — not per household. That is why it reads differently from the “average salary” figures often quoted for Japan. The national average on this measure is about ¥3.88 million per taxpayer.",
    },
    {
      q: "So do rich towns in Japan actually grow?",
      a: "Mostly, they shrink more slowly — which in today's Japan is the realistic version of the claim. The correlation across 1,740 municipalities is 0.40. The highest-income quarter lost on average 1.9% of its population between 2020 and 2025, against 10.6% for the lowest quarter, and 72.8% of the 169 municipalities that did grow are in the top income quarter. But even in that top quarter, the average town still lost people.",
    },
    {
      q: "Which places are both high-income and growing?",
      a: "Three types: central Tokyo wards such as Minato (¥18.10M per taxpayer, +4.6%) and Chuo (+7.5%); a science city, Tsukuba in Ibaraki (¥4.52M, +11.3%), the fastest-growing large city in this analysis; and family-oriented commuter cities such as Nagareyama and Inzai in Chiba and Nagakute in Aichi, all up 5–8%. What they share is a clear base of well-paid work in or near the town.",
    },
    {
      q: "Can a town be rich and still shrink?",
      a: "Yes, in two distinct ways. Shibuya Ward (¥13.94M, second-highest in Japan) lost 2.1% and Ashiya (¥7.61M) lost 2.5%: mature, expensive residential areas where ageing drives natural decrease. And Sarufutsu Village in Hokkaido averages ¥7.52M — top ten nationally — thanks to scallop fishing, yet lost 4.2%. A single strong industry can make residents prosperous without stopping young people from leaving.",
    },
    {
      q: "What should I look at if I am thinking of moving to Japan?",
      a: "Treat average income as a signal that a functioning job market exists in or near the town — useful if your move depends on local work. Then check the fundamentals next to it: the population trend itself, and the age structure. Some lower-income towns are growing for entirely different reasons, from resorts (Shimukappu Village, +13.8%) to Okinawa's young age profile and islands like Ama Town that actively recruit newcomers. Income is one ruler, not a verdict.",
    },
  ];

  const exampleTable = (list: typeof examples) => (
    <div style={{ overflowX: "auto" }}>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: "left" }}>Municipality</th>
            <th style={thR}>Taxable income per taxpayer</th>
            <th style={thR}>Population change 2020→25</th>
          </tr>
        </thead>
        <tbody>
          {list.map((d) => (
            <tr key={d.code}>
              <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                {d.en}
                <span style={{ color: "#6b7280", fontWeight: 400 }}> ({d.pref})</span>
              </td>
              <td style={tdR}>{fmtInc(d.inc)}</td>
              <td style={tdR}>{fmtChg(d.chg)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Income and population
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Do Richer Towns in Japan Grow? Income × Population Across 1,740 Municipalities
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published November 21, 2026</p>
      <p style={lead}>
        Japan has an official statistic that is rarely translated: for every
        municipality, the average taxable income of the people who live there,
        taken from local tax records. Cross-reference it with what happened to
        each town&apos;s population between the 2020 and 2025 censuses, and a
        clear pattern appears — <strong>where residents earn more, population
        falls more slowly</strong>. But the exceptions are as instructive as
        the rule, and one famous village shows why a rich town hall, rich
        residents and a growing town are three different things.
      </p>

      <section style={card}>
        <h2 style={h2}>First, what this income figure is — and is not</h2>
        <p style={para}>
          The figure is <em>kazei shotoku</em> (課税所得): taxable income per
          taxpayer, from the national survey of municipal tax assessments.
          The fiscal-2025 assessment is based on income earned in 2024, and
          because residence tax is levied where you live on January 1, it
          describes residents, not workplaces. It includes salaries, business
          income and capital gains, before deductions, and it is averaged per
          person with a tax liability — not per household, and not per
          resident.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          The national average is <strong>{fmtInc(national)}</strong> per
          taxpayer. At the top sits Tokyo&apos;s Minato Ward at ¥18.10M —
          followed, remarkably, by villages. Sarufutsu in northern Hokkaido
          averages ¥7.52M on the strength of its scallop fishery, which is
          why Japan&apos;s income ranking (covered in our guide to the{" "}
          <Link prefetch={false} href="/en/richest-towns" style={link}>
            richest municipalities
          </Link>
          ) mixes celebrity wards with fishing villages of a few thousand
          people.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>The pattern, in three numbers</h2>
        <p style={para}>
          <strong>{rAll.toFixed(2)}</strong> is the correlation between
          taxable income per taxpayer and population change from 2020 to
          2025, across all {rows.length.toLocaleString()} municipalities in
          this analysis. Among cities and wards alone it is{" "}
          {rUrban.toFixed(2)}; among towns and villages, {rRural.toFixed(2)}.
          Split municipalities into quarters by income and the gradient is
          steady:
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipalities, by taxable income per taxpayer</th>
                <th style={thR}>Average income</th>
                <th style={thR}>Average population change 2020→25</th>
                <th style={thR}>Share that grew</th>
              </tr>
            </thead>
            <tbody>
              {quartiles.map((g) => (
                <tr key={g.label}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{g.label}</td>
                  <td style={tdR}>{fmtInc(g.inc)}</td>
                  <td style={tdR}>{fmtChg(g.chg)}</td>
                  <td style={tdR}>{g.grew.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          The sharpest contrast is in the last column. In the lowest-income
          quarter, just 1.6% of municipalities grew. In the highest quarter,
          28.3% did — and of the {growers.length} municipalities nationwide
          that gained population, {growersTopShare.toFixed(1)}% sit in that
          top income quarter. Income does not guarantee growth; it stacks
          the odds heavily.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Where high income and growth coincide</h2>
        {exampleTable(pick(["08220", "13102", "12220", "12231", "23238", "13103"]))}
        <p style={{ ...para, marginBottom: 0 }}>
          Three types recur. Central Tokyo wards, where the jobs are. A
          planned science city — Tsukuba, up 11.3%, the standout large-city
          performance in this analysis. And commuter cities within reach of a
          metropolis that have made themselves attractive to young families:
          Nagareyama and Inzai near Tokyo, Nagakute near Nagoya. In each
          case, the high average income is the shadow of a concrete base of
          well-paid work in or near the town.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>The exceptions: rich, and shrinking anyway</h2>
        {exampleTable(pick(["13113", "28206", "01511"]))}
        <p style={para}>
          Shibuya is the second-richest municipality in Japan on this
          measure and still lost 2.1% of its people; Ashiya, the mature
          high-end suburb between Osaka and Kobe, lost 2.5%. Where a town is
          already built out, expensive and ageing, natural decrease proceeds
          regardless of income. Sarufutsu makes the other point: a single
          prosperous industry lifts the average income of the people who
          remain, without by itself giving the next generation a reason to
          stay.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          And then there is Tobishima Village in Aichi — the name that tops
          a different ranking. Tobishima has Japan&apos;s highest{" "}
          <em>fiscal strength index</em> (2.02), because port and industrial
          taxes fill the village office&apos;s coffers; it is the star of our
          guide to{" "}
          <Link prefetch={false} href="/en/fiscal-health" style={link}>
            fiscal strength
          </Link>
          . But its residents&apos; average taxable income is{" "}
          {fmtInc(byCode.get("23427")?.inc ?? 0)} — near the national
          average — and its population fell{" "}
          {Math.abs(byCode.get("23427")?.chg ?? 0).toFixed(1)}% in five
          years. A rich town hall is not the same as rich residents, and
          neither is the same as a growing town.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>And the other exceptions: modest incomes, growing towns</h2>
        {exampleTable(pick(["01463", "32525"]))}
        <p style={{ ...para, marginBottom: 0 }}>
          Shimukappu, a ski-resort village in Hokkaido, grew 13.8% on an
          average income below the national median; Okinawa towns such as
          Ginoza Village (+7.7%) and Yaese Town (+5.6%) grow on the strength
          of Japan&apos;s youngest age profile; Ama Town, a remote island
          community in Shimane known for actively recruiting newcomers, grew
          3.5%. Tourism, demography and deliberate welcome can each do what
          income alone does not. At the extreme, the fastest growth in Japan
          — Okuma Town, up 81% — is residents returning after the Fukushima
          nuclear evacuation, a story no income figure explains.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>What this means if you are considering a move to Japan</h2>
        <p style={para}>
          Read average income as evidence about the local labour market: a
          high figure usually means well-paid work exists in the town or
          within commuting range, and towns like that tend to hold their
          people. If your life in Japan depends on local employment, it is
          one of the first numbers worth checking — alongside the population
          trend itself, as in our guide to the{" "}
          <Link prefetch={false} href="/en/growing-towns" style={link}>
            towns that are still growing
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          But keep the three distinctions from this analysis in view. A
          fiscally strong town hall (Tobishima) does not mean wealthy
          neighbours. Wealthy neighbours (Shibuya, Ashiya) do not guarantee
          a growing town. And a modest average income does not rule out a
          lively, growing community (Shimukappu, Ama). The number shows
          where a town stands; it is not a grade, and it is not a forecast
          on its own. Correlation, finally, is not causation: it is just as
          plausible that places people move to end up with higher average
          incomes, as that high incomes attract the moves. The data shows
          the two travelling together — the direction of the arrow is a
          matter of interpretation.
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
          Income is taxable income per taxpayer from the Ministry of
          Internal Affairs and Communications&apos; survey of municipal tax
          assessments, fiscal 2025 (income earned in 2024). Population
          change compares the 2020 and 2025 national censuses (Statistics
          Bureau of Japan) for the {rows.length.toLocaleString()}{" "}
          municipalities covered by both datasets — Tokyo&apos;s special
          wards counted individually, designated-city wards within their
          cities; Futaba Town in Fukushima is excluded because the census
          records no resident population for it. Correlations are Pearson
          coefficients. The full analysis is published in Japanese as{" "}
          <Link prefetch={false} href="/articles/income-population-analysis" style={link}>
            the income × population-change cross-analysis
          </Link>
          , and every municipality&apos;s income is in the{" "}
          <Link prefetch={false} href="/ranking/taxable-income" style={link}>
            taxable income ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/richest-towns" style={link}>
            Japan&apos;s richest municipalities by income
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/fiscal-health" style={link}>
            Fiscal strength: the towns that fund themselves
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/growing-towns" style={link}>
            Japan is shrinking — but these towns are growing
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
