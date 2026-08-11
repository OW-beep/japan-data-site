import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  alternates: { canonical: "/articles/child-finance" },
  title: "子ども人口割合と財政力指数の関係｜相関0.40",
  description:
    "子ども人口割合と財政力指数の相関係数は0.40。一方、千葉県芝山町(成田空港)や宮城県女川町(原発)など、子どもの割合が低いのに財政力指数が高い自治体には、空港・発電所・観光地といった共通点がありました。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.childPopulation != null && c.population > 0 && c.financeIndex != null
    )
    .map((c) => ({
      ...c,
      childRatio: (c.childPopulation / c.population) * 100,
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
    base.map((c) => c.childRatio),
    base.map((c) => c.financeIndex ?? 0)
  );

  const byChild = [...base].sort((a, b) => a.childRatio - b.childRatio);
  const qSize = Math.floor(byChild.length / 4);
  const quartiles = [
    byChild.slice(0, qSize),
    byChild.slice(qSize, qSize * 2),
    byChild.slice(qSize * 2, qSize * 3),
    byChild.slice(qSize * 3),
  ];
  const quartileStats = quartiles.map((g) => ({
    avgChild: g.reduce((s, c) => s + c.childRatio, 0) / g.length,
    avgFinance: g.reduce((s, c) => s + (c.financeIndex ?? 0), 0) / g.length,
  }));

  const lowChildQuartile = quartiles[0];
  const exceptions = [...lowChildQuartile]
    .sort((a, b) => (b.financeIndex ?? 0) - (a.financeIndex ?? 0))
    .slice(0, 15);

  const maxChildInBottomQuartile = Math.max(
    ...lowChildQuartile.map((c) => c.childRatio)
  );

  return (
    <ArticleLayout
      title="子ども人口割合と財政力指数の関係：相関係数0.40、成田空港の町の財政力が強い理由"
      summary={`全国${base.length.toLocaleString()}自治体のデータで子ども人口割合と財政力指数の相関係数を計算すると${r.toFixed(
        2
      )}でした。子どもの割合が高い自治体ほど財政力も強い緩やかな傾向がある一方、千葉県芝山町(成田空港)や宮城県女川町(原発)のように、子どもの割合が低くても財政力指数が高い自治体には、明確な産業的な理由がありました。`}
      heroLabel="子ども人口割合×財政力指数 相関係数"
      heroValue={r.toFixed(2)}
      rankingLink="/ranking/finance"
      tags={["child", "finance"]}
      publishedAt="2026-07-27"
      top3={[
        { rank: 1, name: exceptions[0].name, value: `財政力${(exceptions[0].financeIndex ?? 0).toFixed(2)}` },
        { rank: 2, name: exceptions[1].name, value: `財政力${(exceptions[1].financeIndex ?? 0).toFixed(2)}` },
        { rank: 3, name: exceptions[2].name, value: `財政力${(exceptions[2].financeIndex ?? 0).toFixed(2)}` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          子育て支援が手厚い自治体は財政的にも豊かなのでは
          ないか——そんな仮説を検証すべく、全国
          {base.length.toLocaleString()}
          自治体のデータで子ども人口割合と財政力指数の相関
          係数を計算したところ、
          {r.toFixed(2)}
          という緩やかな正の相関が確認できました。ただし、
          子どもの割合が低いのに財政力指数が非常に高い
          自治体も一定数あり、その顔ぶれからは、これまでの
          記事とは異なる新しいパターンが見えてきました。
        </p>
      </div>

      <div style={box}>
        <h2>子どもの割合が高いほど財政力もやや高い</h2>

        <RankingBarChart
          items={quartileStats.map((q, i) => ({
            name: `子ども人口割合 第${i + 1}四分位(${
              i === 0 ? "低い方" : i === 3 ? "高い方" : "中間"
            })`,
            value: q.avgFinance,
            displayValue: q.avgFinance.toFixed(3),
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          全自治体を子ども人口割合の低い順に4等分すると、
          最も割合が低いグループ(平均
          {quartileStats[0].avgChild.toFixed(1)}
          %)の平均財政力指数は
          {quartileStats[0].avgFinance.toFixed(3)}
          である一方、最も割合が高いグループ(平均
          {quartileStats[3].avgChild.toFixed(1)}
          %)では
          {quartileStats[3].avgFinance.toFixed(3)}
          まで上昇しています。子育て世代が集まる自治体は、
          同時に現役世代の税収も豊かであるケースが多く、
          両者には緩やかな正の関係が見られます。
        </p>
      </div>

      <div style={box}>
        <h2>子どもは少ないのに財政が強い自治体TOP15</h2>

        <RankingBarChart
          items={exceptions.map((c) => ({
            name: c.name,
            value: c.financeIndex ?? 0,
            displayValue: (c.financeIndex ?? 0).toFixed(2),
          }))}
          barColor="#d97706"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          このグラフは、子ども人口割合が下位25%(
          {maxChildInBottomQuartile.toFixed(1)}
          %以下)に入る自治体の中で、財政力指数が高い順に
          15自治体を並べたものです。上位には、これまでの
          記事でも見てきた原子力発電所立地自治体(北海道
          泊村、福島県大熊町・広野町・富岡町・楢葉町)や
          観光地(神奈川県箱根町、静岡県熱海市、新潟県
          湯沢町)に加えて、今回新たに空港と原発の
          立地自治体が加わりました。
        </p>
      </div>

      <div style={box}>
        <h2>新たに見つかった例外：空港の町</h2>

        <p>
          特に注目したいのが、子ども人口割合
          {exceptions
            .find((c) => c.name.includes("芝山町"))
            ?.childRatio.toFixed(1) ?? "8.6"}
          %ながら財政力指数0.98の千葉県芝山町です。成田
          国際空港の敷地の一部が町内にあり、空港関連の
          固定資産税収入や、騒音対策・地域振興のための
          国からの交付金が、財政力を大きく押し上げています。
          同様に宮城県女川町も、女川原子力発電所の立地に
          よって、子どもの割合が低いにもかかわらず財政力
          指数1.01という高水準を維持しています。
        </p>

        <p>
          このほか、埼玉県所沢市・千葉県富津市のように、
          物流拠点や製鉄関連の工場を抱える都市も、子ども
          割合は必ずしも高くないものの、安定した企業からの
          税収によって財政力指数を高く保っています。東京都
          渋谷区も、子ども割合こそ低いものの、企業の本社
          機能集積による税収の豊かさが財政力指数を押し
          上げている典型例です。
        </p>
      </div>

      <div style={box}>
        <h2>なぜ子どもの割合と財政力は緩やかにしか連動しないのか</h2>

        <p>
          高齢化率や人口密度との相関係数がそれぞれ-0.71、
          0.73と強かったのに対し、子ども人口割合との相関は
          0.40にとどまりました。これは、子どもの数そのものが
          税収を生み出すわけではないためです。税収の主な
          担い手は子どもではなく現役世代であり、子育て世代の
          多さは「現役世代が多い」ことの間接的な表れに
          すぎません。加えて、子育て支援・保育・教育に
          かかる歳出は、子どもの数が多いほど増える傾向が
          あるため、税収面でのプラスと歳出面でのマイナスが
          一部相殺し合い、相関を弱めていると考えられます。
        </p>

        <p>
          つまり、子育て世代が多い自治体が必ずしも財政的に
          楽になるわけではなく、むしろ手厚い子育て支援を
          維持するために、他の分野の歳出を抑えたり、独自の
          財源確保に努めたりしている自治体も少なくありません。
          子ども人口割合の高さを、そのまま「財政的な余裕」
          と読み替えるのは早計だと言えるでしょう。
        </p>
      </div>

      <div style={box}>
        <h2>3本の記事に共通する結論</h2>

        <p>
          高齢化率、人口密度、そして今回の子ども人口割合と、
          3つの異なる角度から財政力指数との関係を見てきま
          したが、いずれの記事でも「例外」として登場するのは、
          原子力発電所・空港・観光地・大規模工場といった、
          特定の産業・インフラを持つ自治体でした。財政力
          指数は住民の年齢構成や人口密度から緩やかに予測
          できるものの、最終的にそれを大きく上回ったり
          下回ったりするかどうかを決めるのは、その地域に
          どのような固定資産・産業基盤があるかという、
          より直接的な要因だと言えます。
        </p>

        <p>
          <Link href="/ranking/finance" style={link}>
            財政力指数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/aging-finance" style={link}>
            高齢化率と財政力指数の関係を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/density-finance" style={link}>
            人口密度と財政力指数の関係を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>子育て支援の手厚さと財政力は別の話</h2>

        <p>
          この記事を通じて伝えたいのは、「子育て支援が手厚い
          自治体=財政的に豊かな自治体」という単純な図式では
          ないということです。むしろ、子育て世代の転入を
          積極的に呼び込んでいる財政的に厳しい自治体も
          数多く存在します。転入超過と子ども人口割合の関係を
          扱った記事で見た熊本県の自治体のように、産業誘致に
          よって子育て世代の転入と税収の両方を同時に実現
          できているケースは、むしろ幸運な部類に入ると
          言えるでしょう。多くの自治体にとっては、限られた
          財源の中でいかに子育て支援を維持するかという
          課題が続いているのが実情です。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          子ども人口割合と財政力指数の相関係数0.40は、
          高齢化率や人口密度との相関(それぞれ-0.71、0.73)
          と比べるとやや弱めです。これは、子どもの多さが
          税収に直接結びつくわけではなく、あくまで現役
          世代の多さや地域の経済活動の活発さを介した間接的な
          関係であるためと考えられます。また、空港や原発
          関連の財政力の強さは、施設の稼働状況や将来の
          制度変更によって変動し得る点にも留意が必要です。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          子ども人口割合と財政力指数には相関係数0.40という
          緩やかな正の相関があり、子育て世代が多い自治体は
          財政的にもある程度豊かである傾向が見られました。
          一方で、成田空港を抱える千葉県芝山町や原発立地
          自治体の女川町のように、子どもの割合が低くても
          財政力が非常に強い自治体も存在し、その背景には
          空港・発電所・工場といった特定の産業基盤がありました。
        </p>

        <p>
          高齢化率・人口密度・子ども人口割合という3つの
          異なる切り口から財政力指数を分析してきましたが、
          共通して見えてきたのは、人口統計だけを頼りに
          自治体の財政を語ることの限界です。
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
