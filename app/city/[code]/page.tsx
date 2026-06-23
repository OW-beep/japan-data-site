import cities from "@/data/cities.json";

type City = {
  code: string;
  name: string;
  population?: number;
  birthRate?: number;
};

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
      ? `${city.name}のデータ`
      : "都市データ",
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

  return (
    <main style={{ padding: 20 }}>
      <h1>{city.name}</h1>

      <p>
        人口：
        {city.population?.toLocaleString() ??
          "-"}
      </p>

      <p>
        出生率：
        {city.birthRate ?? "-"}
      </p>
    </main>
  );
}