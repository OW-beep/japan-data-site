import cities from "@/data/cities.json";
import Link from "next/link";

export const metadata = {
  title: "全国人口ランキング",
  description:
    "全国自治体の人口ランキングです。",
};

export default function Page() {
  const ranking = [...cities].sort(
    (a, b) => b.population - a.population
  );

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        全国人口ランキング
      </h1>

      <table className="border-collapse border w-full">
        <thead>
          <tr>
            <th className="border p-2">順位</th>
            <th className="border p-2">自治体</th>
            <th className="border p-2">人口</th>
          </tr>
        </thead>

        <tbody>
          {ranking.map((city, index) => (
            <tr key={city.code}>
              <td className="border p-2">
                {index + 1}
              </td>

              <td className="border p-2">
                <Link
                  href={`/city/${city.code}`}
                  className="text-blue-600 underline"
                >
                  {city.name}
                </Link>
              </td>

              <td className="border p-2">
                {city.population.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}