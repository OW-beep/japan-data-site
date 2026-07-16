import Link from "next/link";

export default function WhyTrust() {
  const items = [
    {
      icon: "🏛️",
      title: "政府オープンデータを利用",
      text:
        "人口・出生率・高齢化率・面積などは政府や自治体が公開しているオープンデータをもとに掲載しています。",
    },
    {
      icon: "🗾",
      title: "全国1741自治体を掲載",
      text:
        "全国の市区町村を横断して比較できるようにデータを統合し、ランキング形式でも閲覧できます。",
    },
    {
      icon: "🔄",
      title: "定期的に更新",
      text:
        "公開統計の更新に合わせて、掲載データも順次更新しています。",
    },
  ];

  return (
    <section
      style={{
        maxWidth: 1100,
        margin: "70px auto",
        padding: "0 20px",
      }}
    >
      <h2
        style={{
          fontSize: 34,
          fontWeight: 800,
          marginBottom: 14,
          color: "#111827",
        }}
      >
        データの信頼性
      </h2>

      <p
        style={{
          color: "#6b7280",
          lineHeight: 1.8,
          marginBottom: 22,
          fontSize: 17,
        }}
      >
        本サイトは政府・自治体が公開している統計データをもとに作成しています。
        個人情報は一切扱わず、誰でも無料で利用できます。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: 24,
        }}
      >
        {items.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 18,
              padding: 28,
            }}
          >
            <div
              style={{
                fontSize: 38,
                marginBottom: 14,
              }}
            >
              {item.icon}
            </div>

            <h3
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              {item.title}
            </h3>

            <p
              style={{
                lineHeight: 1.8,
                color: "#4b5563",
              }}
            >
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 30,
          background: "#f8fafc",
          borderRadius: 16,
          padding: 22,
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: 22,
            marginBottom: 12,
          }}
        >
          データ出典
        </h3>

        <p
          style={{
            color: "#6b7280",
            lineHeight: 1.8,
            marginBottom: 14,
          }}
        >
          e-Stat（政府統計の総合窓口）、
          国勢調査、住民基本台帳などの公開データを利用しています。
        </p>

        <Link
          href="/about"
          style={{
            display: "inline-block",
            background: "#2563eb",
            color: "#fff",
            textDecoration: "none",
            padding: "12px 20px",
            borderRadius: 10,
            fontWeight: 700,
          }}
        >
          データについて詳しく見る →
        </Link>
      </div>
    </section>
  );
}