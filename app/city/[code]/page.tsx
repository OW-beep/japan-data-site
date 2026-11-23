import Link from "next/link";
import { notFound } from "next/navigation";

import { getCity } from "@/lib/getCity";
import { getCities } from "@/lib/getCities";
import { getCities2025, getCity2025 } from "@/lib/city2025";
import { getCityRanking } from "@/lib/getCityRanking";

import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import RelatedArticles from "@/components/RelatedArticles";

import CitySummary from "@/components/city/CitySummary";
import CityPositionVisual from "@/components/city/CityPositionVisual";
import FunabashiDeepDive from "@/components/city/FunabashiDeepDive";
import CityLocationMap from "@/components/city/CityLocationMap";
import CityStats from "@/components/city/CityStats";
import CityFuture from "@/components/city/CityFuture";
import CityIncome from "@/components/city/CityIncome";
import AffiliateRecommend from "@/components/AffiliateRecommend";
import CityWards from "@/components/city/CityWards";
import CityHighlights from "@/components/city/CityHighlights";
import CityRanking from "@/components/city/CityRanking";
import NearbyCities from "@/components/city/NearbyCities";
import CityCompare from "@/components/city/CityCompare";
import RelatedRankings from "@/components/city/RelatedRankings";
import CityNarrative from "@/components/city/CityNarrative";
import CityProfileAnalysis from "@/components/city/CityProfileAnalysis";
import CityStrengths from "@/components/city/CityStrengths";
import CityFurusato from "@/components/city/CityFurusato";
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

  // タイトルは「答え先行」にする:「○○市 人口」で検索した人が、タイトルだけで
  // 人口そのものと全国・県内の順位まで分かる形にする(v22・CTR改善)。
  // 数字は getCityInsight(ページ本文と同じ令和7年国勢調査ベース)から取る。
  // 2025年データが使えない自治体(ins がない/2020年ベース)では、従来の形式にフォールバックする。
  const title =
    ins && ins.use2025
      ? `${short0}の人口は${ins.pop.toLocaleString()}人【2025年国勢調査】全国${ins.popRank}位・${pref0}内${ins.popRankInPref}位`
      : ins
        ? `${short0}(${pref0})の人口・面積・財政力指数【最新】`
        : `${city.name}の人口・面積・人口密度`;
  const description =
    ins && ins.use2025
      ? `${city.name}の人口は${ins.pop.toLocaleString()}人(2020年比${ins.popChangePct > 0 ? "+" : ""}${ins.popChangePct.toFixed(1)}%、全国${ins.popRank}位・${pref0}内${ins.popRankInPref}位)。高齢化率${ins.elderlyRate.toFixed(1)}%、子ども割合${ins.childRate.toFixed(1)}%${ins.financeIndex != null ? `、財政力指数${ins.financeIndex.toFixed(2)}` : ""}。面積・人口密度・財政力指数と全国順位を掲載。`
      : ins
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

  // ページに出す数字は令和7年国勢調査にそろえた版(lib/city2025.ts)。取れていなければ令和2年のまま
  const city = getCity2025(code) ?? getCity(code);

  if (!city) {
    notFound();
  }

  const ranking = getCityRanking(code);

  const insight = getCityInsight(code);

  const allCities = getCities2025();

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

      <CityLocationMap
        code={city.code}
        prefecture={pref}
        cityName={cityName}
        area={city.area ?? null}
        density={city.populationDensity ?? null}
      />

      {insight && <CityPositionVisual insight={insight} />}

      {/* 船橋市(12204)だけの特設「深掘り分析」。ほかの自治体ページには表示しない */}
      {city.code === "12204" && <FunabashiDeepDive />}

      <CityNarrative code={city.code} />

      {/* index対象の自治体だけ、タイプ判定つきの「プロフィール分析」を追加する(テンプレ感の解消)。
          船橋市は専用の深掘りがあるため除く */}
      {isCityIndexable(city.code) && city.code !== "12204" && (
        <CityProfileAnalysis code={city.code} />
      )}

      <CityStrengths code={city.code} />

      {/* その自治体自身のふるさと納税返礼品(楽天)。強みがある自治体では CityStrengths 側の
          ブロックが同じ役割を担うため、CityFurusato 側では出さない(ブロックは1つだけ) */}
      <CityFurusato code={city.code} />

      <CityStats city={city} />

      <CityFuture code={city.code} name={city.name} actual2025={city.population} />

      <CityIncome code={city.code} name={city.name} population={city.population} />

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

      {/* この街への引っ越しを考えている人向けの広告枠(ASPのコードを lib/affiliates.ts の moving に貼ると表示される) */}
      <AffiliateRecommend topics={["moving"]} />
    </main>
  );
}