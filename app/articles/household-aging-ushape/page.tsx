import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  title: "単独世帯割合と高齢化率のU字関係を分析",
  description:
    "単独世帯割合と高齢化率の相関係数を計算するとわずか-0.10。しかし年齢層ごとに見ると、実際には都市部の若い単身者と、地方の高齢単身者という、まったく性質の異なる2つの山からなるU字型の関係が隠れていました。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.households != null &&
        c.households > 0 &&
        c.singleHouseholds != null &&
        c.elderlyPopulation != null &&
        c.population > 0
    )
    .map((c) => ({
      ...c,
      singleRatio: ((c.singleHouseholds ?? 0) / (c.households as number)) * 100,
      agingRate: (c.elderlyPopulation / c.population) * 100,
    }));

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
    base.map((c) => c.agingRate),
    base.map((c) => c.singleRatio)
  );

  const byAging = [...base].sort((a, b) => a.agingRate - b.agingRate);
  const decileSize = Math.floor(byAging.length / 10);
  const deciles = Array.from({ length: 10 }, (_, i) =>
    byAging.slice(
      i * decileSize,
      i === 9 ? byAging.length : (i + 1) * decileSize
    )
  );
  const decileStats = deciles.map((g) => ({
    avgAging: g.reduce((s, c) => s + c.agingRate, 0) / g.length,
    avgSingle: g.reduce((s, c) => s + c.singleRatio, 0) / g.length,
  }));

  const youngDecile = deciles[0];
  const oldDecile = deciles[9];

  const topYoungSingle = [...youngDecile]
    .sort((a, b) => b.singleRatio - a.singleRatio)
    .slice(0, 10);
  const topOldSingle = [...oldDecile]
    .sort((a, b) => b.singleRatio - a.singleRatio)
    .slice(0, 10);

  const naraCount = topOldSingle.filter((c) =>
    c.name.startsWith("奈良県")
  ).length;

  const tokyoWardCount = topYoungSingle.filter((c) =>
    c.name.startsWith("東京都") && !c.name.includes("村") && !c.name.includes("島")
  ).length;

  return (
    <ArticleLayout
      title="単独世帯割合と高齢化率の関係：相関係数はほぼ0なのに「U字型」になる理由"
      summary={`全国${base.length.toLocaleString()}自治体で単独世帯割合と高齢化率の相関係数を計算すると、わずか${r.toFixed(
        2
      )}でした。ところが高齢化率を10段階に分けて平均単独世帯割合を見ると、若い自治体と高齢な自治体の両端で単独世帯割合が高くなる「U字型」が現れます。相関係数だけでは見えない、性質の異なる2つの単身世帯像を分析しました。`}
      heroLabel="高齢化率×単独世帯割合 相関係数(線形)"
      heroValue={r.toFixed(2)}
      rankingLink="/ranking/household"
      tags={["household", "aging"]}
      publishedAt="2026-07-24"
      top3={[
        { rank: 1, name: topOldSingle[0].name, value: `単独世帯${topOldSingle[0].singleRatio.toFixed(1)}%` },
        { rank: 2, name: topOldSingle[1].name, value: `単独世帯${topOldSingle[1].singleRatio.toFixed(1)}%` },
        { rank: 3, name: topOldSingle[2].name, value: `単独世帯${topOldSingle[2].singleRatio.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          単独世帯(一人暮らし世帯)というと、都市部の若い
          単身者か、地方の一人暮らし高齢者か、どちらの
          イメージを持つでしょうか。実は、全国データで
          単独世帯割合と高齢化率の相関係数を単純に計算すると
          {r.toFixed(2)}
          とほぼゼロで、「高齢化率と単独世帯割合には関係が
          ない」という結論になってしまいます。しかし、これは
          統計のトリックです。高齢化率で自治体を10段階に
          分けて平均を取ると、まったく違う姿が見えてきます。
        </p>
      </div>

      <div style={box}>
        <h2>相関係数はゼロでも、実際はU字型</h2>

        <RankingBarChart
          items={decileStats.map((d, i) => ({
            name: `高齢化率 D${i + 1}(平均${d.avgAging.toFixed(0)}%)`,
            value: d.avgSingle,
            displayValue: `${d.avgSingle.toFixed(1)}%`,
          }))}
          barColor="#7c3aed"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          高齢化率が最も低い自治体グループ(平均
          {decileStats[0].avgAging.toFixed(1)}
          %)の平均単独世帯割合は
          {decileStats[0].avgSingle.toFixed(1)}
          %と高い水準にありますが、高齢化率が中間的な
          グループ(D4〜D6)では
          {decileStats[4].avgSingle.toFixed(1)}
          %前後まで下がり、最も高齢化率が高いグループ(平均
          {decileStats[9].avgAging.toFixed(1)}
          %)では再び
          {decileStats[9].avgSingle.toFixed(1)}
          %まで上昇します。グラフの形がアルファベットの
          「U」のようになることから、このような関係は
          「U字型」と呼ばれます。単純な相関係数はこの
          U字の両端が互いに打ち消し合ってしまうため、
          見かけ上ゼロに近い数字になってしまうのです。
        </p>
      </div>

      <div style={box}>
        <h2>U字の左端：都市部の若い単身者</h2>

        <RankingBarChart
          items={topYoungSingle.map((c) => ({
            name: c.name,
            value: c.singleRatio,
            displayValue: `${c.singleRatio.toFixed(1)}%`,
          }))}
          barColor="#2563eb"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          高齢化率が最も低いグループの中で単独世帯割合が
          高い自治体を見ると、東京都新宿区・渋谷区・豊島区・
          中野区など、{tokyoWardCount}
          の特別区が上位を占めています。進学や就職で上京した
          単身の若年層が、賃貸のワンルームマンションなどに
          多く暮らしていることが背景にあります。福島県
          大熊町・富岡町のように、震災復興工事にともなう
          単身赴任の作業員が集中している自治体も、この
          グループに含まれています。
        </p>
      </div>

      <div style={box}>
        <h2>U字の右端：地方の高齢単身者</h2>

        <RankingBarChart
          items={topOldSingle.map((c) => ({
            name: c.name,
            value: c.singleRatio,
            displayValue: `${c.singleRatio.toFixed(1)}%`,
          }))}
          barColor="#b45309"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          一方、高齢化率が最も高いグループの中で単独世帯
          割合が高い自治体を見ると、奈良県野迫川村・上北山村・
          下北山村など、{naraCount}
          の山村が並びます。静岡県熱海市、北海道夕張市・
          上砂川町、高知県東洋町・大豊町といった、旧産業都市
          や過疎地域も含まれています。こちらは配偶者との
          死別や子どもの独立によって一人暮らしになった
          高齢者が中心で、都市部の若い単身者とは世帯が
          単独になった理由がまったく異なります。
        </p>
      </div>

      <div style={box}>
        <h2>U字型の谷にあたる自治体はどんな場所か</h2>

        <p>
          U字グラフの谷にあたる、高齢化率が中間的な
          自治体(D4〜D6)は、単独世帯割合が
          {decileStats[4].avgSingle.toFixed(1)}
          %前後と最も低い水準にあります。これは、子育て
          世帯や3世代同居世帯など、複数人で構成される
          世帯の割合が相対的に高い、いわば「家族のライフ
          サイクルが最も安定している」地域だと考えられます。
          働き盛りの世代が配偶者や子どもと同居し、まだ
          高齢の親も現役で暮らしている、世帯構成上もっとも
          「単独になりにくい」段階にあると言えます。U字の
          両端がそれぞれ都市の若者・地方の高齢者という
          「単独になりやすい」ライフステージであるのに
          対し、谷の部分はその中間にあたる安定期という
          わけです。
        </p>
      </div>

      <div style={box}>
        <h2>同じ「単独世帯」でも中身は正反対</h2>

        <p>
          U字の両端に位置する自治体は、どちらも「単独世帯
          割合が高い」という点では共通していますが、その
          意味するところは正反対です。都市部の若い単身者が
          多い地域は、今後結婚や子どもの誕生によって世帯
          構成が変化していく可能性を持つ、いわば人口の
          「入口」に近い状態です。一方、地方の高齢単身者が
          多い地域は、配偶者との死別後の一人暮らしが今後も
          続き、やがて世帯そのものが消滅していく、人口の
          「出口」に近い状態だと言えます。単独世帯割合という
          1つの数字だけを見ても、この違いは分かりません。
          高齢化率とあわせて見ることで、初めてその世帯が
          どちらの性質を持つのかが見えてきます。
        </p>

        <p>
          世帯分析の記事では単独世帯割合そのもののランキング
          を扱いましたが、今回のようにもう1つの指標(高齢化率)
          と掛け合わせることで、単純なランキングだけでは
          見えなかった構造を見つけることができました。
        </p>

        <p>
          <Link href="/ranking/household" style={link}>
            世帯データランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/household-analysis" style={link}>
            世帯データランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/aging-gap" style={link}>
            少子高齢化ギャップ分析を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          この分析で使った相関係数は、2つの変数の間に直線的な
          関係がどれだけあるかを示す指標であり、U字型や
          V字型のような非線形の関係を捉えることはできません。
          統計データを扱う際は、相関係数などの単一の要約統計量
          だけで「関係がない」と判断せず、今回のようにグループ
          分けをして分布の形そのものを確認することが重要です。
          単独世帯割合・高齢化率とも、いずれも国勢調査に
          基づく市区町村単位のデータであり、世帯の実際の
          事情(単身赴任か、死別か、未婚かなど)までは
          分かりません。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          単独世帯割合と高齢化率の相関係数は{r.toFixed(2)}
          とほぼゼロでしたが、実際には都市部の若い単身者と
          地方の高齢単身者という、性質のまったく異なる2つの
          グループによってU字型の関係が形作られていました。
          同じ「一人暮らし」でも、その背景にあるライフ
          ステージは正反対です。単純な相関係数の裏側にある
          分布の形にまで踏み込むことで、データからより
          多くのことを読み取れるようになります。
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
