type Props = {
  city: {
    name: string;
    population: number;
    area?: number | null;
    populationDensity?: number | null;
    childPopulation?: number | null;
  };

  ranking?: {
    national: {
      population?: number;
      area?: number;
      density?: number;
      child?: number;
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

  // 人口
  if (ranking?.national.population) {
    comments.push(
      `${city.name}は全国約1,900自治体の中で人口第${ranking.national.population}位です。`
    );
  }

  if (city.population > AVG_POPULATION) {
    comments.push(
      `人口は約${(
        city.population / AVG_POPULATION
      ).toFixed(
        1
      )}倍で、全国平均を大きく上回る自治体です。`
    );
  } else {
    comments.push(
      "人口規模は全国平均よりやや小さく、地域に密着した自治体です。"
    );
  }

  // 面積
  if (city.area != null) {
    if (ranking?.national.area) {
      comments.push(
        `面積は全国第${ranking.national.area}位です。`
      );
    }

    if (city.area > AVG_AREA) {
      comments.push(
        `面積は約${(
          city.area / AVG_AREA
        ).toFixed(
          1
        )}倍あり、比較的広い自治体です。`
      );
    } else {
      comments.push(
        "全国平均と比べるとコンパクトな面積です。"
      );
    }
  }

  // 人口密度
  if (city.populationDensity != null) {
    if (ranking?.national.density) {
      comments.push(
        `人口密度は全国第${ranking.national.density}位です。`
      );
    }

    if (city.populationDensity > AVG_DENSITY) {
      comments.push(
        "人口密度が高く、市街地が発達した都市型の自治体です。"
      );
    } else {
      comments.push(
        "人口密度は比較的低く、ゆとりある住環境が特徴です。"
      );
    }
  }

  // 子ども人口
  if (city.childPopulation != null) {
    const rate =
      (city.childPopulation / city.population) *
      100;

    if (ranking?.national.child) {
      comments.push(
        `子ども人口は全国第${ranking.national.child}位です。`
      );
    }

    comments.push(
      `子ども人口は約${city.childPopulation.toLocaleString()}人で、人口全体の約${rate.toFixed(
        1
      )}%を占めています。`
    );
  }

  comments.push(
    "人口・面積・人口密度などのデータを活用することで、全国の自治体との比較や地域の特徴を把握できます。"
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