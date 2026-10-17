import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isReleased } from "@/lib/release";

import AdSense from "@/components/AdSense";
import DataAsOf from "@/components/DataAsOf";
import CompareCTA from "@/components/CompareCTA";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterLinks from "@/components/ClusterLinks";
import { isDesignatedCity } from "@/lib/designatedCities";
import { getMunicipalitiesPop, isShi, shortName, changePct, type CityWithPop } from "@/lib/cityPopulation";

const THRESHOLD = 300_000;

function getRows() {
  const { rows, label, use2025 } = getMunicipalitiesPop();
  const list = rows
    .filter((c) => isShi(c.name) && c.population >= THRESHOLD)
    .sort((a, b) => b.population - a.population);
  return { list, label, use2025 };
}

export function generateMetadata(): Metadata {
  const { list, use2025 } = getRows();
  const last = list[list.length - 1];
  return {
    alternates: { canonical: "/ranking/mid-cities" },
    title: `人口30万人以上の都市ランキング${use2025 ? "(2025年国勢調査)" : ""}｜全国${list.length}市を人口順に`,
    description: `人口30万人以上の市は全国に${list.length}市(${use2025 ? "令和7年国勢調査" : "令和2年国勢調査"})。最も少ないのは${shortName(last.name)}(${last.population.toLocaleString()}人)。政令指定都市・中核市クラスを人口順に並べ、2020年からの増減も一覧で比較できます。`,
  };
}

function kind(c: CityWithPop): string {
  return isDesignatedCity(c.name) ? "政令指定都市" : "その他の市";
}

export default function MidCitiesPage() {
  // 予約公開(lib/release.ts)。日付が来るまでは 404
  if (!isReleased("/ranking/mid-cities")) notFound();
  const { list, label, use2025 } = getRows();
  const designated = list.filter((c) => isDesignatedCity(c.name));
  const others = list.filter((c) => !isDesignatedCity(c.name));
  const growing = list.filter((c) => c.population > c.pop2020);
  const topGrow = [...list].sort((a, b) => changePct(b) - changePct(a))[0];
  const topDrop = [...list].sort((a, b) => changePct(a) - changePct(b))[0];
  const bands = [
    { title: "人口50万人以上", min: 500_000, max: Infinity },
    { title: "人口40万人台", min: 400_000, max: 500_000 },
    { title: "人口30万人台", min: 300_000, max: 400_000 },
  ].map((b) => ({ ...b, rows: list.filter((c) => c.population >= b.min && c.population < b.max) }));

  const faq = [
    {
      q: "人口30万人以上の市はいくつありますか？",
      a: `${list.length}市です(${label})。内訳は政令指定都市${designated.length}市、それ以外の市${others.length}市です。東京都の特別区(23区)は「市」ではないため、このランキングには含めていません。`,
    },
    {
      q: "人口30万人以上の市はすべて中核市ですか？",
      a: "いいえ。中核市の法律上の要件は人口20万人以上で、30万人以上でも中核市に移行していない市があります。また政令指定都市は中核市とは別の区分です。このランキングは区分にかかわらず、人口だけで並べています。",
    },
    {
      q: "30万人以上の市のうち、人口が増えているのはいくつですか？",
      a: `2020年と比べて人口が増えたのは${list.length}市のうち${growing.length}市です。増加率が最も高いのは${shortName(topGrow.name)}(+${changePct(topGrow).toFixed(1)}%)、減少率が最も大きいのは${shortName(topDrop.name)}(${changePct(topDrop).toFixed(1)}%)でした。`,
    },
  ];

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px" }}>
      <Breadcrumbs items={[{ name: "ランキング", href: "/ranking" }, { name: "人口30万人以上の都市" }]} />
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>🏙️ 人口30万人以上の都市ランキング</h1>

      <DataAsOf text={`${label}(総務省統計局)`} />

      <p style={{ lineHeight: 1.9, color: "#374151" }}>
        人口30万人以上の市は全国に{list.length}市あります。人口の多い順に、政令指定都市{designated.length}市と
        それ以外の{others.length}市を並べました。2020年からの増減も載せているので、人口が増えている都市・減っている
        都市の違いも確認できます。人口100万人以上の都市に限った一覧は
        <Link prefetch={false} href="/articles/million-cities" style={a}>100万人都市一覧</Link>、
        50万人以上は
        <Link prefetch={false} href="/ranking/large-cities" style={a}>人口50万人以上の都市ランキング</Link>
        をご覧ください。
      </p>

      <p style={{ lineHeight: 1.9, color: "#374151" }}>
        {use2025 ? "令和7年国勢調査の人口" : "令和2年国勢調査の人口"}で数えると、30万人以上の市のうち人口が増えたのは
        {growing.length}市、減ったのは{list.length - growing.length}市です。
      </p>

      <AdSense />

      {bands.map((b) =>
        b.rows.length === 0 ? null : (
          <section key={b.title} style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 22, marginBottom: 10 }}>
              {b.title}の市({b.rows.length}市)
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>順位</th>
                    <th style={{ ...th, textAlign: "left" }}>市</th>
                    <th style={{ ...th, textAlign: "left" }}>区分</th>
                    <th style={thNum}>人口(人)</th>
                    <th style={thNum}>2020年比</th>
                    <th style={thNum}>面積(km²)</th>
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((c) => (
                    <tr key={c.code}>
                      <td style={td}>{list.indexOf(c) + 1}</td>
                      <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                        <Link prefetch={false} href={`/city/${c.code}`} style={{ color: "#1d4ed8" }}>
                          {c.name}
                        </Link>
                      </td>
                      <td style={{ ...td, textAlign: "left" }}>{kind(c)}</td>
                      <td style={tdNum}>{c.population.toLocaleString()}</td>
                      <td style={tdNum}>
                        {changePct(c) > 0 ? "+" : ""}
                        {changePct(c).toFixed(1)}%
                      </td>
                      <td style={tdNum}>{c.area != null ? c.area.toLocaleString(undefined, { maximumFractionDigits: 1 }) : "―"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      )}

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 22 }}>Q&amp;A：人口30万人以上の都市</h2>
        {faq.map((f) => (
          <p key={f.q} style={{ lineHeight: 1.9 }}>
            <strong>Q. {f.q}</strong>
            <br />
            A. {f.a}
          </p>
        ))}
      </section>

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

      <ClusterLinks current="/ranking/mid-cities" />
      <CompareCTA />
    </main>
  );
}

const a: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thNum: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdNum: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
