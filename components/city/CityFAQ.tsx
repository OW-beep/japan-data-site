type Props = {
  city: {
    name: string;
    population: number;
    area?: number | null;
    populationDensity?: number | null;
    birthRate?: number | null;
    agingRate?: number | null;
  };
};

export default function CityFAQ({ city }: Props) {
  const faqs = [
    {
      q: `${city.name}の人口は？`,
      a: `${city.name}の人口は約${city.population.toLocaleString()}人です。`,
    },
    {
      q: `${city.name}の面積は？`,
      a:
        city.area != null
          ? `${city.area.toLocaleString()}km²です。`
          : "現在データを準備中です。",
    },
    {
      q: `${city.name}の人口密度は？`,
      a:
        city.populationDensity != null
          ? `${city.populationDensity.toLocaleString()}人/km²です。`
          : "現在データを準備中です。",
    },
    {
      q: `${city.name}の出生率は？`,
      a:
        city.birthRate != null
          ? `${city.birthRate}です。`
          : "現在データを準備中です。",
    },
    {
      q: `${city.name}の高齢化率は？`,
      a:
        city.agingRate != null
          ? `${city.agingRate}%です。`
          : "現在データを準備中です。",
    },
  ];

  return (
    <section
      style={{
        marginTop: 50,
        marginBottom: 50,
      }}
    >
      <h2
        style={{
          fontSize: 30,
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        よくある質問
      </h2>

      {faqs.map((faq) => (
        <details
          key={faq.q}
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 18,
            marginBottom: 14,
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {faq.q}
          </summary>

          <p
            style={{
              marginTop: 16,
              lineHeight: 1.9,
              color: "#4b5563",
            }}
          >
            {faq.a}
          </p>
        </details>
      ))}
    </section>
  );
}