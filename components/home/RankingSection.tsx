import Card from "../Card";

export default function RankingSection() {
  return (
    <section style={{ marginBottom: 70 }}>
      <h2
        style={{
          fontSize: 34,
          marginBottom: 24,
        }}
      >
        📊 ランキング
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: 22,
        }}
      >
        <Card
          href="/ranking/population"
          emoji="👥"
          title="人口ランキング"
          desc="全国1747自治体を人口順に掲載"
        />

        <Card
          href="/ranking/area"
          emoji="🗺️"
          title="面積ランキング"
          desc="面積が広い自治体ランキング"
        />

        <Card
          href="/ranking/density"
          emoji="🏙️"
          title="人口密度ランキング"
          desc="人口密度が高い自治体ランキング"
        />

        <Card
          href="/ranking/child"
          emoji="👶"
          title="子ども人口ランキング"
          desc="子ども人口が多い自治体ランキング"
        />

        <Card
          href="/ranking/aging"
          emoji="👴"
          title="高齢化率ランキング"
          desc="高齢化率が高い自治体ランキング"
        />

        <Card
          href="/articles/birth-rate"
          emoji="👶"
          title="出生率ランキング"
          desc="出生率が高い自治体ランキング"
        />

        <Card
          href="/articles/decline"
          emoji="📉"
          title="人口減少ランキング"
          desc="人口減少が進む自治体ランキング"
        />

        <Card
          href="/articles/million-cities"
          emoji="🏙️"
          title="100万人都市"
          desc="人口100万人以上の都市一覧"
        />
      </div>
    </section>
  );
}