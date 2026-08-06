type Props = {
  city: {
    population: number;
    area?: number | null;
    populationDensity?: number | null;
    childPopulation?: number | null;
    agingRate?: number | null;
    birthRate?: number | null;
    financeIndex?: number | null;
  };
};

function financeComment(index: number | null | undefined) {
  if (index == null) return "-";

  if (index >= 1.0) {
    return "★★★★★ 自立財政";
  }

  if (index >= 0.9) {
    return "★★★★☆ 財政力が高い";
  }

  if (index >= 0.7) {
    return "★★★☆☆ 全国平均";
  }

  if (index >= 0.5) {
    return "★★☆☆☆ やや弱い";
  }

  return "★☆☆☆☆ 地方交付税依存";
}

export default function CityStats({ city }: Props) {

  const cards = [
    {
      title: "人口",
      value: city.population.toLocaleString() + " 人",
      sub: "",
      icon: "👥",
    },
    {
      title: "面積",
      value:
        city.area != null
          ? city.area.toLocaleString() + " km²"
          : "-",
      sub: "",
      icon: "🗺️",
    },
    {
      title: "人口密度",
      value:
        city.populationDensity != null
          ? city.populationDensity.toLocaleString() + " 人/km²"
          : "-",
      sub: "",
      icon: "🏙️",
    },
    {
      title: "子ども人口",
      value:
        city.childPopulation != null
          ? city.childPopulation.toLocaleString() + " 人"
          : "-",
      sub: "",
      icon: "👶",
    },
    {
      title: "高齢化率",
      value:
        city.agingRate != null
          ? city.agingRate.toFixed(1) + "%"
          : "-",
      sub: "",
      icon: "👴",
    },
    {
      title: "出生率",
      value:
        city.birthRate != null
          ? city.birthRate.toFixed(2)
          : "-",
      sub: "",
      icon: "🍼",
    },
    {
      title: "財政力指数",
      value:
        city.financeIndex != null
          ? city.financeIndex.toFixed(2)
          : "-",
      sub: financeComment(city.financeIndex),
      icon: "💰",
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
                lineHeight: 1.3,
              }}
            >
              {card.value}
            </div>

            {card.sub && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  color: "#2563eb",
                  fontWeight: 600,
                }}
              >
                {card.sub}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}