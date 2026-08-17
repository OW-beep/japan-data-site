import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/industry-diversity-index" },
  title: "産業構造の多様性指数｜「一極集中」ほど財政が豊かという逆説",
  description:
    "第1次・第2次・第3次産業の就業者比率からハーフィンダール指数(産業集中度)を算出。都市部のようにサービス業に一極集中した自治体ほど財政力指数が高く、農山漁村のように産業がバランスよく分散した自治体ほど財政が厳しいという、直感に反する結果になりました。",
};

export default function Page() {
  const base = getMunicipalities().filter(
    (c) =>
      c.population >= 3000 &&
      c.primaryIndustryWorkers != null &&
      c.secondaryIndustryWorkers != null &&
      c.tertiaryIndustryWorkers != null
  );

  const withHHI = base
    .map((c) => {
      const total =
        (c.primaryIndustryWorkers ?? 0) +
        (c.secondaryIndustryWorkers ?? 0) +
        (c.tertiaryIndustryWorkers ?? 0);
      if (total === 0) return null;
      const shares = [
        (c.primaryIndustryWorkers ?? 0) / total,
        (c.secondaryIndustryWorkers ?? 0) / total,
        (c.tertiaryIndustryWorkers ?? 0) / total,
      ];
      const hhi = shares.reduce((s, v) => s + v * v, 0);
      const labels = ["第1次産業", "第2次産業", "第3次産業"];
      const dominantIndex = shares.indexOf(Math.max(...shares));
      return {
        ...c,
        hhi,
        shares,
        dominantLabel: labels[dominantIndex],
        dominantShare: shares[dominantIndex] * 100,
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const concentrated = [...withHHI].sort((a, b) => b.hhi - a.hhi);
  const diverse = [...withHHI].sort((a, b) => a.hhi - b.hhi);

  const top10 = concentrated.slice(0, 10);
  const bottom10 = diverse.slice(0, 10);

  const average = withHHI.reduce((s, c) => s + c.hhi, 0) / withHHI.length;

  const withFinance = withHHI.filter((c) => c.financeIndex != null);
  const top200Concentrated = [...withFinance]
    .sort((a, b) => b.hhi - a.hhi)
    .slice(0, 200);
  const top200Diverse = [...withFinance].sort((a, b) => a.hhi - b.hhi).slice(0, 200);

  const avgFinConcentrated =
    top200Concentrated.reduce((s, c) => s + (c.financeIndex ?? 0), 0) /
    top200Concentrated.length;
  const avgFinDiverse =
    top200Diverse.reduce((s, c) => s + (c.financeIndex ?? 0), 0) /
    top200Diverse.length;

  const faq = [
    {
      q: "産業の多様性指数(HHI)とは何ですか？",
      a: "第1次・第2次・第3次産業の就業者比率をもとに算出する、経済学で使われるハーフィンダール・ハーシュマン指数(HHI)です。値が1に近いほど特定の産業に集中しており、3分の1(約0.33)に近いほど3産業がバランスよく分散していることを示します。",
    },
    {
      q: "産業が最も一極集中している自治体はどこですか？",
      a: `東京都千代田区(HHI ${top10[0].hhi.toFixed(3)}、第3次産業${top10[0].dominantShare.toFixed(0)}%)です。都心部やリゾート地では、サービス業への一極集中度が全国で最も高くなっています。`,
    },
    {
      q: "産業が一極集中している自治体と、分散している自治体では、どちらが財政的に豊かですか？",
      a: `一極集中している自治体(HHI上位200)の財政力指数の平均は${avgFinConcentrated.toFixed(3)}であるのに対し、分散している自治体(HHI下位200)の平均は${avgFinDiverse.toFixed(3)}でした。一般的な「産業の多様性=経済の強靭さ」というイメージとは逆に、一極集中している自治体の方が財政的に豊かという結果になっています。`,
    },
  ];

  return (
    <ArticleLayout
      title="産業構造の多様性指数：「一極集中」ほど財政が豊かという逆説"
      summary={`第1次・第2次・第3次産業の就業者比率から、産業の集中度を示すハーフィンダール指数(HHI)を算出しました。一般的には「産業が多様な方が経済は強靭」と語られますが、実際のデータでは正反対の結果に。サービス業に一極集中した都市部の自治体の財政力指数平均は${avgFinConcentrated.toFixed(3)}である一方、産業がバランスよく分散した農山漁村の平均は${avgFinDiverse.toFixed(3)}にとどまりました。`}
      heroLabel="産業一極集中度 全国1位"
      heroValue={`${top10[0].name} HHI ${top10[0].hhi.toFixed(3)}`}
      rankingLink="/articles/industry-structure"
      path="/articles/industry-diversity-index"
      tags={["finance"]}
      publishedAt="2026-08-15"
      top3={[
        { rank: 1, name: top10[0].name, value: `HHI ${top10[0].hhi.toFixed(3)}` },
        { rank: 2, name: top10[1].name, value: `HHI ${top10[1].hhi.toFixed(3)}` },
        { rank: 3, name: top10[2].name, value: `HHI ${top10[2].hhi.toFixed(3)}` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          「産業が特定分野に偏っている地域は、その産業が
          衰退すると経済全体が打撃を受けるリスクがある」
          というのは、経済学でよく語られる考え方です。
          今回、第1次・第2次・第3次産業の就業者比率から
          「ハーフィンダール指数(HHI)」という産業集中度の
          指標を算出し、全国{withHHI.length.toLocaleString()}
          自治体を比較しました。平均HHIは
          {average.toFixed(3)}でした(理論上、3産業が完全に
          均等なら約0.333、1つの産業に完全依存すれば1.0に
          なります)。
        </p>
      </div>

      <div style={box}>
        <h2>産業が最も一極集中している自治体TOP10</h2>

        <RankingBarChart
          items={top10.map((c) => ({
            name: c.name,
            value: c.hhi,
            displayValue: `${c.hhi.toFixed(3)}(${c.dominantLabel}${c.dominantShare.toFixed(0)}%)`,
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          上位を占めるのは東京都心部の区や、群馬県草津町・
          神奈川県箱根町のような観光地です。共通するのは、
          いずれも第3次産業(サービス業)への依存度が9割前後と
          極端に高い点です。都心部ではオフィス・金融・
          専門サービス業への集中、観光地では宿泊・飲食業への
          集中という、性質は異なりますが、どちらも「1つの
          産業カテゴリーに強く依存している」という点では
          共通しています。
        </p>
      </div>

      <div style={box}>
        <h2>産業がバランスよく分散している自治体TOP10</h2>

        <RankingBarChart
          items={bottom10.map((c) => ({
            name: c.name,
            value: c.hhi,
            displayValue: c.hhi.toFixed(3),
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          最もバランス型なのは青森県横浜町(HHI
          {bottom10[0].hhi.toFixed(3)})で、第1次・第2次・
          第3次産業がほぼ均等に分かれています。上位10自治体は
          いずれも人口数千人規模の農山漁村で、農業・漁業
          (第1次)、地場の製造業(第2次)、地域内のサービス業
          (第3次)がバランスよく併存する、昔ながらの地域
          経済の姿を保っています。
        </p>
      </div>

      <div style={box}>
        <h2>「多様性=強靭」ではなかった、財政力との関係</h2>

        <p>
          ここからが今回の発見の核心です。産業が一極集中して
          いる自治体(HHI上位200)の財政力指数の平均は
          {avgFinConcentrated.toFixed(3)}であるのに対し、
          産業がバランスよく分散している自治体(HHI下位200)
          の平均はわずか{avgFinDiverse.toFixed(3)}でした。
          一般的にイメージされる「産業が多様な地域は経済的に
          強靭」という考え方とは正反対の結果です。
        </p>

        <p>
          この逆説の背景には、単純な理由があります。
          「一極集中」に分類された自治体の多くは、都心部や
          観光地のようにサービス業(第3次産業)が突出して
          発達した、経済規模そのものが大きい地域です。一方
          「バランス型」に分類された自治体の多くは、農業・
          漁業(第1次)から抜け出せていない、経済規模の
          小さい農山漁村です。つまりHHIが示しているのは
          「産業の多様性」そのものというより、「地域経済が
          サービス業中心の都市型に発展しているかどうか」の
          裏返しである可能性が高いということです。産業構造
          分析の記事で見た「第1次産業の町」の多くが、今回の
          集計でもバランス型かつ財政力の弱い自治体として
          重なっています。
        </p>

        <PersonalNote>
          この数字を見て、「多様性は良いことだ」という
          一般論をそのままデータに当てはめるのは危険だと
          改めて感じました。経済学の教科書的には産業の
          多様化はリスク分散として語られますが、今の日本の
          市区町村データでは、多様性そのものよりも「その
          地域がどれだけ都市型のサービス経済に移行できて
          いるか」の方が、財政力との結びつきが強く出ています。
          データから見える相関を、教科書通りの因果関係と
          決めつけずに、背景にある構造まで考える必要がある
          ことを、この指標は教えてくれました。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>このデータを読むときの注意点</h2>

        <p>
          HHIはあくまで統計的な集中度を示す指標であり、
          「一極集中が良い」「分散が悪い」という価値判断を
          示すものではありません。観光地や都心区のように、
          意図的に強みを一点集中させることで発展してきた
          地域もあれば、農山漁村のように歴史的・地理的な
          制約から産業の転換が難しい地域もあります。財政力
          との相関は、HHIそのものの効果というより、都市化の
          進み具合という別の要因が背景にある可能性が高い点に
          ご留意ください。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：産業の多様性指数についてよくある質問</h2>

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
          産業構造の多様性指数を独自に算出したことで、
          「産業の多様性=経済の強靭さ」という一般的な
          イメージとは異なる、日本の市区町村ならではの
          構造が見えてきました。産業構造分析の記事で見た
          「その町の個性」を、今回はさらに定量化し、財政力
          という別の指標と結びつけることで、新しい発見に
          つながりました。
        </p>

        <p>
          <Link href="/articles/industry-structure" style={link}>
            産業構造ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/finance-analysis" style={link}>
            財政力指数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/fiscal-health-composite" style={link}>
            財政健全度スコア(4指標統合)を見る
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
