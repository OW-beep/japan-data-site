import Link from "next/link";

/**
 * 参考サイト(honeycomb-labo.com)の雰囲気に寄せたヒーロー。
 * ベタ塗りの色ブロックではなく、白地+細い罫線+手描き風の
 * アンダーラインで見せる、抑えた編集的なトーン。
 * イラストは参考サイトの家のスケッチの代わりに、
 * 自治体データサイトらしい「棒グラフ→ビル」の線画に置き換えている。
 */
export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--surface)",
        borderBottom: "1px solid var(--line)",
        padding: "44px 32px 36px",
        marginBottom: 32,
        overflow: "hidden",
      }}
    >
      {/* 右上の斜線テクスチャ(参考サイトのコーナー装飾を意識) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 260,
          height: 180,
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--line) 0, var(--line) 1px, transparent 1px, transparent 14px)",
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 620 }}>
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 30,
              lineHeight: 1.55,
              fontWeight: 800,
              color: "var(--ink)",
              marginBottom: 16,
            }}
          >
            日本全国の自治体データを
            <br />
            <UnderlinedText>ランキング・グラフ</UnderlinedText>
            で比較する
          </h1>

          <p
            style={{
              fontSize: 15,
              lineHeight: 1.9,
              color: "var(--muted)",
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
              borderTop: "1px solid var(--line)",
            }}
          >
            <Info number="1,741" label="対象自治体" />
            <Info number="20+" label="ランキング" />
            <Info number="2,000+" label="データページ" />
          </div>
        </div>

        <div style={{ position: "relative", flexShrink: 0 }}>
          <SkylineIllustration />

          <div
            style={{
              position: "absolute",
              top: -18,
              right: -6,
              transform: "rotate(-6deg)",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--indigo)",
              whiteSpace: "nowrap",
            }}
          >
            毎週データ更新中！
          </div>
        </div>
      </div>
    </section>
  );
}

function UnderlinedText({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 220 12"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          left: -2,
          right: -2,
          bottom: -6,
          width: "calc(100% + 4px)",
          height: 10,
        }}
      >
        <path
          d="M2 8 C 40 2, 80 10, 110 6 C 140 2, 180 9, 218 5"
          fill="none"
          stroke="var(--ochre)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function SkylineIllustration() {
  return (
    <svg
      width="180"
      height="140"
      viewBox="0 0 180 140"
      fill="none"
      role="img"
      aria-label="棒グラフとビル群のイラスト"
    >
      {/* 右肩上がりの折れ線 */}
      <path
        d="M8 108 L48 82 L82 92 L118 48 L168 22"
        stroke="var(--ochre)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {[
        [8, 108],
        [48, 82],
        [82, 92],
        [118, 48],
        [168, 22],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="var(--ochre)" />
      ))}

      {/* ビル(棒グラフ)の線画 */}
      <g stroke="var(--ink)" strokeWidth="2" fill="none">
        <rect x="14" y="108" width="20" height="28" rx="1" />
        <rect x="42" y="86" width="20" height="50" rx="1" />
        <rect x="70" y="96" width="20" height="40" rx="1" />
        <rect x="98" y="60" width="20" height="76" rx="1" />
        <rect x="126" y="70" width="20" height="66" rx="1" />
        <rect x="154" y="30" width="20" height="106" rx="1" />
      </g>

      {/* 窓の点描 */}
      <g fill="var(--line)">
        <circle cx="24" cy="118" r="1.6" />
        <circle cx="52" cy="98" r="1.6" />
        <circle cx="52" cy="112" r="1.6" />
        <circle cx="80" cy="106" r="1.6" />
        <circle cx="108" cy="72" r="1.6" />
        <circle cx="108" cy="88" r="1.6" />
        <circle cx="136" cy="82" r="1.6" />
        <circle cx="136" cy="98" r="1.6" />
        <circle cx="164" cy="44" r="1.6" />
        <circle cx="164" cy="60" r="1.6" />
        <circle cx="164" cy="76" r="1.6" />
      </g>

      <line x1="4" y1="136" x2="178" y2="136" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  );
}

const primaryButton = {
  background: "var(--ink)",
  color: "#fff",
  textDecoration: "none",
  padding: "11px 20px",
  fontWeight: 700,
  fontSize: 13,
} as const;

const secondaryButton = {
  background: "var(--surface)",
  color: "var(--ink)",
  border: "1px solid var(--ink)",
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
          color: "var(--ink)",
        }}
      >
        {number}
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>{label}</div>
    </div>
  );
}
