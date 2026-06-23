import cities from "@/data/cities.json";
import Link from "next/link";

export default function Page({
  params,
}: {
  params: { code: string };
}) {
  const list = cities.filter((c) =>
    c.code.startsWith(params.code)
  );

  const total = list.reduce(
    (sum, c) => sum + (c.population ?? 0),
    0
  );

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1>🗾 都道府県コード：{params.code}</h1>

      <div
        style={{
          marginTop: 16,
          background: "white",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <p>自治体数：{list.length}</p>
        <p>
          人口合計：{total.toLocaleString()}
        </p>
      </div>

      <h2 style={{ marginTop: 24 }}>
        自治体一覧
      </h2>

      <ul>
        {list.map((c) => (
          <li key={c.code}>
            <Link href={`/city/${c.code}`}>
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}