import type { Metadata } from "next";

import DataAsOf from "../../../components/DataAsOf";
import AdSense from "../../../components/AdSense";
import RankingInsightFAQ from "../../../components/ranking/RankingInsightFAQ";
import {
  getPrefectureStats,
  hasPrefectureStatsData,
  hasPrefectureStatsData as checkReady,
} from "../../../lib/prefectureStats";

import RankingCommentary from "@/components/ranking/RankingCommentary";
import RankingEditorial from "@/components/ranking/RankingEditorial";
export const metadata: Metadata = {
  alternates: { canonical: "/ranking/crime-rate" },
  title: "都道府県別 刑法犯認知件数ランキング｜人口千人あたり",
  description:
    "総務省「社会・人口統計体系」をもとにした、人口千人あたりの刑法犯認知件数の都道府県別ランキングです。",
  robots: checkReady() ? undefined : { index: false, follow: true },
};

export default function CrimeRateRankingPage() {
  const ready = hasPrefectureStatsData();

  const ranking = getPrefectureStats()
    .filter((r) => r.stats.crimeRate != null)
    .sort((a, b) => (b.stats.crimeRate ?? 0) - (a.stats.crimeRate ?? 0));

  const year = ranking[0]?.stats.crimeRateYear?.slice(0, 4);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🚨 都道府県別 刑法犯認知件数ランキング
      </h1>

      <DataAsOf />

      <RankingEditorial>
        <p style={{ margin: "0 0 10px" }}>
          刑法犯の「認知件数」は、警察が把握した件数であって、
          実際に起きた犯罪の総数そのものではありません。届出の
          されやすさや、警察の取り締まりの重点によっても増減します。
          この数字だけで「治安の良し悪し」を断定することはできません。
        </p>
        <p style={{ margin: "0 0 10px" }}>
          もう一つ、人口あたりで比べる際の落とし穴があります。
          繁華街や観光地を抱える都市部では、昼間に流入する人が
          多いため、住民の人口を分母にすると件数が高く出ます。
          住む街の安全性を考えるときは、件数の多い罪種(自転車盗や
          万引きが多いのか、凶悪犯なのか)まで含めて見ることが
          大切です。
        </p>
      </RankingEditorial>

      <a
        href="/articles/crime-rate-analysis"
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
        📖 刑法犯認知件数ランキング分析記事を読む →
      </a>

      {!ready || ranking.length === 0 ? (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 12,
            padding: 20,
            color: "#92400e",
            fontSize: 14,
            lineHeight: 1.8,
          }}
        >
          準備中です。<code>npm run merge:safety-stats</code>{" "}
          を実行してデータを取得すると、このページに自動的にランキングが表示されます。
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.8 }}>
            総務省「社会・人口統計体系(K 安全)」({year}年度)をもとにした、
            人口千人あたりの刑法犯認知件数です。市区町村単位のデータは
            公表されていないため、都道府県単位のみの掲載です。
          </p>

          <AdSense />

          <RankingInsightFAQ
            metricName="刑法犯認知件数(人口千人あたり)"
            unitLabel="都道府県"
            items={ranking.map((r) => ({
              name: r.pref,
              displayValue: `${r.stats.crimeRate?.toFixed(2)}件/千人`,
            }))}
            topNote="人口千人あたりの刑法犯認知件数が最も多く、治安面での注意が必要な水準であることを示します。"
          />

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>都道府県</th>
                <th style={th}>刑法犯認知件数(人口千人あたり)</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, i) => (
                <tr key={r.pref}>
                  <td style={td}>{i + 1}</td>
                  <td style={td}>{r.pref}</td>
                  <td style={td}>{r.stats.crimeRate?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {ready && ranking.length > 0 && <RankingCommentary slug="crime-rate" />}

    </main>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
};

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
};
