type Props = {
  city: {
    name: string;
    population: number;
  };
  summary?: {
    national: {
      population: number;
      agingRate: number;
      finance: number;
    };
  };
  similarCities: {
    code: string;
    name: string;
    population: number;
  }[];
};

const TOTAL_MUNICIPALITIES = 1741;

function percentileText(rank: number) {
  if (!rank || rank <= 0) return null;

  const percentile = (rank / TOTAL_MUNICIPALITIES) * 100;

  if (percentile <= 10) return "全国でも上位1割に入る";
  if (percentile <= 30) return "全国的に見て上位に入る";
  if (percentile <= 70) return "全国的には中位に位置する";
  return "全国的には下位に位置する";
}

export default function CityCompare({
  city,
  summary,
  similarCities,
}: Props) {
  const popRank = summary?.national.population;
  const popPercentileText = popRank
    ? percentileText(popRank)
    : null;

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
        {city.name}と他の自治体を比べる
      </h2>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          padding: 30,
          marginBottom: 20,
        }}
      >
        {popRank && popRank > 0 ? (
          <p
            style={{
              lineHeight: 2,
              fontSize: 18,
              color: "#374151",
              margin: 0,
            }}
          >
            {city.name}の人口規模は、全国{TOTAL_MUNICIPALITIES}
            自治体中{popRank}位で、{popPercentileText}
            水準です。
          </p>
        ) : (
          <p
            style={{
              lineHeight: 2,
              fontSize: 18,
              color: "#374151",
              margin: 0,
            }}
          >
            {city.name}
            は政令指定都市の区または特別区部の内訳のため、全国ランキングの対象外です。
          </p>
        )}
      </div>

      {similarCities.length > 0 && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            padding: 30,
          }}
        >
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            人口規模が近い自治体
          </h3>

          <p
            style={{
              color: "#6b7280",
              fontSize: 15,
              marginBottom: 18,
            }}
          >
            {city.name}(人口{city.population.toLocaleString()}
            人)と人口規模が近い自治体は以下のとおりです。
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 10,
            }}
          >
            {similarCities.map((c) => (
              <li key={c.code}>
                <a
                  href={`/city/${c.code}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8fafc",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "#111827",
                  }}
                >
                  <span>{c.name}</span>
                  <span style={{ color: "#6b7280" }}>
                    {c.population.toLocaleString()}人
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
