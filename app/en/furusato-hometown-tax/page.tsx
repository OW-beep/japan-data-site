import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/furusato-hometown-tax";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Furusato Nozei Explained: Japan's ¥1.31 Trillion Hometown Tax, With Data | Japan Municipal Data",
  description:
    "Furusato nozei lets Japanese taxpayers redirect part of their residence tax to any town in Japan — and receive wagyu, scallops or rice in return. How the system works, the FY2025 ranking of recipient towns (¥1.31 trillion total), and the village that receives ¥3 million per resident.",
  openGraph: {
    title: "Furusato Nozei: Japan's Hometown Tax, Explained With Data",
    description:
      "¥1.31 trillion a year moves from big cities to rural towns through one tax scheme. How it works — and who wins.",
    images: ["/images/og-default.png"],
  },
};

const TOP: [string, string, string, string, string][] = [
  ["Izumisano", "Osaka", "¥23.0B", "1,351,688", "100,131"],
  ["Shiranuka", "Hokkaido", "¥22.3B", "1,276,246", "7,289"],
  ["Miyakonojo", "Miyazaki", "¥21.7B", "1,058,404", "160,640"],
  ["Betsukai", "Hokkaido", "¥21.2B", "1,337,531", "14,380"],
  ["Nagoya", "Aichi", "¥17.5B", "351,726", "2,345,186"],
  ["Miyazaki", "Miyazaki", "¥14.3B", "737,009", "399,295"],
  ["Kesennuma", "Miyagi", "¥13.5B", "717,493", "57,232"],
  ["Kyoto", "Kyoto", "¥13.3B", "347,695", "1,430,062"],
  ["Monbetsu", "Hokkaido", "¥12.5B", "715,569", "21,207"],
  ["Nemuro", "Hokkaido", "¥12.3B", "687,002", "23,546"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Furusato nozei
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Furusato Nozei: Japan&apos;s Hometown Tax, Explained
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published November 3, 2026</p>
      <p style={lead}>
        Every year, tens of millions of Japanese taxpayers do something no
        other country quite allows: they choose a town — any town — and send
        it part of their tax money, receiving local delicacies in return. In
        fiscal 2025 the system moved <strong>¥1.31 trillion</strong> (about
        $8.7 billion) across <strong>59.0 million donations</strong>. It is
        part tax policy, part e-commerce, and it has quietly become one of
        the largest revenue sources in rural Japan.
      </p>

      <section style={card}>
        <h2 style={h2}>How it works</h2>
        <p style={para}>
          <strong>1. You donate</strong> to any municipality in Japan through
          a portal site — ¥10,000, ¥50,000, whatever you choose.{" "}
          <strong>2. The town sends a thank-you gift</strong> of local
          products — wagyu beef, scallops, rice, fruit, craft goods — capped
          by rule at 30% of the donation&apos;s value.{" "}
          <strong>3. You claim it back:</strong> the donation minus a ¥2,000
          self-payment is deducted from your income and residence taxes, up
          to a cap based on your income. Net cost to most donors: ¥2,000,
          plus a freezer full of regional food.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          The name means &quot;hometown tax payment&quot;, and the original
          idea (2008) was letting people support the rural towns they grew up
          in. In practice most donors have never visited the towns they fund:
          they are shopping. That tension — solidarity versus shopping — is
          the system&apos;s permanent debate, and the gift cap and local-
          product rules exist to keep it from becoming pure mail-order.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Who receives the money (FY2025)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Town</th>
                <th style={thR}>Received</th>
                <th style={thR}>Donations</th>
                <th style={thR}>Population</th>
              </tr>
            </thead>
            <tbody>
              {TOP.map(([n, p, amt, cnt, pop]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={tdR}>{amt}</td>
                  <td style={tdR}>{cnt}</td>
                  <td style={tdR}>{pop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          The winners are food towns. Izumisano (Osaka) — a gateway city near
          Kansai Airport that pioneered aggressive gift catalogues — leads
          with ¥23.0 billion. Behind it, Hokkaido fishing and dairy towns
          (Shiranuka, Betsukai, Monbetsu, Nemuro) convert scallops, crab and
          milk into municipal revenue, and Miyakonojo (Miyazaki) does the
          same with beef and pork — it is also #2 in our{" "}
          <Link prefetch={false} href="/en/farming-towns" style={link}>
            farming output ranking
          </Link>
          .
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Per resident, the numbers turn surreal</h2>
        <p style={para}>
          Shiranuka Town, population 7,289, received ¥22.3 billion —{" "}
          <strong>¥3.06 million per resident</strong>, more than many towns&apos;
          entire tax take per person. Betsukai received ¥1.47 million per
          resident; Akamura Village (Fukuoka) ¥1.22 million. For these towns,
          furusato nozei is not a bonus but a pillar of the budget — which is
          why the system&apos;s rules matter so much, and why its flip side
          is real: every yen redirected is a yen of residence tax that a big
          city does not collect from the donor who actually uses its services
          (the imbalance our{" "}
          <Link prefetch={false} href="/en/daytime-population" style={link}>
            daytime population
          </Link>{" "}
          data makes vivid).
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          Cross-reference one more table and a curiosity appears: Shiranuka
          is also #2 on our{" "}
          <Link prefetch={false} href="/en/cheapest-land" style={link}>
            cheapest land
          </Link>{" "}
          ranking, at ¥1,022 per m². Some of Japan&apos;s fiscally luckiest
          towns sit on some of its cheapest land — wealth by catalogue, not
          by location.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Figures are from the Ministry of Internal Affairs and
          Communications&apos; annual furusato nozei survey for fiscal 2025
          (donations received April 2025 – March 2026), matched to
          municipalities by name; populations are from the 2020 census in the
          same compilation. Dollar figures use ¥150 = $1, rounded. The full
          dataset, in Japanese, is behind the{" "}
          <Link prefetch={false} href="/ranking/furusato-nozei" style={link}>
            furusato-nozei ranking
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/farming-towns" style={link}>
            Japan&apos;s farming powerhouses
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/fiscal-health" style={link}>
            Fiscal strength: the towns that fund themselves
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/cheapest-land" style={link}>
            The cheapest land in Japan
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
