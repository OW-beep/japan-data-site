import Card from "../Card";

export default function RankingSection() {
  return (
    <section
      style={{
        marginBottom: 46,
      }}
    >
      <h2
        style={{
          fontSize: 34,
          fontWeight: 800,
          marginBottom: 14,
        }}
      >
        📊 人気ランキング
      </h2>

      <p
        style={{
          color: "#6b7280",
          marginBottom: 20,
          lineHeight: 1.8,
          fontSize: 17,
        }}
      >
        よく閲覧されているランキングです。
        全国1741自治体をさまざまな視点から比較できます。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: 22,
        }}
      >
        <Card
          href="/ranking/population"
          emoji="👥"
          title="人口ランキング TOP50"
          desc="人口が多い自治体をランキング形式で比較できます。"
        />

        <Card
          href="/ranking/birth-rate"
          emoji="👶"
          title="出生率ランキング"
          desc="出生率が高い自治体をランキング形式で掲載しています。"
        />

        <Card
          href="/ranking/area"
          emoji="🗺️"
          title="面積ランキング"
          desc="面積が広い自治体をランキング形式で比較できます。"
        />

        <Card
          href="/ranking/density"
          emoji="🏙️"
          title="人口密度ランキング"
          desc="人口密度が高い自治体を比較できます。"
        />

        <Card
          href="/ranking/aging"
          emoji="👴"
          title="高齢化率ランキング"
          desc="高齢化率が高い自治体ランキングです。"
        />

        <Card
          href="/ranking/child"
          emoji="🧒"
          title="子ども人口ランキング"
          desc="子ども人口が多い自治体を比較できます。"
        />

        <Card
          href="/ranking/finance"
          emoji="💰"
          title="財政力指数ランキング"
          desc="財政力指数が高い自治体をランキング形式で比較できます。"
        />

        <Card
          href="/ranking/decline"
          emoji="📊"
          title="社会増減率ランキング"
          desc="転入超過・転出超過の自治体をランキング形式で比較できます。"
        />

        <Card
          href="/ranking/household"
          emoji="🏠"
          title="単独世帯割合ランキング"
          desc="一人暮らし世帯の割合が高い自治体を比較できます。"
        />
      </div>
    </section>
  );
}