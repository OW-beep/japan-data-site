import Link from "next/link";

import { getCities } from "@/lib/getCities";
import { getMunicipalities } from "@/lib/municipalities";
import { getCities2025 } from "@/lib/city2025";
import { SITE_NAME } from "@/lib/site";

const PATH = "/en/growing-towns";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Japan Is Shrinking — But These Towns Are Still Growing | Japan Municipal Data",
  description:
    "Between the 2020 and 2025 censuses, 9 in 10 Japanese municipalities lost population. The 169 that grew tell you where Japan's future is being built: a science city, a childcare-first commuter city, and Tokyo's returning centre. Census data for all 1,740 municipalities.",
  openGraph: {
    title: "Japan Is Shrinking — But These Towns Are Still Growing",
    description:
      "Only 169 of 1,740 municipalities grew between the 2020 and 2025 censuses. Here is who they are, and why.",
    images: ["/images/og-default.png"],
  },
};

export default function Page() {
  const muniCodes = new Set(getMunicipalities().map((c) => c.code));
  const pop2025 = new Map(getCities2025().map((c) => [c.code, c.population]));
  const rows = getCities()
    .filter((c) => muniCodes.has(c.code) && pop2025.has(c.code) && c.population > 0)
    .map((c) => ({
      code: c.code,
      name: c.name,
      pop: c.population,
      chg: (((pop2025.get(c.code) as number) - c.population) / c.population) * 100,
    }));
  const grew = rows.filter((r) => r.chg > 0).length;
  const growers = rows
    .filter((r) => r.pop >= 50000)
    .sort((a, b) => b.chg - a.chg)
    .slice(0, 6);
  const shortName = (n: string) => n.split(" ").pop() ?? n;
  const prefName = (n: string) => n.split(" ")[0] ?? "";

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Growing towns
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 16 }}>
        Japan Is Shrinking — But These Towns Are Still Growing
      </h1>
      <p style={lead}>
        Between the 2020 and 2025 national censuses, the combined population of
        Japan&apos;s {rows.length.toLocaleString()} municipalities fell by about
        2.5%. <strong>Nine in ten municipalities shrank.</strong> Only{" "}
        {grew} grew at all. If you are thinking about living in Japan — or just
        trying to understand where the country is heading — those {grew}{" "}
        exceptions are the most informative places on the map.
      </p>

      <section style={card}>
        <h2 style={h2}>The fastest-growing real towns (population 50,000+)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>City</th>
                <th style={thR}>Population (2020)</th>
                <th style={thR}>Change 2020→25</th>
              </tr>
            </thead>
            <tbody>
              {growers.map((d) => (
                <tr key={d.code}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {shortName(d.name)}
                    <span style={{ color: "#6b7280", fontWeight: 400 }}> ({prefName(d.name)})</span>
                  </td>
                  <td style={tdR}>{d.pop.toLocaleString()}</td>
                  <td style={tdR}>+{d.chg.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={para}>
          Three different recipes appear. <strong>Tsukuba</strong> (Ibaraki,
          +11%) is Japan&apos;s planned science city — national laboratories
          and a university keep importing researchers and students.{" "}
          <strong>Nagareyama</strong> (Chiba, +8%) ran the opposite play: a
          commuter city that marketed itself directly at young parents
          (&quot;If you become a mother, come to Nagareyama&quot;) and built
          childcare capacity ahead of demand. <strong>Inzai</strong> (Chiba,
          +8%) is a new town that added data centres and logistics jobs on top
          of Tokyo access. And central Tokyo wards like Chuo and Taito are
          growing again as redevelopment pulls residents back into the centre.
        </p>
        <p style={para}>
          The pattern is consistent: growth is not random, and it is rarely
          about scenery. It follows <strong>jobs, childcare, and rail
          access</strong> — in some combination.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>What about the towns that &quot;pay you to move&quot;?</h2>
        <p style={para}>
          Videos claiming Japan pays foreigners to move to empty villages are
          half true. A national relocation grant (up to ¥1 million per person,
          more for families) genuinely exists, and many municipalities stack
          their own housing and renovation subsidies on top. But the fine
          print matters: the national grant is for people <strong>moving out
          of the Tokyo metropolitan area</strong>, and nearly all of these
          programmes assume you already hold a Japanese residence status and
          are registered as a resident. They are relocation support for people
          already living in Japan — not a visa route for moving from abroad.
        </p>
        <p style={para}>
          The data above suggests a more reliable strategy anyway: pick a town
          whose fundamentals are already working — growing or stable
          population, functioning services — and then check its newcomer
          support. A generous grant in a town losing 10% of its people every
          five years buys you a cheap house in a place whose clinic and train
          line are at risk. Our{" "}
          <Link prefetch={false} href="/en/akiya" style={link}>
            akiya data guide
          </Link>{" "}
          shows how to combine vacancy, land price and population trend to
          screen towns before you fall in love with a listing.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Population figures are from Japan&apos;s national censuses of 2020
          and 2025 (Statistics Bureau of Japan), covering all{" "}
          {rows.length.toLocaleString()} municipalities in our database
          (Tokyo&apos;s special wards counted individually). Growth rates are
          computed on each municipality&apos;s census population. The full
          dataset, in Japanese, is behind the{" "}
          <Link prefetch={false} href="/ranking/population" style={link}>
            population ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/akiya" style={link}>
            Akiya: where the empty houses really are
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/hidden-gems" style={link}>
            3 towns the crowds haven&apos;t found yet
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
