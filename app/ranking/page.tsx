import Link from "next/link";

export const metadata = {
  title: "全国ランキング一覧",
  description: "人口・出生率・財政力など、全国自治体の各種ランキング一覧です。",
};

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        全国ランキング一覧
      </h1>

      <p className="text-sm text-gray-700 mb-8">
        日本全国の自治体データをもとにしたランキング一覧です。
        気になる指標から都市を比較できます。
      </p>

      <div className="space-y-4">

        <Link
          href="/ranking/population"
          className="block p-4 border rounded hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">
            人口ランキング
          </h2>
          <p className="text-sm text-gray-600">
            全国の自治体を人口順に比較
          </p>
        </Link>

        <Link
          href="/ranking/birth-rate"
          className="block p-4 border rounded hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">
            出生率ランキング
          </h2>
          <p className="text-sm text-gray-600">
            少子化の地域差を可視化
          </p>
        </Link>

        <Link
          href="/ranking/finance"
          className="block p-4 border rounded hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">
            財政力ランキング
          </h2>
          <p className="text-sm text-gray-600">
            自治体の財政健全性を比較
          </p>
        </Link>

      </div>

    </main>
  );
}