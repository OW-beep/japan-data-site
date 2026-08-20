import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/hospital-access-analysis" },
  title: "病院数ランキング分析｜病院ゼロでも診療所380軒の沖縄・竹富町",
  description:
    "人口10万人あたりの病院数を分析。上位は高知県越知町など小規模な町村が並ぶ一方、324自治体には病院が1つもありません。病院ゼロでも診療所が充実する沖縄県竹富町の事例から、医療アクセスの実態を分析します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.hospitalCount != null &&
        c.clinicCount != null &&
        c.population >= 3000
    )
    .map((c) => ({
      ...c,
      hospPer100k: ((c.hospitalCount ?? 0) / c.population) * 100000,
      clinicPer100k: ((c.clinicCount ?? 0) / c.population) * 100000,
    }));

  const ranking = [...base]
    .filter((c) => c.hospPer100k > 0)
    .sort((a, b) => b.hospPer100k - a.hospPer100k);
  const top10 = ranking.slice(0, 10);

  const zeroHospital = base.filter((c) => (c.hospitalCount ?? 0) === 0);
  const zeroButClinicRich = zeroHospital
    .filter((c) => c.clinicPer100k > 100)
    .sort((a, b) => b.clinicPer100k - a.clinicPer100k);

  const kochiInTop10 = top10.filter((c) =>
    c.name.startsWith("高知県")
  ).length;

  const faq = [
    {
      q: "病院数(人口10万人あたり)が全国1位の自治体はどこですか？",
      a: `高知県越知町(人口${top10[0].population.toLocaleString()}人)が${top10[0].hospPer100k.toFixed(
        1
      )}で全国1位です。人口が少ない町では、病院が1つ増えるだけで人口あたりの換算値が大きく跳ね上がるという統計上の特性があります。`,
    },
    {
      q: "病院が1つもない自治体はどれくらいありますか？",
      a: `今回の集計対象${base.length.toLocaleString()}自治体のうち、${zeroHospital.length}自治体には病院が1つもありません。ただしその多くは、病院より小規模な診療所でカバーされています。`,
    },
    {
      q: "病院がなくても医療にアクセスできている自治体はありますか？",
      a: zeroButClinicRich.length > 0
        ? `あります。沖縄県竹富町は病院がゼロですが、人口10万人あたりの診療所数は${zeroButClinicRich[0].clinicPer100k.toFixed(
            1
          )}と全国トップクラスです。離島という地理的条件のもと、診療所が地域医療の中心的な役割を担っています。`
        : "病院がなくても、診療所が充実している自治体は一定数存在します。",
    },
  ];

  return (
    <ArticleLayout
      title="病院数ランキング分析：病院ゼロでも診療所380軒の沖縄・竹富町"
      summary={`人口10万人あたりの病院数を分析すると、医師数ランキングとは対照的に、上位に高知県越知町のような小規模な町村が並びました。一方で全国${zeroHospital.length}自治体には病院が1つもなく、その中には沖縄県竹富町のように病院ゼロでも診療所が非常に充実している自治体もありました。`}
      heroLabel="病院数 全国1位(人口10万人あたり)"
      heroValue={`${top10[0].name} ${top10[0].hospPer100k.toFixed(1)}`}
      rankingLink="/ranking/hospital"
      path="/articles/hospital-access-analysis"
      tags={["aging"]}
      publishedAt="2026-08-20"
      top3={[
        { rank: 1, name: top10[0].name, value: top10[0].hospPer100k.toFixed(1) },
        { rank: 2, name: top10[1].name, value: top10[1].hospPer100k.toFixed(1) },
        { rank: 3, name: top10[2].name, value: top10[2].hospPer100k.toFixed(1) },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          病院数(人口10万人あたり)は、これまでの医師数・
          歯科医師数・薬剤師数のランキングとは異なる顔ぶれに
          なります。医師数は都心区や大学城下町が上位でしたが、
          病院数では小規模な町村が上位に並びます。
        </p>
      </div>

      <div style={box}>
        <h2>病院数TOP10</h2>

        <RankingBarChart
          items={top10.map((c) => ({
            name: c.name,
            value: c.hospPer100k,
            displayValue: c.hospPer100k.toFixed(1),
          }))}
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位は高知県越知町(人口
          {top10[0].population.toLocaleString()}人)でした。
          上位10自治体のうち{kochiInTop10}自治体を高知県が
          占めています。これは高知県が医療機関に恵まれて
          いるというより、県内一極集中度ランキング分析の
          記事で見た通り、高知県は人口の約半分が高知市に
          集中し、残りの町村は人口規模が非常に小さいため、
          病院1つあたりの人口換算値が跳ね上がりやすいという
          統計上の特性が働いています。
        </p>
      </div>

      <div style={box}>
        <h2>病院ゼロでも、診療所が地域医療を支える竹富町</h2>

        <p>
          全国{zeroHospital.length}自治体には病院が1つも
          ありません。しかしその中には、診療所が非常に
          充実している自治体もあります。代表例が沖縄県
          竹富町(石垣島周辺の離島群からなる自治体)で、
          病院はゼロながら、人口10万人あたりの診療所数は
          {zeroButClinicRich[0]?.clinicPer100k.toFixed(1)}
          と全国トップクラスです。離島という地理的な制約から、
          大規模な病院を維持するのではなく、島ごとに小規模な
          診療所を配置するという医療体制を取っていると
          考えられます。
        </p>

        <RankingBarChart
          items={zeroButClinicRich.slice(0, 8).map((c) => ({
            name: c.name,
            value: c.clinicPer100k,
            displayValue: `${c.clinicPer100k.toFixed(1)}(病院ゼロ)`,
          }))}
          barColor="#059669"
        />

        <PersonalNote>
          「病院がゼロ」と聞くと、真っ先に医療が手薄な地域を
          想像してしまいますが、竹富町のようなケースを見ると、
          その地域なりの医療体制の工夫があることが分かります。
          離島や山間部では、大きな病院を1つ作るより、小さな
          診療所を分散させる方が現実的な場合があります。
          「病院の数」という1つの指標だけで医療アクセスの
          良し悪しを判断せず、診療所の状況もあわせて見る
          必要があると、この数字を見て改めて感じました。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          病院(20床以上の入院施設を持つ医療機関)と診療所
          (それ未満の医療機関)は統計上区別されています。
          人口規模が小さい自治体ほど、病院1施設の増減で
          人口あたりの換算値が大きく変動するため、順位の
          変動だけで医療体制の良し悪しを判断しないよう
          ご注意ください。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：病院数ランキングについてよくある質問</h2>

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
          病院数ランキングからは、医師数ランキングとは
          対照的な小規模町村の姿と、病院がなくても診療所で
          医療を支える竹富町のような工夫が見えてきました。
          医師数・歯科医師数・薬剤師数の記事とあわせて
          読むことで、地域医療の全体像がより立体的に
          見えてきます。
        </p>

        <p>
          <Link href="/articles/doctors-analysis" style={link}>
            医師数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/pharmacist-access-analysis" style={link}>
            薬剤師数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/population-concentration" style={link}>
            県内一極集中度ランキング分析を見る
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
