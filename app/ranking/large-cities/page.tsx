import type { Metadata } from "next";
import Link from "next/link";

import MetricBox from "../../../components/MetricBox";
import LargeCitySummary from "../../../components/ranking/LargeCitySummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import JsonLd from "../../../components/JsonLd";
import CompareCTA from "../../../components/CompareCTA";
import AffiliateSlot from "../../../components/AffiliateSlot";
import { dataSources } from "../../../lib/dataSources";
import { getCities } from "../../../lib/getCities";
import { getMunicipalities } from "../../../lib/municipalities";
import type { City } from "../../../lib/City";
import {
  isDesignatedCity,
  normalizeCityName as normalize,
} from "../../../lib/designatedCities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/large-cities" },
  title: "人口50万人以上の都市ランキング｜政令指定都市など大都市を人口順に一覧比較",
  description:
    "人口50万人以上の都市を人口順にランキング。100万人以上・70万人台〜90万人台・50万人台〜60万人台の3区分で、政令指定都市・特別区・その他の市の人口、面積、人口密度、高齢化率を一覧で比較できます。",
};

const THRESHOLD = 500_000;

type Kind = "政令指定都市" | "特別区" | "その他の市";

type Row = City & { kind: Kind };

function kindOf(name: string): Kind {
  const n = normalize(name);
  if (isDesignatedCity(n)) return "政令指定都市";
  if (n.startsWith("東京都 ") && n.endsWith("区")) return "特別区";
  return "その他の市";
}

function agingRate(c: City): string {
  if (c.elderlyPopulation == null || c.population <= 0) return "―";
  return `${((c.elderlyPopulation / c.population) * 100).toFixed(1)}%`;
}

