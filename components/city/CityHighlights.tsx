type Props = {
  city: {
    name: string;
    population: number;
    area?: number | null;
    populationDensity?: number | null;
    childPopulation?: number | null;
    birthRate?: number | null;
    agingRate?: number | null;
    financeIndex?: number | null;
  };

  ranking?: {
    national: {
      population: number;
      area: number;
      density: number;
      child: number;
      birthRate: number;
      agingRate: number;
      finance: number;
    };
  };
};

const AVG_POPULATION = 65000;
const AVG_AREA = 198;
const AVG_DENSITY = 1720;

export default function CityHighlights({
  city,
  ranking,
}: Props) {

  const comments: string[] = [];

  comments.push(
    `${city.name}は全国約1,900自治体の中で人口第${ranking?.national.population}位です。`
  );

  if (city.population > AVG_POPULATION) {
    comments.push(
      `人口は全国平均の約${(
        city.population / AVG_POPULATION
      ).toFixed(1)}倍となっています。`
    );
  } else {
    comments.push(
      "人口規模は全国平均よりやや小さい自治体です。"
    );
  }

  if (city.area != null) {

    comments.push(
      `面積は全国第${ranking?.national.area}位です。`
    );

    comments.push(
      city.area > AVG_AREA
        ? "全国平均より広い面積を持っています。"
        : "比較的コンパクトな自治体です。"
    );

  }

  if (city.populationDensity != null) {

    comments.push(
      `人口密度は全国第${ranking?.national.density}位です。`
    );

    comments.push(
      city.populationDensity > AVG_DENSITY
        ? "人口密度が高く、市街地が発達しています。"
        : "人口密度は低めで、ゆとりある住環境となっています。"
    );

  }

  if (city.childPopulation != null) {

    const rate =
      city.population === 0
        ? 0
        : city.childPopulation / city.population * 100;

    comments.push(
      `子ども人口は約${city.childPopulation.toLocaleString()}人（人口の約${rate.toFixed(
        1
      )}%）で、全国第${ranking?.national.child}位です。`
    );

  }

  if (
    city.birthRate != null &&
    ranking?.national.birthRate
  ) {

    comments.push(
      `出生率は${city.birthRate.toFixed(2)}で、全国第${ranking.national.birthRate}位です。`
    );

  }

  if (
    city.agingRate != null &&
    ranking?.national.agingRate
  ) {

    comments.push(
      `高齢化率は${city.agingRate.toFixed(1)}%で、全国第${ranking.national.agingRate}位です。`
    );

  }

  if (
  city.financeIndex != null &&
  ranking?.national.finance
) {

  const finance = city.financeIndex / 100;

  comments.push(
    `財政力指数は${finance.toFixed(
      2
    )}で、全国第${ranking.national.finance}位です。`
  );

  if (finance >= 1) {

    comments.push(
      "財政力指数が1.00以上であり、地方交付税に依存しない比較的財政力の高い自治体です。"
    );

  } else if (finance >= 0.7) {

    comments.push(
      "全国的に見ても比較的財政基盤が安定した自治体です。"
    );

  } else {

    comments.push(
      "財政力指数は全国平均より低く、地方交付税への依存度が比較的高い自治体です。"
    );

  }

}

  comments.push(
    "人口・出生率・高齢化率・財政力指数などを比較することで、この自治体の特徴を多角的に把握できます。"
  );

  return (
    <section
      style={{
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
        {city.name}の特徴
      </h2>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          padding: 30,
        }}
      >
        {comments.map((text, i) => (
          <p
            key={i}
            style={{
              lineHeight: 2,
              marginBottom: 18,
              color: "#374151",
              fontSize: 18,
            }}
          >
            ✅ {text}
          </p>
        ))}
      </div>
    </section>
  );
}