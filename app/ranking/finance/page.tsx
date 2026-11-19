import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import FinanceSummary from "../../../components/ranking/FinanceSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import RankingJsonLd from "../../../components/RankingJsonLd";
import RakutenGifts from "../../../components/RakutenGifts";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/finance" },
  title: "財政力指数ランキング【全国自治体】高い自治体・低い自治体一覧",
  description:
    "全国自治体の財政力指数をランキング形式で一覧比較。財政力指数が高い「稼げる自治体」から低い自治体まで、1.0を超えるとどうなるか、指数の見方も解説します。",
};

export default function FinanceRankingPage() {
  const all = getMunicipalities()
    .filter(
      (c) =>
        c.financeIndex != null &&
        !Number.isNaN(c.financeIndex)
    )
    .sort(
      (a, b) =>
        (b.financeIndex ?? 0) -
        (a.financeIndex ?? 0)
    );

  const ranking = all.slice(0, 100);

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <RankingJsonLd
        path="/ranking/finance"
        title="財政力指数ランキング"
        items={ranking}
      />
      <h1
        style={{
          fontSize: 32,
          marginBottom: 20,
        }}
      >
        💰 財政力指数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/finance-analysis"
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
        📖 なぜ小さな村が全国トップなのか、分析記事を読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          1.0以上(自前の収入で需要を賄える水準)は70自治体だけで、
          全体の4%ほどです。上位は愛知県飛島村(2.02)、青森県六ヶ所村
          (1.62)、長野県軽井沢町(1.50)、北海道泊村(1.49)と、港湾・
          エネルギー施設・リゾートといった「税源が偏在する」小規模
          自治体が並び、都市部の自治体で上位に入るのは東京都武蔵野市
          (1.48)など少数です。自治体を並べた中央値は0.44で、
          「ふつうの自治体」は必要な経費の半分弱を自前の収入で
          賄っている計算になります。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          人口10万人以上の市に限ると中央値は0.79まで上がり、1.0以上も
          28市あります。人口規模が大きいほど税源が厚くなる傾向は
          明確です。ただし財政力指数が低くても、地方交付税によって
          行政サービスの財源は確保される仕組みのため、指数の低さが
          そのままサービスの弱さにはつながりません。借金の重さや
          経常的な支出の硬直度まで含めた見方は
          <a href="/ranking/fiscal-health-composite" style={{ color: "#2563eb" }}>
            財政健全度スコア
          </a>
          、財政力と人口増減の関係は
          <a href="/articles/finance-population-cross-analysis" style={{ color: "#2563eb" }}>
            掛け合わせ分析
          </a>
          で扱っています。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit=""
        definition="自治体が自前の税収でどれだけ行政サービスを賄えるかを表す指標です。"
        formula="基準財政収入額 ÷ 基準財政需要額"
        example={{
          name: ranking[0]?.name ?? "",
          value:
            ranking[0]?.financeIndex?.toFixed(2) ??
            "0.00",
        }}
      source={dataSources["finance"]}
      />

      <FinanceSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.financeIndex ?? 0,
        }))}
      />

      <AdSense />

      <RankingInsightFAQ
        metricName="財政力指数"
        items={ranking.map((c) => ({
          name: c.name,
          displayValue: `${(c.financeIndex ?? 0).toFixed(2)}`,
        }))}
        totalCount={all.length}
        topNote="港湾や工業用地などの大きな税源を持つ自治体です。財政力指数が1.0を超えると、地方交付税に頼らず自前の収入で運営できる水準とされます。"
      />

      <div
        style={{
          marginTop: 20,
        }}
      >
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={(city.financeIndex ?? 0).toFixed(2)}
            unit=""
          />
        ))}
      </div>

      <RankingCommentary slug="finance" />

      {/* 自治体の財政に関心を持った人向けに、ふるさと納税の返礼品への導線を置く(APIキー未設定なら非表示) */}
      <RakutenGifts
        keyword="ふるさと納税 返礼品"
        heading="楽天市場でふるさと納税の返礼品を見る"
        hits={5}
      />

    </main>
  );
}