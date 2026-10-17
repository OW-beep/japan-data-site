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
import CityWards from "@/components/city/CityWards";
import CityHighlights from "@/components/city/CityHighlights";
import CityRanking from "@/components/city/CityRanking";
import NearbyCities from "@/components/city/NearbyCities";
import CityCompare from "@/components/city/CityCompare";
import RelatedRankings from "@/components/city/RelatedRankings";
import CityNarrative from "@/components/city/CityNarrative";
import CityStrengths from "@/components/city/CityStrengths";
import { getCityInsight } from "@/lib/cityInsight";
import { isCityIndexable, CITY_INDEX_MIN_POP } from "@/lib/indexPolicy";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

/**
 * ビルドで先に作るのは、index対象のページ(人口10万人以上・アフィ入り。lib/indexPolicy.ts)だけ。
 * それ以外のページ(noindexの小さな自治体・政令市の区)は、最初にアクセスされたときに作って
 * キャッシュする(dynamicParams の既定どおり)。ビルド時間を短くするための設定。
 */
export async function generateStaticParams() {
  return getCities()
    .filter((city) => isCityIndexable(city.code))
    .map((city) => ({
      code: city.code,
    }));
}

export async function generateMetadata({
  params,
}: Props) {
  const { code } = await params;

  const city = getCity(code);

  if (!city) return {};

  const ins = getCityInsight(code);
  const pref0 = city.name.split(" ")[0];
  const short0 = city.name.split(" ").slice(1).join(" ") || city.name;
  const indexable = isCityIndexable(code);

  // タイトルには検索されている語(人口・面積・財政力指数など)を入れる。
  // 説明文には、その自治体の順位・増減など、そのページにしかない数字を入れる。
  const title = ins
    ? `${short0}(${pref0})の人口・面積・財政力指数【${ins.use2025 ? "2025年国勢調査" : "最新"}】`
    : `${city.name}の人口・面積・人口密度`;
  const description = ins
    ? `${city.name}の人口は${ins.pop.toLocaleString()}人(2020年比${ins.popChangePct > 0 ? "+" : ""}${ins.popChangePct.toFixed(1)}%、全国${ins.popRank}位)。高齢化率${ins.elderlyRate.toFixed(1)}%、子ども割合${ins.childRate.toFixed(1)}%。面積・人口密度・財政力指数と全国順位を掲載。`
    : `${city.name}の人口・面積・人口密度・出生率・高齢化率などを掲載しています。`;

  return {
    title,
    description,
    alternates: { canonical: `/city/${code}` },
    // 段階的にindexする(lib/indexPolicy.ts)。対象は人口 ${CITY_INDEX_MIN_POP.toLocaleString()} 人以上の市・特別区と、アフィリエイトを載せているページ。
    // それ以外と政令指定都市の区は、薄いページと判断されないよう noindex のまま。
    // follow: true でクロール導線とリンク評価は維持する。
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
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

  const isRealMunicipality = (name: string) =>
    name.trim().split(/\s+/).length === 2 &&
    name.trim() !== "東京都 特別区部";

  const similarPopulationCities = allCities
    .filter(
      (c) =>
        c.code !== city.code &&
        isRealMunicipality(c.name) &&
        c.population > 0
    )
    .sort(
      (a, b) =>
        Math.abs(a.population - city.population) -
        Math.abs(b.population - city.population)
    )
    .slice(0, 4)
    .map((c) => ({
      code: c.code,
      name: c.name,
      population: c.population,
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

      <CityNarrative code={city.code} />

      <CityStrengths code={city.code} />

      <CityStats city={city} />

      <CityWards cityFullName={city.name} />

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

      <CityCompare
        city={city}
        summary={ranking?.summary}
        similarCities={similarPopulationCities}
      />

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
        <Link prefetch={false}
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