import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { dataSources } from "../../../lib/dataSources";
import AdSense from "../../../components/AdSense";
import { getMunicipalities } from "../../../lib/municipalities";
import { getTax } from "../../../lib/taxableIncome";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "@/components/ranking/RankingEditorial";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/light-car" },
  title: "全国市区町村 軽自動車が多い街ランキング(人口100人あたり・令和7年度)",
  description:
    "全国の市区町村を、軽四輪乗用(自家用)の台数(人口100人あたり)でランキング。総務省「市町村税課税状況等の調」令和7年度のデータから、軽自動車が多い街・少ない街がわかります。",
};

export default function LightCarRankingPage() {
  const all = getMunicipalities()
    .filter((c) => c.population >= 3000)
    .map((c) => ({ c, t: getTax(c.code) }))
    .filter((r): r is { c: (typeof r)["c"]; t: NonNullable<(typeof r)["t"]> } => r.t != null)
    .map((r) => ({ ...r, per100: (r.t.kei / r.c.population) * 100 }))
    .sort((a, b) => b.per100 - a.per100);
  const ranking = all.slice(0, 100);
  const totalKei = all.reduce((s, r) => s + r.t.kei, 0);
  const totalPop = all.reduce((s, r) => s + r.c.population, 0);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>🚗 軽自動車が多い街ランキング(人口100人あたり)</h1>

      <a
        href="/articles/light-car-ownership-analysis"
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
        📖 軽自動車が多い街・少ない街と、所得・人口密度との関係を分析した記事を読む →
      </a>

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          軽四輪(乗用・自家用)の人口100人あたり台数の中央値は5.5台です。1位は北谷町の17.7台で、北中城村(12.8台)、宮古島市(10.1台)、恩納村(9.1台)と沖縄県の自治体が上位を占めます。逆に渋谷区、文京区、港区はいずれも0.1台と、公共交通の発達した都心では極端に少なくなります。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          この数字は普通車を含まないため、「車社会かどうか」そのものではありません。とはいえ、鉄道やバスで代替しにくい地域ほど軽自動車への依存が高まる傾向は表れています。移住先の生活費を考えるとき、車が必須かどうかは家計に直結する論点です。
        </p>
      </RankingEditorial>

      <MetricBox
        title="指標定義"
        unit="台/100人"
        definition="軽四輪の乗用・自家用の台数(令和7年4月1日現在)を、人口で割り、100人あたりに直した値です。普通車、軽貨物、営業用は含みません。"
        formula="軽四輪乗用(自家用)の台数 ÷ 人口 × 100"
        example={{
          name: ranking[0]?.c.name ?? "",
          value: `${ranking[0]?.per100.toFixed(1)}台`,
        }}
        source={dataSources["light-car"]}
      />

      <p style={{ lineHeight: 1.9, color: "#374151" }}>
        人口3,000人以上の市区町村の合計では、人口100人あたり{((totalKei / totalPop) * 100).toFixed(1)}台です。上位100自治体を表示しています。
        軽自動車が多いことは、車の台数が多いことを意味しません(普通車は含まれません)。観光地では、レンタカーの台数が含まれている可能性があります。
      </p>

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((r, index) => (
          <RankCard key={r.c.code} rank={index + 1} name={r.c.name} value={r.per100.toFixed(1)} unit="台/100人" />
        ))}
      </div>

      <RankingCommentary slug="light-car" />
    </main>
  );
}
