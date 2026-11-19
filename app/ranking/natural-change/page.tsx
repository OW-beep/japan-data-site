import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import NaturalChangeSummary from "../../../components/ranking/NaturalChangeSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities2025 } from "../../../lib/city2025";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/natural-change" },
  title: "全国自治体 自然増減率ランキング（出生数-死亡数）",
  description:
    "出生数から死亡数を引いた自然増減率を全国自治体でランキング。全国1740自治体のうち自然増加なのはわずか16自治体だけという実態を、社会増減率(転入出)とあわせて紹介します。",
};

export default function Page() {
  const base = getMunicipalities2025()
    .filter(
      (c) => c.births != null && c.deaths != null && c.population > 0
    )
    .map((c) => ({
      ...c,
      naturalRate:
        (((c.births ?? 0) - (c.deaths ?? 0)) / c.population) * 1000,
    }));

  const ranking = [...base]
    .sort((a, b) => b.naturalRate - a.naturalRate)
    .slice(0, 50);

  const positiveCount = base.filter((c) => c.naturalRate > 0).length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        👶 自然増減率ランキング（出生数-死亡数）
      </h1>

      <DataAsOf text="出生数・死亡数:2023年(人口動態調査)、人口:令和7年国勢調査(確定値)" />

      <a
        href="/articles/natural-change"
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
        📖 自然増減率ランキング分析を読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          出生数が死亡数を上回る「自然増」の自治体は、全国1,740のうち
          わずか16しかありません。自治体を並べた中央値は−12.6‰(人口
          千人あたり)で、自然減が圧倒的な多数派です。プラスになった
          16自治体の顔ぶれは、沖縄県の若い年齢構成の自治体(座間味村、
          南風原町、中城村、豊見城市、宜野湾市)、東京都心の中央区・
          港区・千代田区、子育て世代が集まる郊外の栗東市・長久手市・
          日進市・粕屋町・野々市市という、性格の異なる3つのタイプに
          分かれます。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          人口10万人以上の市に限ると、自然増は都心3区だけです。
          つまり、人口が増えている都市のほとんどは、自然減を
          <a href="/ranking/decline" style={{ color: "#2563eb" }}>
            社会増減(転入超過)
          </a>
          で補っている姿です。「子育てしやすい街」を探すときも、
          自然増減だけで判断せず、転入の動きとあわせて見ることが
          大切です。なお下位には、高齢化率の高い村に加え、避難指示の
          影響が残る福島県の町村が並んでおり、年齢構成と特殊事情の
          両方を割り引いて読む必要があります。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="‰(人口千人あたり)"
        definition="出生数から死亡数を引いた自然増減数の、人口千人あたりの比率。転入出による社会増減とは別の指標"
        formula="自然増減率 = (出生数 - 死亡数) ÷ 人口 × 1,000"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].naturalRate.toFixed(1)),
        }}
      source={dataSources["natural-change"]}
      />

      <NaturalChangeSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          naturalRate: c.naturalRate,
        }))}
        positiveCount={positiveCount}
        totalCount={base.length}
      />

      <AdSense />

      <RankingInsightFAQ
        metricName="自然増減率"
        items={ranking.map((c) => ({
          name: c.name,
          displayValue: `${c.naturalRate.toFixed(1)}‰`,
        }))}
        totalCount={base.length}
        topNote="出生数が死亡数を最も大きく上回った自治体です。自然増の自治体は全国でも16しかありません。"
      />

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.naturalRate.toFixed(1)}
            unit="‰"
          />
        ))}
      </div>

      <RankingCommentary slug="natural-change" />

    </div>
  );
}
