import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import DivorceRateSummary from "../../../components/ranking/DivorceRateSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities2025 } from "../../../lib/city2025";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/divorce-rate" },
  title: "全国自治体 離婚率ランキング｜人口千人あたりで比較",
  description:
    "人口千人あたりの離婚件数をランキング形式で比較。西日本の都市部で高く、東北・北陸地方で低いという地域差が見られます。人口規模の小さい自治体では数値が振れやすい点にご注意ください。",
};

export default function DivorceRateRankingPage() {
  const base = getMunicipalities2025().filter(
    (c) => c.divorces != null && c.population >= 3000
  );

  const ranking = base
    .map((c) => ({
      ...c,
      rate: ((c.divorces ?? 0) / c.population) * 1000,
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 100);

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1
        style={{
          fontSize: 32,
          marginBottom: 20,
        }}
      >
        💔 離婚率ランキング
      </h1>

      <DataAsOf text="離婚件数:2023年(人口動態調査)、人口:令和7年国勢調査(確定値)" />

      <a
        href="/articles/divorce-rate-analysis"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#eef2ff",
          color: "#4338ca",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 離婚率ランキング分析記事を読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          地域差ははっきりあります。地方ブロックごとに平均すると、
          九州・沖縄が1.70(人口千人あたり)と最も高く、近畿1.51、
          北海道1.50、関東と四国が1.45、中国1.36、東北1.29、
          中部1.26の順です。上位30自治体のうち22は西日本
          (近畿・中国・四国・九州・沖縄)にあり、上位には鹿児島県
          和泊町(3.38)、沖縄県石垣市(3.38)など南の島しょ部や
          都市が並びます。対象自治体の中央値は1.44です。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          ただし、この数字の読み方には注意が必要です。離婚は
          20〜30代に多い出来事のため、若い世代の割合が高い地域では
          率が上がりやすくなります。また人口の少ない自治体では、
          数件の差で順位が大きく動きます。離婚率は「家族の形や
          世代構成の地域差」を示す統計であって、街の住みやすさや
          治安を測る物差しではありません。婚姻の動きと対になる
          <a href="/ranking/marriage-rate" style={{ color: "#2563eb" }}>
            婚姻率ランキング
          </a>
          とあわせて見ると、地域ごとの家族形成の姿が見えてきます。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit=""
        definition="人口1,000人あたりの離婚件数です。婚姻率ランキングと対になる人口動態統計の1つで、地域の家族構成の変化を示す指標として扱っています。"
        formula="離婚件数 ÷ 人口 × 1,000"
        example={{
          name: ranking[0]?.name ?? "",
          value: Number(ranking[0]?.rate?.toFixed(2) ?? 0),
        }}
        source={dataSources["divorce-rate"]}
      />

      <DivorceRateSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.rate,
        }))}
      />

      <AdSense />

      <RankingInsightFAQ
        metricName="離婚率(人口千人あたり離婚件数)"
        items={ranking.map((c) => ({
          name: c.name,
          displayValue: `${c.rate.toFixed(2)}`,
        }))}
        totalCount={base.length}
        topNote="人口あたりの離婚件数が最も多い自治体です。離婚率は年齢構成の影響を受けるため、若い世代が多い地域で高く出やすい指標です。"
      />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.rate.toFixed(2)}
            unit=""
          />
        ))}
      </div>

      <RankingCommentary slug="divorce-rate" />

    </main>
  );
}
