import cities from "@/data/cities.json";
import Link from "next/link";

export const metadata = {
  title: "全国出生率ランキング",
  description: "全国自治体の出生率ランキングです。少子化の地域差を比較できます。",
};

export default function Page() {
  const ranking = [...cities].sort(
    (a, b) => b.birthRate - a.birthRate
  );

  return (
    <main className="max-w-5xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-4">
        全国出生率ランキング
      </h1>

      <p className="text-sm text-gray-700 mb-4">
        全国の自治体を出生率順に並べたランキングです。
        少子化の地域差を比較できます。
      </p>

      <p className="text-sm text-gray-700 mb-8">
        都市部は低く、地方は高い傾向があります。
      </p>

      <table className="border-collapse border w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">順位</th>
            <th className="border p-2">自治体</th>
            <th className="border p-2">出生率</th>
          </tr>
        </thead>

        <tbody>
          {ranking.map((city, index) => (
            <tr key={city.code}>
              <td className="border p-2">{index + 1}</td>

              <td className="border p-2">
                <Link
                  href={`/city/${city.code}`}
                  className="text-blue-600 underline"
                >
                  {city.name}
                </Link>
              </td>

              <td className="border p-2">
                {city.birthRate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 text-sm text-gray-600">
        各自治体をクリックすると詳細データページに移動します。
      </div>

    </main>
  );
}