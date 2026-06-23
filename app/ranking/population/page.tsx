import cities from "@/data/cities.json";
import Link from "next/link";

type City = {
  code: string;
  name: string;
  population?: number;
};

export default function Page() {
  const ranking = (cities as City[])
    .filter((c) => {
      // ❌ 特別区部除外（ランキング歪み防止）
      if (c.name === "特別区部") return false;
      if (c.code === "13100") return false;
      return true;
    })
    .filter((c) => c.population && c.population > 0)
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
    .slice(0, 100);

  return (
    <main
      style={{
        padding: 24,
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      {/* SEOタイトル */}
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        日本の人口ランキング TOP100
      </h1>

      <p style={{ color: "#666", marginTop: 8 }}>
        全国の市区町村人口データ（e-Stat基準）
      </p>

      {/* ランキング */}
      <ol style={{ marginTop: 24 }}>
        {ranking.map((c, i) => (
          <li key={c.code} style={{ marginBottom: 8 }}>
            <Link
              href={`/city/${c.code}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                textDecoration: "none",
                padding: 12,
                borderRadius: 8,
                background: "#f5f5f5",
                color: "#111",
              }}
            >
              <span>
                {i + 1}. {c.name}
              </span>

              <span>
                {c.population?.toLocaleString()} 人
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* SEO内部リンク */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 18 }}>関連ランキング</h2>

        <ul>
          <li>
            <Link href="/ranking/birth-rate">
              出生率ランキング
            </Link>
          </li>
          <li>
            <Link href="/search">
              自治体検索
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}