type Props = {
  city: {
    population: number;
    area?: number | null;
    populationDensity?: number | null;
    childPopulation?: number | null;
    agingRate?: number | null;
    birthRate?: number | null;
  };
};

export default function CityStats({ city }: Props) {
  const cards = [
    {
      title: "人口",
      value: city.population.toLocaleString() + " 人",
      icon: "👥",
    },
    {
      title: "面積",
      value: city.area
        ? city.area.toLocaleString() + " km²"
        : "-",
      icon: "🗺️",
    },
    {
      title: "人口密度",
      value: city.populationDensity
        ? city.populationDensity.toLocaleString() + " 人/km²"
        : "-",
      icon: "🏙️",
    },
    {
      title: "子ども人口",
      value: city.childPopulation
        ? city.childPopulation.toLocaleString() + " 人"
        : "-",
      icon: "👶",
    },
    {
      title: "高齢化率",
      value:
        city.agingRate != null
          ? city.agingRate + "%"
          : "-",
      icon: "👴",
    },
    {
      title: "出生率",
      value:
        city.birthRate != null
          ? city.birthRate.toString()
          : "-",
      icon: "🍼",
    },
  ];

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
        基本データ
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 18,
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 34,
                marginBottom: 14,
              }}
            >
              {card.icon}
            </div>

            <div
              style={{
                color: "#6b7280",
                marginBottom: 8,
                fontSize: 15,
              }}
            >
              {card.title}
            </div>

            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1.4,
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}