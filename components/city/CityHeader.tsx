type Props = {
  city: {
    name: string;
    prefecture: string;
    population: number;
  };
};

export default function CityHeader({ city }: Props) {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg,#eff6ff,#ffffff)",
        borderRadius: 20,
        padding: "40px",
        marginBottom: 40,
        border: "1px solid #dbeafe",
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: "#2563eb",
          color: "#fff",
          padding: "6px 14px",
          borderRadius: 999,
          fontWeight: 700,
          marginBottom: 18,
        }}
      >
        📍 {city.prefecture}
      </div>

      <h1
        style={{
          fontSize: 42,
          fontWeight: 800,
          marginBottom: 18,
          color: "#111827",
        }}
      >
        {city.name}
      </h1>

      <p
        style={{
          fontSize: 20,
          color: "#4b5563",
          lineHeight: 1.9,
          maxWidth: 850,
        }}
      >
        {city.name}は{city.prefecture}にある自治体です。
        人口は
        <strong>
          {" "}
          {city.population.toLocaleString()}人
        </strong>
        で、日本全国1741自治体の中でも比較できるデータを掲載しています。
      </p>
    </section>
  );
}