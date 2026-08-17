import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/elderly-support-composite" },
  title: "高齢者支援体制スコア｜同じ高齢化率でも自治体でここまで違う",
  description:
    "高齢化率が近い自治体同士でも、医師数・老人ホーム定員・独居高齢者率を組み合わせた独自スコアで比較すると、支援体制には大きな差があることが分かりました。群馬県川場村と高知県大豊町を対比しながら分析します。",
};

function zScores(values: number[]) {
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const sd = Math.sqrt(
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
  );
  return values.map((v) => (v - mean) / sd);
}

export default function Page() {
  const base = getMunicipalities().filter(
    (c) =>
      c.population >= 3000 &&
      c.elderlyPopulation != null &&
      c.doctorsCount != null &&
      c.elderlyHomeCount != null &&
      c.singleHouseholds != null &&
      c.households
  );

  const withRates = base.map((c) => ({
    ...c,
    agingRate: (c.elderlyPopulation / c.population) * 100,
    doctorsPer10k: (c.doctorsCount ?? 0) / c.population * 100000,
    homesPer1kElderly:
      c.elderlyPopulation > 0
        ? (c.elderlyHomeCount ?? 0) / (c.elderlyPopulation / 1000)
        : 0,
    singleRatio: ((c.singleHouseholds ?? 0) / (c.households ?? 1)) * 100,
  }));

  const zDoctors = zScores(withRates.map((c) => c.doctorsPer10k));
  const zHomes = zScores(withRates.map((c) => c.homesPer1kElderly));
  const zSingle = zScores(withRates.map((c) => c.singleRatio));

  const scored = withRates.map((c, i) => ({
    ...c,
    supportScore: zDoctors[i] + zHomes[i] - zSingle[i],
  }));

  // 高齢化率TOP300(高齢化が進んでいる自治体)に絞って支援体制を比較
  const highAging = [...scored]
    .sort((a, b) => b.agingRate - a.agingRate)
    .slice(0, 300);

  const weakest = [...highAging].sort(
    (a, b) => a.supportScore - b.supportScore
  );
  const strongest = [...highAging].sort(
    (a, b) => b.supportScore - a.supportScore
  );

  const worst10 = weakest.slice(0, 10);
  const best10 = strongest.slice(0, 10);

  const kochiInWorst = worst10.filter((c) =>
    c.name.startsWith("高知県")
  ).length;

  const faq = [
    {
      q: "高齢者支援体制スコアとは何ですか？",
      a: "人口あたりの医師数、高齢者あたりの老人ホーム定員数、独居高齢者の割合という3つの指標をZスコア化して組み合わせた、本サイト独自の指標です。高齢化率そのものではなく、高齢化が進んだ地域で「支援体制がどれだけ整っているか」を測ることを目的としています。",
    },
    {
      q: "高齢化率が近くても、支援体制に差がある例はありますか？",
      a: `あります。高齢化率TOP300の中で最も支援体制が手厚いのは群馬県川場村(高齢化率${best10[0].agingRate.toFixed(1)}%)、最も薄いのは高知県大豊町(高齢化率${worst10[0].agingRate.toFixed(1)}%)でした。高齢化率はどちらも40%台後半〜50%台と近い水準ですが、医師数・老人ホーム定員・独居率には大きな差があります。`,
    },
    {
      q: "支援体制が薄い自治体には、地域的な偏りがありますか？",
      a: `今回の集計では、支援体制が薄い上位10自治体のうち${kochiInWorst}自治体を高知県が占めました。県内一極集中度ランキング分析の記事でも触れた通り、高知県は県人口の約半分が高知市に集中しており、それ以外の地域では医療・福祉資源が相対的に手薄になっている可能性があります。`,
    },
  ];

  return (
    <ArticleLayout
      title="高齢者支援体制スコア：同じ高齢化率でも自治体でここまで違う"
      summary={`高齢化率が近い自治体同士を、医師数・老人ホーム定員・独居高齢者率を組み合わせた独自スコアで比較しました。高齢化率TOP300の中で、群馬県川場村(高齢化率${best10[0].agingRate.toFixed(1)}%)は支援体制が手厚い一方、高知県大豊町(高齢化率${worst10[0].agingRate.toFixed(1)}%)は同水準の高齢化率でありながら支援体制が薄いという、対照的な結果になりました。`}
      heroLabel="高齢者支援体制スコア 最上位(高齢化率TOP300中)"
      heroValue={`${best10[0].name} ${best10[0].supportScore.toFixed(1)}`}
      rankingLink="/ranking/aging"
      path="/articles/elderly-support-composite"
      tags={["aging"]}
      publishedAt="2026-08-15"
      top3={[
        { rank: 1, name: best10[0].name, value: best10[0].supportScore.toFixed(1) },
        { rank: 2, name: best10[1].name, value: best10[1].supportScore.toFixed(1) },
        { rank: 3, name: best10[2].name, value: best10[2].supportScore.toFixed(1) },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          高齢化率ランキングでは「高齢化率が高い自治体ほど
          課題が大きい」という前提で語られがちです。しかし
          福祉・高齢化系の記事群でこれまで繰り返し見てきた
          通り、高齢化率という数字だけでは、その地域の
          高齢者が実際にどれだけ支援を受けられているかは
          分かりません。そこで今回、高齢化率TOP300の
          自治体に絞り、医師数・老人ホーム定員・独居
          高齢者率という3つの指標を組み合わせた「支援体制
          スコア」で比較しました。
        </p>
      </div>

      <div style={box}>
        <h2>支援体制が最も手厚い10自治体</h2>

        <RankingBarChart
          items={best10.map((c) => ({
            name: c.name,
            value: c.supportScore,
            displayValue: c.supportScore.toFixed(1),
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の群馬県川場村(高齢化率{best10[0].agingRate.toFixed(1)}
          %)は、人口10万人あたりの医師数が
          {best10[0].doctorsPer10k.toFixed(0)}人と全国平均を
          大きく上回り、高齢者1,000人あたりの老人ホーム定員も
          {best10[0].homesPer1kElderly.toFixed(2)}と手厚い
          水準です。独居高齢者の割合も
          {best10[0].singleRatio.toFixed(1)}%と、他の高齢化
          自治体と比べて低く抑えられています。
        </p>
      </div>

      <div style={box}>
        <h2>支援体制が最も薄い10自治体</h2>

        <RankingBarChart
          items={worst10.map((c) => ({
            name: c.name,
            value: c.supportScore,
            displayValue: c.supportScore.toFixed(1),
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          最下位の高知県大豊町(高齢化率
          {worst10[0].agingRate.toFixed(1)}%)は、独居高齢者
          率が{worst10[0].singleRatio.toFixed(1)}%と非常に
          高く、老人ホームの定員はほぼゼロという状況です。
          高齢化率だけを見れば群馬県川場村と同水準ですが、
          支援体制には大きな開きがあります。上位10自治体
          のうち{kochiInWorst}自治体を高知県が占めている
          点も見逃せません。県内一極集中度ランキング分析の
          記事で見た通り、高知県は県人口の約半分が高知市に
          集中しており、それ以外の地域では医療・福祉資源が
          相対的に手薄になっている可能性があります。1つの
          都道府県の中でも、これだけ支援体制に差があるという
          ことです。
        </p>

        <PersonalNote>
          高齢者福祉に関わっていたとき「高齢化率だけでは
          地域の高齢者問題は判断できない」と感じていましたが、
          今回3つの指標を組み合わせて初めて、その感覚が
          数字として裏付けられました。高齢化率が同じでも、
          医師へのアクセスや老人ホームの定員、独居かどうかで
          高齢者の暮らしやすさはまったく違います。自治体の
          高齢化対策を考えるときは、高齢化率という入口の
          数字だけでなく、実際にどれだけの支援体制が
          用意されているかまで見る必要があると、改めて
          感じています。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>このスコアの限界</h2>

        <p>
          このスコアは3つの指標を統計的に統合した独自
          集計であり、公式な福祉水準の評価基準ではありません。
          医師数は勤務地ベースの集計のため、近隣自治体の
          医療機関を利用しているケースは反映されません。
          また、人口規模が小さい自治体では、施設の有無で
          数値が大きく振れやすい点にもご注意ください。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：高齢者支援体制スコアについてよくある質問</h2>

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
          高齢化率が近い自治体同士を比較しても、支援体制には
          大きな差があることが、独自の複合スコアによって
          はっきりと見えてきました。高齢化率という単一の
          数字で地域の高齢者問題を語るのではなく、医療
          アクセス・施設定員・世帯構成まで踏み込んで初めて、
          実態に近い理解に近づけます。福祉・高齢化系の
          個別記事とあわせて読むことで、より立体的に地域の
          課題が見えてきます。
        </p>

        <p>
          <Link href="/articles/welfare-aging" style={link}>
            高齢化率と民生費の関係を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/household-aging-ushape" style={link}>
            単独世帯割合と高齢化のU字構造を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/doctors-analysis" style={link}>
            医師数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/elderly-home-analysis" style={link}>
            老人ホーム数ランキング分析を見る
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
