import Link from "next/link";
import cities from "@/data/cities.json";

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        全国データ一覧
      </h1>

      <ul className="space-y-2">
        {cities.map((city) => (
          <li key={city.code}>
            <Link
              className="text-blue-600 underline"
              href={`/city/${city.code}`}
            >
              {city.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}