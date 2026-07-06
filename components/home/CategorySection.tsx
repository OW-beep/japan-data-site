import CategoryCard from "../CategoryCard";

const categories = [
  {
    href: "/ranking/population",
    title: "👥 人口ランキング",
    desc: "全国の自治体を人口順に比較できます。",
  },
  {
    href: "/ranking/area",
    title: "🗺 面積ランキング",
    desc: "面積が広い自治体をランキング形式で掲載。",
  },
  {
    href: "/ranking/density",
    title: "🏙 人口密度",
    desc: "人口密度から都市の特徴を比較できます。",
  },
  {
    href: "/ranking/child",
    title: "👶 子ども人口",
    desc: "子育て世代が多い自治体を調べられます。",
  },
  {
    href: "/ranking/aging",
    title: "👴 高齢化率",
    desc: "高齢化率が高い自治体ランキングです。",
  },
  {
    href: "/ranking/birth-rate",
    title: "👶 出生率",
    desc: "出生率が高い自治体を比較できます。",
  },
  {
    href: "/ranking/decline",
    title: "📉 人口減少",
    desc: "人口減少率が高い自治体ランキングです。",
  },
  {
    href:"/ranking/finance",
    title:"💰 財政力指数",
    desc:"自治体の財政力指数を比較できます。",
  },
];

export default function CategorySection() {
  return (
    <section
      style={{
        marginBottom: 70,
      }}
    >
      <h2
        style={{
          fontSize: 34,
          fontWeight: 800,
          marginBottom: 18,
        }}
      >
        📂 カテゴリから探す
      </h2>

      <p
        style={{
          color: "#6b7280",
          marginBottom: 30,
          lineHeight: 1.8,
          fontSize: 17,
        }}
      >
        全国1741自治体をさまざまな指標から比較できます。
        気になるテーマを選んでランキングや解説をご覧ください。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: 20,
        }}
      >
        {categories.map((item) => (
          <div
            key={item.href}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 22,
            }}
          >
            <CategoryCard
              href={item.href}
              text={item.title}
            />

            <p
              style={{
                marginTop: 12,
                color: "#6b7280",
                lineHeight: 1.7,
                fontSize: 15,
              }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}