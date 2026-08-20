import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/pharmacist-access-analysis" },
  title: "薬剤師数ランキング分析｜「研究医療都市」というもう1つのパターン",
  description:
    "人口10万人あたりの薬剤師数を分析。東京都心区に加え、国立長寿医療研究センターのある愛知県大府市、静岡がんセンターのある長泉町など、国立の医療研究機関を抱える自治体が上位に入りました。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter((c) => c.pharmacistsCount != null && c.population >= 3000)
    .map((c) => ({
      ...c,
      per100k: ((c.pharmacistsCount ?? 0) / c.population) * 100000,
    }));

  const ranking = [...base].sort((a, b) => b.per100k - a.per100k);
  const top10 = ranking.slice(0, 10);
  const average = base.reduce((s, c) => s + c.per100k, 0) / base.length;
  const zeroCount = base.filter((c) => c.pharmacistsCount === 0).length;

  const researchTowns = ranking.filter((c) =>
    ["大府市", "矢巾町", "長泉町", "つくば市"].some((n) =>
      c.name.includes(n)
    )
  );

  const faq = [
    {
      q: "薬剤師数(人口10万人あたり)が全国1位の自治体はどこですか？",
      a: `東京都千代田区が${top10[0].per100k.toFixed(
        1
      )}人で全国1位です。都心のオフィス街としての通院需要に加え、大規模な調剤薬局チェーンの本部機能が集積していることも要因とみられます。`,
    },
    {
      q: "東京都以外で薬剤師数が多いのはどんな自治体ですか？",
      a: "国立の医療研究機関を抱える自治体が目立ちます。愛知県大府市には国立長寿医療研究センター、静岡県長泉町には静岡県立静岡がんセンター、岩手県矢巾町には岩手医科大学附属病院があり、いずれも人口規模に見合わない高い薬剤師数につながっています。",
    },
    {
      q: "薬剤師が1人もいない自治体はありますか？",
      a: `今回の集計では、薬剤師数が0人として登録されている自治体が${zeroCount}町村ありました。近隣自治体の薬局に頼っている地域です。`,
    },
  ];

  return (
    <ArticleLayout
      title="薬剤師数ランキング分析：「研究医療都市」というもう1つのパターン"
      summary={`人口10万人あたりの薬剤師数を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${average.toFixed(
        1
      )}人に対し、東京都千代田区が${top10[0].per100k.toFixed(
        1
      )}人で全国1位。医師数・歯科医師数の記事で見た「大学城下町」とは別に、国立の医療研究機関を抱える自治体が上位に入るという、新しいパターンが見えてきました。`}
      heroLabel="薬剤師数 全国1位"
      heroValue={`${top10[0].name} ${top10[0].per100k.toFixed(1)}人`}
      rankingLink="/ranking/pharmacist"
      path="/articles/pharmacist-access-analysis"
      tags={["aging"]}
      publishedAt="2026-08-20"
      top3={[
        { rank: 1, name: top10[0].name, value: `${top10[0].per100k.toFixed(1)}人` },
        { rank: 2, name: top10[1].name, value: `${top10[1].per100k.toFixed(1)}人` },
        { rank: 3, name: top10[2].name, value: `${top10[2].per100k.toFixed(1)}人` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          薬剤師数(人口10万人あたり)を見ると、医師数・
          歯科医師数の分析記事とは少し違う顔ぶれが見えて
          きます。全国{base.length.toLocaleString()}自治体
          の平均は{average.toFixed(1)}人でした。
        </p>
      </div>

      <div style={box}>
        <h2>薬剤師数TOP10</h2>

        <RankingBarChart
          items={top10.map((c) => ({
            name: c.name,
            value: c.per100k,
            displayValue: `${c.per100k.toFixed(1)}人`,
          }))}
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          上位5位までは東京都心区が占めていますが、6位以下に
          目を向けると、これまでの医師数・歯科医師数の記事
          では見られなかった「国立の医療研究機関を抱える
          自治体」というパターンが浮かび上がります。
        </p>
      </div>

      {researchTowns.length > 0 && (
        <div style={box}>
          <h2>「研究医療都市」という第3のパターン</h2>

          <RankingBarChart
            items={researchTowns.map((c) => ({
              name: c.name,
              value: c.per100k,
              displayValue: `${c.per100k.toFixed(1)}人`,
            }))}
            barColor="#059669"
          />

          <p style={{ marginTop: 16, color: "#4b5563" }}>
            愛知県大府市には国立長寿医療研究センター、静岡県
            長泉町には静岡県立静岡がんセンター、岩手県矢巾町
            には岩手医科大学附属病院、茨城県つくば市には
            筑波大学附属病院をはじめとする研究機関が集積して
            います。医師数・歯科医師数の記事で見た「私立
            大学の城下町」とは異なり、国が主導する高度専門
            医療・研究機関が立地することで、薬剤師の需要が
            人口規模に見合わない水準まで押し上げられている
            ケースです。都市の規模ではなく、その都市が
            どんな機能を担っているかが数字に表れる好例だと
            言えます。
          </p>
        </div>
      )}

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          医師数・歯科医師数の記事と同様、この統計は薬剤師の
          勤務地ベースの集計です。調剤薬局チェーンの本部や
          物流拠点が置かれている自治体でも数値が高く出ることが
          あり、必ずしも住民が薬を受け取りやすいかどうかを
          直接表しているわけではない点にご注意ください。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：薬剤師数ランキングについてよくある質問</h2>

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
          薬剤師数ランキングからは、医師数・歯科医師数と
          同じ「都心部」「大学城下町」に加え、「国立の
          研究医療都市」という第3のパターンが見えてきました。
          医療系の記事を横断して読むことで、それぞれの
          自治体がどんな医療機能を担っているのかが、より
          立体的に見えてきます。
        </p>

        <p>
          <Link href="/articles/doctors-analysis" style={link}>
            医師数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/dentist-access-analysis" style={link}>
            歯科医師数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/hospital-access-analysis" style={link}>
            病院数ランキング分析を見る
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
