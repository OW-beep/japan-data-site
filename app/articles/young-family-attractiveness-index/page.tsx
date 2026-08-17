import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/young-family-attractiveness-index" },
  title: "子育て世代吸引力指数｜東京都心区と、意外な小さな町",
  description:
    "保育所定員・20代純移動率・婚姻率を組み合わせた独自の「子育て世代吸引力指数」を算出。東京都心区が上位を占める一方、島根県川本町や高知県仁淀川町など、保育所定員が突出して手厚い小さな町も上位に食い込みました。",
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
      c.daycareCount != null &&
      c.childPopulation &&
      c.youngAdultNetMigration != null &&
      c.marriages != null
  );

  const withRates = base.map((c) => ({
    ...c,
    daycarePer1kChild: (c.daycareCount ?? 0) / (c.childPopulation / 1000),
    migrRate: ((c.youngAdultNetMigration ?? 0) / c.population) * 100,
    marriageRate: ((c.marriages ?? 0) / c.population) * 1000,
  }));

  const zDaycare = zScores(withRates.map((c) => c.daycarePer1kChild));
  const zMigr = zScores(withRates.map((c) => c.migrRate));
  const zMarriage = zScores(withRates.map((c) => c.marriageRate));

  const scored = withRates.map((c, i) => ({
    ...c,
    attractScore: zDaycare[i] + zMigr[i] + zMarriage[i],
  }));

  const ranked = [...scored].sort((a, b) => b.attractScore - a.attractScore);
  const top15 = ranked.slice(0, 15);

  const tokyoInTop8 = ranked
    .slice(0, 8)
    .filter((c) => c.name.startsWith("東京都")).length;

  // 東京都以外で上位に入る「意外な町」
  const nonTokyoHighlights = ranked
    .filter((c) => !c.name.startsWith("東京都"))
    .slice(0, 5);

  const bigCities = ranked.filter((c) => c.population >= 200000);
  const bigTop5 = bigCities.slice(0, 5);

  const faq = [
    {
      q: "子育て世代吸引力指数とは何ですか？",
      a: "子ども1,000人あたりの保育所定員数、20代(20〜29歳)の人口純移動率、人口あたりの婚姻件数という3つの指標をZスコア化して統合した、本サイト独自の指標です。子育て世代にとっての「住みやすさ・選ばれやすさ」を多角的に測ることを目的としています。",
    },
    {
      q: "子育て世代吸引力指数が最も高いのはどこですか？",
      a: `東京都墨田区です。上位8自治体のうち${tokyoInTop8}自治体を東京都特別区が占めており、雇用の多さと保育インフラの充実が高く評価されています。`,
    },
    {
      q: "東京都以外で上位に入る自治体はありますか？",
      a: `あります。特に島根県川本町は子ども1,000人あたりの保育所定員が${nonTokyoHighlights.find((c) => c.name.includes("川本町"))?.daycarePer1kChild.toFixed(1) ?? "9"}と全国トップクラスで、人口3,000人規模の町としては極めて手厚い保育体制を持っています。高知県仁淀川町も同様の傾向が見られます。`,
    },
  ];

  return (
    <ArticleLayout
      title="子育て世代吸引力指数：東京都心区と、意外な小さな町"
      summary={`保育所定員・20代純移動率・婚姻率を組み合わせた独自の「子育て世代吸引力指数」を算出しました。上位は東京都心区が占める一方、島根県川本町や高知県仁淀川町のように、保育所定員が突出して手厚い小さな町も上位に食い込みました。`}
      heroLabel="子育て世代吸引力指数 全国1位"
      heroValue={`${top15[0].name} ${top15[0].attractScore.toFixed(1)}`}
      rankingLink="/ranking/daycare"
      path="/articles/young-family-attractiveness-index"
      tags={["child"]}
      publishedAt="2026-08-15"
      top3={[
        { rank: 1, name: top15[0].name, value: top15[0].attractScore.toFixed(1) },
        { rank: 2, name: top15[1].name, value: top15[1].attractScore.toFixed(1) },
        { rank: 3, name: top15[2].name, value: top15[2].attractScore.toFixed(1) },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          「子育てしやすい街」を1つの数字だけで語るのは
          難しいものです。今回、保育所へのアクセス(子ども
          1,000人あたりの保育所定員)、若い世代の転入超過
          (20代純移動率)、婚姻件数という3つの指標を組み
          合わせ、「子育て世代吸引力指数」という独自の
          総合指標を算出しました。
        </p>
      </div>

      <div style={box}>
        <h2>子育て世代吸引力指数 TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.attractScore,
            displayValue: c.attractScore.toFixed(1),
          }))}
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          上位8自治体のうち{tokyoInTop8}自治体を東京都特別区が
          占めています。20代純移動率ランキング分析の記事で
          見た通り、東京都心区は若年層の転入超過が大きく、
          保育所の整備も進んでいるため、複数の指標で高い
          評価になりやすい構造があります。ただし婚姻率
          ランキング分析の記事で指摘した通り、都心区の
          婚姻件数には「未婚のまま転入した若年層が多く住む
          ことによる分母の押し上げ」という統計上の癖がある
          点には注意が必要です。
        </p>
      </div>

      <div style={box}>
        <h2>東京以外で光る、意外な小さな町</h2>

        <RankingBarChart
          items={nonTokyoHighlights.map((c) => ({
            name: c.name,
            value: c.attractScore,
            displayValue: c.attractScore.toFixed(1),
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          東京都を除いた中で目を引くのが、島根県川本町
          (人口{nonTokyoHighlights[0]?.population.toLocaleString()}
          人)です。子ども1,000人あたりの保育所定員は
          {nonTokyoHighlights[0]?.daycarePer1kChild.toFixed(1)}
          と全国トップクラスで、これは東京都心区の3倍以上の
          水準です。高知県仁淀川町も同様に保育所定員が
          突出しており、人口規模の小さな町ほど、保育所
          1施設あたりがカバーする子どもの数が少なく、
          相対的に手厚い体制になりやすいという側面があります。
          都市部の雇用の多さとは違う軸で、「子どもを預け
          やすい町」を探すなら、こうした小規模自治体にも
          注目する価値があります。
        </p>

        <PersonalNote>
          この指数を作っていて感じたのは、「子育て世代に
          選ばれる街」には、東京都心区のような「仕事も
          保育も揃っている」パターンと、島根県川本町の
          ような「規模は小さいが1人あたりの支援が手厚い」
          パターンの、性質の異なる2つの強さがあるという
          ことです。移住先を選ぶときは、自分たちが何を
          優先したいか(雇用機会か、手厚い支援か)によって、
          見るべき指標が変わってくると感じています。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>大都市(人口20万人以上)ではどこが強いか</h2>

        <RankingBarChart
          items={bigTop5.map((c) => ({
            name: c.name,
            value: c.attractScore,
            displayValue: c.attractScore.toFixed(1),
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16 }}>
          人口20万人以上に絞っても、上位は東京都特別区が
          並びます。子育て世帯にとって重要な「仕事の
          選択肢の多さ」と「保育インフラの充実」が同時に
          揃っている自治体は、やはり大都市圏に集中して
          いることが分かります。
        </p>
      </div>

      <div style={box}>
        <h2>このスコアの限界</h2>

        <p>
          このスコアは3つの指標を統計的に統合した独自
          集計であり、公式な「子育てしやすさ」の評価基準
          ではありません。婚姻率は東京都心区で高く出やすい
          統計上の癖があり、保育所定員も人口規模が小さい
          自治体ほど数値が振れやすい点にご注意ください。
          実際の子育て環境は、保育料や医療費助成など、
          今回のスコアに含まれない要素にも大きく左右されます。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：子育て世代吸引力指数についてよくある質問</h2>

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
          子育て世代吸引力指数からは、東京都心区の「総合力の
          高さ」と、島根県川本町のような小さな町の「1人
          あたりの手厚さ」という、異なる2種類の強さが
          見えてきました。保育所アクセス・移住・婚姻という
          個別記事とあわせて読むことで、より多角的に
          「子育てしやすい街」を探せます。
        </p>

        <p>
          <Link href="/articles/daycare-access" style={link}>
            保育所アクセスランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/young-adult-migration-analysis" style={link}>
            20代純移動率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/marriage-rate-analysis" style={link}>
            婚姻率ランキング分析を見る
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
