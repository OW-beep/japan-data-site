import StatCard from "../StatCard";

export default function Stats() {
  return (
    <section
      style={{
        marginBottom: 46,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: 24,
        }}
      >
        <StatCard
          number="1,747"
          title="自治体"
          subtitle="全国の市区町村"
        />

        <StatCard
          number="約1.2億"
          title="人口"
          subtitle="総人口データ"
        />

        <StatCard
          number="毎月更新"
          title="オープンデータ"
          subtitle="最新情報を反映"
        />

        <StatCard
          number="無料"
          title="ランキング"
          subtitle="すべて閲覧可能"
        />
      </div>
    </section>
  );
}