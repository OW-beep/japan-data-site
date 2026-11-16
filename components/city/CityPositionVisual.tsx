import type { Insight } from "@/lib/cityInsight";

/**
 * 自治体ページの「ひと目で分かる全国ポジション」。
 *
 * 数字と順位だけが並ぶページでは、その自治体が全国の中で
 * どのあたりにいるのかが直感的に伝わらない。5つの主要指標について、
 * 全国での位置をバーの上のマーカーで示し、あわせて全国平均との差も出す。
 * 値はすべて lib/cityInsight.ts が計算した、その自治体固有の数字。
 */

type Row = {
  label: string;
  value: string;
  rank: number;
  of: number;
  note?: string;
};

function pctLabel(rank: number, of: number): string {
  const pct = (rank / of) * 100;
  return pct < 1 ? "上位1%未満" : `上位${Math.round(pct)}%`;
}

function PositionRow({ row }: { row: Row }) {
  // バー上の位置: 左が「小さい・低い側」、右が「大きい・高い側」
  const pos = Math.min(98, Math.max(2, ((row.of - row.rank + 1) / row.of) * 100));
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15 }}>
          {row.label}
          <span style={{ marginLeft: 10, fontSize: 17, color: "#1d4ed8" }}>{row.value}</span>
        </div>
        <div style={{ fontSize: 13, color: "#4b5563" }}>
          全国{row.rank.toLocaleString()}位 / {row.of.toLocaleString()}自治体（
          {pctLabel(row.rank, row.of)}）
        </div>
      </div>
      <div
        style={{
          position: "relative",
          height: 10,
          background: "#e5e7eb",
          borderRadius: 999,
          marginTop: 8,
        }}
        role="img"
        aria-label={`${row.label}は全国${row.rank}位（${pctLabel(row.rank, row.of)}）`}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${pos}%`,
            background: "linear-gradient(90deg,#93c5fd,#2563eb)",
            borderRadius: 999,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${pos}%`,
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            border: "3px solid #1d4ed8",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#9ca3af",
          marginTop: 4,
        }}
      >
        <span>小さい・低い</span>
        <span>大きい・高い</span>
      </div>
      {row.note && (
        <div style={{ fontSize: 13, color: "#4b5563", marginTop: 2 }}>{row.note}</div>
      )}
    </div>
  );
}

export default function CityPositionVisual({ insight }: { insight: Insight }) {
  const diff = (v: number, avg: number) => {
    const d = v - avg;
    return `全国平均は${avg.toFixed(1)}%（この自治体は${d >= 0 ? "+" : ""}${d.toFixed(1)}ポイント）`;
  };

  const rows: Row[] = [
    {
      label: "人口",
      value: `${insight.pop.toLocaleString()}人`,
      rank: insight.popRank,
      of: insight.total,
    },
    {
      label: "子ども（15歳未満）の割合",
      value: `${insight.childRate.toFixed(1)}%`,
      rank: insight.childRank,
      of: insight.total,
      note: diff(insight.childRate, insight.childNat),
    },
    {
      label: "高齢化率",
      value: `${insight.elderlyRate.toFixed(1)}%`,
      rank: insight.elderlyRank,
      of: insight.total,
      note: diff(insight.elderlyRate, insight.elderlyNat),
    },
  ];
  if (insight.financeIndex != null && insight.financeRank != null) {
    rows.push({
      label: "財政力指数",
      value: insight.financeIndex.toFixed(2),
      rank: insight.financeRank,
      of: insight.financeCount,
      note: "1.0を超えると、国からの地方交付税に頼らず自前の収入で運営できる水準です",
    });
  }
  if (insight.density != null && insight.densityRank != null) {
    rows.push({
      label: "人口密度",
      value: `${Math.round(insight.density).toLocaleString()}人/km²`,
      rank: insight.densityRank,
      of: insight.total,
    });
  }

  return (
    <section
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: "24px 24px 10px",
        marginBottom: 40,
      }}
    >
      <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
        ひと目で分かる全国ポジション
      </h2>
      <p style={{ color: "#4b5563", lineHeight: 1.8, marginBottom: 20 }}>
        {insight.name}の主要指標が、全国{insight.total.toLocaleString()}自治体の
        どのあたりにあるかを図にしました。マーカーが右にあるほど、その指標が
        大きい（高い）側です。
        {insight.standouts.length > 0 && (
          <>
            全国で際立つのは、
            {insight.standouts
              .map((s) => `${s.label}（${s.top ? "高い側" : "低い側"}の${pctLabel(s.rank, s.of)}）`)
              .join("、")}
            です。
          </>
        )}
      </p>
      {rows.map((r) => (
        <PositionRow key={r.label} row={r} />
      ))}
    </section>
  );
}