export default function LargeCitiesRankingPage() {
  const all = getMunicipalities();

  const ranking: Row[] = all
    .filter((c) => c.population >= THRESHOLD)
    .sort((a, b) => b.population - a.population)
    .map((c) => ({ ...c, kind: kindOf(c.name) }));

  if (ranking.length === 0) {
    return null;
  }

  const rankOf = new Map(ranking.map((c, i) => [c.code, i + 1]));

  const band100 = ranking.filter((c) => c.population >= 1_000_000);
  const band70 = ranking.filter(
    (c) => c.population >= 700_000 && c.population < 1_000_000
  );
  const band50 = ranking.filter(
    (c) => c.population >= 500_000 && c.population < 700_000
  );

  const designated = ranking.filter((c) => c.kind === "政令指定都市");
  const wards = ranking.filter((c) => c.kind === "特別区");
  const others = ranking.filter((c) => c.kind === "その他の市");

  const nationalTotal = all.reduce((s, c) => s + c.population, 0);
  const rankingTotal = ranking.reduce((s, c) => s + c.population, 0);

  // 東京都特別区部は23区の合計値なので、ランキングには入れず参考として示す
  const tokyo23 = getCities().find(
    (c) => normalize(c.name) === "東京都 特別区部"
  );

  const last = ranking[ranking.length - 1];

  const bands: { id: string; title: string; rows: Row[] }[] = [
    { id: "band100", title: "人口100万人以上の都市", rows: band100 },
    { id: "band70", title: "人口70万人台〜90万人台の都市", rows: band70 },
    { id: "band50", title: "人口50万人台〜60万人台の都市", rows: band50 },
  ];

  const top5Designated = designated
    .slice(0, 5)
    .map((c) => `${rankOfDesignated(designated, c)}位${c.name.split(" ").pop()}(${c.population.toLocaleString()}人)`)
    .join("、");

  const faq = [
    {
      q: "人口50万人以上の都市はいくつありますか？",
      a: `${ranking.length}自治体です(東京都の特別区は1区ずつ数え、特別区部の合計値は含めていません)。内訳は政令指定都市${designated.length}市、特別区${wards.length}区、その他の市${others.length}市です。`,
    },
    {
      q: "政令指定都市を人口の多い順に教えてください。",
      a:
        designated.length > 0
          ? `上位は${top5Designated}です。政令指定都市${designated.length}市すべての人口はこのページの表で確認できます。`
          : "このページの表で政令指定都市の人口を確認できます。",
    },
    {
      q: "人口50万人以上でも政令指定都市ではない都市はありますか？",
      a:
        others.length > 0
          ? `あります。このランキングでは${others.map((c) => c.name.split(" ").pop()).join("、")}が該当します。政令指定都市の法律上の要件は人口50万人以上ですが、指定は人口だけで決まるわけではありません。`
          : "このランキングの対象では、人口50万人以上で政令指定都市ではない市はありません。",
    },
    {
      q: "「12大都市」「15大都市」とはどの都市のことですか？",
      a: "「○大都市」という呼び方に法律上の定義はなく、統計や時期によって対象となる都市が異なります。このページでは呼び方にかかわらず、人口50万人以上の自治体を人口順に一覧にしています。",
    },
    {
      q: "人口100万人以上の都市だけを知りたいです。",
      a: "人口100万人以上の都市は、このページの「人口100万人以上の都市」の表、または専用の一覧記事で確認できます。",
    },
  ];

  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "28px 24px",
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
        🏙️ 人口50万人以上の都市ランキング
      </h1>

      <DataAsOf />

      <p style={{ lineHeight: 1.9, color: "#374151" }}>
        人口50万人以上の自治体は全国で{ranking.length}あります。人口100万人以上
        {band100.length}、70万人台〜90万人台{band70.length}、50万人台〜60万人台
        {band50.length}の3つに分けて、人口・面積・人口密度・高齢化率を人口順に
        並べました。
      </p>

      <nav
        aria-label="ページ内リンク"
        style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "16px 0 24px" }}
      >
        {bands.map((b) => (
          <a key={b.id} href={`#${b.id}`} style={chip}>
            {b.title}({b.rows.length})
          </a>
        ))}
        <a href="#faq" style={chip}>
          よくある質問
        </a>
      </nav>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        <Link prefetch={false} href="/articles/million-cities" style={linkBtn}>
          📖 100万人都市一覧の記事 →
        </Link>
        <Link prefetch={false} href="/articles/near-million-cities" style={linkBtn}>
          📖 90万人・80万人都市一覧の記事 →
        </Link>
        <Link prefetch={false} href="/articles/designated-cities-comparison" style={linkBtn}>
          📖 政令指定都市20市の比較記事 →
        </Link>
      </div>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="人口50万人以上の市・特別区を、人口の多い順に並べたランキングです。政令指定都市の区は独立した自治体ではないため対象外とし、東京都特別区部(23区の合計値)は二重計上を避けるため順位には含めず、参考値として別に示しています。"
        example={{
          name: ranking[0].name,
          value: ranking[0].population.toLocaleString(),
        }}
        source={dataSources["large-cities"]}
      />

      {tokyo23 && (
        <p
          style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 10,
            fontSize: 14,
            lineHeight: 1.8,
          }}
        >
          参考:東京都特別区部(23区の合計)の人口は
          {tokyo23.population.toLocaleString()}人です。特別区部を1つの都市として
          数える「100万人都市一覧」と同じ数え方にすると、人口100万人以上の都市は
          {tokyo23.population >= 1_000_000 ? band100.length + 1 : band100.length}
          になります。
        </p>
      )}

      <LargeCitySummary
        totalCount={ranking.length}
        bandCounts={{
          over100: band100.length,
          band70: band70.length,
          band50: band50.length,
        }}
        designatedCount={designated.length}
        wardCount={wards.length}
        otherCityNames={others.map((c) => c.name.split(" ").pop() ?? c.name)}
        topName={ranking[0].name}
        topPopulation={ranking[0].population}
        lastName={last.name}
        lastPopulation={last.population}
        populationShare={
          nationalTotal > 0 ? (rankingTotal / nationalTotal) * 100 : 0
        }
      />

      <AdSense />

      {bands.map((b) =>
        b.rows.length === 0 ? null : (
          <section key={b.id} id={b.id} style={{ marginTop: 36 }}>
            <h2 style={{ fontSize: 24, marginBottom: 12 }}>
              {b.title}({b.rows.length}自治体)
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>順位</th>
                    <th style={{ ...th, textAlign: "left" }}>自治体</th>
                    <th style={{ ...th, textAlign: "left" }}>区分</th>
                    <th style={thNum}>人口(人)</th>
                    <th style={thNum}>面積(km²)</th>
                    <th style={thNum}>人口密度(人/km²)</th>
                    <th style={thNum}>高齢化率</th>
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((c) => (
                    <tr key={c.code}>
                      <td style={td}>{rankOf.get(c.code)}</td>
                      <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                        <Link prefetch={false} href={`/city/${c.code}`} style={{ color: "#1d4ed8" }}>
                          {c.name}
                        </Link>
                      </td>
                      <td style={{ ...td, textAlign: "left" }}>{c.kind}</td>
                      <td style={tdNum}>{c.population.toLocaleString()}</td>
                      <td style={tdNum}>
                        {c.area != null ? c.area.toLocaleString(undefined, { maximumFractionDigits: 1 }) : "―"}
                      </td>
                      <td style={tdNum}>
                        {c.populationDensity != null
                          ? Math.round(c.populationDensity).toLocaleString()
                          : "―"}
                      </td>
                      <td style={tdNum}>{agingRate(c)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      )}

      <section id="faq" style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 24 }}>Q&amp;A：大都市の人口についてよくある質問</h2>
        {faq.map((item) => (
          <p key={item.q} style={{ lineHeight: 1.9 }}>
            <strong>Q. {item.q}</strong>
            <br />
            A. {item.a}
          </p>
        ))}
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      <AffiliateSlot topic="moving" />

      <CompareCTA />

      <p style={{ marginTop: 24, fontSize: 14, color: "#6b7280" }}>
        全自治体の人口ランキングは
        <Link prefetch={false} href="/ranking/population" style={{ color: "#2563eb", textDecoration: "underline" }}>
          人口ランキング
        </Link>
        、面積・人口密度の順位は
        <Link prefetch={false} href="/ranking/area" style={{ color: "#2563eb", textDecoration: "underline" }}>
          面積ランキング
        </Link>
        ・
        <Link prefetch={false} href="/ranking/density" style={{ color: "#2563eb", textDecoration: "underline" }}>
          人口密度ランキング
        </Link>
        で確認できます。
      </p>
    </main>
  );
}

function rankOfDesignated(list: Row[], c: Row): number {
  return list.findIndex((x) => x.code === c.code) + 1;
}

const chip: React.CSSProperties = {
  padding: "6px 14px",
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 700,
  textDecoration: "none",
};

const linkBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 16px",
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 14,
  textDecoration: "none",
};

const table: React.CSSProperties = {
  width: "100%",
  minWidth: 640,
  borderCollapse: "collapse",
  background: "#fff",
  border: "1px solid #e5e7eb",
  fontSize: 14,
};

const th: React.CSSProperties = {
  padding: "10px 8px",
  background: "#f3f4f6",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};

const thNum: React.CSSProperties = { ...th, textAlign: "right" };

const td: React.CSSProperties = {
  padding: "10px 8px",
  borderBottom: "1px solid #f1f5f9",
  textAlign: "center",
};

const tdNum: React.CSSProperties = { ...td, textAlign: "right" };
