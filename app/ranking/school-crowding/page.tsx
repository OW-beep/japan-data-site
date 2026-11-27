import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import SchoolCrowdingSummary from "../../../components/ranking/SchoolCrowdingSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities2025 } from "../../../lib/city2025";
import RankingCommentary from "../../../components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import { withTop1 } from "@/lib/rankingMeta";

const baseMetadata: Metadata = {
  alternates: { canonical: "/ranking/school-crowding" },
  title: "小学校1校あたり子ども人口ランキング｜最大1校2,079人、学校の混み具合を全国比較",
  description:
    "全国自治体の小学校1校あたりの子ども人口(0〜14歳)をランキング形式で比較。子育て世代の転入が続く自治体で学校のキャパシティが追いついていない実態や、逆に児童数が極端に少ない過疎地域の学校維持の実態を紹介します。",
};

export function generateMetadata() {
  return withTop1("school-crowding", baseMetadata);
}

export default function Page() {
  const ranking = getMunicipalities2025()
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

      <DataAsOf text="小学校数:2024年(学校基本調査)、子ども人口:令和7年国勢調査(確定値)" />

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

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          小学校1校あたりの子ども人口の中央値は422人です。最も多い長泉町は2,079人、早島町は1,974人、南風原町は1,944人と、子育て世代の流入が続く成長エリアが上位に並びます。学校の新設や増築、学区の見直しが課題になりやすい地域です。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          逆に下位は渡名喜村(13人)、青ヶ島村(15人)、早川町(20人)と、小規模な学校が地域の核になっている自治体です。この数字は実際の1校あたり児童数ではなく、子どもの人口を学校数で割った目安です。学校の統廃合は通学距離や地域の事情で判断されるもので、数字だけで良し悪しは決められません。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="子ども人口(0〜14歳)を小学校数で割った、小学校1校あたりの子ども人口(学校規模の目安)"
        formula="1校あたり子ども人口 = 子ども人口(0〜14歳) ÷ 小学校数"
        example={{
          name: `例：${ranking[0].name}`,
          value: Math.round(ranking[0].perSchool),
        }}
      source={dataSources["school-crowding"]}
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

      <RankingCommentary slug="school-crowding" />

    </div>
  );
}
