type Props = {
  city: {
    name: string;
    prefecture: string;
    population: number;
    area?: number | null;
    populationDensity?: number | null;
    agingRate?: number | null;
    birthRate?: number | null;
  };
};

export default function CitySummary({ city }: Props) {
  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        padding: 34,
        marginBottom: 40,
      }}
    >
      <h2
        style={{
          fontSize: 30,
          fontWeight: 800,
          marginBottom: 22,
        }}
      >
        {city.name}とは？
      </h2>

      <p
        style={{
          lineHeight: 2,
          fontSize: 18,
          color: "#374151",
        }}
      >
        {city.name}は{city.prefecture}に位置する自治体です。
        人口は
        <strong>{city.population.toLocaleString()}人</strong>
        で、地域の中心都市として暮らし・産業・行政サービスを支えています。
      </p>

      {city.area && (
        <p
          style={{
            marginTop: 18,
            lineHeight: 2,
            fontSize: 18,
            color: "#374151",
          }}
        >
          面積は
          <strong>{city.area.toLocaleString()}㎢</strong>
          です。
          {city.populationDensity && (
            <>
              人口密度は
              <strong>
                {city.populationDensity.toLocaleString()}人/㎢
              </strong>
              となっています。
            </>
          )}
        </p>
      )}

      {city.agingRate && (
        <p
          style={{
            marginTop: 18,
            lineHeight: 2,
            fontSize: 18,
            color: "#374151",
          }}
        >
          高齢化率は
          <strong>{city.agingRate}%</strong>
          で、地域の人口構成を知る重要な指標となっています。
        </p>
      )}

      {city.birthRate && (
        <p
          style={{
            marginTop: 18,
            lineHeight: 2,
            fontSize: 18,
            color: "#374151",
          }}
        >
          出生率は
          <strong>{city.birthRate}</strong>
          で、子育て世代の多さや将来の人口動向を知る参考になります。
        </p>
      )}

      <div
        style={{
          marginTop: 26,
          background: "#f8fafc",
          borderRadius: 14,
          padding: 22,
        }}
      >
        <h3
          style={{
            fontSize: 22,
            marginBottom: 14,
          }}
        >
          このページで分かること
        </h3>

        <ul
          style={{
            lineHeight: 2,
            paddingLeft: 24,
          }}
        >
          <li>人口</li>
          <li>面積</li>
          <li>人口密度</li>
          <li>出生率</li>
          <li>高齢化率</li>
          <li>全国順位</li>
          <li>都道府県順位</li>
        </ul>
      </div>
    </section>
  );
}