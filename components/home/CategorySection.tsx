import CategoryCard from "../CategoryCard";

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
          marginBottom: 24,
        }}
      >
        📂 カテゴリから探す
      </h2>

      <p
        style={{
          color: "#6b7280",
          marginBottom: 24,
          lineHeight: 1.8,
        }}
      >
        気になるテーマからランキングや解説記事を探せます。
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <CategoryCard href="/ranking/population" text="👥 人口" />
        <CategoryCard href="/ranking/area" text="🗺 面積" />
        <CategoryCard href="/ranking/density" text="🏙 人口密度" />
        <CategoryCard href="/ranking/child" text="👶 子ども人口" />
        <CategoryCard href="/ranking/aging" text="👴 高齢化率" />
        <CategoryCard href="/articles/birth-rate" text="👶 出生率" />
        <CategoryCard href="/articles/decline" text="📉 人口減少" />
        <CategoryCard href="/articles/million-cities" text="🏙 100万人都市" />
        <CategoryCard href="/articles/population-concentration" text="📊 人口集中" />
        <CategoryCard href="/articles/youngest-municipalities" text="🎓 若い自治体" />
      </div>
    </section>
  );
}