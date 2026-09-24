import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import RakutenGifts from "@/components/RakutenGifts";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/library-child-ratio-analysis" },
  title: "図書館の充実度と子供の割合に関係はあるか｜人口10万人以上の都市で検証",
  description:
    "図書館1館あたりの人口(図書館の充実度)と、15歳未満人口の割合を人口10万人以上の都市で突き合わせて検証。相関係数は0.06とほぼ無関係でしたが、千葉県印西市は図書館アクセス・子供の割合ともに好成績という数少ない例外でした。",
};

function corr(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  const cov = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const sx = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0));
  const sy = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0));
  return sx * sy ? cov / (sx * sy) : 0;
}

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.population >= 100000 &&
        c.libraryCount != null &&
        c.libraryCount > 0 &&
        c.childPopulation
    )
    .map((c) => ({
      ...c,
      popPerLibrary: c.population / (c.libraryCount ?? 1),
      childRatio: (c.childPopulation ?? 0) / c.population * 100,
    }));

  const correlation = corr(
    base.map((c) => c.popPerLibrary),
    base.map((c) => c.childRatio)
  );

  const ranking = [...base].sort((a, b) => a.popPerLibrary - b.popPerLibrary).slice(0, 15);
  const avgChildRatio = base.reduce((s, c) => s + c.childRatio, 0) / base.length;

  // 図書館アクセスが良く(上位30%)、かつ子供の割合も平均より高い自治体
  const sortedByAccess = [...base].sort((a, b) => a.popPerLibrary - b.popPerLibrary);
  const goodAccess = sortedByAccess.slice(0, Math.floor(sortedByAccess.length * 0.3));
  const bothGood = goodAccess
    .filter((c) => c.childRatio > avgChildRatio)
    .sort((a, b) => b.childRatio - a.childRatio);
  const standout = bothGood[0];

  const faq = [
    {
      q: "図書館が充実している都市ほど子供の割合は高いですか？",
      a: `人口10万人以上の${base.length}都市で相関係数を計算したところ${correlation.toFixed(
        2
      )}となり、ほぼ無関係という結果でした。図書館の充実度だけで子育て世帯の多さを説明することはできません。`,
    },
    {
      q: "図書館アクセスが全国で一番良い都市はどこですか？",
      a: `${ranking[0].name}で、図書館1館あたりの人口は約${Math.round(
        ranking[0].popPerLibrary
      ).toLocaleString()}人です。`,
    },
    {
      q: "図書館アクセスと子供の割合が両方とも良い都市はありますか？",
      a: standout
        ? `${standout.name}が代表例です。図書館1館あたり人口は約${Math.round(
            standout.popPerLibrary
          ).toLocaleString()}人と上位30%に入りながら、15歳未満人口の割合も${standout.childRatio.toFixed(
            1
          )}%と平均(${avgChildRatio.toFixed(1)}%)を上回っています。`
        : "際立った該当例は見つかりませんでした。",
    },
  ];

  return (
    <ArticleLayout
      title="図書館の充実度と子供の割合に関係はあるか｜人口10万人以上の都市で検証"
      summary={`図書館1館あたりの人口と15歳未満人口の割合を、人口10万人以上の${base.length}都市で突き合わせると、相関係数は${correlation.toFixed(
        2
      )}でほぼ無関係でした。数少ない例外が${standout?.name ?? ""}で、図書館アクセス・子供の割合の両方で好成績です。`}
      heroLabel="図書館アクセス 全国1位"
      heroValue={`${ranking[0].name.split(" ")[1] ?? ranking[0].name} 1館あたり約${Math.round(
        ranking[0].popPerLibrary / 1000
      )}千人`}
      rankingLink="/ranking/library"
      path="/articles/library-child-ratio-analysis"
      tags={["child"]}
      publishedAt="2026-09-24"
      top3={ranking.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `1館あたり${Math.round(c.popPerLibrary).toLocaleString()}人`,
      }))}
    >
      <div style={box}>
        <p style={lead}>
          「図書館が充実している街は、子育て世帯にも選ばれやすいのでは」
          という仮説を検証します。本サイトの図書館数ランキングで使って
          いる「図書館1館あたりの人口(数字が小さいほどアクセスが良い)」
          と、15歳未満人口の割合を、人口10万人以上の{base.length}都市で
          突き合わせました。
        </p>
      </div>

      <div style={box}>
        <h2>図書館アクセスTOP15</h2>

        <p>
          1位は{ranking[0].name}で、図書館1館あたりの人口は約
          {Math.round(ranking[0].popPerLibrary).toLocaleString()}人。
          上位には人口10万〜15万人規模の中核市クラスが多く並び、
          必ずしも大都市ほど図書館アクセスが良いわけではありません。
        </p>

        <RankingBarChart
          items={ranking.map((c) => ({
            name: c.name.split(" ")[1] ?? c.name,
            value: Math.round(c.popPerLibrary),
            displayValue: `${Math.round(c.popPerLibrary).toLocaleString()}人`,
          }))}
          barColor="#0891b2"
        />
      </div>

      <div style={box}>
        <h2>相関係数{correlation.toFixed(2)} ── ほぼ無関係</h2>

        <p>
          図書館アクセスの良さと子供の割合の相関係数は
          {correlation.toFixed(2)}でした。これは統計的にはほぼ無相関と
          言ってよい水準です。図書館は子育て世帯にとって嬉しい施設では
          あるものの、「図書館が多いから子育て世帯が集まる」というほど
          単純な関係は、データ上は確認できませんでした。人口10万人以上
          の都市全体の子供の割合平均は{avgChildRatio.toFixed(1)}%でした。
        </p>

        {standout && (
          <div className="pull-note">
            数少ない両立例が<strong>{standout.name}</strong>
            です。図書館1館あたり人口は約
            {Math.round(standout.popPerLibrary).toLocaleString()}
            人と上位30%に入りながら、15歳未満人口の割合も
            {standout.childRatio.toFixed(1)}%と平均を上回っています。
            都心へのアクセスの良さと計画的な街づくりが、子育て世帯の
            流入と図書館整備の両方を後押ししたと考えられます。
          </div>
        )}
      </div>

      <RakutenGifts
        keyword="絵本 セット 読み聞かせ"
        heading="おうち時間の読み聞かせに人気の絵本を楽天市場で見る"
      />

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          図書館数は市区町村合併の経緯や、分館・移動図書館の扱いに
          よってカウント方法が自治体ごとに異なる場合があります。また、
          今回は人口10万人未満の自治体を対象外としているため、小規模な
          町村における図書館と子育て環境の関係については、別途検証が
          必要です。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：図書館の充実度と子供の割合についてよくある質問</h2>

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
          図書館の充実度と子供の割合には、統計的に意味のある関係は
          見られませんでした。ただし{standout?.name ?? "一部の自治体"}
          のように、図書館アクセスと子育て環境の両方が優れた自治体も
          実在します。図書館の充実度は、子育てのしやすさを測る一つの
          参考情報として見るのが適切です。
        </p>

        <p>
          <Link prefetch={false} href="/ranking/library" style={link}>
            図書館数ランキングを見る
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/child-top50" style={link}>
            子ども人口割合ランキングを見る
          </Link>
          {" ｜ "}
          <Link
            prefetch={false}
            href="/articles/daycare-birthrate-analysis"
            style={link}
          >
            保育園の数と出生率の関係を見る
          </Link>
        </p>

        <p
          style={{
            fontSize: 13,
            color: "var(--muted, #6b7280)",
            marginTop: 16,
          }}
        >
          出典：本サイト集計(市区町村別図書館数・年齢別人口データ)。対象は
          人口10万人以上の{base.length}都市。
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
