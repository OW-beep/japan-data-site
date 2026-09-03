import type { Metadata } from "next";

import DataAsOf from "../../../components/DataAsOf";
import AdSense from "../../../components/AdSense";
import {
  getPrefectureStats,
  hasPrefectureStatsData,
  hasPrefectureStatsData as checkReady,
} from "../../../lib/prefectureStats";

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
