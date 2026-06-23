import cities from "@/data/cities.json";

type City = {
  code: string;
  name: string;
  population?: number;
  birthRate?: number;
};

export default function Page() {
  const ranking = [...(cities as City[])].sort(
    (a, b) => (b.population ?? 0) - (a.population ?? 0)
  );

  return (
    <main style={{ padding: 20 }}>
      <h1>人口ランキング</h1>

      <ol>
        {ranking.slice(0, 50).map((city) => (
          <li key={city.code}>
            {city.name}
            {" "}
            {(city.population ?? 0).toLocaleString()}人
          </li>
        ))}
      </ol>
    </main>
  );
}