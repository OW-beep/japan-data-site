import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  title: "人口密度と財政力指数の関係｜相関係数0.73",
  description:
    "人口密度と財政力指数の相関係数は0.73と強い正の相関。しかし青森県六ヶ所村や北海道泊村など、人口密度が極めて低いのに財政力指数が1を超える自治体には、原子力発電関連施設という共通点がありました。",
};

export default function Page() {
  const base = getMunicipalities().filter(
    (c) => c.populationDensity != null && c.financeIndex != null
  );

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
    base.map((c) => Math.log10((c.populationDensity ?? 0) + 1)),
    base.map((c) => c.financeIndex ?? 0)
  );

  const byDensity = [...base].sort(
    (a, b) => (a.populationDensity ?? 0) - (b.populationDensity ?? 0)
  );
  const qSize = Math.floor(byDensity.length / 4);
  const quartiles = [
    byDensity.slice(0, qSize),
    byDensity.slice(qSize, qSize * 2),
    byDensity.slice(qSize * 2, qSize * 3),
    byDensity.slice(qSize * 3),
  ];
  const quartileStats = quartiles.map((g) => ({
    avgDensity: g.reduce((s, c) => s + (c.populationDensity ?? 0), 0) / g.length,
    avgFinance: g.reduce((s, c) => s + (c.financeIndex ?? 0), 0) / g.length,
  }));

  const lowDensityQuartile = quartiles[0];
  const exceptions = [...lowDensityQuartile]
    .sort((a, b) => (b.financeIndex ?? 0) - (a.financeIndex ?? 0))
    .slice(0, 15);

  const maxDensityInBottomQuartile = Math.max(
    ...lowDensityQuartile.map((c) => c.populationDensity ?? 0)
  );

  const nuclearRelated = ["六ヶ所村", "泊村", "大熊町", "おおい町", "富岡町", "楢葉町", "東通村"];
  const nuclearCount = exceptions.filter((c) =>
    nuclearRelated.some((k) => c.name.includes(k))
  ).length;

  return (
    <ArticleLayout
      title="人口密度と財政力指数の関係：相関係数0.73、それでも過疎地なのに財政が豊かな自治体がある理由"
      summary={`全国${base.length.toLocaleString()}自治体のデータで人口密度(対数値)と財政力指数の相関係数を計算すると${r.toFixed(
        2
      )}と強い正の相関が見られました。人口密度が高い都市部ほど財政力が強い傾向がある一方、青森県六ヶ所村や北海道泊村のように、人口密度が極めて低いのに財政力指数が1を超える自治体には、共通した産業基盤がありました。`}
      heroLabel="人口密度(対数)×財政力指数 相関係数"
      heroValue={r.toFixed(2)}
      rankingLink="/ranking/finance"
      tags={["population", "finance"]}
      publishedAt="2026-07-25"
      top3={[
        { rank: 1, name: exceptions[0].name, value: `財政力${(exceptions[0].financeIndex ?? 0).toFixed(2)}` },
        { rank: 2, name: exceptions[1].name, value: `財政力${(exceptions[1].financeIndex ?? 0).toFixed(2)}` },
        { rank: 3, name: exceptions[2].name, value: `財政力${(exceptions[2].financeIndex ?? 0).toFixed(2)}` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          財政力指数ランキング分析の記事では人口規模と財政力の
          関係を扱いましたが、今回は「人口密度」という
          もう1つの物差しで財政力との関係を見てみます。全国
          {base.length.toLocaleString()}
          自治体のデータで人口密度(対数値)と財政力指数の
          相関係数を計算すると、{r.toFixed(2)}
          という強い正の相関が確認できました。ところが、
          人口密度が極めて低い過疎地域の中に、財政力指数が
          1を超える、都市部顔負けの「豊かな」自治体が
          いくつも存在します。
        </p>
      </div>

      <div style={box}>
        <h2>人口密度が上がるほど財政力指数も上がる</h2>

        <RankingBarChart
          items={quartileStats.map((q, i) => ({
            name: `人口密度 第${i + 1}四分位(${
              i === 0 ? "低い方" : i === 3 ? "高い方" : "中間"
            })`,
            value: q.avgFinance,
            displayValue: q.avgFinance.toFixed(3),
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          全自治体を人口密度の低い順に4等分すると、最も密度が
          低いグループ(平均{quartileStats[0].avgDensity.toFixed(
            0
          )}
          人/km²)の平均財政力指数は
          {quartileStats[0].avgFinance.toFixed(3)}
          である一方、最も密度が高いグループ(平均
          {quartileStats[3].avgDensity.toFixed(0)}
          人/km²)では
          {quartileStats[3].avgFinance.toFixed(3)}
          まで上昇しており、人口が集積する都市ほど税収基盤が
          豊かになるという、経済学でいう「集積の経済」を
          裏付ける結果になっています。
        </p>
      </div>

      <div style={box}>
        <h2>過疎地なのに財政が豊かな自治体TOP15</h2>

        <RankingBarChart
          items={exceptions.map((c) => ({
            name: c.name,
            value: c.financeIndex ?? 0,
            displayValue: (c.financeIndex ?? 0).toFixed(2),
          }))}
          barColor="#d97706"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          このグラフは、人口密度が下位25%(
          {maxDensityInBottomQuartile}
          人/km²以下)に入る過疎的な自治体の中で、財政力指数
          が高い順に15自治体を並べたものです。1位の
          {exceptions[0].name}
          は財政力指数
          {(exceptions[0].financeIndex ?? 0).toFixed(2)}
          と、東京23区の平均を大きく上回る水準にあります。
        </p>
      </div>

      <div style={box}>
        <h2>例外の正体は原子力関連施設</h2>

        <p>
          TOP15の顔ぶれを見ると、青森県六ヶ所村(使用済み
          核燃料の再処理施設)、北海道泊村(泊発電所)、福島県
          大熊町・富岡町・楢葉町(福島第一・第二原子力発電所)、
          福井県おおい町(大飯発電所)、青森県東通村(東通
          原子力発電所)など、{nuclearCount}
          自治体が原子力発電関連施設の立地自治体です。
          高齢化率と財政力指数の関係を扱った記事でも触れた
          とおり、原子力施設は固定資産税収入と電源立地地域
          対策交付金という2つの経路で、人口規模とは無関係に
          財政力指数を大きく押し上げます。人口密度で見ても、
          この構造がはっきりと表れる結果になりました。
        </p>

        <p>
          残りの顔ぶれは、新潟県湯沢町(スキーリゾート・
          別荘地としての固定資産税収入)、群馬県上野村
          (林業・製造業を中心とした独自の産業基盤)、神奈川県
          清川村・山北町(工場立地や別荘地)など、観光・
          製造業を基盤とする自治体です。いずれも人口自体は
          少ないものの、地域外から資金が流入する産業を
          持っている点で共通しています。
        </p>
      </div>

      <div style={box}>
        <h2>「密度と財政力」から見える2つの豊かさ</h2>

        <p>
          今回の分析から、自治体の財政的な豊かさには大きく
          2つの経路があることが見えてきます。1つは都市部の
          ように、多くの企業・住民が密集することで税収基盤
          そのものが大きくなる「集積型」の豊かさです。もう
          1つは、原子力施設や大規模工場のように、たとえ
          人口が少なくても、単一の大規模な固定資産・産業が
          立地することで税収が生まれる「拠点型」の豊かさ
          です。人口密度という指標は、前者の「集積型」の
          豊かさとは強く連動しますが、後者の「拠点型」の
          豊かさとはまったく連動しません。全国の自治体の
          財政力を理解するには、この2つの経路を区別して
          考える必要があります。
        </p>

        <p>
          なお、「拠点型」の豊かさは、その拠点となる産業や
          施設が失われた場合に急激に縮小するリスクを
          伴います。実際、かつて炭鉱で栄えた旧産炭都市の
          多くは、閉山後に財政力指数が大きく低下した歴史が
          あります。人口密度と高齢化率の関係を扱った記事で
          取り上げた旧産炭都市が、今回の分析ではむしろ
          「密度は高いが財政力は平均的」という位置づけに
          とどまっているのは、まさにこの縮小を経た結果だと
          考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>逆に「密集しているのに財政が弱い」自治体もある</h2>

        <p>
          今回の分析とは逆に、人口密度が高いにもかかわらず
          財政力指数が低い自治体も存在します。代表的なのが
          東京都荒川区・足立区・北区・葛飾区で、東京23区の
          中では人口密度が高い一方、財政力指数は他の区に
          比べて低い水準にあります。同じ東京23区でも、
          企業の本社機能が集積する千代田区・港区・渋谷区
          などと比べると、住宅地としての性格が強い区では
          税収基盤に差が生じることを示しています。人口密度
          という「量」だけでは、その地域の財政的な豊かさを
          正確に測ることはできません。
        </p>
      </div>

      <div style={box}>
        <h2>2つの記事から見える財政力指数の本質</h2>

        <p>
          高齢化率と財政力指数の関係を扱った記事、そして
          今回の人口密度と財政力指数の関係を扱った記事、
          どちらでも同じ顔ぶれの原子力・エネルギー関連
          施設立地自治体が「例外」として登場しました。これは
          偶然ではなく、財政力指数を決めているのが人口の
          年齢構成でも密度でもなく、その地域にどれだけの
          固定資産・産業基盤があるかという、もっと直接的な
          要因であることを示しています。人口統計だけを
          見て自治体の財政状況を推測するのではなく、その
          地域にどのような産業・施設が立地しているかを
          あわせて確認することが欠かせません。
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
          <Link href="/articles/aging-finance" style={link}>
            高齢化率と財政力指数の関係を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          今回の相関係数の計算には、人口密度の分布が極めて
          広範囲にわたるため、対数変換した値を用いています。
          また、原子力関連施設が立地する自治体の財政力指数の
          高さは、施設の稼働状況や将来の廃炉、電源立地地域
          対策交付金制度の見直しなどによって、今後大きく
          変動する可能性がある点にも留意が必要です。財政力
          指数はあくまで現時点のスナップショットであり、
          その持続性まで保証するものではありません。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          人口密度と財政力指数には、対数変換した値で見ると
          相関係数{r.toFixed(2)}
          という強い正の相関があり、人口が集積する都市ほど
          財政基盤が豊かになる傾向は統計的にも裏付けられ
          ました。一方で、原子力関連施設や観光・製造業と
          いった特定の産業基盤を持つ過疎地域は、人口密度が
          極めて低いにもかかわらず、都市部を上回る財政力を
          持つ例外として存在します。人口密度・高齢化率
          いずれの角度から見ても、財政力指数の高さを最終的に
          決めているのは、その地域の産業構造だという結論に
          たどり着きます。
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
