import Link from "next/link";

const articles = [
  {
    title: "人口ランキングTOP50",
    href: "/articles/population-top50",
    emoji: "👥",
    desc: "全国の人口が多い自治体をランキング形式で紹介します。",
    tag: "人気",
  },
  {
    title: "人口密度が高い自治体",
    href: "/articles/population-concentration",
    emoji: "🏙️",
    desc: "人口密度から都市の特徴を比較できます。",
    tag: "注目",
  },
  {
    title: "100万人都市一覧",
    href: "/articles/million-cities",
    emoji: "🌆",
    desc: "人口100万人を超える都市を一覧で紹介します。",
    tag: "定番",
  },
  {
    title: "子ども人口ランキング",
    href: "/articles/child-top50",
    emoji: "👶",
    desc: "子どもが多い自治体ランキングです。",
    tag: "人気",
  },
  {
    title: "高齢化率ランキング",
    href: "/articles/aging-top50",
    emoji: "👴",
    desc: "高齢化率が高い自治体を比較できます。",
    tag: "注目",
  },
  {
    title: "出生率ランキング",
    href: "/articles/birth-rate",
    emoji: "👶🏻",
    desc: "出生率が高い自治体の特徴を解説します。",
    tag: "新着",
  },
];

export default function LatestArticles() {
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
        }}
      >
        おすすめ記事・人気ランキング
      </h2>

      <p
        style={{
          color: "#6b7280",
          lineHeight: 1.8,
          marginBottom: 22,
          fontSize: 17,
        }}
      >
        人口・出生率・高齢化率など、特によく読まれている記事を掲載しています。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: 24,
        }}
      >
        {articles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            style={{
              textDecoration: "none",
              color: "#111827",
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 18,
                padding: 26,
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 36,
                  }}
                >
                  {article.emoji}
                </div>

                <span
                  style={{
                    background: "#DBEAFE",
                    color: "#2563eb",
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {article.tag}
                </span>
              </div>

              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                {article.title}
              </h3>

              <p
                style={{
                  color: "#6b7280",
                  lineHeight: 1.8,
                }}
              >
                {article.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}