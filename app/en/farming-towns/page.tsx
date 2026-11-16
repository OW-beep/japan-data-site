import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/farming-towns";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Japan's Farming Powerhouses: The Towns That Feed the Country | Japan Municipal Data",
  description:
    "Tahara City produces ¥93 billion of farm output a year — cabbage, tomatoes, melons. The top 10 agricultural municipalities in Japan by output value, plus the villages where farming is worth over ¥4 million per resident.",
  openGraph: {
    title: "Japan's Farming Powerhouses",
    description:
      "¥93 billion of vegetables from one city. Japan's top farming municipalities by output — and the per-resident champions.",
    images: ["/images/og-default.png"],
  },
};

const TOP10: [string, string, string, string][] = [
  ["Tahara", "Aichi", "¥93.4B", "Cabbage, tomatoes, melons"],
  ["Miyakonojo", "Miyazaki", "¥92.1B", "Pork, beef cattle, taro"],
  ["Niigata", "Niigata", "¥71.0B", "Rice, daikon, pears"],
  ["Betsukai", "Hokkaido", "¥70.3B", "Raw milk (dairy)"],
  ["Hokota", "Ibaraki", "¥66.4B", "Melons, sweet potatoes, strawberries"],
  ["Hirosaki", "Aomori", "¥62.1B", "Apples"],
  ["Hamamatsu", "Shizuoka", "¥59.3B", "Mikan oranges, onions"],
  ["Maebashi", "Gunma", "¥57.7B", "Eggs, eggplants, pork"],
  ["Kumamoto", "Kumamoto", "¥57.3B", "Watermelons, eggplants, melons"],
  ["Kanoya", "Kagoshima", "¥56.9B", "Beef cattle, pork, broilers"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Farming towns
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Japan&apos;s Farming Powerhouses
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published September 22, 2026</p>
      <p style={lead}>
        Japan imports about 60% of its calories, so the towns that produce
        the other 40% matter out of proportion to their size. Ranked by the
        value of agricultural output, the leaders are not Tokyo-adjacent
        market gardens but big, specialised production regions — a vegetable
        peninsula in Aichi, a livestock basin in Miyazaki, a dairy plain in
        eastern Hokkaido. Here are the towns that feed Japan.
      </p>

      <section style={card}>
        <h2 style={h2}>The top 10 municipalities by farm output (2024)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Town</th>
                <th style={thR}>Output / year</th>
                <th style={{ ...th, textAlign: "left" }}>Known for</th>
              </tr>
            </thead>
            <tbody>
              {TOP10.map(([n, p, v, k]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{v}</td>
                  <td style={{ ...td, textAlign: "left" }}>{k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Tahara City, on the Atsumi Peninsula in Aichi, is Japan&apos;s #1
          farming municipality at ¥93.4 billion a year (about $620 million) —
          a greenhouse and open-field vegetable machine that also ranks among
          the country&apos;s top producers of cabbage and melons. Miyakonojo
          (Miyazaki) is its livestock mirror: pork and wagyu beef from the
          Kirishima foothills. Hirosaki is the apple capital — a single-crop
          identity the whole city is organised around.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Per resident, the villages win</h2>
        <p style={para}>
          Divide output by population and the leaderboard flips to
          large-scale farming villages. Ogata Village (Akita) — built on
          reclaimed land from Lake Hachirogata and farmed in huge plots —
          produces <strong>¥7.07 million of output per resident</strong>.
          Shihoro Town in Hokkaido&apos;s Tokachi plain reaches ¥5.94
          million, Betsukai ¥4.89 million, and Kawakami Village (Nagano)
          ¥4.58 million from highland lettuce grown at 1,100 m — the same
          Kawakami that tops our{" "}
          <Link prefetch={false} href="/en/highest-towns" style={link}>
            highest towns
          </Link>{" "}
          ranking. Altitude is a farming asset for cool-climate vegetables;
          the mountains that empty a town of people can fill it with produce.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          The overlap with money flows is striking. Betsukai is simultaneously
          a top-5 farm town and a top-5 recipient of{" "}
          <Link prefetch={false} href="/en/furusato-hometown-tax" style={link}>
            furusato nozei donations
          </Link>{" "}
          (¥21.2 billion a year): the same dairy and seafood that fill its
          output statistics fill the gift catalogues that urban taxpayers
          choose from. In modern Japan, a strong farm sector is also a
          marketing sector.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Output values are municipal agricultural output estimates for 2024
          from the Ministry of Agriculture, Forestry and Fisheries (municipal
          estimates apportioned from prefectural totals; they are production
          estimates, not farm-gate sales records). Signature products are the
          items in which each municipality ranks in the national top 30 in
          the same dataset. Dollar figures use ¥150 = $1, rounded. The full
          dataset, in Japanese, is behind the{" "}
          <Link prefetch={false} href="/ranking/agri" style={link}>
            agricultural-output ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/furusato-hometown-tax" style={link}>
            Furusato nozei, explained with data
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/highest-towns" style={link}>
            Japan&apos;s highest towns
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/richest-towns" style={link}>
            Japan&apos;s richest municipalities
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/company-towns" style={link}>
            Where Japan&apos;s new companies are born
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
