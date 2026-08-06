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

  const rankText = (rank: number | undefined) =>
    rank && rank > 0 ? `第${rank}位` : "対象外";

  comments.push(
    ranking && ranking.national.population > 0
      ? `${city.name}は全国の実在する自治体(約1,741)の中で人口${rankText(
          ranking?.national.population
        )}です。`
      : `${city.name}は政令指定都市の区のため、全国ランキングの対象外です(内訳として掲載しています)。`
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
      `面積は全国${rankText(ranking?.national.area)}です。`
    );

    comments.push(
      city.area > AVG_AREA
        ? "全国平均より広い面積を持っています。"
        : "比較的コンパクトな自治体です。"
    );

  }

  if (city.populationDensity != null) {

    comments.push(
      `人口密度は全国${rankText(ranking?.national.density)}です。`
    );

    comments.push(
      city.populationDensity > AVG_DENSITY
        ? "人口密度が高く、市街地が発達した都市型自治体です。"
        : "人口密度は比較的低く、ゆとりある住環境となっています。"
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
      )}%）で、全国${rankText(ranking?.national.child)}です。`
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

    comments.push(
      `財政力指数は${city.financeIndex.toFixed(
        2
      )}で、全国第${ranking.national.finance}位です。`
    );

    if (city.financeIndex >= 1.0) {

      comments.push(
        "財政力指数が1.00以上であり、地方交付税に依存せず自前の税収で行政運営できる財政力の高い自治体です。"
      );

    } else if (city.financeIndex >= 0.9) {

      comments.push(
        "全国でも上位クラスの財政基盤を持ち、安定した行政運営が期待できる自治体です。"
      );

    } else if (city.financeIndex >= 0.7) {

      comments.push(
        "比較的安定した財政基盤を持つ自治体です。"
      );

    } else if (city.financeIndex >= 0.5) {

      comments.push(
        "地方交付税に一定程度依存しながら行政運営を行っています。"
      );

    } else {

      comments.push(
        "地方交付税への依存度が高く、財政基盤は比較的弱い自治体です。"
      );

    }

  } else {

    comments.push(
      "財政力指数は公表対象外、または取得できない自治体です。"
    );

  }

  comments.push(
    "人口規模・人口構成・財政力などを総合的に見ることで、この自治体の特徴や全国での位置づけを把握できます。"
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