import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import YoungAdultMigrationSummary from "../../../components/ranking/YoungAdultMigrationSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/young-adult-migration" },
  title: "全国自治体 20代純移動率ランキング｜若者に選ばれる街は？",
  description:
    "人口1,000人あたりの20代(20〜29歳)純移動数をランキング形式で比較。2025年の最新データで、進学・就職を機に若者がどこへ移動しているかがわかります。",
};

export default function YoungAdultMigrationRankingPage() {
  const base = getMunicipalities().filter(
    (c) => c.youngAdultNetMigration != null && c.population >= 3000
  );

  const positiveCount = base.filter(
    (c) => (c.youngAdultNetMigration ?? 0) > 0
  ).length;

  const ranking = base
    .map((c) => ({
      ...c,
      rate: ((c.youngAdultNetMigration ?? 0) / c.population) * 1000,
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
        🎒 20代純移動率ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/young-adult-migration-analysis"
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
        📖 分析記事「若者に選ばれる街」もあわせて読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          20代の純移動がプラスなのは287自治体、全体の18.2%だけです。
          上位には墨田区(人口1,000人あたり+14.2)、中央区+13.4、
          品川区+12.7と都心の区が並び、進学・就職の受け皿になって
          いることが分かります。都心以外では、観光の働き口が多い
          竹富町が+16.0で1位に入りました。若者の移動は、進学・就職と
          いったライフイベントの節目に強く引っ張られる動きです。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          下位の大きなマイナスは、読み方に注意が要ります。岬町−63.7、
          白子町−60.4といった町では、高校卒業後の進学・就職で世代ごと
          出ていく動きが、人口の小ささゆえに率へ大きく跳ね返ります。
          人が去ること自体が問題なのではなく、進学先・就職先が町内に
          乏しい構造の表れと見るのが正確です。若者の流入がそのまま
          子育て世代の定着につながるかは、
          <a href="/ranking/child" style={{ color: "#2563eb" }}>
            子ども人口割合ランキング
          </a>
          と重ねると見えてきます。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit=""
        definition="人口1,000人あたりの20代(20〜24歳+25〜29歳)純移動数(転入者数-転出者数)です。2025年の住民基本台帳人口移動報告に基づきます。人口3,000人未満の自治体は母数が小さく数値が不安定になるため対象から除外しています。"
        formula="20代純移動数 ÷ 人口 × 1,000"
        example={{
          name: ranking[0]?.name ?? "",
          value: `${ranking[0]?.rate?.toFixed(1) ?? "0.0"}`,
        }}
      source={dataSources["young-adult-migration"]}
      />

      <YoungAdultMigrationSummary
        positiveCount={positiveCount}
        totalCount={base.length}
        ranking={ranking.map((c) => ({
          name: c.name,
          value: c.rate,
        }))}
      />

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.rate.toFixed(1)}
            unit=""
          />
        ))}
      </div>

      <RankingCommentary slug="young-adult-migration" />

    </main>
  );
}
