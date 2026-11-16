import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/fiscal-health";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Fiscal Strength in Japan: The Towns That Fund Themselves | Japan Municipal Data",
  description:
    "Only 70 of Japan's 1,717 fiscally-measured municipalities can fund standard services from their own taxes. The fiscal strength index ranking — nuclear plants, ports, resorts and one very rich Tokyo suburb — and why rich finances don't always mean a growing town.",
  openGraph: {
    title: "Fiscal Strength: The Towns That Fund Themselves",
    description:
      "A fiscal strength index of 1.0 means self-funding. Only 70 of 1,717 municipalities clear it. Here's who, and why.",
    images: ["/images/og-default.png"],
  },
};

const FISCAL: [string, string, string, string, string][] = [
  ["Tobishima", "Aichi", "2.02", "4,575", "Port industry (Nagoya port area)"],
  ["Rokkasho", "Aomori", "1.62", "10,367", "Nuclear fuel reprocessing plant"],
  ["Karuizawa", "Nagano", "1.50", "19,188", "Villa resort town"],
  ["Tomari", "Hokkaido", "1.49", "1,569", "Nuclear power plant"],
  ["Musashino", "Tokyo", "1.48", "150,149", "Affluent residential city"],
  ["Okuma", "Fukushima", "1.46", "847", "Nuclear plant / recovery works"],
  ["Urayasu", "Chiba", "1.43", "171,362", "Tokyo Disney Resort"],
  ["Tokai", "Ibaraki", "1.36", "37,891", "Nuclear power plant"],
  ["Kariwa", "Niigata", "1.36", "4,380", "Kashiwazaki-Kariwa nuclear plant"],
  ["Kamisu", "Ibaraki", "1.35", "95,454", "Kashima industrial zone"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Fiscal health
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Fiscal Strength: The Towns That Fund Themselves
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published September 29, 2026</p>
      <p style={lead}>
        Japan measures every municipality with a &quot;fiscal strength
        index&quot;: the ratio of a town&apos;s own tax revenue to the cost
        of a standard basket of local services. Score 1.0 and you can fund
        yourself; score below it and the national government tops you up with
        equalisation grants. The median municipality scores 0.44. Only{" "}
        <strong>70 of 1,717 municipalities score 1.0 or higher</strong> — and
        the list of who clears the bar reads like a catalogue of Japan&apos;s
        special economies.
      </p>

      <section style={card}>
        <h2 style={h2}>The 10 fiscally strongest municipalities</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Town</th>
                <th style={thR}>Index</th>
                <th style={thR}>Population</th>
                <th style={{ ...th, textAlign: "left" }}>Why</th>
              </tr>
            </thead>
            <tbody>
              {FISCAL.map(([n, p, idx, pop, why]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{idx}</td>
                  <td style={tdR}>{pop}</td>
                  <td style={{ ...td, textAlign: "left" }}>{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Tobishima Village, a port-industrial corner of the Nagoya port
          area, tops the ranking at 2.02 — it raises twice what standard
          services cost. The single most common recipe on the list, though,
          is hosting a nuclear facility: Rokkasho, Tomari, Tokai and Kariwa
          all convert plant property taxes and related revenues into fiscal
          strength far beyond their size. Tomari Village in Hokkaido — 1,569
          residents — is the famous case: its index of 1.49 puts it ahead of
          every big city in Japan.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Strong finances ≠ a thriving town</h2>
        <p style={para}>
          Cross this ranking with population change and the story complicates.
          Tomari shrank 5.7% between the 2020 and 2025 censuses despite its
          wealth; Hakone (index 1.33) shrank 9.1%; Tobishima shrank 4.1%.
          A big fixed-asset tax base pays for excellent facilities, but it
          does not by itself give young families a reason to stay — the jobs
          at a power plant or a port terminal are few relative to the
          revenue they generate.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          The reverse also holds: many fast-growing suburbs score below 1.0
          and rely partly on transfers while their populations boom. Fiscal
          strength measures a town hall&apos;s wallet, not a town&apos;s
          vitality — the two correlate far less than either side of the
          debate usually admits. For the other end of the scale, Yubari City
          in Hokkaido — which effectively went bankrupt in 2007 and remains
          Japan&apos;s only municipality under a national fiscal
          reconstruction plan — anchors our{" "}
          <Link prefetch={false} href="/en/shrinking-towns" style={link}>
            shrinking towns
          </Link>{" "}
          and{" "}
          <Link prefetch={false} href="/en/future-2050" style={link}>
            2050 projections
          </Link>{" "}
          coverage. And on the revenue side, the newest fiscal force in rural
          Japan is not a plant at all but donations: see our{" "}
          <Link prefetch={false} href="/en/furusato-hometown-tax" style={link}>
            furusato nozei explainer
          </Link>
          .
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          The fiscal strength index (財政力指数) is the three-year average
          published by the Ministry of Internal Affairs and Communications in
          its local public finance statistics; municipalities with complete
          fiscal data number 1,717 of the 1,740. Population change compares
          the 2020 and 2025 national censuses. The full dataset, in Japanese,
          is behind the{" "}
          <Link prefetch={false} href="/ranking/finance" style={link}>
            fiscal-strength ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/richest-towns" style={link}>
            Japan&apos;s richest municipalities
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/furusato-hometown-tax" style={link}>
            Furusato nozei, explained with data
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/shrinking-towns" style={link}>
            The fastest-shrinking towns in Japan
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/daytime-population" style={link}>
            Daytime population extremes
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
