import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import RetailAccessSummary from "../../../components/ranking/RetailAccessSummary";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "../../../components/ranking/RankingEditorial";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/retail-access" },
  title: "全国自治体 高齢者あたり小売店数ランキング",
  description:
    "高齢者人口1,000人あたりの小売店数が少ない自治体をランキング。「買い物難民」問題の実態を、都市近郊のニュータウンを中心に紹介します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.retailStoreCount != null &&
        c.elderlyPopulation != null &&
        c.elderlyPopulation > 0 &&
        c.population > 5000
    )
    .map((c) => ({
      ...c,
      per1000elderly:
        ((c.retailStoreCount ?? 0) / (c.elderlyPopulation ?? 1)) *
        1000,
    }))
    .sort((a, b) => a.per1000elderly - b.per1000elderly)
    .slice(0, 50);

  const average =
    ranking.reduce((s, c) => s + c.per1000elderly, 0) /
    ranking.length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🛒 高齢者あたり小売店数ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/shopping-access"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#fff7ed",
          color: "#c2410c",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 買い物難民問題の分析記事を読む →
      </a>

      <MetricBox
        title="指標定義"
        unit="店"
        definition="高齢者(65歳以上)人口1,000人あたりの小売店数。人口5,000人以上の自治体が対象"
        formula="高齢者あたり小売店数 = 小売店数 ÷ 高齢者人口 × 1,000"
        example={{
          name: `例：${ranking[0].name}`,
          value: Number(ranking[0].per1000elderly.toFixed(1)),
        }}
      source={dataSources["retail-access"]}
      />

      <RetailAccessSummary
        ranking={ranking.map((c) => ({
          name: c.name,
          per1000elderly: c.per1000elderly,
        }))}
        average={average}
      />

      <AdSense />

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          高齢者あたりの小売店が最も少ないのは、大阪府豊能町
          (高齢者1,000人あたり6.9店)、埼玉県鳩山町(7.7店)、
          奈良県の安堵町・三郷町と続きます。意外なことに「買い物難民」
          の最前線は遠くの過疎地ではなく、大都市近郊のニュータウンや
          ベッドタウンです。開発当時にできた商店が、住民の高齢化と
          ともに閉店し、買い物は隣の市で済ませる構造になったためです。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          山間部の村では小さな商店がかえって残りやすく、この指標では
          悪く出ません。逆に千代田区(299.9店)のような都心は商業集積で
          跳ね上がり、「高齢者の買い物のしやすさ」とは別のものを
          映します。このランキングは郊外の街の変化を見る指標として
          読むのが正解です。
        </p>
      </RankingEditorial>

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.per1000elderly.toFixed(1)}
            unit="店"
          />
        ))}
      </div>

      <RankingCommentary slug="retail-access" />

    </div>
  );
}
