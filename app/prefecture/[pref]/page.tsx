import Link from "next/link";
import { notFound } from "next/navigation";

import { getCities } from "@/lib/getCities";
import { getPrefectures } from "@/lib/getPrefecture";

type Props = {
  params: Promise<{
    pref: string;
  }>;
};

export async function generateStaticParams() {
  return getPrefectures().map((pref) => ({
    pref,
  }));
}

export async function generateMetadata({
  params,
}: Props) {
  const { pref: rawPref } = await params;

  const pref = decodeURIComponent(rawPref);

  return {
    title: `${pref}の自治体一覧`,
    description: `${pref}の人口・面積・人口密度などを掲載しています。`,
  };
}

export default async function Page({
  params,
}: Props) {
  const { pref: rawPref } = await params;

  const pref = decodeURIComponent(rawPref);

  console.log("==========");
  console.log("pref =", pref);

  const allCities = getCities();

  console.log("cities.length =", allCities.length);
  console.log("first city =", allCities[0]);

  const cities = allCities.filter((c) =>
    c.name.startsWith(pref + " ")
  );

  console.log("matched =", cities.length);

  if (cities.length === 0) {
    notFound();
  }

  const population = cities.reduce(
    (s, c) => s + c.population,
    0
  );

  const area = cities.reduce(
    (s, c) => s + (c.area ?? 0),
    0
  );

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
      <h1
        style={{
          fontSize: 42,
          marginBottom: 30,
        }}
      >
        {pref}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: 20,
          marginBottom: 50,
        }}
      >
        <Card
          title="自治体数"
          value={`${cities.length}`}
        />

        <Card
          title="総人口"
          value={`${population.toLocaleString()} 人`}
        />

        <Card
          title="総面積"
          value={`${area.toLocaleString()} km²`}
        />
      </div>

      <h2>自治体一覧</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        {cities
          .sort((a, b) => b.population - a.population)
          .map((city) => (
            <Link
              key={city.code}
              href={`/city/${city.code}`}
              style={{
                textDecoration: "none",
                color: "#111827",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <h3>{city.name.replace(pref + " ", "")}</h3>

                <p>
                  人口：
                  {city.population.toLocaleString()} 人
                </p>

                <p>
                  面積：
                  {city.area?.toLocaleString() ?? "-"} km²
                </p>

                <p>
                  人口密度：
                  {city.populationDensity?.toLocaleString() ??
                    "-"}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <div
        style={{
          color: "#6b7280",
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}