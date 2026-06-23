import cities from "@/data/cities.json";

export default function Page({
  params,
}: {
  params: { code: string };
}) {
  const prefCode = params.code;

  const filtered = cities.filter((c) =>
    c.code.startsWith(prefCode)
  );

  const total = filtered.reduce(
    (sum, c) => sum + (c.population ?? 0),
    0
  );

  return (
    <main style={{ padding: 20 }}>
      <h1>都道府県コード：{prefCode}</h1>

      <p>自治体数：{filtered.length}</p>
      <p>人口合計：{total.toLocaleString()}</p>

      <h2>自治体一覧</h2>
      <ul>
        {filtered.map((c) => (
          <li key={c.code}>{c.name}</li>
        ))}
      </ul>
    </main>
  );
}