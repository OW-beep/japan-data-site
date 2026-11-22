import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import WelfareRatioSummary from "../../../components/ranking/WelfareRatioSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "@/components/ranking/RankingEditorial";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/welfare-ratio" },
  title: "全国自治体 民生費比率ランキング",
  description:
    "全国自治体の歳入に占める民生費(福祉関連支出)の割合をランキング形式で比較。高齢化率が高い自治体ほど比率が高いとは限らない、意外な実態を紹介します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.totalRevenue != null &&
        c.welfareExpense != null &&
        c.totalRevenue > 0
    )
    .map((c) => ({
      ...c,
      welfareRatio:
        ((c.welfareExpense ?? 0) / (c.totalRevenue ?? 1)) * 100,
    }))
    .sort((a, b) => b.welfareRatio - a.welfareRatio)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.welfareRatio, 0) /
    ranking.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🤝 民生費比率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/welfare-aging"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#f0fdf4",
          color: "#047857",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 民生費と高齢化率の関係を読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          歳出に占める民生費(社会保障関係費)の割合の中央値は27.7%です。上位は練馬区(55.4%)、大田区(55.3%)、足立区(54.8%)と東京の区が並び、沖縄市(54.8%)も入ります。民生費が歳出の半分を超える自治体は26あり、高齢者福祉、子育て、生活支援といった支出が財政の中心になっています。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          民生費の割合は、その自治体の人口構成を映します。割合が高いことは負担の重さであると同時に、福祉サービスへの支出規模の大きさでもあります。<a href="/ranking/balance-ratio" style={{ color: "#2563eb" }}>経常収支比率</a>(財政の余裕)とあわせて見ると、「何に使っているか」と「どれだけ余裕があるか」の両面から財政を読み解けます。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="歳入決算総額に占める民生費(児童・高齢者・障害者福祉、生活保護などの福祉関連支出)の割合"
        formula="民生費比率 = 民生費 ÷ 歳入決算総額 × 100"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].welfareRatio.toFixed(1)),
        }}
      source={dataSources["welfare-ratio"]}
      />

      <WelfareRatioSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          welfareRatio: c.welfareRatio,
        }))}
        average={average}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.welfareRatio.toFixed(1)}
            unit="%"
          />
        ))}
      </div>

      <RankingCommentary slug="welfare-ratio" />

    </div>
  );
}
