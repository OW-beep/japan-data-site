import Link from "next/link";
import { notFound } from "next/navigation";

import { getCity } from "@/lib/getCity";
import { getCities } from "@/lib/getCities";
import { getCityRanking } from "@/lib/getCityRanking";

import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import RelatedArticles from "@/components/RelatedArticles";

import CitySummary from "@/components/city/CitySummary";
import CityStats from "@/components/city/CityStats";
import CityHighlights from "@/components/city/CityHighlights";
import CityRanking from "@/components/city/CityRanking";
import NearbyCities from "@/components/city/NearbyCities";
import CityFAQ from "@/components/city/CityFAQ";
import RelatedRankings from "@/components/city/RelatedRankings";

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
    description: `${city.name}の人口・面積・人口密度・出生率・高齢化率などを掲載しています。`,
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

  const ranking = getCityRanking(code);

  const allCities = getCities();

  const pref = city.name.split(" ")[0];
  const cityName = city.name.replace(pref, "").trim();

  const nearbyCities = allCities
  .filter((c) => c.name.startsWith(pref))
  .filter((c) => c.code !== city.code)
  .sort((a, b) => b.population - a.population)
  .slice(0, 8)
  .map((c) => ({
    code: c.code,
    name: c.name.replace(pref, "").trim(),
  }));

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "40px 24px 80px",
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
          fontSize: 44,
          fontWeight: 800,
          marginBottom: 30,
        }}
      >
        {city.name}
      </h1>

      <CitySummary city={city} />

      <CityStats city={city} />

      <CityHighlights
        city={city}
        ranking={ranking?.summary}
      />

      <CityRanking
        national={ranking?.national ?? []}
        prefecture={ranking?.prefecture ?? []}
      />

      <NearbyCities
        prefecture={pref}
        cities={nearbyCities}
      />

      <CityFAQ city={city} />

      <RelatedRankings
        prefecture={pref}
      />

      <RelatedArticles />

      <div
        style={{
          marginTop: 50,
          textAlign: "center",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← トップページへ戻る
        </Link>
      </div>
    </main>
  );
}