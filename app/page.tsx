import Link from "next/link";

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        Japan Data Site
      </h1>

      <p className="mt-4">
        データランキングサイト
      </p>

      <div className="mt-6 space-y-2">
        <Link className="text-blue-600 underline" href="/ranking">
          全国一覧
        </Link>

        <br />

        <Link className="text-blue-600 underline" href="/ranking/population">
          人口ランキング
        </Link>

        <br />

        <Link className="text-blue-600 underline" href="/ranking/birth-rate">
          出生率ランキング
        </Link>
      </div>
    </main>
  );
}