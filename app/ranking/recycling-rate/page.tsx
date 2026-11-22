import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import RecyclingRateSummary from "../../../components/ranking/RecyclingRateSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "@/components/ranking/RankingEditorial";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/recycling-rate" },
  title: "全国自治体 ごみのリサイクル率ランキング｜大崎町など優等生自治体",
  description:
    "ごみのリサイクル率をランキング形式で比較。全国的に知られる鹿児島県大崎町など、住民参加型の分別収集で高い数値を出している自治体がわかります。",
};

export default function RecyclingRateRankingPage() {
  const ranking = getMunicipalities()
    .filter((c) => c.recyclingRate != null && c.recyclingRate > 0)
    .sort((a, b) => (b.recyclingRate ?? 0) - (a.recyclingRate ?? 0))
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
        ♻️ ごみのリサイクル率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/recycling-rate-analysis"
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
        📖 分析記事「大崎町はなぜリサイクル率日本一なのか」もあわせて読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          リサイクル率の中央値は17.5%、平均は20.0%です。20%以上の自治体は655、30%以上は219あります。上位は日高市(99.7%)、中土佐町(99.6%)、美祢市(97.2%)と、排出されたごみのほぼ全量が資源化された計算になる自治体が並びます。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          ただし、リサイクル率は対象とするごみの範囲や資源化の数え方が自治体で異なる場合があり、数字の単純な比較には注意が必要です。高い数値は「ごみがほとんど出ない」という意味ではなく、分別と資源化の仕組みが徹底している姿と読むのが正確です。地域の取り組みの本気度を測る目安としてご覧ください。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="ごみ総排出量に占める、資源化された量の割合です。令和5年度「一般廃棄物処理事業実態調査」に基づきます。東京23区は共同のごみ処理組合で運営されているため、区単位のデータは対象外です。"
        formula="資源化量 ÷ ごみ総排出量 × 100"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.recyclingRate?.toFixed(1) ?? "0.0"}`,
        }}
      source={dataSources["recycling-rate"]}
      />

      <RecyclingRateSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.recyclingRate ?? 0,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={(city.recyclingRate ?? 0).toFixed(1)}
            unit="%"
          />
        ))}
      </div>

      <RankingCommentary slug="recycling-rate" />

    </main>
  );
}
