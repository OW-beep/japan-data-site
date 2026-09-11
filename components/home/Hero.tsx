import Link from "next/link";

export default function Hero() {
  return (
    <section
      style={{
        background: "var(--indigo)",
        color: "#fff",
        borderLeft: "6px solid var(--ochre)",
        padding: "36px 32px 30px",
        marginBottom: 32,
      }}
    >
      <div style={{ maxWidth: 720 }}>
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 32,
            lineHeight: 1.5,
            fontWeight: 800,
            marginBottom: 14,
          }}
        >
          日本全国の自治体データを
          <br />
          <span
            style={{
              background: "var(--ochre)",
              padding: "2px 10px",
              display: "inline-block",
              marginTop: 4,
            }}
          >
            ランキング・グラフ
          </span>
          で比較する
        </h1>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.9,
            opacity: 0.92,
            marginBottom: 0,
          }}
        >
          人口・出生率・人口密度・高齢化率・子ども人口・面積・財政など、
          政府オープンデータをわかりやすく可視化。
          全国1,741自治体をランキング・比較・分析できます。
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 24,
          }}
        >
          <Link href="/ranking/population" style={primaryButton}>
            人口ランキング
          </Link>

          <Link href="/search" style={secondaryButton}>
            自治体検索
          </Link>

          <Link href="/compare" style={secondaryButton}>
            自治体比較
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px 28px",
            marginTop: 26,
            paddingTop: 18,
            borderTop: "1px solid rgba(255,255,255,.25)",
          }}
        >
          <Info number="1,741" label="対象自治体" />
          <Info number="20+" label="ランキング" />
          <Info number="2,000+" label="データページ" />
        </div>
      </div>
    </section>
  );
}

const primaryButton = {
  background: "var(--ochre)",
  color: "#fff",
  textDecoration: "none",
  padding: "11px 20px",
  fontWeight: 700,
  fontSize: 13,
} as const;

const secondaryButton = {
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.4)",
  textDecoration: "none",
  padding: "11px 20px",
  fontWeight: 700,
  fontSize: 13,
} as const;

function Info({ number, label }: { number: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          fontFamily: "var(--font-numeric)",
        }}
      >
        {number}
      </div>
      <div style={{ fontSize: 12, opacity: 0.85 }}>{label}</div>
    </div>
  );
}
