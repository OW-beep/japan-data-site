import Link from "next/link";
import { getCorporateGrowthRanking } from "@/lib/corporateRegistration";
import { getRealEstatePriceRanking } from "@/lib/realEstatePrice";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";

export const metadata = {
  alternates: { canonical: "/articles/corporate-growth-analysis" },
  title: "新設法人ランキング分析｜渋谷区が純増1位、新宿区は逆に純減1位",
  description:
    "国税庁のデータで市区町村別の新設法人純増数を分析。渋谷区が純増2,721件で1位の一方、新宿区は新設2,213件・閉鎖3,329件で純減1,116件という意外な結果でした。",
};

const MIN_POPULATION = 1000;

export default function Page() {
  const all = getCorporateGrowthRanking().filter(
    (c) => c.population != null && c.population >= MIN_POPULATION
  );

  const ranking = [...all].sort((a, b) => b.netGrowth - a.netGrowth);
  const top12 = ranking.slice(0, 12);
  const bottom10 = ranking.slice(-10);
  const shinjuku = all.find((c) => c.name.includes("新宿区"));
  const okuma = all.find((c) => c.name.includes("大熊町"));

  const totalNew = all.reduce((s, c) => s + c.newCount, 0);
  const totalClose = all.reduce((s, c) => s + c.closeCount, 0);

  // 地価との相関(参考値)
  const realEstate = getRealEstatePriceRanking();
  const reByCode = new Map(realEstate.map((r) => [r.code, r]));

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

  const pairs = all
    .map((c) => {
      const re = reByCode.get(c.code);
      return re && re.landPricePerSqm && re.landSampleSize >= 10 && c.netGrowthPer1000 != null
        ? { per1000: c.netGrowthPer1000, price: re.landPricePerSqm }
        : null;
    })
    .filter((p): p is { per1000: number; price: number } => p != null);

  const r = correlation(
    pairs.map((p) => p.per1000),
    pairs.map((p) => Math.log10(p.price))
  );

  const faq = [
    {
      q: "新設法人の純増数が最も多い自治体はどこですか？",
      a: `${top12[0].name}で、直近12か月の純増数は${top12[0].netGrowth.toLocaleString()}件です(新設${top12[0].newCount.toLocaleString()}件、閉鎖${top12[0].closeCount.toLocaleString()}件)。`,
    },
    {
      q: "新宿区の新設法人はなぜ純減しているのですか？",
      a: `新宿区は新設${shinjuku?.newCount.toLocaleString()}件と、単独で見れば全国トップクラスの新設数がありますが、閉鎖数が${shinjuku?.closeCount.toLocaleString()}件とそれを上回り、純増では全国最下位(${shinjuku?.netGrowth.toLocaleString()}件)になっています。新宿区は開業も廃業も多い「新陳代謝の激しい」エリアであり、単純に企業活動が停滞しているというよりは、小規模事業者の入れ替わりが非常に活発な結果と考えられます。`,
    },
    {
      q: "新設法人の純増数は地価と関係がありますか？",
      a: `住民1,000人あたりの純増数と地価(対数)の相関係数は${r.toFixed(
        2
      )}で、弱い正の相関にとどまりました。地価が高い都心部で法人純増数が多い傾向はあるものの、地価だけで説明できる部分は限定的で、業種構成や再開発の有無など、他の要因も大きく影響していると考えられます。`,
    },
  ];

  return (
    <ArticleLayout
      title="新設法人ランキング分析｜渋谷区1位、新宿区は逆に純減1位"
      summary={`国税庁のデータで市区町村別の新設法人純増数(直近12か月)を分析。全国計は新設${totalNew.toLocaleString()}件・閉鎖${totalClose.toLocaleString()}件・純増${(totalNew-totalClose).toLocaleString()}件でした。1位は${top12[0].name}(純増${top12[0].netGrowth.toLocaleString()}件)、一方で新宿区は新設数こそ多いものの、閉鎖数がそれを上回り純減1位という意外な結果でした。`}
      heroLabel="純増数1位の自治体"
      heroValue={top12[0].name}
      rankingLink="/ranking/corporate-growth"
      path="/articles/corporate-growth-analysis"
      tags={["finance"]}
      publishedAt="2026-09-18"
      top3={top12.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `純増${c.netGrowth.toLocaleString()}件`,
      }))}
    >
      <div style={box}>
        <h2>純増数TOP12</h2>

        <p>
          国税庁「法人番号公表サイト」の全件データをもとに、直近12か月間の
          市区町村別「新設法人純増数」(新設数-閉鎖数)を集計しました。
          全国計は新設{totalNew.toLocaleString()}件・閉鎖
          {totalClose.toLocaleString()}件、差し引き純増
          {(totalNew - totalClose).toLocaleString()}件です。
        </p>

        <RankingBarChart
          items={top12.map((c) => ({
            name: c.name,
            value: c.netGrowth,
            displayValue: `${c.netGrowth.toLocaleString()}件`,
          }))}
        />

        <p style={{ marginTop: 12, fontSize: 14, color: "var(--muted)" }}>
          1位の{top12[0].name}は、新設{top12[0].newCount.toLocaleString()}件・
          閉鎖{top12[0].closeCount.toLocaleString()}件で、純増
          {top12[0].netGrowth.toLocaleString()}件と全国で突出しています。
          IT・スタートアップ企業の集積地として知られるエリアで、
          データの上でもその勢いが裏付けられました。
        </p>
      </div>

      <div style={box}>
        <h2>新宿区は、新設数トップ級なのに純減1位</h2>

        <p>
          今回の分析で最も意外だったのが新宿区です。新宿区の新設法人数は
          {shinjuku?.newCount.toLocaleString()}件と全国でも上位に入る
          規模ですが、閉鎖数が{shinjuku?.closeCount.toLocaleString()}件と
          それを大きく上回り、純増では
          <strong>{shinjuku?.netGrowth.toLocaleString()}件</strong>
          という、全国で最も大きな純減になりました。
        </p>

        <div className="pull-note">
          新設数だけを見れば新宿区は「企業が集まる街」ですが、
          それ以上のペースで法人が閉鎖されているため、実質的には
          企業数が減少しています。歓楽街を含む雑居ビルの多さや、
          小規模事業者の開業・廃業サイクルの早さが背景にあると
          考えられます。「新設数が多い=成長している」とは限らない
          という、この純増数という指標ならではの発見です。
        </div>

        <p>
          新宿区以外にも、練馬区・江戸川区・北区など、東京23区の
          中でも郊外寄りのベッドタウン的なエリアで純減が目立ちます。
          都心3区(千代田区・中央区・港区)や渋谷区に企業活動が
          集中する一方、その外側のエリアでは純減が進むという、
          東京都内での二極化が見えてきます。
        </p>

        <div style={{ margin: "12px 0" }}>
          {bottom10.map((c) => (
            <span className="stat-chip" key={c.code}>
              {c.name}({c.netGrowth.toLocaleString()})
            </span>
          ))}
        </div>
      </div>

      <div style={box}>
        <h2>小さな町の"復興特需"：福島県大熊町</h2>

        <p>
          人口あたりで見ると、意外な自治体が上位に入ります。
          {okuma?.name}(人口{okuma?.population?.toLocaleString()}人)は、
          純増数こそ{okuma?.netGrowth}件と小さいものの、人口比では
          全国トップクラスの伸び率です。人口の入れ替わり率を分析した
          過去記事でも触れたとおり、大熊町は原発事故からの復興が
          進む町で、除染・復興関連の事業者の新規登録が、人口規模の
          わりに多いことが背景にあると考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>地価との関係は「弱い」相関にとどまる</h2>

        <p>
          住民1,000人あたりの純増数と地価(対数)の相関係数を計算すると
          {r.toFixed(2)}で、正の傾向はあるものの弱い相関にとどまりました。
          地価が高い都心部で法人純増数が多い傾向はあるものの、地価だけで
          説明できる部分は限定的です。業種構成、再開発の有無、新宿区の
          ような「開業・廃業サイクルの早さ」など、地価以外の要因も
          大きく影響していると考えられます。無理に強い関係があると
          決めつけず、あくまで参考程度の数値として見るのが適切です。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：新設法人純増数についてよくある質問</h2>

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
          新設法人数だけでは見えない「純増数」という視点を導入する
          ことで、渋谷区の突出した勢いと、新宿区の意外な純減という、
          対照的な2つの姿が見えてきました。開業の多さは必ずしも
          その地域の企業活動の成長を意味せず、閉鎖数もあわせて見る
          ことで、はじめて実態に近づけることが分かります。
        </p>

        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 16 }}>
          出典：国税庁 法人番号公表サイト(全件データ、直近12か月集計)
        </p>

        <p>
          <Link href="/ranking/corporate-growth" style={link}>
            新設法人純増数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/population-churn-analysis" style={link}>
            人口の入れ替わり率ランキング分析を見る
          </Link>
        </p>

        <CompareCTA />
      </div>
    </ArticleLayout>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)",
  padding: "20px 24px",
  border: "1px solid var(--line)",
  marginBottom: 20,
};

const link: React.CSSProperties = {
  color: "var(--indigo)",
  textDecoration: "underline",
};
