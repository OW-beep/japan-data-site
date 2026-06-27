import Link from "next/link";
import { notFound } from "next/navigation";

import { getCity } from "@/lib/getCity";
import { getCities } from "@/lib/getCities";

import Breadcrumb from "@/components/Breadcrumb";
import RelatedArticles from "@/components/RelatedArticles";
import JsonLd from "@/components/JsonLd";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

export async function generateStaticParams() {
  return getCities().map((city) => ({
    code: city.code,
  }));
}

export async function generateMetadata({
  params,
}: Props) {
  const { code } = await params;

  const city = getCity(code);

  if (!city) return {};

  return {
    title: city.name,
    description: `${city.name}の人口・面積・人口密度・子ども人口・高齢化率を掲載しています。`,
  };
}

export default async function Page({
  params,
}: Props) {
  const { code } = await params;

  const city = getCity(code);

  if (!city) {
    notFound();
  }

  const pref = city.name.split(" ")[0];
  const cityName = city.name.split(" ")[1];

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Place",
          name: city.name,
        }}
      />

      <Breadcrumb
        items={[
          {
            name: "ホーム",
            href: "/",
          },
          {
            name: pref,
            href: `/prefecture/${encodeURIComponent(pref)}`,
          },
          {
            name: cityName,
            href: `/city/${city.code}`,
          },
        ]}
      />

      <h1
        style={{
          fontSize: 42,
          marginBottom: 30,
        }}
      >
        {city.name}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
        }}
      >
        <Card
          title="人口"
          value={`${city.population.toLocaleString()} 人`}
        />

        <Card
          title="面積"
          value={
            city.area
              ? `${city.area.toLocaleString()} km²`
              : "-"
          }
        />

        <Card
          title="人口密度"
          value={
            city.populationDensity
              ? `${city.populationDensity.toLocaleString()} 人/km²`
              : "-"
          }
        />

        <Card
          title="子ども人口"
          value={`${city.childPopulation.toLocaleString()} 人`}
        />

        <Card
          title="高齢者人口"
          value={`${city.elderlyPopulation.toLocaleString()} 人`}
        />

        <Card
          title="財政力指数"
          value={
            city.financialIndex
              ? city.financialIndex.toString()
              : "-"
          }
        />
      </div>

      <section
        style={{
          marginTop: 60,
        }}
      >
        <h2>概要</h2>

        <p
          style={{
            lineHeight: 2,
          }}
        >
          {city.name}
          の人口・面積・人口密度・子ども人口・高齢化率などを掲載しています。
          全国1747自治体を同じ基準で比較できます。
        </p>
      </section>

      <RelatedArticles />

      <div
        style={{
          marginTop: 50,
        }}
      >
        <Link href="/">
          ← トップへ戻る
        </Link>
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