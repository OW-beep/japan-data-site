import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import RakutenGifts from "@/components/RakutenGifts";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/daycare-birthrate-analysis" },
  title:
    "保育園の数と出生率の関係｜「増やせば出生率が上がる」は本当か",
  description:
    "人口1万人あたり保育園数と出生率(合計特殊出生率)を全自治体で突き合わせて検証。相関係数は0.33で緩やかな正の相関はあるものの、世田谷区・渋谷区など保育園は多いのに出生率が低い都市部の例も目立ちます。",
};

function corr(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  const cov = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const sx = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0));
  const sy = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0));
  return cov / (sx * sy);
}

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.population >= 10000 &&
        c.daycareCount != null &&
        c.birthRate != null
    )
    .map((c) => ({
      ...c,
      per10k: ((c.daycareCount ?? 0) / c.population) * 10000,
    }));

  const correlation = corr(
    base.map((c) => c.per10k),
    base.map((c) => c.birthRate ?? 0)
  );

  const ranking = [...base].sort((a, b) => b.per10k - a.per10k).slice(0, 15);
  const zero = base.filter((c) => (c.daycareCount ?? 0) === 0);
  const average = base.reduce((s, c) => s + c.per10k, 0) / base.length;
  const avgBirthRate =
    base.reduce((s, c) => s + (c.birthRate ?? 0), 0) / base.length;

  const urbanExamples = ["東京都 世田谷区", "東京都 渋谷区", "大阪府 大阪市"]
    .map((name) => base.find((c) => c.name === name))
    .filter((c): c is (typeof base)[number] => !!c);

  const faq = [
    {
      q: "保育園の数と出生率には関係がありますか？",
      a: `人口1万人あたり保育園数と出生率の相関係数は${correlation.toFixed(
        2
      )}で、緩やかな正の相関が見られます。ただし相関はそれほど強くなく、保育園を増やせば出生率が上がると単純に言い切れる強さではありません。`,
    },
    {
      q: "保育園密度が全国1位の自治体はどこですか？",
      a: `${ranking[0].name}で、人口1万人あたり${ranking[0].per10k.toFixed(
        2
      )}園です。全国平均は${average.toFixed(2)}園でした。`,
    },
    {
      q: "保育園が1つもない自治体はありますか？",
      a: `本サイトが対象とする人口1万人以上の自治体${base.length}のうち、${zero.length}自治体で登録上の保育園数がゼロでした。人口1万人未満の小規模自治体まで含めると、さらに多くなります。`,
    },
  ];

  return (
    <ArticleLayout
      title="保育園の数と出生率の関係｜「増やせば出生率が上がる」は本当か"
      summary={`人口1万人あたり保育園数と出生率(合計特殊出生率)の相関係数は${correlation.toFixed(
        2
      )}。緩やかな正の相関はあるものの、東京都世田谷区・渋谷区のように保育園は多いのに出生率が低い都市部も目立ち、「保育園を増やせば出生率が上がる」とは単純に言えない結果になりました。`}
      heroLabel="人口1万人あたり保育園数 全国1位"
      heroValue={`${ranking[0].name.split(" ")[1]} ${ranking[0].per10k.toFixed(
        2
      )}園`}
      rankingLink="/ranking/daycare"
      path="/articles/daycare-birthrate-analysis"
      tags={["child"]}
      publishedAt="2026-09-23"
      top3={ranking.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `${c.per10k.toFixed(2)}園`,
      }))}
    >
      <div style={box}>
        <p style={lead}>
          「保育園を増やせば少子化は改善するのか」は、子育て政策でよく
          語られる仮説です。本サイトが持つ市区町村別の保育園数と出生率
          (合計特殊出生率)のデータを人口1万人以上の
          {base.length.toLocaleString()}自治体で突き合わせ、実際にどの
          程度の関係があるのかを検証しました。
        </p>
      </div>

      <div style={box}>
        <h2>人口1万人あたり保育園数 TOP15</h2>

        <p>
          1位は{ranking[0].name}({ranking[0].per10k.toFixed(2)}園)。
          上位には{ranking[1].name}や{ranking[2].name}など、人口1〜5万人
          規模の地方の町が並びます。大都市の行政区は保育園の絶対数こそ
          多いものの、人口も多いため、人口あたりで見ると上位には入り
          にくい傾向があります。
        </p>

        <RankingBarChart
          items={ranking.map((c) => ({
            name: c.name.split(" ")[1] ?? c.name,
            value: c.per10k,
            displayValue: `${c.per10k.toFixed(2)}園`,
          }))}
          barColor="#be185d"
        />
      </div>

      <div style={box}>
        <h2>相関係数{correlation.toFixed(2)} ── 緩やかな正の相関</h2>

        <p>
          保育園密度と出生率の相関係数は{correlation.toFixed(2)}でした。
          正の相関ではあるものの強い関係ではなく、「保育園が多い自治体
          ほど出生率が高い傾向はあるが、それだけで説明できるわけでは
          ない」という、やや慎重な結論になります。全自治体平均の保育園
          密度は{average.toFixed(2)}園、平均出生率は
          {avgBirthRate.toFixed(2)}でした。
        </p>

        <div className="pull-note">
          保育園がゼロの自治体は{zero.length}(人口1万人以上のみ集計)
          ある一方、出生率がゼロの自治体と完全に一致するわけではありま
          せん。保育園の有無だけでなく、産科医療機関へのアクセスや
          地域の年齢構成など、他の要因も出生率に影響していると考えら
          れます。
        </div>
      </div>

      <div style={box}>
        <h2>都市部の逆説 ── 保育園は多いのに出生率は低い</h2>

        <p>
          相関を弱めている典型例が、東京都心部の行政区です。
          {urbanExamples.map((c, i) => (
            <span key={c.code}>
              {i > 0 && "、"}
              {c.name}(人口1万人あたり{c.per10k.toFixed(2)}園・出生率
              {c.birthRate?.toFixed(2)})
            </span>
          ))}
          は、保育園密度としては全国平均を上回るか同水準にあるにも
          かかわらず、出生率は全国平均を大きく下回ります。保育園の数
          だけでなく、住宅価格や共働き世帯の労働時間といった、データに
          表れにくい要因が都市部の出生率を押し下げていると考えられ
          ます。
        </p>

        <p>
          逆に上位に入る地方の町の多くは、人口規模が小さいために保育園
          1つあたりがカバーする人口も小さく、結果として人口あたりの
          保育園数が押し上げられている面があります。単純な「施設数の
          比較」には、こうした人口規模による偏りが含まれる点には注意が
          必要です。
        </p>
      </div>

      <RakutenGifts
        keyword="出産準備 ベビー用品 セット"
        heading="出産・育児の準備に人気の商品を楽天市場で見る"
      />

      <div style={box}>
        <h2>Q&amp;A：保育園数と出生率についてよくある質問</h2>

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
          保育園密度と出生率には相関係数{correlation.toFixed(
            2
          )}の緩やかな正の相関が見られましたが、東京都心部のように
          保育園が多くても出生率が低い地域があることから、「保育園を
          増やせば出生率が上がる」と単純に言い切ることはできません。
          出生率には、住宅費・働き方・地域の年齢構成など、保育園の
          数だけでは捉えきれない複数の要因が絡んでいると考えるのが
          妥当です。
        </p>

        <p>
          <Link prefetch={false} href="/articles/birth-rate" style={link}>
            出生率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/daycare-access" style={link}>
            保育園あたり子ども人口ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link
            prefetch={false}
            href="/articles/young-family-attractiveness-index"
            style={link}
          >
            子育て世代吸引力指数を見る
          </Link>
        </p>

        <p
          style={{
            fontSize: 13,
            color: "var(--muted, #6b7280)",
            marginTop: 16,
          }}
        >
          出典：本サイト集計(市区町村別保育園数・出生率データ)。対象は
          人口1万人以上の{base.length.toLocaleString()}自治体。
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
