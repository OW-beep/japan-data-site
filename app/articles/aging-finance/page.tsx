import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";


export const metadata = {
  title: "高齢化率と財政力指数の関係｜相関係数-0.71",
  description:
    "全国の自治体データで高齢化率と財政力指数の相関を分析。高齢化が進むほど財政力は弱くなる傾向がある一方、熱海市や伊方町など高齢化率が高くても財政力指数が高い自治体には共通点がありました。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.elderlyPopulation != null &&
        c.population > 0 &&
        c.financeIndex != null
    )
    .map((c) => ({
      ...c,
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
    base.map((c) => c.financeIndex ?? 0)
  );

  const byAging = [...base].sort((a, b) => a.agingRate - b.agingRate);
  const qSize = Math.floor(byAging.length / 4);
  const quartiles = [
    byAging.slice(0, qSize),
    byAging.slice(qSize, qSize * 2),
    byAging.slice(qSize * 2, qSize * 3),
    byAging.slice(qSize * 3),
  ];
  const quartileStats = quartiles.map((g) => ({
    avgAging: g.reduce((s, c) => s + c.agingRate, 0) / g.length,
    avgFinance:
      g.reduce((s, c) => s + (c.financeIndex ?? 0), 0) / g.length,
  }));

  const topAgingQuartile = quartiles[3];
  const exceptions = [...topAgingQuartile]
    .sort((a, b) => (b.financeIndex ?? 0) - (a.financeIndex ?? 0))
    .slice(0, 15);

  const minAgingInTopQuartile = Math.min(
    ...topAgingQuartile.map((c) => c.agingRate)
  );

  const onsenCount = exceptions.filter((c) =>
    ["熱海", "伊東", "湯河原", "那須", "岬"].some((k) =>
      c.name.includes(k)
    )
  ).length;

  const bottomAgingQuartile = quartiles[0];
  const lowFinanceYoungExceptions = [...bottomAgingQuartile]
    .sort((a, b) => (a.financeIndex ?? 0) - (b.financeIndex ?? 0))
    .slice(0, 10);

  return (
    <ArticleLayout
      title="高齢化率と財政力指数の関係：相関係数-0.71でも財政が強い「例外」自治体はどこか"
      summary={`全国${base.length.toLocaleString()}自治体のデータで高齢化率と財政力指数の相関係数を計算すると-0.71と、強い負の相関が見られました。高齢化が進むほど財政基盤は弱くなる傾向がある一方、熱海市や伊方町のように、高齢化率が高くても財政力指数が高い「例外」自治体には共通点がありました。`}
      heroLabel="高齢化率×財政力指数 相関係数"
      heroValue={r.toFixed(2)}
      rankingLink="/ranking/finance"
      tags={["aging", "finance"]}
      publishedAt="2026-07-03"
      top3={[
        {
          rank: 1,
          name: exceptions[0].name,
          value: `財政力${exceptions[0].financeIndex?.toFixed(2)}`,
        },
        {
          rank: 2,
          name: exceptions[1].name,
          value: `財政力${exceptions[1].financeIndex?.toFixed(2)}`,
        },
        {
          rank: 3,
          name: exceptions[2].name,
          value: `財政力${exceptions[2].financeIndex?.toFixed(2)}`,
        },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          財政力指数ランキング分析の記事で見たとおり、財政力指数
          (自治体の税収の豊かさを示す指標で、1に近いほど自主財源
          だけで運営できることを意味します)は人口規模だけでは
          説明できません。では、住民の年齢構成、特に高齢化率
          とはどのような関係にあるのでしょうか。全国
          {base.length.toLocaleString()}
          自治体のデータで両者の相関係数を計算したところ、
          {r.toFixed(2)}
          という強い負の相関が確認できました。つまり、
          高齢化が進んでいる自治体ほど、財政力指数が低い
          傾向がはっきりと表れています。一般に相関係数は、
          絶対値が0.7を超えると「強い相関」と評価される
          ことが多く、社会統計としてはかなりはっきりした
          関係と言えます。もっとも、相関があるからといって
          高齢化が財政悪化の唯一の原因というわけではなく、
          両者に共通する背景(人口減少・産業の衰退など)が
          同時に影響している可能性も考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>高齢化率が上がるほど財政力は下がる</h2>

        <RankingBarChart
          items={quartileStats.map((q, i) => ({
            name: `高齢化率 第${i + 1}四分位(${
              i === 0 ? "低い方" : i === 3 ? "高い方" : "中間"
            })`,
            value: q.avgFinance,
            displayValue: q.avgFinance.toFixed(3),
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          全自治体を高齢化率の低い順に4等分し、各グループの
          平均財政力指数を比較すると、最も高齢化率が低い
          グループ(平均{quartileStats[0].avgAging.toFixed(1)}%)
          の平均財政力指数は
          {quartileStats[0].avgFinance.toFixed(3)}
          である一方、最も高齢化率が高いグループ(平均
          {quartileStats[3].avgAging.toFixed(1)}%)では
          {quartileStats[3].avgFinance.toFixed(3)}
          まで低下しており、高齢化が進むグループほど
          一貫して財政力指数が下がる、きれいな右肩下がりの
          関係になっています。
        </p>
      </div>

      <div style={box}>
        <h2>なぜ高齢化と財政力は逆相関するのか</h2>

        <p>
          この関係の背景には、主に2つのメカニズムがあると
          考えられます。1つ目は税収面です。財政力指数の
          分子にあたる基準財政収入額は、住民税や固定資産税
          など現役世代の経済活動から生まれる税収が中心で
          あるため、高齢化とともに生産年齢人口が減れば
          税収基盤も縮小しやすくなります。2つ目は歳出面
          です。高齢化が進むと、基準財政需要額に算入される
          介護・医療・福祉関連の行政需要が増加します。
          税収が細る一方で必要な支出が増えるという、
          両面からの圧力が財政力指数を押し下げていると
          考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>それでも財政が強い「例外」自治体TOP15</h2>

        <RankingBarChart
          items={exceptions.map((c) => ({
            name: c.name,
            value: c.financeIndex ?? 0,
            displayValue: (c.financeIndex ?? 0).toFixed(2),
          }))}
          barColor="#d97706"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          このグラフは、高齢化率が上位25%(高齢化率
          {minAgingInTopQuartile.toFixed(1)}%以上)に入る
          自治体の中で、財政力指数が高い順に15自治体を
          並べたものです。全国的な相関から見れば「本来なら
          財政力が弱いはずの」高齢化した自治体でありながら、
          いずれも財政力指数0.5前後、あるいはそれ以上という
          高い水準を維持しています。
        </p>
      </div>

      <div style={box}>
        <h2>例外を生む2つの産業パターン</h2>

        <p>
          TOP15の顔ぶれを見ると、大きく2つの産業パターンに
          分かれることが分かります。1つ目は静岡県熱海市・
          伊東市、神奈川県湯河原町、栃木県那須町といった
          温泉・リゾート観光地です。これらの自治体では、
          住民自体は高齢化していても、旅館・ホテルなどの
          宿泊施設や別荘・保養所が生み出す固定資産税収入が
          大きく、住民の年齢構成とは切り離された形で
          税収基盤が維持されています。{onsenCount}
          自治体がこのパターンに該当します。
        </p>

        <p>
          2つ目は原子力発電所の立地自治体です。愛媛県伊方町
          (伊方発電所)、石川県志賀町(志賀原子力発電所)などが
          該当し、発電所という大規模な固定資産に対する
          固定資産税収入に加え、国からの電源立地地域対策
          交付金といった財政支援も財政力指数を押し上げる
          要因になっています。人口が少なく高齢化率も高い
          町村であっても、大規模発電施設が立地しているだけで
          財政指標が大きく変わる典型的な例です。
        </p>

        <p>
          このほか、群馬県上野村のように林業・製造業を
          中心とした独自の産業基盤を持つ山村や、神奈川県
          三浦市・大阪府岬町のように大都市圏に近接し
          一定の産業集積を保っている自治体も、例外リストに
          含まれています。共通しているのは、いずれも
          「住民の年齢構成」以外の要因、すなわち観光・
          エネルギー・特定産業といった、地域外からの
          資金流入を伴う産業基盤を持っている点です。
        </p>
      </div>

      <div style={box}>
        <h2>逆の例外もある：「若いのに財政が弱い」離島</h2>

        <p>
          ここまでは「高齢化率が高いのに財政が強い」例外を
          見てきましたが、実は正反対のパターン、すなわち
          「高齢化率は低い(住民は若い)のに財政力指数が
          極端に低い」自治体も存在します。高齢化率が
          下位25%(全体平均より若い)のグループの中で、
          財政力指数が最も低い10自治体を見ると、鹿児島県
          三島村・十島村、沖縄県渡嘉敷村・座間味村・
          北大東村・与那国町・南大東村、東京都御蔵島村・
          利島村・青ヶ島村と、そのほとんどが人口数百人規模の
          離島で占められています。
        </p>

        <p>
          これらの離島は、役場職員や漁業・観光関連の
          比較的若い就業者が人口の中心を占めるため
          高齢化率自体は低い一方、人口があまりに少なく
          産業基盤も限られているため、自主財源となる
          税収がほとんど発生しません。財政力指数は
          {lowFinanceYoungExceptions[0].financeIndex?.toFixed(
            2
          )}
          前後という極めて低い水準にとどまり、行政
          サービスの大部分を地方交付税など国からの
          財政移転に依存しています。高齢化した観光地・
          原発立地自治体が「高齢だが豊か」であるのに対し、
          これらの離島は「若いが乏しい」という、まったく
          逆方向の例外だと言えます。この違いは、財政力を
          決めるのが年齢構成そのものではなく、あくまで
          地域にどれだけの産業基盤・税源があるかという点に
          あることを、あらためて裏付けています。
        </p>
      </div>

      <div style={box}>
        <h2>財政力指数だけでは測れないリスク</h2>

        <p>
          ここで注意したいのは、これらの例外自治体の財政の
          強さが、必ずしも将来にわたって安泰であることを
          意味しない点です。観光・リゾート系の自治体は、
          感染症の流行や旅行需要の変化によって宿泊関連の
          税収が大きく変動するリスクを抱えています。また
          原子力発電所立地自治体の場合、施設の稼働状況や
          将来的な廃炉によって、固定資産税収入や交付金が
          大きく減少する可能性があります。財政力指数は
          あくまで現時点のスナップショットであり、その
          背景にある産業構造まで見なければ、将来の持続性を
          正しく評価することはできません。
        </p>

        <p>
          本サイトの財政力指数ランキング分析や、人口規模と
          財政力の関係を扱った記事とあわせて読むことで、
          「なぜその自治体の財政が強い、あるいは弱いのか」
          という背景をより多角的に理解することができます。
        </p>

        <p>
          <Link href="/ranking/finance" style={link}>
            財政力指数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/finance-analysis" style={link}>
            財政力指数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/population-finance" style={link}>
            人口規模と財政力の関係を見る
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
          相関係数-0.71は、あくまで全国の市区町村を対象にした
          単純な統計的関係であり、個々の自治体の財政状況を
          決定づけるものではありません。財政力指数は基準
          財政収入額と基準財政需要額から算出される指標で、
          地方交付税の算定にも用いられる公的な数値ですが、
          臨時の交付金や国庫支出金など、指数に反映されない
          収入源も存在します。また、四分位グループの平均値は
          あくまで全体的な傾向を示すものであり、同じグループ
          内でも自治体ごとの差は小さくありません。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          高齢化率と財政力指数には、全国データで見ると相関係数
          -0.71という強い負の相関があり、高齢化が進む自治体
          ほど財政基盤が弱くなる傾向は統計的にも裏付けられ
          ました。一方で、温泉・リゾート観光地や原子力発電所
          立地自治体のように、住民の年齢構成とは別の要因に
          よって財政力を保っている「例外」も一定数存在します。
          高齢化率だけで自治体の財政の強さを判断するのではなく、
          その地域がどのような産業基盤の上に成り立っているかを
          あわせて見ることが、地域を正しく理解する鍵になります。
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
