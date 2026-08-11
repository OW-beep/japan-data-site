import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/education-expense-analysis" },
  title: "教育費ランキング分析｜北海道の小さな町がなぜ上位を独占するのか",
  description:
    "住民一人あたりの教育費をランキング分析。北海道豊頃町など人口数千人規模の町が上位を占める一方、大都市の多くは平均を下回る結果に。学校の統廃合コストが数値を押し上げる構造を解説します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter((c) => c.educationExpense != null && c.population >= 3000)
    .map((c) => ({
      ...c,
      perCapita: ((c.educationExpense ?? 0) * 1000) / c.population,
    }));

  const top10 = [...base].sort((a, b) => b.perCapita - a.perCapita).slice(0, 10);
  const bottom10 = [...base].sort((a, b) => a.perCapita - b.perCapita).slice(0, 10);

  const average = base.reduce((s, c) => s + c.perCapita, 0) / base.length;

  const small = base.filter((c) => c.population < 10000);
  const smallAvg = small.reduce((s, c) => s + c.perCapita, 0) / small.length;

  const large = base.filter((c) => c.population >= 100000);
  const largeAvg = large.reduce((s, c) => s + c.perCapita, 0) / large.length;

  const bigCities = base
    .filter((c) => c.population >= 300000)
    .sort((a, b) => b.perCapita - a.perCapita);
  const bigTop5 = bigCities.slice(0, 5);

  const faq = [
    {
      q: "住民一人あたりの教育費が最も高い自治体はどこですか？",
      a: `北海道豊頃町(人口${top10[0].population.toLocaleString()}人)で、住民一人あたり${Math.round(
        top10[0].perCapita
      ).toLocaleString()}円です。全国平均(${Math.round(
        average
      ).toLocaleString()}円)の約10倍にあたります。`,
    },
    {
      q: "なぜ人口の少ない町の方が教育費が高くなるのですか？",
      a: `学校1校あたりの児童数が少なくても、校舎の維持・光熱費・教員配置などの固定費は人口規模に関わらず一定額かかるためです。実際、人口1万人未満の自治体の平均は${Math.round(
        smallAvg
      ).toLocaleString()}円である一方、人口10万人以上の自治体では${Math.round(
        largeAvg
      ).toLocaleString()}円と、2倍以上の差があります。`,
    },
    {
      q: "教育費が高い自治体は「教育熱心」と言えますか？",
      a: "必ずしもそうとは言えません。今回の統計は学校の統廃合や施設更新など建設・維持コストを含むため、数値の高さは「教育に力を入れている」ことよりも「小規模校を多く維持している」ことを反映している場合が多くあります。",
    },
    {
      q: "大都市の中で教育費が高いのはどこですか？",
      a: `人口30万人以上では大阪市が最も高く、住民一人あたり${Math.round(
        bigTop5[0].perCapita
      ).toLocaleString()}円でした。政令指定都市は学校数・児童数ともに多いため、絶対額は大きくなりやすい傾向があります。`,
    },
  ];

  return (
    <ArticleLayout
      title="教育費ランキング分析：北海道の小さな町がなぜ上位を独占するのか"
      summary={`住民一人あたりの教育費を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${Math.round(
        average
      ).toLocaleString()}円に対し、人口${top10[0].population.toLocaleString()}人の北海道豊頃町が${Math.round(
        top10[0].perCapita
      ).toLocaleString()}円で全国1位。人口の少ない町ほど数値が高くなる、明確な傾向が見られました。`}
      heroLabel="教育費(住民一人あたり) 全国1位"
      heroValue={`${top10[0].name} ${Math.round(top10[0].perCapita).toLocaleString()}円`}
      rankingLink="/ranking/education-expense"
      path="/articles/education-expense-analysis"
      tags={["child"]}
      publishedAt="2026-08-11"
      top3={[
        { rank: 1, name: top10[0].name, value: `${Math.round(top10[0].perCapita).toLocaleString()}円` },
        { rank: 2, name: top10[1].name, value: `${Math.round(top10[1].perCapita).toLocaleString()}円` },
        { rank: 3, name: top10[2].name, value: `${Math.round(top10[2].perCapita).toLocaleString()}円` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          教育費は、小中学校の運営・施設整備等にかかる支出の
          決算額です。今回は住民一人あたりに換算して比較
          しました。全国{base.length.toLocaleString()}自治体
          (人口3,000人以上)の平均は
          {Math.round(average).toLocaleString()}
          円でした。
        </p>
      </div>

      <div style={box}>
        <h2>教育費(住民一人あたり)TOP10</h2>

        <RankingBarChart
          items={top10.map((c) => ({
            name: c.name,
            value: c.perCapita,
            displayValue: `${Math.round(c.perCapita).toLocaleString()}円`,
          }))}
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の北海道豊頃町(人口{top10[0].population.toLocaleString()}人)
          は{Math.round(top10[0].perCapita).toLocaleString()}
          円で、全国平均の約10倍にのぼります。上位10自治体の
          多くを北海道の町村が占めており、広い面積に人口が
          点在する地域特性上、学校を統廃合しにくく、小規模校を
          維持するコストが住民一人あたりの負担として重く
          のしかかっている実態がうかがえます。
        </p>
      </div>

      <div style={box}>
        <h2>逆に低いのは、人口が多いベッドタウン</h2>

        <RankingBarChart
          items={bottom10.map((c) => ({
            name: c.name,
            value: c.perCapita,
            displayValue: `${Math.round(c.perCapita).toLocaleString()}円`,
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          下位には埼玉県上尾市・白岡市・伊奈町など、首都圏の
          ベッドタウンが目立ちます。児童数に対して学校数が
          効率的な規模になっているため、住民一人あたりの
          負担が小さく抑えられていると考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>人口規模と教育費の関係がはっきり出た</h2>

        <p>
          人口1万人未満の自治体の平均は
          {Math.round(smallAvg).toLocaleString()}
          円である一方、人口10万人以上の自治体では
          {Math.round(largeAvg).toLocaleString()}
          円と、2倍以上の開きがあります。学校の運営には、
          児童数に関わらず一定の固定費(校舎の維持・光熱費・
          教員配置など)がかかるため、母数となる人口が
          少ないほど住民一人あたりの負担が重くなる、という
          単純な構造がそのまま数値に表れています。学校の
          過密度ランキング分析の記事で見た「1校あたり児童数」
          とあわせて見ると、教育費と学校規模の関係がより
          立体的に理解できます。
        </p>

        <PersonalNote>
          この指標を見て感じたのは、「教育費が高い=手厚い
          教育」と単純に読むのは危険だということです。実際には
          統廃合が進められないまま小規模校を維持せざるを得ない
          自治体の苦しさが数字に表れているケースが多く、
          むしろ人口減少地域が抱える構造的な課題を映す指標
          だと捉えるほうが実態に近いと思います。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>大都市の中では大阪市が最も高い</h2>

        <RankingBarChart
          items={bigTop5.map((c) => ({
            name: c.name,
            value: c.perCapita,
            displayValue: `${Math.round(c.perCapita).toLocaleString()}円`,
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          人口30万人以上の大都市に絞ると、大阪市・福岡市・
          神戸市・熊本市・仙台市が上位に並びます。政令指定
          都市は学校数・児童数がそもそも多いため、住民一人
          あたりで見ても一定の水準を維持しやすい傾向が
          あります。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：教育費ランキングについてよくある質問</h2>

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
          教育費ランキングからは、人口の少ない町ほど住民
          一人あたりの負担が重くなるという、はっきりとした
          構造が見えてきました。これは「教育への熱心さ」
          というより、学校統廃合が難しい地方の事情を映した
          結果と見るのが妥当です。学校の過密度ランキングや
          子ども人口割合ランキングとあわせて見ることで、
          各地域が抱える教育インフラの課題がより見えて
          きます。
        </p>

        <p>
          <Link href="/ranking/education-expense" style={link}>
            教育費ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/school-crowding" style={link}>
            学校の過密度分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/child-top50" style={link}>
            子ども人口割合TOP50を見る
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
