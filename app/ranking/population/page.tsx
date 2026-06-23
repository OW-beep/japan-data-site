import cities from "@/data/cities.json";
import Link from "next/link";

export default function Page() {
  const ranking = [...cities]
    .filter((c) => c.population && c.name)
    .filter((c) => c.name !== "特別区部")
    .sort(
      (a, b) =>
        (b.population ?? 0) - (a.population ?? 0)
    )
    .slice(0, 50);

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22 }}>
        📊 人口ランキング TOP50
      </h2>

      <p style={{ color: "#666" }}>
        全国の市区町村を人口順にランキング化
      </p>

      <div style={{ marginTop: 20 }}>
        {ranking.map((c, i) => (
          <Link
            key={c.code}
            href={`/city/${c.code}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 14,
              marginBottom: 10,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              textDecoration: "none",
              color: "#111",
              transition: "0.2s",
            }}
          >
            <span style={{ fontWeight: 500 }}>
              <span style={{ color: "#888" }}>
                #{i + 1}
              </span>{" "}
              {c.name}
            </span>

            <span
              style={{
                fontWeight: 700,
                color: "#2563eb",
              }}
            >
              {c.population?.toLocaleString()} 人
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}