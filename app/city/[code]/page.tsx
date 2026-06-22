import cities from "@/data/cities.json";

export default function Page({
  params,
}: {
  params: { code: string };
}) {
  const city = cities.find((c) => c.code === params.code);

  if (!city) return <div>Not Found</div>;

  return (
    <main style={{ padding: 20 }}>
      <h1>{city.name}</h1>
      <p>{city.population?.toLocaleString()}</p>
    </main>
  );
}