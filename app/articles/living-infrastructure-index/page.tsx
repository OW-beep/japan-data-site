import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/living-infrastructure-index" },
  title: "生活基盤充実度指数｜商業集積・公民館・空き家率を統合",
  description:
    "人口あたりの商業集積(小売・飲食店)、公民館数、空き家率を組み合わせた独自の「生活基盤充実度指数」を算出。下位には熱海市・那須町など別荘地特有の事情を抱える自治体が並びました。",
};

function zScores(values: number[]) {
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const sd = Math.sqrt(
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
  );
  return values.map((v) => (v - mean) / sd);
}

export default function Page() {
  const base = getMunicipalities().filter(
    (c) =>
      c.population >= 3000 &&
      c.vacantHouseCount != null &&
      c.totalHousingCount &&
      c.retailStoreCount != null &&
      c.restaurantCount != null &&
      c.communityCenterCount != null
  );

  const withRates = base.map((c) => ({
    ...c,
    vacancyRate: ((c.vacantHouseCount ?? 0) / (c.totalHousingCount ?? 1)) * 100,
    commercePerCapita:
      ((c.retailStoreCount ?? 0) + (c.restaurantCount ?? 0)) /
      c.population *
      1000,
    communityPer10k: ((c.communityCenterCount ?? 0) / c.population) * 10000,
  }));

  const zVacancy = zScores(withRates.map((c) => c.vacancyRate));
  const zCommerce = zScores(withRates.map((c) => c.commercePerCapita));
  const zCommunity = zScores(withRates.map((c) => c.communityPer10k));

  const scored = withRates.map((c, i) => ({
    ...c,
    livabilityScore: zCommerce[i] + zCommunity[i] - zVacancy[i],
  }));

  const ranked = [...scored].sort(
    (a, b) => b.livabilityScore - a.livabilityScore
  );
  const top10 = ranked.slice(0, 10);
  const bottom10 = [...ranked].slice(-10).reverse();

  const resortTowns = ["熱海市", "那須町", "湯河原町", "勝浦市"];
  const resortInBottom = bottom10.filter((c) =>
    resortTowns.some((t) => c.name.includes(t))
  );

  const bigCities = ranked.filter((c) => c.population >= 200000);
  const bigTop5 = bigCities.slice(0, 5);

  const faq = [
    {
      q: "生活基盤充実度指数とは何ですか？",
      a: "人口あたりの商業集積(小売店・飲食店の合計数)、人口あたりの公民館数、空き家率(逆指標)という3つの指標をZスコア化して統合した、本サイト独自の指標です。日常生活を送るうえでの利便性を多角的に測ることを目的としています。",
    },
    {
      q: "生活基盤充実度指数が低い自治体には、どんな特徴がありますか？",
      a: `下位には熱海市・那須町・湯河原町・勝浦市のような観光・温泉地が複数含まれています。これらの地域は空き家率が30〜60%台と非常に高いですが、その多くは別荘やセカンドハウスとして季節的に利用されている住宅であり、居住実態のない「本当の空き家」とは性質が異なる可能性があります。`,
    },
    {
      q: "意外な自治体が上位に入ることはありますか？",
      a: `あります。山形県尾花沢市は人口10万人あたりの公民館数が全国トップクラスで、大都市に劣らない総合スコアになりました。商業集積は都市部に及ばなくても、地域コミュニティの拠点となる公民館の数では、地方の自治体が上位に来ることがあります。`,
    },
  ];

  return (
    <ArticleLayout
      title="生活基盤充実度指数：商業集積・公民館・空き家率を統合"
      summary={`人口あたりの商業集積(小売・飲食店)、公民館数、空き家率を組み合わせた独自の「生活基盤充実度指数」を算出しました。下位には熱海市・那須町など観光・温泉地が並びましたが、これは別荘地特有の空き家率の高さが影響している可能性があります。`}
      heroLabel="生活基盤充実度指数 全国1位"
      heroValue={`${top10[0].name} ${top10[0].livabilityScore.toFixed(1)}`}
      rankingLink="/ranking/retail-access"
      path="/articles/living-infrastructure-index"
      tags={["aging"]}
      publishedAt="2026-08-15"
      top3={[
        { rank: 1, name: top10[0].name, value: top10[0].livabilityScore.toFixed(1) },
        { rank: 2, name: top10[1].name, value: top10[1].livabilityScore.toFixed(1) },
        { rank: 3, name: top10[2].name, value: top10[2].livabilityScore.toFixed(1) },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          「暮らしやすさ」は、人口や高齢化率だけでは測れません。
          今回、人口あたりの商業集積(小売店・飲食店)、公民館数、
          空き家率という3つの指標を組み合わせ、「生活基盤
          充実度指数」という独自の総合指標を算出しました。
        </p>
      </div>

      <div style={box}>
        <h2>生活基盤充実度指数 TOP10</h2>

        <RankingBarChart
          items={top10.map((c) => ({
            name: c.name,
            value: c.livabilityScore,
            displayValue: c.livabilityScore.toFixed(1),
          }))}
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位は東京都千代田区でしたが、2位に山形県尾花沢市
          (人口{top10[1]?.population.toLocaleString()}人)が
          入ったのが今回の発見です。人口10万人あたりの
          公民館数が{top10[1]?.communityPer10k.toFixed(1)}
          と全国トップクラスで、商業集積では都市部に及ば
          なくても、地域コミュニティの拠点数では大都市に
          劣らないスコアになりました。生活の利便性は
          「お店の多さ」だけで測れるものではないことが、
          この結果からも分かります。
        </p>
      </div>

      <div style={box}>
        <h2>下位に並ぶのは、意外にも観光・温泉地</h2>

        <RankingBarChart
          items={bottom10.map((c) => ({
            name: c.name,
            value: c.livabilityScore,
            displayValue: c.livabilityScore.toFixed(1),
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          下位10自治体のうち{resortInBottom.length}自治体を
          熱海市・那須町・湯河原町・勝浦市のような観光・
          温泉地が占めています。これらの地域は空き家率が
          軒並み30〜60%台と非常に高いのですが、空き家
          率ランキングの記事でも触れた通り、別荘・セカンド
          ハウスとして季節的に利用されている住宅は、統計上
          「空き家」としてカウントされます。つまりこれらの
          地域の高い数値は、過疎による本当の空き家というより、
          観光地としての性質を反映している可能性が高いと
          考えられます。生活基盤充実度指数を読むときは、
          こうした地域特性による数値の偏りに注意が必要です。
        </p>

        <PersonalNote>
          この指数を作っていて、「空き家率が高い=衰退して
          いる街」と単純に読むことの危うさを改めて感じ
          ました。熱海市や那須町のような観光地は、実際には
          活気のある街ですが、別荘という住宅の使われ方に
          よって数値上は「空き家が多い街」に見えてしまいます。
          データを組み合わせて指数を作る作業は、こうした
          「数字の見え方のクセ」を見つける良い機会にも
          なると感じています。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>大都市(人口20万人以上)ではどこが強いか</h2>

        <RankingBarChart
          items={bigTop5.map((c) => ({
            name: c.name,
            value: c.livabilityScore,
            displayValue: c.livabilityScore.toFixed(1),
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16 }}>
          大都市に絞ると、渋谷区・台東区・港区・新宿区など
          東京都心区が上位を占めます。商業集積の高さが
          スコアを押し上げている一方、空き家率も都心部は
          比較的高い水準にあり(相続・投資用物件の空室など)、
          純粋な「暮らしやすさ」というより、都市の商業機能の
          強さを反映した結果と見るのが妥当です。
        </p>
      </div>

      <div style={box}>
        <h2>このスコアの限界</h2>

        <p>
          このスコアは3つの指標を統計的に統合した独自
          集計であり、公式な生活利便性の評価基準ではあり
          ません。特に空き家率は、別荘地や投資用物件が
          多い地域で高く出やすく、必ずしも「人が住んで
          いない衰退地域」を意味しない点にご注意ください。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：生活基盤充実度指数についてよくある質問</h2>

        {faq.map((item) => (
          <p key={item.q}>
            <strong>Q. {item.q}</strong>
            <br />
            A. {item.a}
          </p>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }}
      />

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          生活基盤充実度指数からは、都市部の商業集積の強さと、
          山形県尾花沢市のような地方都市のコミュニティ
          拠点の充実という、異なる強さの形が見えてきました。
          また、空き家率が高い地域が必ずしも衰退している
          わけではなく、観光地特有の事情が数値に表れている
          ケースがあることも分かりました。個別の記事と
          あわせて読むことで、数字の裏にある地域の実情が
          より見えてきます。
        </p>

        <p>
          <Link href="/ranking/retail-access" style={link}>
            高齢者あたり小売店数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/vacant-house-analysis" style={link}>
            空き家率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/community-center-analysis" style={link}>
            公民館数ランキング分析を見る
          </Link>
        </p>
      </div>
    </ArticleLayout>
  );
}

const box: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 20,
};

const lead: React.CSSProperties = {
  fontSize: 16,
  color: "#374151",
  margin: 0,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
