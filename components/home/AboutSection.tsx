import Link from "next/link";

const points = [
  {
    icon: "🏛️",
    title: "政府オープンデータ",
    text: "総務省統計局・e-Stat・国土地理院などの公開統計を利用。",
  },
  {
    icon: "🗾",
    title: "全国1741自治体",
    text: "市区町村を横断して比較・ランキング形式で閲覧できます。",
  },
  {
    icon: "🔄",
    title: "定期的に更新",
    text: "公開統計の更新にあわせて掲載データも順次更新しています。",
  },
];

export default function AboutSection() {
  return (
    <section
      style={{
        marginBottom: 40,
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <h2
        style={{
          fontSize: 20,
          fontWeight: 800,
          margin: 0,
          marginBottom: 8,
        }}
      >
        このサイトについて
      </h2>

      <p
        style={{
          color: "#4b5563",
          lineHeight: 1.8,
          fontSize: 14,
          marginBottom: 18,
        }}
      >
        全国自治体データベースは、日本全国1741自治体の人口・出生率・高齢化率・
        人口密度・子ども人口・面積・財政などを、政府オープンデータをもとに
        誰でも無料で比較できるデータサイトです。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 14,
          marginBottom: 18,
        }}
      >
        {points.map((p) => (
          <div
            key={p.title}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>
              {p.icon}
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                marginBottom: 4,
              }}
            >
              {p.title}
            </div>
            <div
              style={{
                color: "#6b7280",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {p.text}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        <span>
          データ出典：e-Stat（政府統計の総合窓口）・国勢調査・住民基本台帳など
        </span>

        <Link
          href="/about"
          style={{
            color: "#2563eb",
            fontWeight: 700,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          データについて詳しく見る →
        </Link>
      </div>
    </section>
  );
}
