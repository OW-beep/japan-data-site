import Link from "next/link";

import { getCities } from "@/lib/getCities";
import { getMunicipalities } from "@/lib/municipalities";
import { getCities2025 } from "@/lib/city2025";
import { getRealEstatePriceRanking } from "@/lib/realEstatePrice";
import { SITE_NAME } from "@/lib/site";

const PATH = "/en/akiya";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Akiya in Japan: Where the Empty Houses Really Are — Data From 1,000+ Towns | Japan Municipal Data",
  description:
    "Japan has about 9 million empty homes (akiya). But the towns with the highest vacancy rates are famous resorts, not dying villages. Using official data from over 1,000 municipalities, we show where akiya are plentiful, land is cheap, and towns are still alive.",
  openGraph: {
    title: "Akiya in Japan: Where the Empty Houses Really Are",
    description:
      "The highest vacancy rates in Japan are in resort towns like Karuizawa (70%). A data-first guide to finding akiya in towns that are still alive.",
    images: ["/images/og-default.png"],
  },
};

const usd = (yen: number) => Math.round(yen / 150);

export default function Page() {
  const muniCodes = new Set(getMunicipalities().map((c) => c.code));
  const pop2025 = new Map(getCities2025().map((c) => [c.code, c.population]));
  const priceByCode = new Map(
    getRealEstatePriceRanking()
      .filter((r) => r.landPricePerSqm != null)
      .map((r) => [r.code, r.landPricePerSqm as number]),
  );
  const data = getCities()
    .filter(
      (c) =>
        muniCodes.has(c.code) &&
        c.vacantHouseCount != null &&
        c.totalHousingCount != null &&
        c.totalHousingCount > 0 &&
        priceByCode.has(c.code) &&
        pop2025.has(c.code),
    )
    .map((c) => ({
      code: c.code,
      name: c.name,
      vac: ((c.vacantHouseCount as number) / (c.totalHousingCount as number)) * 100,
      price: priceByCode.get(c.code) as number,
      pop: c.population,
      chg: ((pop2025.get(c.code) as number) - c.population) / c.population * 100,
    }));

  const topVac = [...data].sort((a, b) => b.vac - a.vac).slice(0, 5);
  // Plentiful akiya + cheap land + a town that is not collapsing
  const shortlist = data
    .filter((d) => d.vac >= 18 && d.price < 15000 && d.chg >= -5 && d.pop >= 3000)
    .sort((a, b) => b.vac - a.vac)
    .slice(0, 6);

  const shortName = (n: string) => n.split(" ").pop() ?? n;
  const prefName = (n: string) => n.split(" ")[0] ?? "";

  const table = (
    list: typeof data,
    cols: ("vac" | "price" | "pop" | "chg")[],
  ) => (
    <div style={{ overflowX: "auto" }}>
      <table style={tbl}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: "left" }}>Town</th>
            {cols.includes("vac") && <th style={thR}>Vacancy rate</th>}
            {cols.includes("price") && <th style={thR}>Land price (¥/m²)</th>}
            {cols.includes("pop") && <th style={thR}>Population</th>}
            {cols.includes("chg") && <th style={thR}>Pop. change 2020→25</th>}
          </tr>
        </thead>
        <tbody>
          {list.map((d) => (
            <tr key={d.code}>
              <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                {shortName(d.name)}
                <span style={{ color: "#6b7280", fontWeight: 400 }}> ({prefName(d.name)})</span>
              </td>
              {cols.includes("vac") && <td style={tdR}>{d.vac.toFixed(1)}%</td>}
              {cols.includes("price") && (
                <td style={tdR}>
                  ¥{d.price.toLocaleString()} (~${usd(d.price)})
                </td>
              )}
              {cols.includes("pop") && <td style={tdR}>{d.pop.toLocaleString()}</td>}
              {cols.includes("chg") && (
                <td style={tdR}>{d.chg >= 0 ? "+" : ""}{d.chg.toFixed(1)}%</td>
              )}
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
        {" / "}Akiya
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 16 }}>
        Akiya in Japan: Where the Empty Houses Really Are
      </h1>
      <p style={lead}>
        Japan has roughly <strong>9 million empty homes</strong> — about one in seven
        houses — and international interest in buying them has surged. But most
        &quot;akiya&quot; content stops at the headline. We publish official data for
        every Japanese municipality, so we asked a more useful question:
        <strong> where are the empty houses, and which of those towns are still
        good places to live?</strong> The answer has a twist.
      </p>

      <section style={card}>
        <h2 style={h2}>The twist: Japan&apos;s emptiest towns are its richest resorts</h2>
        <p style={para}>
          Rank every municipality by vacancy rate and the top of the list is not
          dying villages. It is Karuizawa, Nasu and Atami — famous holiday-home
          country:
        </p>
        {table(topVac, ["vac", "price"])}
        <p style={para}>
          The reason is a definition. In Japan&apos;s housing statistics, a
          &quot;vacant home&quot; includes <strong>second homes and holiday
          houses</strong> that sit empty most of the year. A 70% vacancy rate in
          Karuizawa does not signal collapse; it signals demand from wealthy
          Tokyo households. The akiya that make headlines — abandoned farmhouses
          sold for a few thousand dollars — are a different category, and they
          are not where the vacancy rate is highest.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>A better shortlist: plenty of akiya, cheap land, town still alive</h2>
        <p style={para}>
          For actually living somewhere, three numbers matter together: a high
          vacancy rate (choice of houses), low land prices (your budget goes
          further), and a population that is not in free fall (shops, clinics
          and trains keep running). Filtering all {data.length.toLocaleString()}{" "}
          municipalities with complete data on those three conditions leaves a
          short list:
        </p>
        {table(shortlist, ["vac", "price", "pop", "chg"])}
        <p style={para}>
          These are real small cities, not ghost towns. Komoro (Nagano) pairs a
          24% vacancy rate with land around ¥12,000/m² — roughly $80 — and a
          castle-town centre on a rail line to Nagano City. Bungotakada (Oita)
          is known inside Japan for actively courting newcomers. Nasushiobara
          (Tochigi) even has a Shinkansen station. At these land prices, a
          100 m² plot costs around ¥1.0–1.5 million (about $7,000–10,000) —
          before the house itself, which is where akiya prices come in.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>How buying an akiya actually works</h2>
        <p style={para}>
          Most cheap akiya never reach commercial property portals. They are
          listed in <strong>akiya banks</strong> (空き家バンク) — databases run
          by municipalities to match empty houses with newcomers. The typical
          process: register with the town&apos;s akiya bank, view listed
          properties (often with a town officer present), negotiate directly
          with the owner, and sign through a local real-estate agent. Many
          towns add renovation subsidies for buyers who move in, though amounts
          and conditions vary widely.
        </p>
        <p style={para}>
          Foreign nationals can buy property in Japan on the same terms as
          citizens — there is no residency requirement for ownership. The fine
          print that matters:
        </p>
        <ul style={{ ...para, paddingLeft: 22 }}>
          <li><strong>Owning a house does not give you a visa.</strong> You need an independent right to live in Japan.</li>
          <li><strong>The purchase price is the small part.</strong> Budget for renovation (often ¥3–10 million for an old wooden house), taxes, agent and registration fees, and ongoing fixed-asset tax.</li>
          <li><strong>Rules tightened in 2026.</strong> New disclosure and reporting requirements for property purchases have been introduced; check the current requirements with a judicial scrivener (司法書士) before you buy.</li>
          <li><strong>Old houses may not meet current earthquake codes</strong>, and some cannot legally be rebuilt on their plot. Verify before signing.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Vacancy rates are each municipality&apos;s share of vacant homes in
          total housing (including second homes, as defined in Japan&apos;s
          housing statistics). Land prices are average transaction prices per
          m² from the Ministry of Land, Infrastructure, Transport and
          Tourism&apos;s Real Estate Information Library. Population change is
          between the 2020 and 2025 national censuses. Dollar figures use
          ¥150 = $1, rounded. Our full datasets (in Japanese) are behind the{" "}
          <Link prefetch={false} href="/ranking/vacant-house" style={link}>
            vacancy-rate ranking
          </Link>{" "}
          and the{" "}
          <Link prefetch={false} href="/ranking/real-estate-price" style={link}>
            land-price ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/growing-towns" style={link}>
            Japan is shrinking — but these towns are growing
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
