import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  title: "転入超過と子ども人口割合の関係｜相関0.30",
  description:
    "転入超過率(社会増減率)と子ども人口割合の相関を全国データで分析。相関係数は0.30にとどまり、転入超過が大きくても子どもの割合が低い自治体と、本当の意味で子育て世代を集めている自治体には明確な違いがありました。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.inMigrants != null &&
        c.outMigrants != null &&
        c.childPopulation != null &&
        c.population > 0
    )
    .map((c) => ({
      ...c,
      netRate:
        (((c.inMigrants as number) - (c.outMigrants as number)) /
          c.population) *
        100,
      childRatio: ((c.childPopulation as number) / c.population) * 100,
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
    base.map((c) => c.netRate),
    base.map((c) => c.childRatio)
  );

  const byNet = [...base].sort((a, b) => a.netRate - b.netRate);
  const qSize = Math.floor(byNet.length / 4);
  const quartiles = [
    byNet.slice(0, qSize),
    byNet.slice(qSize, qSize * 2),
    byNet.slice(qSize * 2, qSize * 3),
    byNet.slice(qSize * 3),
  ];
  const quartileStats = quartiles.map((g) => ({
    avgNet: g.reduce((s, c) => s + c.netRate, 0) / g.length,
    avgChild: g.reduce((s, c) => s + c.childRatio, 0) / g.length,
  }));

  const topMigrationQuartile = quartiles[3];

  const familyBoomtowns = [...topMigrationQuartile]
    .sort((a, b) => b.childRatio - a.childRatio)
    .slice(0, 15);

  const nonFamilyMigration = [...topMigrationQuartile]
    .sort((a, b) => a.childRatio - b.childRatio)
    .slice(0, 15);

  const okinawaCount = familyBoomtowns.filter((c) =>
    c.name.startsWith("沖縄県")
  ).length;

  const kumamotoCount = familyBoomtowns.filter((c) =>
    c.name.startsWith("熊本県")
  ).length;

  const fukushimaCount = nonFamilyMigration.filter((c) =>
    c.name.startsWith("福島県")
  ).length;

  return (
    <ArticleLayout
      title="転入超過と子ども人口割合の関係：相関係数0.30、「人が集まる町」と「子育て世代が集まる町」は別物"
      summary={`全国${base.length.toLocaleString()}自治体のデータで転入超過率(社会増減率)と子ども人口割合の相関係数を計算すると${r.toFixed(
        2
      )}にとどまりました。転入超過が大きくても子どもの割合が極端に低い自治体がある一方、本当の意味で子育て世代を集めている自治体には共通した産業・地域的な背景がありました。`}
      heroLabel="転入超過率×子ども人口割合 相関係数"
      heroValue={r.toFixed(2)}
      rankingLink="/ranking/decline"
      tags={["migration", "child"]}
      publishedAt="2026-07-21"
      top3={[
        { rank: 1, name: familyBoomtowns[0].name, value: `子ども${familyBoomtowns[0].childRatio.toFixed(1)}%` },
        { rank: 2, name: familyBoomtowns[1].name, value: `子ども${familyBoomtowns[1].childRatio.toFixed(1)}%` },
        { rank: 3, name: familyBoomtowns[2].name, value: `子ども${familyBoomtowns[2].childRatio.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          「転入超過(社会増)が続いている町は、子育て世代に
          選ばれている町だ」——移住・地方創生の文脈では、
          しばしばこのように語られます。しかし実際のデータで
          転入超過率と子ども人口割合の関係を調べると、相関係数
          は{r.toFixed(2)}
          と、弱い正の相関にとどまりました。つまり「人が
          転入超過している」ことと「子どもの割合が高い」
          ことは、思われているほど強く結びついてはいません。
        </p>
      </div>

      <div style={box}>
        <h2>転入超過率が高いほど子ども割合はやや高い、が弱い</h2>

        <RankingBarChart
          items={quartileStats.map((q, i) => ({
            name: `転入超過率 第${i + 1}四分位(${
              i === 0 ? "転出超過が大きい" : i === 3 ? "転入超過が大きい" : "中間"
            })`,
            value: q.avgChild,
            displayValue: `${q.avgChild.toFixed(1)}%`,
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          全自治体を転入超過率の低い順に4等分すると、最も
          転出超過が大きいグループ(平均
          {quartileStats[0].avgNet.toFixed(2)}
          %)の平均子ども人口割合は
          {quartileStats[0].avgChild.toFixed(1)}
          %、最も転入超過が大きいグループ(平均
          {quartileStats[3].avgNet.toFixed(2)}
          %)では
          {quartileStats[3].avgChild.toFixed(1)}
          %と、たしかに転入超過が大きいグループの方が子ども
          割合は高い傾向にあります。ただしその差はわずか
          {(
            quartileStats[3].avgChild - quartileStats[0].avgChild
          ).toFixed(1)}
          ポイントほどで、決して強い関係とは言えません。
        </p>
      </div>

      <div style={box}>
        <h2>転入超過が大きいのに子どもが少ない自治体</h2>

        <RankingBarChart
          items={nonFamilyMigration.map((c) => ({
            name: c.name,
            value: c.childRatio,
            displayValue: `${c.childRatio.toFixed(1)}%`,
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          このグラフは、転入超過率が上位25%に入る自治体の
          中で、子ども人口割合が低い順に15自治体を並べたもの
          です。福島県大熊町・金山町・昭和村など
          {fukushimaCount}
          自治体は、東日本大震災からの復興・帰還にともなう
          転入超過で、帰還者の多くが高齢者や単身の作業員で
          あるため、転入超過が大きいにもかかわらず子ども
          割合は極めて低くなっています。長野県王滝村・栄村、
          徳島県神山町、東京都檜原村・奥多摩町といった
          中山間地の町村も、Iターン・Uターン移住や別荘・
          サテライトオフィスの整備によって転入超過を記録
          していますが、移住者の中心は現役世代〜シニア層で
          あり、子育て世代の大規模な流入には至っていません。
        </p>
      </div>

      <div style={box}>
        <h2>本当の「子育て世代が集まる町」TOP15</h2>

        <RankingBarChart
          items={familyBoomtowns.map((c) => ({
            name: c.name,
            value: c.childRatio,
            displayValue: `${c.childRatio.toFixed(1)}%`,
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          一方でこちらは、同じく転入超過率が上位25%に入る
          自治体の中で、子ども人口割合が高い順に15自治体を
          並べたものです。1位の
          {familyBoomtowns[0].name}
          をはじめ、沖縄県の自治体が{okinawaCount}
          自治体を占めています。出生率ランキング分析の記事
          で見たとおり、沖縄県はもともと出生率が高く、転入
          超過とあわせて子ども割合が押し上げられやすい地域
          です。
        </p>

        <p>
          もう1つの顔ぶれが、熊本県合志市・嘉島町です。
          {kumamotoCount}
          自治体が該当し、いずれも熊本市近郊の自治体で、
          半導体関連企業の進出・拡大にともなう雇用創出が
          子育て世代の転入を後押ししていると考えられます。
          三重県朝日町も、自動車関連産業の集積地として
          知られ、同様に現役の子育て世代を惹きつけている
          地域です。共通しているのは、明確な雇用の受け皿と
          なる産業が地域にあるという点で、単に「移住者を
          歓迎している」だけでは、子育て世代の転入には
          必ずしもつながらないことがうかがえます。
        </p>
      </div>

      <div style={box}>
        <h2>移住施策を評価するときに見るべき指標</h2>

        <p>
          地方創生の現場では、しばしば「転入超過数」や
          「転入超過率」がそのまま移住施策の成果指標として
          使われがちです。しかし今回の分析が示すとおり、
          転入超過という結果だけでは、その地域が本当に
          将来の担い手となる子育て世代を獲得できているのか
          どうかは判断できません。震災復興工事のように、
          期間が限定された事業に伴う転入は、工事が終われば
          再び転出超過に転じる可能性が高く、持続的な人口
          維持にはつながりにくい面があります。一方、半導体
          関連産業の集積のように、長期的な雇用創出を伴う
          転入は、子育て世代の定着を通じて、次の世代の
          子どもの増加にもつながりやすいと考えられます。
        </p>

        <p>
          自治体の人口政策を評価する際は、転入超過率という
          単一の数字だけでなく、子ども人口割合や出生率と
          いった別の指標も同時に確認し、その転入が一時的な
          ものか、持続的な世代の定着につながるものかを
          見極める視点が欠かせません。
        </p>
      </div>

      <div style={box}>
        <h2>「転入超過」の中身を見分ける重要性</h2>

        <p>
          この結果から言えるのは、転入超過率という数字
          だけを見て「子育て世代に選ばれている町」と判断
          するのは早計だということです。転入超過の背景には、
          震災復興にともなう作業員の転入、Iターン・Uターン
          移住によるシニア層・単身者の増加、大規模工場や
          研究施設の進出にともなう現役世代の転入など、
          性質の異なる複数の要因が混在しています。同じ
          「転入超過1位」でも、その中身によって将来の
          人口構成に与える影響はまったく異なります。
        </p>

        <p>
          社会増減率ランキング分析の記事とあわせて読むことで、
          転入超過という現象の裏にどのような人の動きがある
          のかを、より立体的に理解することができます。
        </p>

        <p>
          <Link href="/ranking/decline" style={link}>
            社会増減率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/decline" style={link}>
            社会増減率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/birth-rate" style={link}>
            出生率ランキング分析を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          転入超過率は、その自治体の人口に対する転入者数と
          転出者数の差の割合であり、転入者・転出者の年齢別
          内訳までは分かりません。そのため、この記事では
          子ども人口割合という別の指標を組み合わせることで、
          間接的に「どのような世代が動いているか」を推測して
          います。本来であれば年齢階級別の移動データを使う
          ことが望ましいですが、市区町村単位でそこまで詳細な
          データが公開されているケースは限られるため、
          今回のような組み合わせ分析が現実的な代替手段に
          なります。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          転入超過率と子ども人口割合の相関係数は0.30と、
          直感的なイメージほど強い関係ではありませんでした。
          転入超過が大きい自治体の中には、震災復興や
          Iターン移住によって現役・シニア層が中心に流入
          している町村と、明確な産業基盤によって子育て世代
          を惹きつけている自治体の、性質の異なる2つの
          グループが混在しています。「転入超過」という
          言葉だけに注目するのではなく、その転入がどのような
          世代によるものかを見極めることが、地域の将来を
          正しく理解するうえで欠かせません。
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
