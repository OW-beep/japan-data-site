import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/dentist-access-analysis" },
  title: "歯科医師数ランキング分析｜北海道当別町が2位に入る理由",
  description:
    "人口10万人あたりの歯科医師数を分析。東京都千代田区が全国1位の一方、人口1.6万人の北海道当別町が全国2位に入りました。北海道医療大学の歯学部所在地という「大学城下町」パターンが医師数ランキングと同様に表れています。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter((c) => c.dentistsCount != null && c.population >= 3000)
    .map((c) => ({
      ...c,
      per100k: ((c.dentistsCount ?? 0) / c.population) * 100000,
    }));

  const ranking = [...base].sort((a, b) => b.per100k - a.per100k);
  const top10 = ranking.slice(0, 10);

  const zeroCount = base.filter((c) => c.dentistsCount === 0).length;
  const average = base.reduce((s, c) => s + c.per100k, 0) / base.length;

  const withDoctors = getMunicipalities().filter(
    (c) =>
      c.dentistsCount != null && c.doctorsCount != null && c.population >= 3000
  );
  const docValues = withDoctors
    .map((c) => ((c.doctorsCount ?? 0) / c.population) * 100000)
    .sort((a, b) => a - b);
  const denValues = withDoctors
    .map((c) => ((c.dentistsCount ?? 0) / c.population) * 100000)
    .sort((a, b) => a - b);
  const docMedian = docValues[Math.floor(docValues.length / 2)];
  const denMedian = denValues[Math.floor(denValues.length / 2)];

  const bothScarce = withDoctors
    .filter((c) => c.population >= 10000)
    .map((c) => ({
      ...c,
      docPer100k: ((c.doctorsCount ?? 0) / c.population) * 100000,
      denPer100k: ((c.dentistsCount ?? 0) / c.population) * 100000,
    }))
    .filter(
      (c) => c.docPer100k < docMedian * 0.3 && c.denPer100k < denMedian * 0.3
    );

  const faq = [
    {
      q: "歯科医師数(人口10万人あたり)が全国1位の自治体はどこですか？",
      a: `東京都千代田区が${top10[0].per100k.toFixed(
        1
      )}人で全国1位です。オフィス街としての通院需要と、都心部の歯科医院の集積が要因とみられます。`,
    },
    {
      q: "なぜ人口1万人台の北海道当別町が歯科医師数ランキングで上位に入るのですか？",
      a: `当別町には北海道医療大学の歯学部が所在しており、大学附属の歯科診療施設に多くの歯科医師が勤務しているためです。医師数ランキング分析の記事で紹介した「医科大学の城下町」と同じパターンが、歯科でも起きています。`,
    },
    {
      q: "歯科医師が1人もいない自治体はありますか？",
      a: `今回の集計では、歯科医師数が0人として登録されている自治体が${zeroCount}町村ありました。人口規模の小さな町村が多く、近隣自治体の歯科医院に頼っている地域です。`,
    },
    {
      q: "医師と歯科医師の両方が少ない自治体はありますか？",
      a: bothScarce.length > 0
        ? `あります。人口1万人以上の自治体では${bothScarce[0].name}が該当し、医科・歯科どちらのアクセスも全国中央値の3割未満という状況です。`
        : "人口1万人以上の自治体では、医科・歯科の両方が著しく少ないケースは限定的でした。",
    },
  ];

  return (
    <ArticleLayout
      title="歯科医師数ランキング分析：北海道当別町が2位に入る理由"
      summary={`人口10万人あたりの歯科医師数を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${average.toFixed(
        1
      )}人に対し、東京都千代田区が${top10[0].per100k.toFixed(
        1
      )}人で全国1位。2位には人口1.6万人の北海道当別町が入りました。北海道医療大学の歯学部が所在する「大学城下町」であることが理由です。`}
      heroLabel="歯科医師数 全国1位"
      heroValue={`${top10[0].name} ${top10[0].per100k.toFixed(1)}人`}
      rankingLink="/ranking/dentist"
      path="/articles/dentist-access-analysis"
      tags={["aging"]}
      publishedAt="2026-08-17"
      top3={[
        { rank: 1, name: top10[0].name, value: `${top10[0].per100k.toFixed(1)}人` },
        { rank: 2, name: top10[1].name, value: `${top10[1].per100k.toFixed(1)}人` },
        { rank: 3, name: top10[2].name, value: `${top10[2].per100k.toFixed(1)}人` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          歯科医師数(人口10万人あたり)を見ると、医師数
          ランキング分析の記事と同じような「大学城下町」の
          パターンが見えてきます。全国{base.length.toLocaleString()}
          自治体の平均は{average.toFixed(1)}人でした。
        </p>
      </div>

      <div style={box}>
        <h2>歯科医師数TOP10</h2>

        <RankingBarChart
          items={top10.map((c) => ({
            name: c.name,
            value: c.per100k,
            displayValue: `${c.per100k.toFixed(1)}人`,
          }))}
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位は東京都千代田区で{top10[0].per100k.toFixed(1)}
          人。ここまでは医師数ランキングと同じ顔ぶれですが、
          注目すべきは2位の北海道当別町(人口
          {top10[1].population.toLocaleString()}人)です。
          当別町には北海道医療大学の歯学部が所在しており、
          大学附属の歯科診療施設に多くの歯科医師が勤務して
          いることが、人口規模に見合わない突出した数値の
          理由です。3位の岐阜県瑞穂市、7位の長野県塩尻市も、
          近隣に歯科系の大学・専門施設を抱える自治体です。
        </p>
      </div>

      <div style={box}>
        <h2>歯科医師ゼロの自治体も少なくない</h2>

        <p>
          今回の集計では、歯科医師数が0人として登録されている
          自治体が{zeroCount}町村ありました。人口数千人規模の
          小さな町村が中心で、近隣自治体の歯科医院に通院する
          ことが前提になっている地域です。医師数ランキング
          分析の記事で紹介した「医師ゼロの29町村」と重なる
          自治体も多く、医療資源全体が手薄な地域が一定数
          存在することが分かります。
        </p>
      </div>

      <div style={box}>
        <h2>医科と歯科、両方が手薄な自治体は限定的</h2>

        <p>
          医師数と歯科医師数を人口1万人以上の自治体で
          突き合わせたところ、両方とも全国中央値の3割未満
          という「医療アクセスが二重に手薄な自治体」は
          {bothScarce.length}自治体にとどまりました。
          {bothScarce.length > 0 && (
            <>
              該当したのは{bothScarce[0].name}
              (人口{bothScarce[0].population.toLocaleString()}
              人)です。
            </>
          )}
          逆に、医科・歯科ともに手厚い自治体は、千代田区・
          文京区・新宿区・港区・中央区といった東京都心区と、
          大阪府吹田市(近隣に医科大学附属病院を抱える)に
          集中しており、医療資源の集積は都心部と大学立地
          自治体という、限られたパターンに偏っていることが
          見えてきます。
        </p>

        <PersonalNote>
          医師数の記事に続いて歯科医師数も見てみて、医療
          資源の集積パターンが「都心部」か「大学の立地」の
          どちらかにほぼ限られているという印象を強く持ちました。
          住民の視点では、医科・歯科どちらか一方が手薄でも
          もう一方でカバーできる場合もありますが、今回の
          ように両方が手薄な地域では、通院そのものが大きな
          負担になっている可能性があります。単独の指標では
          なく、医療資源を横断して見ることの大切さを感じます。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          医師数ランキング分析の記事と同様、この統計は
          歯科医師の勤務地ベースの集計です。大学の歯学部や
          大規模な歯科医療施設がある自治体に数値が集中し
          やすく、必ずしも住民一人ひとりが受けやすい歯科
          医療の水準を表しているわけではない点にご注意
          ください。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：歯科医師数ランキングについてよくある質問</h2>

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
          歯科医師数ランキングからも、医師数ランキングと
          同じ「都心部」と「大学城下町」という2つの集積
          パターンが見えてきました。北海道当別町のような
          例は、人口規模だけを見ていては気づけない発見です。
          医科・歯科を横断して見ることで、地域の医療
          アクセスをより立体的に理解できます。
        </p>

        <p>
          <Link href="/ranking/dentist" style={link}>
            歯科医師数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/doctors-analysis" style={link}>
            医師数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/pharmacist-access-analysis" style={link}>
            薬剤師数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/hospital-access-analysis" style={link}>
            病院数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/elderly-support-composite" style={link}>
            高齢者支援体制スコア(複合指数)を見る
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
