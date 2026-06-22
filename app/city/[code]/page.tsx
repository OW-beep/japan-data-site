import cities from "@/data/cities.json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const city = cities.find(
    (c) => c.code === code
  );

  return {
    title: `${city?.name}の人口・基本データ`,
    description:
      `${city?.name}の人口や基本情報を掲載しています。`,
  };
}