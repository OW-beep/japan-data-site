import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  title: "人口密度と高齢化率の相関分析｜相関係数-0.72",
  description:
    "全国の自治体データで人口密度と高齢化率の相関を分析。人口密度が高いほど高齢化率は低い傾向が明確な一方、旧産炭都市や高度成長期の郊外団地など、密度が高いのに高齢化も進む自治体には共通点がありました。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.populationDensity != null &&
        c.elderlyPopulation != null &&
        c.population > 0
    )
    .map((c) => ({
      ...c,
      populationDensity: c.populationDensity ?? 0,
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
    base.map((c) => Math.log10(c.populationDensity + 1)),
    base.map((c) => c.agingRate)
  );

  const byDensity = [...base].sort(
    (a, b) => a.populationDensity - b.populationDensity
  );
  const qSize = Math.floor(byDensity.length / 4);
  const quartiles = [
    byDensity.slice(0, qSize),
    byDensity.slice(qSize, qSize * 2),
    byDensity.slice(qSize * 2, qSize * 3),
    byDensity.slice(qSize * 3),
  ];
  const quartileStats = quartiles.map((g) => ({
    avgDensity: g.reduce((s, c) => s + c.populationDensity, 0) / g.length,
    avgAging: g.reduce((s, c) => s + c.agingRate, 0) / g.length,
  }));

  const topDensityQuartile = quartiles[3];
  const exceptions = [...topDensityQuartile]
    .sort((a, b) => b.agingRate - a.agingRate)
    .slice(0, 15);

  const minDensityInTopQuartile = Math.min(
    ...topDensityQuartile.map((c) => c.populationDensity)
  );

  const formerCoalCount = exceptions.filter((c) =>
    ["大牟田", "中間", "荒尾", "室蘭", "長洲"].some((k) =>
      c.name.includes(k)
    )
  ).length;

  const naraSuburbCount = exceptions.filter((c) =>
    c.name.startsWith("奈良県")
  ).length;

  return (
    <ArticleLayout
      title="人口密度と高齢化率の相関分析：相関係数-0.72、それでも「密集した高齢化都市」がある理由"
      summary={`全国${base.length.toLocaleString()}自治体のデータで人口密度(対数値)と高齢化率の相関係数を計算すると${r.toFixed(
        2
      )}と、強い負の相関が見られました。人口密度が高いほど高齢化率は低い傾向がある一方、旧産炭都市や高度成長期の郊外団地など、密度が高いのに高齢化も進んでいる自治体には明確な共通点がありました。`}
      heroLabel="人口密度(対数)×高齢化率 相関係数"
      heroValue={r.toFixed(2)}
      rankingLink="/ranking/density"
      tags={["population", "aging"]}
      publishedAt="2026-07-14"
      top3={[
        { rank: 1, name: exceptions[0].name, value: `高齢化率${exceptions[0].agingRate.toFixed(1)}%` },
        { rank: 2, name: exceptions[1].name, value: `高齢化率${exceptions[1].agingRate.toFixed(1)}%` },
        { rank: 3, name: exceptions[2].name, value: `高齢化率${exceptions[2].agingRate.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          人口密度が高い都市部は若く、密度が低い地方は高齢化が
          進んでいる——これは直感的にも理解しやすいイメージ
          ですが、実際のデータではどの程度はっきりした関係
          なのでしょうか。全国{base.length.toLocaleString()}
          自治体の人口密度(対数値)と高齢化率の相関係数を
          計算したところ、{r.toFixed(2)}
          という強い負の相関が確認できました。ただし、この
          全国的な傾向にあてはまらない「密度は高いのに高齢化も
          進んでいる」自治体が一定数存在し、そこには特有の
          歴史的背景があります。
        </p>
      </div>

      <div style={box}>
        <h2>人口密度が上がるほど高齢化率は下がる</h2>

        <RankingBarChart
          items={quartileStats.map((q, i) => ({
            name: `人口密度 第${i + 1}四分位(${
              i === 0 ? "低い方" : i === 3 ? "高い方" : "中間"
            })`,
            value: q.avgAging,
            displayValue: `${q.avgAging.toFixed(1)}%`,
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          全自治体を人口密度の低い順に4等分すると、最も密度が
          低いグループ(平均{quartileStats[0].avgDensity.toFixed(
            0
          )}
          人/km²)の平均高齢化率は
          {quartileStats[0].avgAging.toFixed(1)}
          %である一方、最も密度が高いグループ(平均
          {quartileStats[3].avgDensity.toFixed(0)}
          人/km²)では
          {quartileStats[3].avgAging.toFixed(1)}
          %まで下がり、密度が上がるほど高齢化率が一貫して
          低下する、きれいな右肩下がりの関係になっています。
        </p>
      </div>

      <div style={box}>
        <h2>なぜ人口密度と高齢化率は逆相関するのか</h2>

        <p>
          この関係の背景には、主に人口移動の方向性があります。
          進学や就職を機に地方から都市部へ移動するのは主に
          若い世代であり、都市部には大学・企業・商業施設が
          集積しているため、継続的に若年層の転入を集めやすい
          構造になっています。一方、密度が低い地方は、こうした
          転入超過が起きにくいうえに、もともと居住していた
          世代がそのまま高齢化していくため、高齢化率が上昇
          しやすくなります。社会増減率を扱った記事で見たとおり、
          人口密度が低い自治体ほど転出超過(社会減)が続きやすい
          傾向とも整合的な結果です。
        </p>
      </div>

      <div style={box}>
        <h2>それでも「密集した高齢化都市」TOP15</h2>

        <RankingBarChart
          items={exceptions.map((c) => ({
            name: c.name,
            value: c.agingRate,
            displayValue: `${c.agingRate.toFixed(1)}%`,
          }))}
          barColor="#d97706"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          このグラフは、人口密度が上位25%(
          {minDensityInTopQuartile.toLocaleString()}人/km²以上)
          に入る、都市的な自治体の中で、高齢化率が高い順に
          15自治体を並べたものです。全国的な相関から見れば
          「本来なら高齢化率が低いはずの」高密度エリアで
          ありながら、いずれも高齢化率30%台後半〜40%台
          という高い水準になっています。
        </p>
      </div>

      <div style={box}>
        <h2>例外を生む2つのパターン</h2>

        <p>
          TOP15の顔ぶれは、大きく2つのパターンに分かれます。
          1つ目は福岡県大牟田市・中間市・熊本県荒尾市・長洲町、
          北海道室蘭市といった、かつて炭鉱業や重工業で栄えた
          旧産炭・旧工業都市です。{formerCoalCount}
          自治体がこのパターンに該当します。高度経済成長期
          には多くの労働者とその家族が密集して暮らして
          いましたが、炭鉱閉山や工場縮小以降は新たな若年層の
          転入がほとんどなくなり、当時のまま住み続けた住民が
          高齢化する一方で、住宅密度自体は当時の水準を保って
          いるため、「高密度・高高齢化」という組み合わせに
          なっています。
        </p>

        <p>
          2つ目は奈良県河合町・三宅町・上牧町といった、
          大阪都市圏に隣接する奈良県北西部の郊外住宅地です。
          TOP15のうち{naraSuburbCount}
          自治体を占めています。これらは1960〜70年代の
          高度経済成長期に、大阪への通勤圏として大規模な
          宅地開発が行われた地域で、当時働き盛りだった
          住民がほぼ一斉に入居し、現在はその世代がまとめて
          高齢化する「ニュータウンの高齢化」問題に直面して
          います。少子高齢化ギャップ分析の記事で取り上げた、
          子育て世代を集める新興住宅地も、開発から数十年後には
          同じ状況になり得ることを示す実例です。
        </p>

        <p>
          このほか、神奈川県真鶴町・三浦市のような漁業・
          観光を基盤とする沿岸の町、香川県琴平町のような
          歴史ある門前町も、住宅が密集した市街地を持ちながら
          高齢化が進んでいるという意味で、例外リストに
          含まれています。
        </p>
      </div>

      <div style={box}>
        <h2>過去の人口集積が今の高齢化を左右する</h2>

        <p>
          旧産炭都市と郊外ニュータウンには、一見すると
          共通点がないように見えますが、どちらも「特定の
          短い期間に、特定の目的(炭鉱労働、都市への通勤)
          のために、大量の人口が一度に流入した」という
          歴史を持っています。人口が一度に流入すると、
          住宅や インフラもその時期に集中して整備される
          ため、結果として人口密度は高いまま維持されます。
          しかし、その流入した世代が引退・高齢化した後、
          同じ理由(炭鉱の存続、通勤圏としての魅力)が
          失われれば、次の世代の流入は起こりにくくなります。
          人口密度という「量」の指標は、こうした過去の
          一括流入の記憶を長く残し続ける一方、高齢化率
          という「質」の指標は、その記憶がいつ形成された
          ものかを映し出していると言えるでしょう。
        </p>

        <p>
          逆に言えば、現在進行形で人口が密集しつつある
          地域(例えば都心のタワーマンション街区や、
          企業誘致が進む地方都市の新興住宅地)も、数十年後
          には同じように高齢化率だけが上昇していく可能性が
          あります。人口密度の高さを「若さの証拠」と単純に
          解釈するのではなく、その密度がいつ、どのような
          経緯で形成されたのかを合わせて考えることが重要
          です。
        </p>
      </div>

      <div style={box}>
        <h2>人口密度だけでは将来は測れない</h2>

        <p>
          この分析から分かるのは、人口密度の高さは必ずしも
          「若さ」を保証しないということです。旧産炭都市や
          高度成長期の郊外住宅地は、かつて若い世代が密集して
          移り住んだからこそ今の密度がありますが、その世代が
          一斉に高齢化した後、次の世代の転入が続かなければ、
          高密度のまま高齢化率だけが上昇していきます。
          人口密度ランキング分析や社会増減率の記事とあわせて
          見ることで、単に「今の密度」だけでなく、その密度が
          どの世代によって形成されたのかという視点が重要
          であることが分かります。
        </p>

        <p>
          <Link href="/ranking/density" style={link}>
            人口密度ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/density-analysis" style={link}>
            人口密度ランキング分析を見る
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
          相関係数の計算には、人口密度の分布が広範囲(数人/km²
          から1万人/km²超まで)にわたるため、対数変換した
          値を用いています。単純な実数のままで相関を取ると
          相関係数は{"-0.48"}
          程度まで弱まりますが、これは少数の超高密度な
          大都市が数値を押し下げているためで、大半の自治体が
          分布する範囲では対数変換した方が実態に近い関係性を
          捉えられます。また、四分位グループの平均値はあくまで
          全体傾向であり、同じグループ内でも自治体ごとの差は
          小さくありません。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          人口密度と高齢化率には、対数変換した値で見ると
          相関係数{r.toFixed(2)}
          という強い負の相関があり、人口密度が高い自治体ほど
          高齢化率が低い傾向は統計的にも裏付けられました。
          一方で、旧産炭・旧工業都市や高度成長期の郊外住宅地
          のように、過去に一時的な人口集積があった地域では、
          住宅密度は高いまま高齢化だけが進むという、時間差の
          ある例外パターンが存在します。人口密度は「今の姿」
          を映す指標であると同時に、その地域がいつ、どの世代に
          よって形作られたかという歴史も映し出していると
          言えるでしょう。
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
