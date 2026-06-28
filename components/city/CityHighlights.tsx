type Props = {
  city: {
    name: string;
    population: number;
    populationDensity?: number | null;
    agingRate?: number | null;
    birthRate?: number | null;
    area?: number | null;
  };
};

export default function CityHighlights({ city }: Props) {
  const comments: string[] = [];

  if (city.population > 500000) {
    comments.push(
      "全国でも人口の多い自治体のひとつで、地域の中心都市として発展しています。"
    );
  } else if (city.population > 100000) {
    comments.push(
      "人口10万人を超える自治体で、生活・商業・行政機能が充実しています。"
    );
  } else {
    comments.push(
      "比較的小規模な自治体で、地域の特色を活かしたまちづくりが行われています。"
    );
  }

  if (city.populationDensity && city.populationDensity > 5000) {
    comments.push(
      "人口密度が高く、市街地が発達した都市型の自治体です。"
    );
  }

  if (city.area && city.area > 500) {
    comments.push(
      "面積が広く、多様な地域特性を持つ自治体です。"
    );
  }

  if (city.agingRate && city.agingRate > 35) {
    comments.push(
      "高齢化率が高く、高齢者向け施策が重要となる地域です。"
    );
  }

  if (city.birthRate && city.birthRate > 1.5) {
    comments.push(
      "全国的に見ても出生率が比較的高い自治体です。"
    );
  }

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
        {comments.map((text, index) => (
          <p
            key={index}
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