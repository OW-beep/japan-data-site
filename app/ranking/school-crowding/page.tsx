import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import SchoolCrowdingSummary from "../../../components/ranking/SchoolCrowdingSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/school-crowding" },
  title: "全国自治体 小学校1校あたり子ども人口ランキング",
  description:
    "全国自治体の小学校1校あたりの子ども人口(0〜14歳)をランキング形式で比較。子育て世代の転入が続く自治体で学校のキャパシティが追いついていない実態や、逆に児童数が極端に少ない過疎地域の学校維持の実態を紹介します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.elementarySchoolCount != null &&
        c.elementarySchoolCount > 0 &&
        c.childPopulation != null
    )
    .map((c) => ({
      ...c,
      perSchool:
        c.childPopulation / (c.elementarySchoolCount ?? 1),
    }))
    .sort((a, b) => b.perSchool - a.perSchool)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.perSchool, 0) / ranking.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🏫 小学校1校あたり子ども人口ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/school-crowding"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#fdf2f8",
          color: "#be185d",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 学校規模ランキング分析を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="子ども人口(0〜14歳)を小学校数で割った、小学校1校あたりの子ども人口(学校規模の目安)"
        formula="1校あたり子ども人口 = 子ども人口(0〜14歳) ÷ 小学校数"
        example={{
          name: `例：${ranking[0].name}`,
          value: Math.round(ranking[0].perSchool),
        }}
      />

      <SchoolCrowdingSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          perSchool: c.perSchool,
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
            value={Math.round(c.perSchool).toLocaleString()}
            unit="人"
          />
        ))}
      </div>
    </div>
  );
}
