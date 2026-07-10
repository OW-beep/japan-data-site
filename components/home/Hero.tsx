import Link from "next/link";

export default function Hero() {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg,#2563eb 0%,#0ea5e9 100%)",
        color: "#fff",
        borderRadius: 28,
        padding: "70px 28px",
        marginBottom: 50,
        boxShadow: "0 20px 40px rgba(37,99,235,.18)",
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
            padding: "8px 18px",
            borderRadius: 999,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          🇯🇵 全国1741自治体データを毎年更新
        </div>

        <h1
          style={{
            fontSize: 54,
            lineHeight: 1.2,
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          日本全国の自治体データを
          <br />
          ランキングとグラフで比較
        </h1>

        <p
          style={{
            maxWidth: 820,
            margin: "0 auto",
            fontSize: 20,
            lineHeight: 1.9,
            opacity: .95,
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
            gap: 16,
            marginTop: 42,
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
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 24,
            marginTop: 60,
          }}
        >
          <Info number="1741+" label="自治体" />
          <Info number="20+" label="ランキング" />
          <Info number="2000+" label="データページ" />
          <Info number="毎年更新" label="政府データ" />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 48,
          }}
        >
          {[
            "人口",
            "出生率",
            "高齢化率",
            "子ども人口",
            "人口密度",
            "面積",
            "財政",
            "教育",
          ].map((x) => (
            <span
              key={x}
              style={{
                padding: "10px 18px",
                background: "rgba(255,255,255,.15)",
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              {x}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const primaryButton = {
  background: "#fff",
  color: "#2563eb",
  textDecoration: "none",
  padding: "16px 26px",
  borderRadius: 14,
  fontWeight: 800,
} as const;

const secondaryButton = {
  background: "rgba(255,255,255,.15)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.35)",
  textDecoration: "none",
  padding: "16px 26px",
  borderRadius: 14,
  fontWeight: 700,
} as const;

function Info({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 40,
          fontWeight: 800,
        }}
      >
        {number}
      </div>

      <div
        style={{
          marginTop: 6,
          opacity: .9,
        }}
      >
        {label}
      </div>
    </div>
  );
}