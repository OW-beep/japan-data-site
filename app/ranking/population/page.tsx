import Link from "next/link";
import cities from "@/data/cities.json";

export default function Page() {
  const ranking = [...cities];

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        全国人口ランキング
      </h1>

      <ul className="space-y-2">
        {ranking.slice(0, 100).map((city, index) => (
          <li key={city.code}>
            <Link href={`/city/${city.code}`}>
              {index + 1}位　
              {city.name}
              （{city.population.toLocaleString()}人）
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}