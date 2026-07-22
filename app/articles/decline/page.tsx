import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  title: "社会増減率分析：転入超過1位はなぜ人口847人の町なのか",
  description:
    "転入・転出データから見る社会増減率ランキング。震災復興地域と都心再開発、正反対の背景を持つ自治体を分析します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.inMigrants != null &&
        c.outMigrants != null &&
        c.population > 0
    )
    .map((c) => ({
      ...c,
      rate:
        (((c.inMigrants ?? 0) - (c.outMigrants ?? 0)) /
          c.population) *
        100,
    }))
    .sort((a, b) => b.rate - a.rate);

  const top10 = ranking.slice(0, 10);
  const bottom10 = ranking.slice(-10).reverse();

  return (
    <ArticleLayout
      title="社会増減率分析：転入超過1位はなぜ人口847人の町なのか"
      summary="転入者数から転出者数を引いた社会増減率で全国1位になったのは、人口847人の福島県大熊町でした。転入超過・転出超過、それぞれの上位に共通する背景を分析します。"
      heroLabel="転入超過1位"
      heroValue={`${top10[0].name} ${top10[0].rate.toFixed(1)}%`}
      rankingLink="/ranking/decline"
      top3={[
        {
          rank: 1,
          name: top10[0].name,
          value: `${top10[0].rate.toFixed(2)}%`,
        },
        {
          rank: 2,
          name: top10[1].name,
          value: `${top10[1].rate.toFixed(2)}%`,
        },
        {
          rank: 3,
          name: top10[2].name,
          value: `${top10[2].rate.toFixed(2)}%`,
        },
      ]}
    >
      <div style={box}>
        <h2>転入超過TOP10</h2>

        <RankingBarChart
          items={top10.map((c) => ({
            name: c.name,
            value: c.rate,
            displayValue: `${c.rate.toFixed(2)}%`,
          }))}
        />
      </div>

      <div style={box}>
        <h2>この指標について</h2>

        <p>
          社会増減率は、総務省「住民基本台帳人口移動報告」の
          転入者数・転出者数をもとに、(転入者数−転出者数)÷人口
          で算出しています。出生・死亡による自然増減は含まれて
          いないため、実際の総人口の増減率とは異なります。
          小規模な自治体ほど、少数の転入・転出でも比率が
          大きく振れる点にも注意が必要です。
        </p>

        <p>
          実際、今回のランキング上位・下位の多くは、人口
          数百人〜数千人規模の小さな自治体で占められています。
          人口が少ないほど、わずか数十人の転入・転出でも
          パーセンテージが跳ね上がるため、大都市と同じ基準で
          単純比較すると実態を見誤ることがあります。ランキングを
          見る際は、率だけでなく、その自治体の人口規模も
          あわせて確認することをおすすめします。
        </p>
      </div>

      <div style={box}>
        <h2>1位は震災復興が進む町</h2>

        <p>
          1位の{top10[0].name}(社会増減率
          {top10[0].rate.toFixed(2)}%)は、東京電力福島第一原発
          事故により長期間避難指示が出されていた自治体です。
          除染やインフラ復旧が進み、帰還困難区域の一部が
          解除されたことで、復興関連の作業員や帰還を決めた
          住民の転入が続いています。ただし人口はもともと
          847人と少なく、少数の転入でも比率が大きく跳ね上がる
          点には注意が必要です。
        </p>

        <p>
          一方で、同じ原発事故の影響を受けた福島県内の
          自治体でも、状況は大きく異なります。浪江町は
          社会増減率がマイナス15.96%と、全国で最も転出超過が
          大きい自治体になっており、飯舘村・葛尾村も大幅な
          転出超過です。避難指示の解除時期や、帰還を選ぶ
          住民の割合の違いが、同じ被災地域の中でも明暗を
          分けています。
        </p>
      </div>

      <div style={box}>
        <h2>転出超過TOP10</h2>

        <RankingBarChart
          items={bottom10.map((c) => ({
            name: c.name,
            value: Math.abs(c.rate),
            displayValue: `${c.rate.toFixed(2)}%`,
          }))}
        />
      </div>

      <div style={box}>
        <h2>都心の再開発と転入超過</h2>

        <p>
          転入超過の上位には、東京都中央区のような都心の
          自治体も入っています。中央区は大規模なタワー
          マンション開発が続いており、住宅供給の増加が
          転入超過に直結しています。震災復興地域とは
          まったく異なる理由で、同じ「転入超過」という
          結果になっている点が興味深いところです。
        </p>

        <p>
          本サイトでは人口ランキング・子ども人口割合ランキングと
          あわせてこの社会増減率を見ることで、その自治体の
          人口動態がどのような要因によって支えられているのかを、
          より立体的に把握できます。
        </p>
      </div>

      <div style={box}>
        <h2>社会増減率と自治体の将来予測</h2>

        <p>
          社会増減率がプラスの自治体がすべて「今後も人口が
          増える」とは限りません。転入超過が一時的な要因
          (震災復興工事、大規模マンションの入居ラッシュなど)に
          よるものであれば、工事や販売が一段落した時点で
          転入超過は収まる可能性があります。逆に、継続的な
          雇用創出や住宅供給が伴っている自治体では、
          転入超過が長期的なトレンドとして定着しやすいと
          考えられます。単年の数字だけでなく、何年も続けて
          転入超過が見られるかどうかも、あわせて確認したい
          ポイントです。
        </p>

        <p>
          一方、転出超過が続く自治体では、若年層の流出に
          歯止めをかけるため、移住支援策や企業誘致、
          テレワーク環境の整備など、さまざまな取り組みが
          進められています。本サイトの財政力指数ランキングと
          あわせて見ることで、こうした施策を実行するための
          財政的な余力がどの程度あるかも確認できます。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          社会増減率ランキングの上位・下位には、震災復興、
          都心再開発、農村部の過疎化という、性質の異なる
          複数の要因が混在していました。同じ「転入超過」
          「転出超過」という結果でも、その背景を理解することで、
          単なる順位以上の情報を読み取ることができます。
          今後、同じ自治体の順位がどう変化していくかを
          追いかけることも、地域の変化を理解する手がかりに
          なります。
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
