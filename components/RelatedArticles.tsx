import Link from "next/link";

const articles = [
  {
    title: "人口ランキング",
    href: "/ranking/population",
  },
  {
    title: "面積ランキング",
    href: "/ranking/area",
  },
  {
    title: "人口密度ランキング",
    href: "/ranking/density",
  },
  {
    title: "子ども人口ランキング",
    href: "/ranking/child",
  },
  {
    title: "高齢化率ランキング",
    href: "/ranking/aging",
  },
];

export default function RelatedArticles() {
  return (
    <section
      style={{
        marginTop: 60,
      }}
    >
      <h2>関連記事</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16,
          marginTop: 20,
        }}
      >
        {articles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            style={{
              padding: 18,
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              textDecoration: "none",
              color: "#111827",
            }}
          >
            {article.title}
          </Link>
        ))}
      </div>
    </section>
  );
}