import Link from "next/link";

type City = {
  code: string;
  name: string;
};

type Props = {
  prefecture: string;
  cities: City[];
};

export default function NearbyCities({
  prefecture,
  cities,
}: Props) {
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
          marginBottom: 18,
        }}
      >
        📍 {prefecture}の他の自治体
      </h2>

      <p
        style={{
          color: "#6b7280",
          lineHeight: 1.8,
          marginBottom: 24,
        }}
      >
        同じ都道府県にある自治体のデータも比較できます。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 18,
        }}
      >
        {cities.map((city) => (
          <Link
            key={city.code}
            href={`/city/${city.code}`}
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 18,
                color: "#111827",
                fontWeight: 600,
              }}
            >
              🏙 {city.name}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}