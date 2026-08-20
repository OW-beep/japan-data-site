import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/divorce-rate-analysis" },
  title: "離婚率ランキング分析｜西日本で高く、東北・北陸で低い理由",
  description:
    "人口千人あたりの離婚件数を分析。沖縄県・福岡県・大阪府など西日本の都市部で高く、山形県・秋田県・富山県など東北・北陸地方で低いという地域差が見られました。婚姻率との関係もあわせて解説します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter((c) => c.divorces != null && c.population >= 3000)
    .map((c) => ({
      ...c,
      rate: ((c.divorces ?? 0) / c.population) * 1000,
    }));

  const ranking = [...base].sort((a, b) => b.rate - a.rate);
  const top10 = ranking.slice(0, 10);
  const average = base.reduce((s, c) => s + c.rate, 0) / base.length;
  const zeroCount = base.filter((c) => c.divorces === 0).length;

  const PREFECTURES = [
    "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
    "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
    "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
    "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
    "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
    "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
    "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
  ];

  const prefectureAverages = PREFECTURES.map((pref) => {
    const cities = base.filter((c) => c.name.startsWith(pref));
    const avg =
      cities.length > 0
        ? cities.reduce((s, c) => s + c.rate, 0) / cities.length
        : null;
    return { pref, avg, count: cities.length };
  }).filter((p) => p.avg != null) as { pref: string; avg: number; count: number }[];

  const prefRankingDesc = [...prefectureAverages].sort((a, b) => b.avg - a.avg);
  const prefTop5 = prefRankingDesc.slice(0, 5);
  const prefBottom5 = prefRankingDesc.slice(-5).reverse();

  const withMarriage = getMunicipalities().filter(
    (c) => c.divorces != null && c.marriages != null && c.population >= 3000
  );
  const ratioSum = withMarriage
    .filter((c) => (c.marriages ?? 0) > 0)
    .map((c) => (c.divorces ?? 0) / (c.marriages ?? 1));
  const avgRatio = ratioSum.reduce((s, v) => s + v, 0) / ratioSum.length;

  const faq = [
    {
      q: "離婚率(人口千人あたり)が最も高い自治体はどこですか？",
      a: `沖縄県竹富町(人口${top10[0].population.toLocaleString()}人)が${top10[0].rate.toFixed(
        2
      )}で最も高い数値でした。ただし人口規模が小さい自治体のため、数件の増減で数値が大きく変動しやすい点にご留意ください。`,
    },
    {
      q: "離婚率には地域差がありますか？",
      a: `都道府県単位で平均すると、沖縄県(${prefTop5[0].avg.toFixed(
        2
      )})・福岡県・大阪府など西日本の都市部で高く、島根県(${prefBottom5[0].avg.toFixed(
        2
      )})・富山県・新潟県など東北・北陸地方で低いという傾向が見られました。`,
    },
    {
      q: "離婚件数がゼロの自治体はどれくらいありますか？",
      a: `今回の集計対象${base.length.toLocaleString()}自治体のうち、${zeroCount}自治体では離婚件数が0件でした。多くは人口規模が小さい自治体で、そもそもの件数が少ないために起こりやすい統計上の現象です。`,
    },
  ];

  return (
    <ArticleLayout
      title="離婚率ランキング分析：西日本で高く、東北・北陸で低い理由"
      summary={`人口千人あたりの離婚件数を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${average.toFixed(
        2
      )}に対し、都道府県単位では沖縄県・福岡県・大阪府など西日本の都市部で高く、島根県・富山県・新潟県など東北・北陸地方で低いという地域差が見られました。`}
      heroLabel="都道府県別 離婚率 最高"
      heroValue={`${prefTop5[0].pref} ${prefTop5[0].avg.toFixed(2)}`}
      rankingLink="/ranking/divorce-rate"
      path="/articles/divorce-rate-analysis"
      tags={["population"]}
      publishedAt="2026-08-20"
      top3={[
        { rank: 1, name: prefTop5[0].pref, value: prefTop5[0].avg.toFixed(2) },
        { rank: 2, name: prefTop5[1].pref, value: prefTop5[1].avg.toFixed(2) },
        { rank: 3, name: prefTop5[2].pref, value: prefTop5[2].avg.toFixed(2) },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          離婚率は、婚姻率と同じく地域の家族構成の変化を示す
          人口動態統計の1つです。今回は市区町村単位だけで
          なく、数値が振れやすい小規模自治体の影響を抑える
          ため、都道府県単位の平均もあわせて見ていきます。
          全国{base.length.toLocaleString()}自治体の平均は
          {average.toFixed(2)}でした。
        </p>
      </div>

      <div style={box}>
        <h2>都道府県別 平均離婚率ランキング</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>順位</th>
              <th style={th}>都道府県</th>
              <th style={th}>平均値</th>
            </tr>
          </thead>
          <tbody>
            {prefTop5.map((p, i) => (
              <tr key={p.pref}>
                <td style={td}>上位{i + 1}位</td>
                <td style={td}>{p.pref}</td>
                <td style={td}>{p.avg.toFixed(2)}</td>
              </tr>
            ))}
            {prefBottom5.map((p, i) => (
              <tr key={p.pref}>
                <td style={td}>下位{i + 1}位</td>
                <td style={td}>{p.pref}</td>
                <td style={td}>{p.avg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          上位には沖縄県・福岡県・大阪府・鹿児島県・宮崎県と、
          西日本の都市部や人口の多い県が並びます。下位には
          山形県・秋田県・新潟県・富山県・島根県と、東北・
          北陸地方が並びました。この地域差の要因を単純に
          特定することは難しく、人口構成・就業構造・世帯
          構成など、複数の要因が絡み合っていると考えられます。
          断定的な理由づけは避け、あくまで観察された地域
          パターンとして捉えるのが妥当です。
        </p>
      </div>

      <div style={box}>
        <h2>婚姻率との関係</h2>

        <p>
          離婚件数を婚姻件数と比べると、全国平均で婚姻件数
          {(avgRatio * 100).toFixed(0)}%程度の離婚件数が
          発生している計算になります。婚姻率ランキング分析の
          記事で見た通り、婚姻件数の多い都市部では離婚件数も
          相対的に多くなる傾向があり、これは母数となる
          世帯数・人口の多さが影響している面が大きいと
          考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>市区町村単位の数値には注意が必要</h2>

        <p>
          市区町村単位のランキングでは、沖縄県竹富町のような
          人口数千人規模の自治体が上位に来ることがありますが、
          これは離婚件数が数件増減するだけで、人口あたりの
          数値が大きく変動するためです。今回{zeroCount}
          自治体で離婚件数が0件だったことも、同じ理由に
          よるものです。市区町村単位の順位よりも、都道府県
          単位の傾向の方が、統計的には安定した比較が
          できます。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          離婚率は、地域の「暮らしやすさ」や「家族の
          幸福度」を直接示す指標ではありません。単身赴任や
          転居のタイミング、届出地と実際の居住地の違いなど、
          様々な事情が数字に影響します。この統計を、特定の
          地域や個人への価値判断に結びつけることは適切では
          ありません。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：離婚率ランキングについてよくある質問</h2>

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
          離婚率には、都道府県単位で見ても一定の地域差が
          あることが分かりました。ただしその要因は単純では
          なく、この統計だけで地域や個人を評価することは
          できません。婚姻率ランキングとあわせて、人口動態の
          一側面として参考にしていただければと思います。
        </p>

        <p>
          <Link href="/ranking/divorce-rate" style={link}>
            離婚率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/marriage-rate-analysis" style={link}>
            婚姻率ランキング分析を見る
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

const lead: React.CSSProperties = {
  fontSize: 16,
  color: "#374151",
  margin: 0,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
};

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
};
