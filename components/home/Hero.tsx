import Link from "next/link";

export default function Hero() {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg,#2563eb 0%,#0ea5e9 100%)",
        color: "#fff",
        borderRadius: 24,
        padding: "40px 28px",
        marginBottom: 40,
        boxShadow: "0 16px 32px rgba(37,99,235,.16)",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,.15)",
            padding: "6px 16px",
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          🇯🇵 全国1741自治体データを毎年更新
        </div>

        <h1
          style={{
            fontSize: 36,
            lineHeight: 1.35,
            fontWeight: 800,
            marginBottom: 14,
          }}
        >
          日本全国の自治体データを
          <br />
          ランキングとグラフで比較
        </h1>

        <p
          style={{
            maxWidth: 720,
            margin: "0 auto",
            fontSize: 16,
            lineHeight: 1.8,
            opacity: 0.95,
          }}
        >
          人口・出生率・人口密度・高齢化率・子ども人口・面積・財政など、
          政府オープンデータをわかりやすく可視化。
          全国1741自治体をランキング・比較・分析できます。
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 26,
          }}
        >
          <Link
            href="/ranking/population"
            style={primaryButton}
          >
            👑 人口ランキング
          </Link>

          <Link
            href="/ranking/birth-rate"
            style={secondaryButton}
          >
            👶 出生率ランキング
          </Link>

          <Link
            href="/search"
            style={secondaryButton}
          >
            🔍 自治体検索
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px 28px",
            marginTop: 28,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,.2)",
          }}
        >
          <Info number="1741+" label="自治体" />
          <Info number="20+" label="ランキング" />
          <Info number="2000+" label="データページ" />
          <Info number="毎年更新" label="政府データ" />
        </div>
      </div>
    </section>
  );
}

const primaryButton = {
  background: "#fff",
  color: "#2563eb",
  textDecoration: "none",
  padding: "12px 20px",
  borderRadius: 12,
  fontWeight: 800,
  fontSize: 14,
} as const;

const secondaryButton = {
  background: "rgba(255,255,255,.15)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.35)",
  textDecoration: "none",
  padding: "12px 20px",
  borderRadius: 12,
  fontWeight: 700,
  fontSize: 14,
} as const;

function Info({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
        }}
      >
        {number}
      </div>

      <div
        style={{
          fontSize: 13,
          opacity: 0.85,
        }}
      >
        {label}
      </div>
    </div>
  );
}
