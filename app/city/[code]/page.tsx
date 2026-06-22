import cities from "@/data/cities.json";

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}) {
  const city = cities.find((c) => c.code === params.code);

  return {
    title: city ? `${city.name}のデータ` : "都市データ",
    description: city
      ? `${city.name}の統計データ`
      : "都市データページ",
  };
}

export default function Page({
  params,
}: {
  params: { code: string };
}) {
  const city = cities.find((c) => c.code === params.code);

  if (!city) {
    return <div className="p-8">データが見つかりません</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{city.name}</h1>

      <p className="mt-4">
        コード: {city.code}
      </p>

      <p>
        データ: {city.value ?? "未設定"}
      </p>
    </main>
  );
}