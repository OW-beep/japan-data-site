import Link from "next/link";
import { getRealEstatePriceRanking } from "@/lib/realEstatePrice";
import { getCities } from "@/lib/getCities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";

export const metadata = {
  alternates: { canonical: "/articles/real-estate-single-household-analysis" },
  title: "地価が高い自治体ほど単身世帯が多い｜相関係数+0.54",
  description:
    "不動産価格(地価)と単身世帯率の相関係数は+0.54。地価の高い都心部ほど単身世帯が多い一方、地価の安い離島にも単身世帯が多い自治体があり、その中身は正反対でした。",
};

const MIN_SAMPLE = 10;

export default function Page() {
  const all = getRealEstatePriceRanking();
  const cities = getCities();
  const householdByCode = new Map(
    cities
      .filter((c) => c.singleHouseholds != null && c.households)
      .map((c) => [
        c.code,
        {
          rate: ((c.singleHouseholds as number) / (c.households as number)) * 100,
          population: c.population,
        },
      ])
  );

  const base = all
    .filter(
      (c) => c.landPricePerSqm != null && c.landSampleSize >= MIN_SAMPLE
    )
    .map((c) => ({
      name: c.name,
      landPricePerSqm: c.landPricePerSqm as number,
      household: householdByCode.get(c.code),
    }))
    .filter((c) => c.household != null) as {
    name: string;
    landPricePerSqm: number;
    household: { rate: number; population: number };
  }[];

  function correlation(xs: number[], ys: number[]) {
    const n = xs.length;
    const mx = xs.reduce((s, v) => s + v, 0) / n;
    const my = ys.reduce((s, v) => s + v, 0) / n;
    let num = 0;
    let dx = 0;
    let dy = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      dx += (xs[i] - mx) ** 2;
      dy += (ys[i] - my) ** 2;
    }
    return num / Math.sqrt(dx * dy);
  }

  const r = correlation(
    base.map((c) => Math.log10(c.landPricePerSqm)),
    base.map((c) => c.household.rate)
  );

  const sortedByPrice = [...base].sort(
    (a, b) => b.landPricePerSqm - a.landPricePerSqm
  );
  const top15 = sortedByPrice.slice(0, 15);
  const bottom10 = sortedByPrice.slice(-10);

  const bucketSize = Math.floor(sortedByPrice.length / 5);
  const top20 = sortedByPrice.slice(0, bucketSize);
  const bottom20 = sortedByPrice.slice(-bucketSize);
  const avgTop = top20.reduce((s, c) => s + c.household.rate, 0) / top20.length;
  const avgBottom =
    bottom20.reduce((s, c) => s + c.household.rate, 0) / bottom20.length;

  const naniwa = base.find((c) => c.name.includes("浪速区"));
  const awaguni = base.find((c) => c.name.includes("粟国村"));

  const faq = [
    {
      q: "地価と単身世帯率には関係がありますか？",
      a: `対数変換した地価と単身世帯率の相関係数は+${r.toFixed(
        2
      )}で、明確な正の相関があります。地価の高い自治体ほど、単身世帯の割合も高い傾向があります。`,
    },
    {
      q: "地価が高い自治体は、なぜ単身世帯が多いのですか？",
      a: `地価が高い都心部は、住宅費が高額になるため、家族向けの広い住宅よりもワンルーム・1Kといったコンパクトな住戸が供給されやすく、単身の若年層・単身赴任者・学生などが集まりやすい構造になっていると考えられます。地価TOP20%の自治体群の平均単身世帯率は${avgTop.toFixed(
        1
      )}%で、地価BOTTOM20%の自治体群(${avgBottom.toFixed(
        1
      )}%)より${(avgTop - avgBottom).toFixed(1)}ポイント高くなっています。`,
    },
    {
      q: "地価が安いのに単身世帯率が高い自治体もありますか？",
      a: `あります。例えば${
        awaguni?.name
      }は地価が非常に安いにもかかわらず、単身世帯率は${awaguni?.household.rate.toFixed(
        1
      )}%と高水準です。ただしこれは、都心部の「若い単身者向けの賃貸住宅が多い」という理由とは全く逆で、人口が少なく高齢の単身世帯(独居高齢者)が多いことが背景にあると考えられます。同じ「単身世帯率が高い」でも、地価という別の指標と組み合わせることで、中身が正反対であることが分かります。`,
    },
  ];

  return (
    <ArticleLayout
      title="地価が高い自治体ほど単身世帯が多い｜相関係数+0.54"
      summary={`不動産価格(地価)と単身世帯率の相関係数を計算すると+${r.toFixed(
        2
      )}となり、地価の高い自治体ほど単身世帯が多い傾向が確認できました。ただし地価の安い自治体にも単身世帯率が高い例があり、その中身は正反対でした。`}
      heroLabel="地価(対数)×単身世帯率 相関係数"
      heroValue={`+${r.toFixed(2)}`}
      rankingLink="/ranking/real-estate-price"
      path="/articles/real-estate-single-household-analysis"
      tags={["population"]}
      publishedAt="2026-09-14"
      top3={top15.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `単身世帯率${c.household.rate.toFixed(1)}%`,
      }))}
    >
      <div style={box}>
        <h2>地価が高い自治体ほど、単身世帯が多い</h2>

        <p>
          不動産価格(地価・平米単価)と単身世帯率の相関係数を
          計算すると
          <strong>+{r.toFixed(2)}</strong>
          となり、明確な正の相関が確認できました。地価TOP20%の
          自治体群の平均単身世帯率は{avgTop.toFixed(1)}%で、
          地価BOTTOM20%の自治体群({avgBottom.toFixed(1)}%)より
          {(avgTop - avgBottom).toFixed(1)}ポイント高くなっています。
        </p>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.household.rate,
            displayValue: `${c.household.rate.toFixed(1)}%`,
          }))}
        />

        <p style={{ marginTop: 12, fontSize: 14, color: "var(--muted)" }}>
          地価上位には東京都港区・千代田区・渋谷区など都心区が
          並びますが、単身世帯率で見ると、地価では8位の
          {naniwa?.name}が{naniwa?.household.rate.toFixed(1)}%と、
          この中で最も高い数値になっています。
        </p>
      </div>

      <div style={box}>
        <h2>同じ「単身世帯が多い」でも、中身は正反対</h2>

        <p>
          ここで注意したいのは、単身世帯率が高い理由が、地価の
          高い自治体と安い自治体とではまったく異なるという点です。
        </p>

        <div className="pull-note">
          <strong>都心型(地価が高い)</strong>
          <br />
          港区・渋谷区・{naniwa?.name}など地価の高いエリアでは、
          住宅費の高さから、ワンルーム・1Kといったコンパクトな
          賃貸住宅が供給されやすく、若年層の単身者・単身赴任者・
          学生などが集まりやすい構造になっています。
        </div>

        <div className="pull-note">
          <strong>過疎型(地価が安い)</strong>
          <br />
          一方、{awaguni?.name}(地価は非常に安いものの、単身
          世帯率{awaguni?.household.rate.toFixed(1)}%)のような
          離島・山間部では、人口減少と高齢化の結果、配偶者に
          先立たれた高齢者が一人で暮らす「独居高齢者」が単身
          世帯の中心になっています。
        </div>

        <p>
          同じ「単身世帯率が高い」という数字でも、都心型は
          「これから世帯を持つ前の若年層」、過疎型は「かつて
          世帯を持っていた高齢者が一人になった」という、
          ライフステージの両端が生み出している現象だと言えます。
          このサイトの単独世帯割合分析の記事でも、都心と被災地
          (人口移動の激しい地域)に共通点があることを紹介して
          いますが、地価という切り口を加えることで、その内訳を
          より具体的に読み解くことができます。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：地価と単身世帯率の関係についてよくある質問</h2>

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
          地価と単身世帯率には、無視できない正の相関がありました。
          ただし、その中身は「都心の若年単身者」と「過疎地の
          独居高齢者」という、まったく異なる2つの層が混在して
          います。単身世帯率という1つの数字だけでは、その地域が
          活気のある都市なのか、高齢化が進む地方なのかを
          判断できません。地価という別のデータと掛け合わせる
          ことで、初めてその実態が見えてきます。
        </p>

        <p>
          <Link prefetch={false} href="/articles/household-analysis" style={link}>
            単独世帯割合分析(都心と被災地に共通点)を見る
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/household-aging-ushape" style={link}>
            単独世帯割合と高齢化率のU字関係を見る
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/real-estate-price" style={link}>
            不動産価格ランキングを見る
          </Link>
        </p>

        <CompareCTA />
      </div>
    </ArticleLayout>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)",
  padding: "20px 24px",
  border: "1px solid var(--line)",
  marginBottom: 20,
};

const link: React.CSSProperties = {
  color: "var(--indigo)",
  textDecoration: "underline",
};
