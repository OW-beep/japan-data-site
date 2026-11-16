import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/cheapest-land";

export const metadata = {
  alternates: { canonical: PATH },
  title: "The Cheapest Land in Japan: Towns Where a Square Metre Costs Less Than Lunch | Japan Municipal Data",
  description:
    "Average residential land transactions in Japan range from ¥4.47 million per m² in Tokyo's Minato Ward to ¥556 in Tenei Village, Fukushima. The cheapest-land ranking from official transaction data — including towns with real populations where land still costs under ¥2,500/m².",
  openGraph: {
    title: "The Cheapest Land in Japan",
    description:
      "Land at ¥556 per square metre exists — about $4. Where Japan's cheapest residential land is, and what those towns are actually like.",
    images: ["/images/og-default.png"],
  },
};

const CHEAPEST: [string, string, string, string, string][] = [
  ["Tenei", "Fukushima", "¥556", "~$4", "5,194"],
  ["Shiranuka", "Hokkaido", "¥1,022", "~$7", "7,289"],
  ["China", "Kagoshima", "¥1,216", "~$8", "5,750"],
  ["Isen", "Kagoshima", "¥1,504", "~$10", "6,139"],
  ["Taiki", "Mie", "¥1,648", "~$11", "7,815"],
  ["Ebino", "Miyazaki", "¥1,721", "~$11", "17,638"],
  ["Shirakawa", "Gifu", "¥1,754", "~$12", "7,412"],
  ["Aguni", "Okinawa", "¥1,767", "~$12", "683"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Cheapest land
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        The Cheapest Land in Japan
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published August 18, 2026</p>
      <p style={lead}>
        The median Japanese municipality in our transaction data trades
        residential land at about <strong>¥16,875 per square metre</strong>{" "}
        (roughly $113). But the distribution has a very long tail. At the
        bottom, a square metre of land costs less than a convenience-store
        coffee — and a standard 100 m² building plot can cost less than a used
        bicycle. Here is where Japan&apos;s cheapest land is, with the caveats
        that matter.
      </p>

      <section style={card}>
        <h2 style={h2}>The cheapest residential land in Japan (per m²)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Town</th>
                <th style={thR}>Land price (¥/m²)</th>
                <th style={thR}>In dollars</th>
                <th style={thR}>Population</th>
              </tr>
            </thead>
            <tbody>
              {CHEAPEST.map(([n, p, y, d, pop]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{y}</td>
                  <td style={tdR}>{d}</td>
                  <td style={tdR}>{pop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={para}>
          Tenei Village in Fukushima tops the list at an average of ¥556/m² —
          a 100 m² plot for about ¥56,000 (roughly $370). China Town on
          Okinoerabu Island in Kagoshima (yes, it is pronounced
          &quot;China&quot;; the characters mean &quot;knowledge&quot; and
          &quot;name&quot;) comes in at ¥1,216. Most of the list is mountainous
          or island country in Hokkaido, Kyushu and Okinawa.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          These are averages of actual transactions over the past year, and in
          small towns the sample can be a handful of sales — treat the exact
          figures as indicative, not as asking prices.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Cheap land in towns with real populations</h2>
        <p style={para}>
          Micro-villages are not for everyone. Filtering for towns of 10,000+
          residents, land is still remarkably cheap: Ebino City (Miyazaki,
          17,638 people) averages ¥1,721/m², Kimotsuki Town (Kagoshima,
          14,227) ¥2,031, and Higashiagatsuma Town (Gunma, 12,728) ¥2,495 —
          with 26 recorded transactions, the most robust sample on this list.
          In Ebino, a 100 m² plot averages around ¥172,000 (about $1,150). The
          constraint in these towns is rarely the land; it is the cost of
          building or renovating on it, which is why our{" "}
          <Link prefetch={false} href="/en/akiya" style={link}>
            akiya guide
          </Link>{" "}
          focuses on the total cost of the house, not just the plot.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          For the opposite extreme, see{" "}
          <Link prefetch={false} href="/en/most-expensive-land" style={link}>
            Japan&apos;s most expensive land
          </Link>
          : the gap between Tenei and Tokyo&apos;s Minato Ward is a factor of
          about 8,000.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Cheap land, surprising twist: the furusato effect</h2>
        <p style={para}>
          Shiranuka Town (Hokkaido), second-cheapest land in Japan at
          ¥1,022/m², is simultaneously the country&apos;s #2 recipient of{" "}
          <Link prefetch={false} href="/en/furusato-hometown-tax" style={link}>
            furusato nozei hometown-tax donations
          </Link>{" "}
          — ¥22.3 billion in a year, over ¥3 million per resident, driven by
          seafood gifts. A town can be nearly worthless as real estate and
          extremely valuable as a brand. The harder truth runs the other way:
          most towns on this page are shrinking (Tenei lost 7.1% of its people
          between censuses), which is precisely why their land is cheap. Cheap
          land is an opportunity only if the town&apos;s services — clinic,
          school, bus — will still be there in twenty years. Screen for that
          first, price second.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Land prices are average residential transaction prices per m² from
          the Ministry of Land, Infrastructure, Transport and Tourism&apos;s
          Real Estate Information Library (most recent year), for
          municipalities with at least five recorded transactions. Dollar
          figures use ¥150 = $1, rounded. The full dataset, in Japanese, is
          behind the{" "}
          <Link prefetch={false} href="/ranking/real-estate-price" style={link}>
            land-price ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/akiya" style={link}>
            Akiya: where the empty houses really are
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/most-expensive-land" style={link}>
            Japan&apos;s most expensive land
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/furusato-hometown-tax" style={link}>
            Furusato nozei, explained with data
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/shrinking-towns" style={link}>
            The fastest-shrinking towns in Japan
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
