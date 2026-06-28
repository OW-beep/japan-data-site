type RankItem = {
  label: string;
  value: string;
};

type Props = {
  national: RankItem[];
  prefecture: RankItem[];
};

export default function CityRanking({
  national,
  prefecture,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 40,
      }}
    >
      <h2
        style={{
          fontSize: 30,
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        全国・都道府県順位
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: 24,
        }}
      >
        <RankingCard
          title="🇯🇵 全国順位"
          items={national}
        />

        <RankingCard
          title="📍 都道府県順位"
          items={prefecture}
        />
      </div>
    </section>
  );
}

function RankingCard({
  title,
  items,
}: {
  title: string;
  items: RankItem[];
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        padding: 26,
      }}
    >
      <h3
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 18,
        }}
      >
        {title}
      </h3>

      {items.map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px 0",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <span>{item.label}</span>

          <strong
            style={{
              color: "#2563eb",
            }}
          >
            {item.value}
          </strong>
        </div>
      ))}
    </div>
  );
}