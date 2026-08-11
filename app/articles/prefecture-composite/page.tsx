import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import Link from "next/link";


export const metadata = {
  alternates: { canonical: "/articles/prefecture-composite" },
  title: "都道府県総合スコア：4指標を組み合わせて比較すると見えるもの",
  description:
    "子ども人口割合・高齢化率・財政力指数・出生率の4指標を組み合わせた独自の総合スコアで、都道府県を比較・分析します。",
};

function average(values: number[]) {
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function zScores(values: number[]) {
  const mean = average(values);
  const sd = Math.sqrt(
    average(values.map((v) => (v - mean) ** 2))
  );
  return values.map((v) => (v - mean) / sd);
}

export default function Page() {
  const municipalities = getMunicipalities();

  const byPref = new Map<
    string,
    {
      pop: number;
      child: number;
      elderly: number;
      finance: number[];
      birth: number[];
    }
  >();

  municipalities.forEach((c) => {
    const pref = c.name.split(" ")[0];

    if (!byPref.has(pref)) {
      byPref.set(pref, {
        pop: 0,
        child: 0,
        elderly: 0,
        finance: [],
        birth: [],
      });
    }

    const p = byPref.get(pref)!;
    p.pop += c.population;
    p.child += c.childPopulation;
    p.elderly += c.elderlyPopulation;
    if (c.financeIndex != null) p.finance.push(c.financeIndex);
    if (c.birthRate != null) p.birth.push(c.birthRate);
  });

  const rows = Array.from(byPref.entries()).map(([pref, p]) => ({
    pref,
    childRatio: (p.child / p.pop) * 100,
    agingRate: (p.elderly / p.pop) * 100,
    avgFinance: average(p.finance),
    avgBirth: average(p.birth),
  }));

  const zChild = zScores(rows.map((r) => r.childRatio));
  const zAging = zScores(rows.map((r) => r.agingRate));
  const zFinance = zScores(rows.map((r) => r.avgFinance));
  const zBirth = zScores(rows.map((r) => r.avgBirth));

  const scored = rows
    .map((r, i) => ({
      ...r,
      composite: zChild[i] - zAging[i] + zFinance[i] + zBirth[i],
    }))
    .sort((a, b) => b.composite - a.composite);

  const top10 = scored.slice(0, 10);
  const bottom10 = scored.slice(-10).reverse();

  return (
    <ArticleLayout
      title="都道府県総合スコア：4指標を組み合わせて比較すると見えるもの"
      summary="子ども人口割合・高齢化率(低いほど加点)・財政力指数・出生率の4指標を、それぞれ同じ重みで組み合わせた独自の総合スコアです。1位は沖縄県、突出した理由をデータで見ていきます。"
      heroLabel="総合スコア1位"
      heroValue={top10[0].pref}
      rankingLink="/prefecture"
      tags={["composite"]}
      publishedAt="2026-05-22"
      top3={[
        {
          rank: 1,
          name: top10[0].pref,
          value: `スコア${top10[0].composite.toFixed(2)}`,
        },
        {
          rank: 2,
          name: top10[1].pref,
          value: `スコア${top10[1].composite.toFixed(2)}`,
        },
        {
          rank: 3,
          name: top10[2].pref,
          value: `スコア${top10[2].composite.toFixed(2)}`,
        },
      ]}
    >
      <div style={box}>
        <h2>この総合スコアについて</h2>

        <p>
          このスコアは、都道府県ごとに集計した「子ども人口割合」
          「高齢化率(低いほど加点)」「財政力指数の平均」
          「出生率の平均」の4つの指標を、それぞれ全国の
          ばらつき(標準偏差)で揃えたうえで、単純に均等な
          重みで足し合わせたものです。何を重視するかによって
          結果は変わるため、これは数ある見方の一つに過ぎません。
          あくまで「複数指標を組み合わせるとどう見えるか」を
          示す試みとしてご覧ください。
        </p>
      </div>

      <div style={box}>
        <h2>総合スコアTOP10</h2>

        <RankingBarChart
          items={top10.map((r) => ({
            name: r.pref,
            value: r.composite,
            displayValue: r.composite.toFixed(2),
          }))}
        />
      </div>

      <div style={box}>
        <h2>1位は沖縄県、圧倒的なスコア差</h2>

        <p>
          1位の沖縄県はスコア
          {top10[0].composite.toFixed(2)}
          と、2位の{top10[1].pref}
          (
          {top10[1].composite.toFixed(2)}
          )に大差をつけています。子ども人口割合
          {top10[0].childRatio.toFixed(1)}
          %、高齢化率
          {top10[0].agingRate.toFixed(1)}
          %、出生率平均
          {top10[0].avgBirth.toFixed(2)}
          はいずれも全国トップクラスで、財政力指数の平均
          (
          {top10[0].avgFinance.toFixed(2)}
          )は全国的に見て低い水準にもかかわらず、他の3指標の
          強さがそれを大きく上回っています。これは、本サイトの
          子ども人口ランキング・出生率ランキングの分析記事でも
          取り上げた、沖縄県の子育て世帯の多さ・出生率の高さが、
          複数指標を組み合わせた場合にも一貫して表れていることを
          示しています。
        </p>

        <p>
          2位の愛知県、3位の滋賀県は、財政力指数が高い
          (製造業の集積による税収基盤の強さ)ことに加え、
          子ども人口割合も全国平均を上回っており、
          「産業が強く、かつ子育て世帯も多い」という
          バランスの取れた特徴を持っています。
        </p>
      </div>

      <div style={box}>
        <h2>下位に多いのは東北・北海道</h2>

        <RankingBarChart
          items={bottom10.map((r) => ({
            name: r.pref,
            value: Math.abs(r.composite),
            displayValue: r.composite.toFixed(2),
          }))}
        />

        <p style={{ marginTop: 16 }}>
          下位には秋田県・青森県・岩手県・山形県・北海道といった
          東北・北海道地方の道県が多く並びます。これらの地域は
          高齢化率ランキングの分析記事でも触れた通り、若年層の
          大都市圏への流出が長期にわたって続いてきた地域であり、
          子ども人口割合の低さ・高齢化率の高さが、総合スコアを
          押し下げる要因になっています。
        </p>
      </div>

      <div style={box}>
        <h2>重みを変えれば結果は変わる</h2>

        <p>
          このスコアはあくまで4指標を均等に扱った場合の
          一例です。たとえば財政力指数の重みを増やせば、
          製造業が集積する中部地方の県がより上位に来やすく
          なりますし、高齢化率だけを重視すれば、また異なる
          顔ぶれになります。「都道府県の総合力」を一つの
          数字だけで語ることには限界がありますが、複数の
          指標を組み合わせることで、単一のランキングだけでは
          見えてこない地域の特徴を発見できることもあります。
          本サイトの各ランキングページで、気になる指標を
          個別に確認してみてください。
        </p>
      </div>

      <div style={box}>
        <h2>都道府県ごとの内部格差にも注意</h2>

        <p>
          今回のスコアは、都道府県内のすべての市区町村を
          合算・平均した数値にもとづいています。しかし、
          同じ都道府県の中でも、県庁所在地とその他の
          市町村とでは、人口動態や財政状況が大きく異なる
          ケースが少なくありません。都道府県ページでは、
          都道府県内の自治体を9つの指標でランキング・
          グラフ表示できる機能を用意しています。
        </p>

        <PersonalNote>
          土地勘のある千葉県を例にすると、船橋市・市川市
          など東京寄りのエリアは人口密度が高く子育て世代の
          流入も続く一方、県南部・内陸部では高齢化と
          人口減少が進んでいます。同じ「千葉県」という
          くくりでも、JR沿線や高速道路沿いかどうかで
          人口構成がまるで違うので、県単位の平均スコアは
          あくまで出発点として、市区町村ごとの数字も
          見比べてみることをおすすめします。
        </PersonalNote>


        <p>
          <Link href="/articles/population-finance" style={link}>
            人口規模と財政力の関係を見る
          </Link>

          {" ｜ "}
          <Link href="/articles/aging-finance" style={link}>
            高齢化率と財政力指数の関係を見る
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

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
