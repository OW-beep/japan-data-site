import cities from "@/data/cities.json";

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}) {
  const city = cities.find((c) => c.code === params.code);

  return {
    title: city ? `${city.name}の人口・基本データ` : "データなし",
    description: city
      ? `${city.name}の人口や基本情報を掲載しています。`
      : "データが見つかりません",
  };
}

export default function Page({
  params,
}: {
  params: { code: string };
}) {
  const city = cities.find((c) => c.code === params.code);

  if (!city) {
    return <div>データが見つかりません</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{city.name}</h1>
      <p>人口: {city.population?.toLocaleString()}</p>
    </main>
  );
}