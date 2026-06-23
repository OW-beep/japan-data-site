import cities from "@/data/cities.json";

type City = {
  code: string;
  name: string;
  population: number;
};

export async function generateStaticParams() {
  return cities.map((city) => ({
    code: city.code,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const city = (cities as City[]).find(
    (c) => c.code === code
  );

  return {
    title: city
      ? `${city.name}の人口データ`
      : "自治体データ",
    description: city
      ? `${city.name}の人口は${city.population.toLocaleString()}人です。`
      : "",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const city = (cities as City[]).find(
    (c) => c.code === code
  );

  if (!city) {
    return <main>データがありません</main>;
  }

  const ranking =
    [...(cities as City[])].sort(
      (a, b) =>
        b.population - a.population
    );

  const rank =
    ranking.findIndex(
      (c) => c.code === city.code
    ) + 1;

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold">
        {city.name}
      </h1>

      <div className="mt-6 space-y-4">
        <p>
          人口：
          {city.population.toLocaleString()}人
        </p>

        <p>
          全国順位：
          {rank}位
        </p>
      </div>
    </main>
  );
}