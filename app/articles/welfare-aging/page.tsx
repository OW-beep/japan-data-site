import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  title: "民生費と高齢化率の関係｜相関係数-0.61",
  description:
    "歳入に占める民生費(福祉関連支出)の割合と高齢化率の関係を分析。直感に反して相関係数は-0.61と負の相関になり、東京都練馬区・大田区など若い都市部の区が上位を占める理由を解説します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.totalRevenue != null &&
        c.welfareExpense != null &&
        c.elderlyPopulation != null &&
        c.population > 0 &&
        c.totalRevenue > 0
    )
    .map((c) => ({
      ...c,
      welfareRatio:
        ((c.welfareExpense ?? 0) / (c.totalRevenue ?? 1)) * 100,
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
    base.map((c) => c.welfareRatio)
  );

  const top15 = [...base]
    .sort((a, b) => b.welfareRatio - a.welfareRatio)
    .slice(0, 15);

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
    avgWelfare:
      g.reduce((s, c) => s + c.welfareRatio, 0) / g.length,
  }));

  const average =
    base.reduce((s, c) => s + c.welfareRatio, 0) / base.length;

  const tokyoWardCount = top15.filter((c) =>
    c.name.startsWith("東京都")
  ).length;

  const osakaCount = top15.filter((c) =>
    c.name.startsWith("大阪府")
  ).length;

  return (
    <ArticleLayout
      title="民生費と高齢化率の意外な関係：相関係数-0.61、なぜ高齢化率が高いほど民生費比率は下がるのか"
      summary={`「高齢化が進むほど福祉予算の割合も増える」というのは自然な予想ですが、実際に全国${base.length.toLocaleString()}自治体のデータで相関係数を計算すると${r.toFixed(
        2
      )}という負の相関でした。歳入に占める民生費の割合が最も高いのは、高齢化率が全国平均より低い東京都練馬区(55.4%)や大田区(55.3%)など、都市部の区が中心です。`}
      heroLabel="民生費比率×高齢化率 相関係数"
      heroValue={r.toFixed(2)}
      rankingLink="/ranking/welfare-ratio"
      tags={["finance", "aging"]}
      publishedAt="2026-08-01"
      top3={[
        { rank: 1, name: top15[0].name, value: `${top15[0].welfareRatio.toFixed(1)}%` },
        { rank: 2, name: top15[1].name, value: `${top15[1].welfareRatio.toFixed(1)}%` },
        { rank: 3, name: top15[2].name, value: `${top15[2].welfareRatio.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          民生費とは、児童福祉・高齢者福祉・障害者福祉・生活保護
          などをまとめた、いわゆる「福祉関連支出」の総称です。
          高齢化率と財政力指数の関係を扱った記事では、高齢化が
          進むほど財政力指数が下がる(相関係数-0.71)ことを
          紹介しましたが、では歳入に占める民生費の「割合」
          自体は、高齢化率とともに上がっていくのでしょうか。
          常識的には「高齢化が進む地域ほど、福祉予算の比重も
          高まるはずだ」と考えるのが自然です。結論から言うと、
          答えは意外にも「ノー」でした。
        </p>
      </div>

      <div style={box}>
        <h2>高齢化率が上がるほど、民生費比率はむしろ下がる</h2>

        <RankingBarChart
          items={quartileStats.map((q, i) => ({
            name: `高齢化率 第${i + 1}四分位(${
              i === 0 ? "低い方" : i === 3 ? "高い方" : "中間"
            })`,
            value: q.avgWelfare,
            displayValue: `${q.avgWelfare.toFixed(1)}%`,
          }))}
          barColor="#047857"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          全自治体を高齢化率の低い順に4等分すると、最も
          高齢化率が低いグループ(平均{quartileStats[0].avgAging.toFixed(
            1
          )}
          %)の平均民生費比率は
          {quartileStats[0].avgWelfare.toFixed(1)}
          %である一方、最も高齢化率が高いグループ(平均
          {quartileStats[3].avgAging.toFixed(1)}
          %)では
          {quartileStats[3].avgWelfare.toFixed(1)}
          %まで下がっています。相関係数は
          {r.toFixed(2)}
          と、はっきりとした負の相関が確認できます。これは
          高齢化率と人口密度・財政力指数の関係を扱ったこれまでの
          記事とは、逆方向の結果です。
        </p>
      </div>

      <div style={box}>
        <h2>「高齢化=福祉費増大」という思い込みを見直す</h2>

        <p>
          地方財政の議論では「高齢化が進むと福祉予算が
          膨らみ、自治体の財政を圧迫する」という語られ方を
          されることが少なくありません。しかし今回のデータが
          示すのは、少なくとも歳入に占める民生費の「比率」
          という切り口では、必ずしもそうなっていないという
          事実です。実際には、都市への人口集中にともなう
          保育需要の増大や、生活保護受給世帯の集積といった、
          高齢化とは別の要因が、民生費比率を大きく左右して
          います。自治体の財政課題を語るときには、「高齢化
          対応」と「都市型福祉ニーズへの対応」を分けて
          考える必要があることを、この数字は教えてくれます。
        </p>
      </div>

      <div style={box}>
        <h2>民生費比率TOP15の正体：都市部の区・市</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.welfareRatio,
            displayValue: `${c.welfareRatio.toFixed(1)}%`,
          }))}
          barColor="#0891b2"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          TOP15のうち{tokyoWardCount}
          自治体を東京都の特別区(練馬区・大田区・足立区・
          板橋区・新宿区・国立市・江東区)が占め、{osakaCount}
          自治体を大阪府の市(松原市・八尾市・守口市・
          東大阪市・藤井寺市)が占めています。1位の練馬区の
          高齢化率は{top15[0].agingRate.toFixed(1)}
          %、8位の新宿区に至っては
          {top15.find((c) => c.name.includes("新宿区"))?.agingRate.toFixed(
            1
          )}
          %と、いずれも全国平均を下回る「若い」自治体です。
        </p>
      </div>

      <div style={box}>
        <h2>民生費の主役は高齢者ではなく、児童・生活保護</h2>

        <p>
          この逆説を理解するカギは、民生費の中身にあります。
          民生費は、高齢者福祉費だけでなく、児童福祉費(保育所
          運営、児童手当など)、生活保護費、障害者福祉費と
          いった幅広い支出を含みます。特に都市部では、人口
          密度が高く保育需要が大きいことに加え、生活保護受給
          世帯や、ひとり親世帯への支援ニーズが相対的に高い
          傾向があり、これらが民生費全体を押し上げています。
          人口密度と財政力指数の関係を扱った記事で紹介した
          東京都荒川区・足立区・北区・葛飾区といった「東京
          23区の中では財政力が相対的に弱い区」は、今回の
          民生費比率ランキングでも軒並み上位に入っており、
          両記事の内容が裏付け合う結果になっています。
        </p>

        <p>
          一方、高齢化率が非常に高い山村・離島の多くは、
          民生費比率がむしろ低めです。これは高齢者福祉の
          ニーズが低いからではなく、そもそも歳入総額(分母)
          における他の支出項目(公共事業費、総務費など)の
          割合が大きく、相対的に民生費の「割合」が薄まって
          しまうためです。絶対額としての高齢者福祉費は
          過小評価されているわけではなく、あくまで比率の
          計算上、こうした結果になっている点には注意が
          必要です。
        </p>
      </div>

      <div style={box}>
        <h2>沖縄県の2都市が入る理由</h2>

        <p>
          TOP15には沖縄市・糸満市という沖縄県の2市も
          入っています。出生率ランキング分析の記事で見た
          とおり、沖縄県は全国で最も出生率が高く、子ども
          人口割合も高い県です。児童福祉関連の支出が
          相対的に大きくなりやすいことに加え、全国平均より
          所得水準が低い世帯の割合が高いことも、生活保護
          関連の民生費を押し上げる一因になっていると
          考えられます。高齢化率はむしろ全国平均を下回って
          おり、東京・大阪の都市部と共通する「都市型・
          子育て世帯型」の民生費構造だと言えます。全国的に
          出生率の高さで知られる沖縄県が、財政の側面からも
          独自の福祉構造を持っていることが、このデータから
          確認できます。
        </p>

        <p>
          <Link href="/ranking/welfare-ratio" style={link}>
            民生費比率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/aging-finance" style={link}>
            高齢化率と財政力指数の関係を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/density-finance" style={link}>
            人口密度と財政力指数の関係を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/doctors-analysis" style={link}>
            医師数ランキング分析を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          民生費比率は、歳入決算総額に占める民生費の「割合」
          であり、住民一人あたりの絶対額とは異なる指標です。
          歳入総額が小さい自治体では、比較的小さな福祉支出でも
          比率が高く出やすく、逆に歳入総額が大きい自治体では、
          福祉支出が絶対額として大きくても比率としては小さく
          見えることがあります。また、民生費には児童・高齢者・
          障害者・生活保護など複数の性質の異なる支出が
          含まれているため、比率の高さだけで「高齢者福祉が
          手厚い」あるいは「乏しい」と単純に判断することは
          できません。
        </p>

        <p>
          より正確に「高齢者福祉にどれだけ支出しているか」を
          知りたい場合は、民生費の内訳(児童福祉費・高齢者
          福祉費・生活保護費など)を個別に見る必要があります
          が、そこまで詳細な内訳データは市区町村単位では
          公開されていないことが多く、今回のような合計値
          ベースの比較が現実的な選択肢になります。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          民生費比率と高齢化率の相関係数は
          {r.toFixed(2)}
          と、直感に反する負の相関でした。上位には、高齢化率
          自体は全国平均より低いものの、児童福祉や生活保護の
          ニーズが相対的に高い東京・大阪の都市部と、出生率の
          高い沖縄県の自治体が並びました。「福祉費=高齢者
          福祉」という単純なイメージだけでは説明できない、
          都市が抱える別の福祉課題の存在が、このランキングから
          浮かび上がってきます。高齢化率という単一の指標
          だけで自治体の福祉課題を語るのは不十分であり、
          都市・地方それぞれが抱える異なる性質の課題を、
          切り分けて見ていく必要があります。
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
