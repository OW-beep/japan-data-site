import Link from "next/link";

export default function Hero() {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg,#eff6ff 0%,#ffffff 100%)",
        padding: "70px 20px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#2563eb",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          🇯🇵 全国1741自治体データベース
        </div>

        <h1
          style={{
            fontSize: 46,
            lineHeight: 1.25,
            fontWeight: 800,
            color: "#111827",
            marginBottom: 24,
          }}
        >
          日本全国の自治体データを
          <br />
          ひと目で比較できる
        </h1>

        <p
          style={{
            fontSize: 19,
            color: "#4b5563",
            lineHeight: 1.9,
            maxWidth: 860,
            margin: "0 auto",
          }}
        >
          人口・出生率・人口密度・高齢化率・子ども人口・面積など、
          政府オープンデータをもとに全国1741自治体を比較できます。
          ランキングや自治体ごとの特徴も掲載しています。
        </p>

        {/* ボタン */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
            marginTop: 34,
          }}
        >
          <Link
            href="/search"
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: 12,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            🔍 自治体を探す
          </Link>

          <Link
            href="/ranking/population"
            style={{
              background: "#fff",
              color: "#2563eb",
              padding: "14px 24px",
              border: "1px solid #2563eb",
              borderRadius: 12,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            📊 人気ランキング
          </Link>
        </div>

        {/* データ件数 */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 40,
            flexWrap: "wrap",
            marginTop: 46,
          }}
        >
          <Info number="1741+" label="自治体" />

          <Info number="8+" label="ランキング" />

          <Info number="2000+" label="ページ" />

          <Info number="100%" label="オープンデータ" />
        </div>

        {/* タグ */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 40,
          }}
        >
          {[
            "人口",
            "出生率",
            "人口密度",
            "高齢化率",
            "子ども人口",
            "面積",
          ].map((item) => (
            <span
              key={item}
              style={{
                background: "#fff",
                border: "1px solid #dbeafe",
                borderRadius: 999,
                padding: "10px 18px",
                fontWeight: 600,
                color: "#2563eb",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

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
          fontSize: 34,
          fontWeight: 800,
          color: "#2563eb",
        }}
      >
        {number}
      </div>

      <div
        style={{
          color: "#6b7280",
          marginTop: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
}