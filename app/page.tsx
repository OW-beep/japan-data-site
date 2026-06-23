import Link from "next/link";
import cities from "@/data/cities.json";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">
        日本自治体データベース
      </h1>

      <p className="mb-8">
        全国 {cities.length} 自治体の人口データを掲載
      </p>

      <ul className="space-y-4">
        <li>
          <Link href="/ranking/population">
            人口ランキング
          </Link>
        </li>

        <li>
          <Link href="/city/12204">
            船橋市を見る
          </Link>
        </li>
      </ul>
    </main>
  );
}