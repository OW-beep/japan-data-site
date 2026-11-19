import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import DaycareSummary from "../../../components/ranking/DaycareSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities2025 } from "../../../lib/city2025";
import RankingCommentary from "../../../components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import { withTop1 } from "@/lib/rankingMeta";

const baseMetadata: Metadata = {
  alternates: { canonical: "/ranking/daycare" },
  title: "全国自治体 保育園あたり子ども人口ランキング｜保育の余裕度",
  description:
    "全国自治体の保育園1施設あたりの子ども人口をランキング形式で比較。数字が小さいほど、子どもの数に対して保育施設に余裕があることを意味します。データ上の注意点もあわせて解説します。",
};

export function generateMetadata() {
  return withTop1("daycare", baseMetadata);
}

export default function DaycareRankingPage() {
  const all = getMunicipalities2025()
    .filter(
      (c) =>
        c.daycareCount != null &&
        c.daycareCount > 0 &&
        c.childPopulation >= 500
    )
    .map((c) => ({
      ...c,
      childPerDaycare: c.childPopulation / (c.daycareCount ?? 1),
    }))
    .sort((a, b) => a.childPerDaycare - b.childPerDaycare);

  const ranking = all.slice(0, 100);

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
        🧸 保育園あたり子ども人口ランキング
      </h1>

      <DataAsOf text="保育所等数:2023年、子ども人口:令和7年国勢調査(確定値)" />

      <a
        href="/articles/daycare-access"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#eff6ff",
          color: "#1d4ed8",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 分析記事「東京23区と大阪の差」もあわせて読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          「数字が小さいほど保育に余裕がある」という読み方は、半分だけ
          正しいものです。上位の高知県室戸市(72人/施設)や山口県
          周防大島町(73人/施設)は、施設が多いというより子どもの絶対数が
          減っている地域で、「入りやすさ」と「子どもが少ないこと」の
          両方が混ざっています。対象1,305自治体の中央値は528人/施設、
          人口10万人以上の市では624人/施設です。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          一方、下位には大阪府泉佐野市(9,751人/施設)のように、子育て
          世代が集まって子どもの数が多い都市が並びます。ただしこの指標は
          「子ども人口÷施設数」で、施設ごとの定員や、実際の待機児童数とは
          別の数字です。保育の入りやすさを最終的に判断するには、
          自治体が公表する待機児童数や申込倍率とあわせて確認して
          ください。子育て環境の見方全体は
          <a href="/articles/child-friendly-city-data-guide" style={{ color: "#2563eb" }}>
            子育てしやすい街の見方ガイド
          </a>
          にまとめています。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="人"
        definition="保育園(保育所)1施設あたりの子ども人口(15歳未満人口)です。数字が小さいほど、子どもの数に対して保育施設に余裕があることを意味します。子ども人口500人未満の自治体は母数が小さく数値が不安定になるため対象から除外しています。"
        formula="子ども人口(15歳未満) ÷ 保育園数"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.childPerDaycare?.toFixed(0) ?? "0"}`,
        }}
      source={dataSources["daycare"]}
      />

      <DaycareSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.childPerDaycare,
        }))}
      />

      <AdSense />

      <RankingInsightFAQ
        metricName="保育園1施設あたり子ども人口"
        items={ranking.map((c) => ({
          name: c.name,
          displayValue: `${c.childPerDaycare.toFixed(0)}人`,
        }))}
        totalCount={all.length}
        topNote="子どもの数に対して施設数に余裕があるとされる自治体です。ただし上位には子どもの絶対数が減っている地域も含まれます。"
      />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.childPerDaycare.toFixed(0)}
            unit="人/施設"
          />
        ))}
      </div>

      <RankingCommentary slug="daycare" />

    </main>
  );
}
