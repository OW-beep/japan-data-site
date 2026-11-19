import Link from "next/link";
import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import DeclineSummary from "../../../components/ranking/DeclineSummary";
import { dataSources } from "../../../lib/dataSources";
import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/decline" },
  title: "全国自治体 社会増減率ランキング(転入超過・転出超過)",
  description:
    "総務省「住民基本台帳人口移動報告」の転入者数・転出者数から算出した、社会増減率(人口移動による増減)のランキングです。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.inMigrants != null &&
        c.outMigrants != null &&
        c.population > 0
    )
    .map((c) => ({
      ...c,
      rate:
        (((c.inMigrants ?? 0) - (c.outMigrants ?? 0)) /
          c.population) *
        100,
    }))
    .sort((a, b) => b.rate - a.rate);

  const top50 = ranking.slice(0, 50);
  const bottom50 = ranking.slice(-50).reverse();

  const average =
    ranking.reduce((s, c) => s + c.rate, 0) / ranking.length;

  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "28px 24px",
      }}
    >
      <h1
        style={{
          fontSize: 34,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        全国自治体 社会増減率ランキング
      </h1>

      <DataAsOf />

      <p
        style={{
          color: "#4b5563",
          lineHeight: 1.8,
          marginBottom: 12,
        }}
      >
        総務省「住民基本台帳人口移動報告」の転入者数・転出者数をもとに、
        人口移動による増減(社会増減率)を算出したランキングです。
        プラスが大きいほど転入が転出を上回る「転入超過」、マイナスが大きいほど
        「転出超過」を意味します。
      </p>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          転入超過になっているのは402自治体で、全体の23%にとどまります。
          自治体を並べた中央値は−0.38%で、「ふつうの自治体」は緩やかな
          転出超過です。ただし人口10万人以上の自治体に限ると46.6%が
          転入超過になり、規模の大きい都市ほど人の移動ではプラスに
          なりやすい構造が見えます。上位も東京都中央区(+4.43%)のような
          都心部と、都城市(+1.26%)のような地方の拠点都市が中心です。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          一方、両端の数字には特殊な事情が含まれます。1位の福島県大熊町
          (+6.73%)は帰還の動き、下位には避難指示の影響が残る福島県の
          町村や、能登半島地震の被災地である珠洲市が並びます。率の大きさ
          だけで「人気の街・不人気の街」と読むのは早計です。また社会増減は
          人口変動の半分で、出生と死亡による
          <a href="/ranking/natural-change" style={{ color: "#2563eb" }}>
            自然増減
          </a>
          と合わせたものが総人口の増減になります。移住先選びの観点では
          <a href="/articles/moving-city-data-guide" style={{ color: "#2563eb" }}>
            移住先の選び方ガイド
          </a>
          も参考にしてください。
        </p>
      </RankingEditorial>

      <MetricBox
        title="社会増減率とは？"
        unit="%"
        definition="転入者数から転出者数を引いた差を、人口で割った割合です。出生・死亡による自然増減は含みません。"
        formula="社会増減率 = (転入者数 − 転出者数) ÷ 人口 × 100"
        example={{
          name: top50[0].name,
          value: Number(top50[0].rate.toFixed(2)),
        }}
        source={dataSources.decline}
      />

      <p
        style={{
          fontSize: 13,
          color: "#9ca3af",
          marginBottom: 20,
        }}
      >
        ※この指標は転入・転出による人口の増減(社会増減)のみを示すもので、
        出生・死亡による自然増減は含みません。実際の総人口の増減率とは
        異なりますので、あわせて人口ランキングもご確認ください。
      </p>

      <a
        href="/articles/decline"
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
        📖 震災復興地域と都心再開発、転入超過の背景を読む →
      </a>

      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginTop: 30,
          marginBottom: 10,
        }}
      >
        転入超過TOP50
      </h2>

      <div>
        {top50.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.rate.toFixed(2)}
            unit="%"
          />
        ))}
      </div>

      <AdSense />

      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginTop: 40,
          marginBottom: 10,
        }}
      >
        転出超過TOP50
      </h2>

      <div>
        {bottom50.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.rate.toFixed(2)}
            unit="%"
          />
        ))}
      </div>

      <p
        style={{
          marginTop: 30,
          fontSize: 14,
          color: "#6b7280",
        }}
      >
        全国平均：{average.toFixed(2)}%(対象自治体
        {ranking.length.toLocaleString()})
      </p>

      <DeclineSummary top50={top50} bottom50={bottom50} average={average} />

      <RankingInsightFAQ
        metricName="社会増減率"
        items={[...top50, ...[...bottom50].reverse()].map((c) => ({
          name: c.name,
          displayValue: `${c.rate.toFixed(2)}%`,
        }))}
        totalCount={ranking.length}
        topNote="転入者数が転出者数を最も大きく上回った自治体です。なお上位には帰還の動きがある自治体も含まれます。"
      />

      <div style={{ marginTop: 30 }}>
        <Link prefetch={false} href="/ranking" style={{ color: "#2563eb" }}>
          ← ランキング一覧に戻る
        </Link>
      </div>

      <RankingCommentary slug="decline" />

    </main>
  );
}
