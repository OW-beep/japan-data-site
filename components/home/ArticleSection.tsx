import ArticleCard from "../ArticleCard";

export default function ArticleSection() {
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
        📖 人気記事
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(340px,1fr))",
          gap: 24,
        }}
      >
        <ArticleCard
          href="/articles/population-about"
          title="人口とは？"
          desc="人口データの見方や集計方法をわかりやすく解説します。"
        />

        <ArticleCard
          href="/articles/population-top50"
          title="人口ランキングTOP50"
          desc="人口が多い自治体をランキング形式で紹介します。"
        />

        <ArticleCard
          href="/articles/population-concentration"
          title="人口集中はどこで起きている？"
          desc="都市への人口集中をデータから分析します。"
        />

        <ArticleCard
          href="/articles/million-cities"
          title="100万人都市一覧"
          desc="人口100万人以上の都市を一覧で比較できます。"
        />

        <ArticleCard
          href="/articles/child-top50"
          title="子ども人口ランキング"
          desc="子ども人口が多い自治体ランキングです。"
        />

        <ArticleCard
          href="/articles/aging-top50"
          title="高齢化率ランキング"
          desc="高齢化率が高い自治体ランキングです。"
        />

        <ArticleCard
          href="/articles/youngest-municipalities"
          title="若い自治体ランキング"
          desc="平均年齢が若い自治体を紹介します。"
        />

        <ArticleCard
          href="/articles/birth-rate"
          title="出生率ランキング"
          desc="出生率が高い自治体ランキングです。"
        />

        <ArticleCard
          href="/articles/decline"
          title="人口減少ランキング"
          desc="人口減少が進む自治体を比較します。"
        />
      </div>
    </section>
  );
}