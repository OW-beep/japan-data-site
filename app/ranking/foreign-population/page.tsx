import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import ForeignPopulationSummary from "../../../components/ranking/ForeignPopulationSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "@/components/ranking/RankingEditorial";
import RankingJsonLd from "../../../components/RankingJsonLd";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/foreign-population" },
  title: "外国人比率が高い自治体ランキング｜10%以上の自治体一覧",
  description:
    "全国自治体の外国人人口比率(人口に占める外国人住民の割合)を高い順にランキング。外国人比率10%以上の自治体は全国で4件、そのすべてを掲載。農業・製造業の担い手として外国人労働者が多い町から、多国籍化が進む都心の区まで紹介します。",
};

export default function Page() {
  const all = getMunicipalities()
    .filter(
      (c) => c.foreignPopulation != null && c.population > 0
    )
    .map((c) => ({
      ...c,
      ratio: ((c.foreignPopulation ?? 0) / c.population) * 100,
    }))
    .sort((a, b) => b.ratio - a.ratio);
  const ranking = all.slice(0, 50);

  // 「外国人比率が10%以上の自治体」を探す人向けに、基準を超える自治体を、すべて示す
  const over10 = all.filter((c) => c.ratio >= 10);
  const over5 = all.filter((c) => c.ratio >= 5).length;
  const over3 = all.filter((c) => c.ratio >= 3).length;

  const average =
    ranking.reduce((s, c) => s + c.ratio, 0) / ranking.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <RankingJsonLd
        path="/ranking/foreign-population"
        title="外国人人口比率ランキング"
        items={ranking}
      />
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🌏 外国人人口比率ランキング
      </h1>

      <DataAsOf />

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          外国人比率が高い自治体は、大きく2つのタイプに分かれます。
          一つは、自動車や電子部品などの工場が集まり、技能実習生や
          特定技能の働き手が多い製造業の街。もう一つは、大学や
          国際機関、観光地を抱える街です。比率の背景にある産業を
          見ると、その街の成り立ちが分かります。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          なお「比率」と「人数」は別の話です。人数では大都市圏が
          圧倒的に多く、比率で上位の小規模な自治体とは顔ぶれが
          異なります。このページでは比率の順位とあわせて、
          10%以上の自治体をすべて掲載しています。
        </p>
      </RankingEditorial>

      <a
        href="/articles/foreign-population"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#fefce8",
          color: "#a16207",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 外国人人口比率ランキング分析を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="人口に占める外国人住民の割合"
        formula="外国人人口比率 = 外国人人口 ÷ 総人口 × 100"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].ratio.toFixed(1)),
        }}
      source={dataSources["foreign-population"]}
      />

      <ForeignPopulationSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          ratio: c.ratio,
        }))}
        average={average}
      />

      <section id="over10" style={{ margin: "28px 0" }}>
        <h2 style={{ fontSize: 24, marginBottom: 10 }}>
          外国人人口の割合が10%以上の自治体は{over10.length}
        </h2>
        <p style={{ lineHeight: 1.9, color: "#374151" }}>
          全国{all.length.toLocaleString()}市区町村のうち、外国人人口の割合が10%以上の自治体は{over10.length}です。5%以上は{over5}、3%以上は{over3}です。
          割合の高い順に、すべて示します。人口が少ない自治体では、少数の人数で割合が大きく動くので、人口もあわせて見てください。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 480, fontSize: 14 }}>
            <thead>
              <tr>
                {["順位", "市区町村", "外国人人口の割合", "外国人人口", "総人口"].map((h, i) => (
                  <th key={h} style={{ padding: "7px 10px", border: "1px solid #e5e7eb", background: "#f8fafc", textAlign: i < 2 ? "left" : "right" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {over10.map((c, i) => (
                <tr key={c.code}>
                  <td style={{ padding: "7px 10px", border: "1px solid #e5e7eb" }}>{i + 1}位</td>
                  <td style={{ padding: "7px 10px", border: "1px solid #e5e7eb", fontWeight: 700 }}>
                    <a href={`/city/${c.code}`} style={{ color: "#2563eb", textDecoration: "underline" }}>
                      {c.name.replace(/\s+/g, "")}
                    </a>
                  </td>
                  <td style={{ padding: "7px 10px", border: "1px solid #e5e7eb", textAlign: "right" }}>{c.ratio.toFixed(1)}%</td>
                  <td style={{ padding: "7px 10px", border: "1px solid #e5e7eb", textAlign: "right" }}>{(c.foreignPopulation ?? 0).toLocaleString()}人</td>
                  <td style={{ padding: "7px 10px", border: "1px solid #e5e7eb", textAlign: "right" }}>{c.population.toLocaleString()}人</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.ratio.toFixed(1)}
            unit="%"
          />
        ))}
      </div>

      <RankingCommentary slug="foreign-population" />

    </div>
  );
}
