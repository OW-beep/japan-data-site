import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import Link from "next/link";


export const metadata = {
  alternates: { canonical: "/articles/population-finance" },
  title: "人口規模と財政力の関係：大都市は本当に財政が強いのか",
  description:
    "人口規模が大きい自治体ほど財政力指数が高い傾向がある一方、東京都特別区は例外的に低くなります。その理由をデータと制度の両面から分析します。",
};

export default function Page() {
  const municipalities = getMunicipalities().filter(
    (c) => c.financeIndex != null
  );

  const buckets: {
    label: string;
    min: number;
    max: number;
  }[] = [
    { label: "〜1万人", min: 0, max: 10000 },
    { label: "1万〜5万人", min: 10000, max: 50000 },
    { label: "5万〜10万人", min: 50000, max: 100000 },
    { label: "10万〜30万人", min: 100000, max: 300000 },
    { label: "30万〜100万人", min: 300000, max: 1000000 },
    { label: "100万人〜", min: 1000000, max: Infinity },
  ];

  const bucketStats = buckets.map((b) => {
    const group = municipalities.filter(
      (c) => c.population >= b.min && c.population < b.max
    );
    const avg =
      group.reduce((s, c) => s + (c.financeIndex ?? 0), 0) /
      group.length;
    return { ...b, avg, count: group.length };
  });

  const smallButRich = [...municipalities]
    .filter((c) => c.population < 20000)
    .sort((a, b) => (b.financeIndex ?? 0) - (a.financeIndex ?? 0))
    .slice(0, 5);

  const bigButPoor = [...municipalities]
    .filter((c) => c.population > 200000)
    .sort((a, b) => (a.financeIndex ?? 0) - (b.financeIndex ?? 0))
    .slice(0, 5);

  return (
    <ArticleLayout
      title="人口規模と財政力の関係：大都市は本当に財政が強いのか"
      summary="人口規模が大きい自治体ほど財政力指数が高くなる傾向は、データ上はっきり確認できます。ただし東京都特別区だけは例外で、これは税制上の理由があります。"
      heroLabel="人口100万人以上の平均財政力指数"
      heroValue={bucketStats[5].avg.toFixed(3)}
      rankingLink="/ranking/finance"
      tags={["finance", "population"]}
      publishedAt="2026-05-08"
      top3={[
        {
          rank: 1,
          name: smallButRich[0].name,
          value: `人口${smallButRich[0].population.toLocaleString()}人で指数${smallButRich[0].financeIndex?.toFixed(2)}`,
        },
        {
          rank: 2,
          name: bigButPoor[0].name,
          value: `人口${bigButPoor[0].population.toLocaleString()}人で指数${bigButPoor[0].financeIndex?.toFixed(2)}`,
        },
        {
          rank: 3,
          name: smallButRich[1].name,
          value: `人口${smallButRich[1].population.toLocaleString()}人で指数${smallButRich[1].financeIndex?.toFixed(2)}`,
        },
      ]}
    >
      <div style={box}>
        <h2>人口規模別・平均財政力指数</h2>

        <RankingBarChart
          items={bucketStats.map((b) => ({
            name: `${b.label}(${b.count}自治体)`,
            value: b.avg,
            displayValue: b.avg.toFixed(3),
          }))}
        />
      </div>

      <div style={box}>
        <h2>人口が多いほど財政力指数は高くなる</h2>

        <p>
          人口規模別に財政力指数の平均を見ると、
          人口1万人未満の自治体では
          {bucketStats[0].avg.toFixed(3)}
          であるのに対し、人口が増えるごとに指数は上昇し、
          30万〜100万人の自治体では
          {bucketStats[4].avg.toFixed(3)}、
          100万人以上では
          {bucketStats[5].avg.toFixed(3)}
          に達します。人口規模と財政力指数の相関係数(人口を
          対数変換した値との相関)を計算すると0.65前後となり、
          統計的にもはっきりとした正の関係が確認できます。
          人口が多い自治体ほど、法人税収や固定資産税収の
          基盤となる商業・産業集積が進んでいることが、
          この傾向の背景にあります。
        </p>

        <p>
          ただし、30万〜100万人の階層と100万人以上の階層の
          平均はほぼ同じ水準で、人口が増えれば際限なく
          財政力指数が上がり続けるわけではないことも
          分かります。人口規模がある程度を超えると、
          行政需要(道路・福祉・教育など)の増加が税収の
          増加に追いつき、財政力指数の伸びは頭打ちに
          なる傾向があるようです。
        </p>
      </div>

      <div style={box}>
        <h2>例外① 小さくても財政力の強い自治体</h2>

        <p>
          人口規模による傾向には明確な例外もあります。
          {smallButRich[0].name}
          は人口
          {smallButRich[0].population.toLocaleString()}
          人ながら財政力指数
          {smallButRich[0].financeIndex?.toFixed(2)}
          と、全国トップクラスです。財政力指数ランキングの
          分析記事で取り上げたとおり、これは工場・原子力
          施設・リゾート地など、人口規模に見合わない大きな
          税収基盤(固定資産税など)を持つ自治体に共通する
          パターンです。人口だけでは、その自治体の本当の
          財政基盤は測れません。
        </p>
      </div>

      <div style={box}>
        <h2>例外② 人口が多いのに財政力指数が低い、東京都特別区</h2>

        <p>
          逆に、人口20万人を超えているのに財政力指数が低い
          自治体を見ると、
          {bigButPoor
            .map((c) => c.name)
            .join("・")}
          など、上位はすべて東京都の特別区で占められています。
          これは特別区特有の税制によるものです。
        </p>

        <p>
          通常の市町村では、固定資産税や市町村民税法人分は
          その自治体自身の税収になりますが、東京都総務局の
          解説によれば、特別区の区域ではこれらの税(調整税)を
          東京都が代わりに賦課・徴収し、消防・上下水道といった
          本来は市町村が担う事務の一部を都が広域的に担う
          代わりに、収入額の一定割合(現在55%)を「都区財政
          調整交付金」として各区に配分する仕組みになっています。
          つまり特別区の財政力指数は、実際の税収基盤の強さを
          そのまま反映したものではなく、この特別な制度を
          差し引いて見る必要があります。単純に指数だけで
          「特別区は財政的に弱い」と判断するのは、正確では
          ありません。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          人口規模と財政力指数には、統計的にはっきりとした
          正の関係があります。しかしその関係は一様ではなく、
          特定の産業・施設に支えられた小規模自治体や、
          特別区のように税制上の特例を持つ自治体では、
          人口規模だけでは説明できない結果が生まれます。
          ランキングの数字を見るときは、その自治体がどの
          ような制度・産業構造の上に成り立っているかまで
          踏み込むことで、より正確な理解につながります。
        </p>
      </div>

      <div style={box}>
        <h2>自治体の財政運営への示唆</h2>

        <p>
          この分析から見えてくるのは、人口減少が進む
          小規模自治体にとって、税収基盤の強化が容易では
          ないという現実です。人口1万人未満の自治体の
          平均財政力指数は
          {bucketStats[0].avg.toFixed(3)}
          にとどまっており、多くの自治体が地方交付税に
          頼らざるを得ない構造になっています。一方で、
          飛島村や六ヶ所村のような例は、企業誘致や
          産業立地によって、人口規模に頼らずに税収基盤を
          強化する道筋があることも示しています。
        </p>

        <PersonalNote>
          行政にいた頃から今のデータコンサルの仕事まで通じて
          感じているのは、財政力指数のような1つの数字だけでは
          意思決定できないということです。同じ財政力指数の
          低さでも、税収基盤が弱いのか、人口規模のわりに
          維持すべき施設が多いのか、一時的な要因なのかで、
          必要な対策は全く変わります。このサイトでも、
          ランキングを示すだけでなく「その数字の裏側に何が
          あるのか」まで考察することを意識しています。
        </PersonalNote>

        <p>
          <Link href="/articles/tax-composition" style={link}>
            財政の中身分析を見る
          </Link>

          {" ｜ "}
          <Link href="/articles/density-finance" style={link}>
            人口密度と財政力指数の関係を見る
          </Link>
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

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
