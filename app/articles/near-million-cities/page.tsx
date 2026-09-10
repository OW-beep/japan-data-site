import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import Link from "next/link";

export const metadata = {
  alternates: { canonical: "/articles/near-million-cities" },
  title: "人口90万人・80万人の都市一覧｜あと一歩の「準100万都市」はどこ？",
  description:
    "人口100万人には届かないものの、90万人・80万人台の都市はどこか一覧で紹介。千葉市・北九州市・堺市・浜松市など、100万人都市に迫る「準百万都市」をランキング形式で比較します。",
};

export default function Page() {
  const all = getMunicipalities();

  const band90 = all
    .filter((c) => c.population >= 900000 && c.population < 1000000)
    .sort((a, b) => b.population - a.population);

  const band80 = all
    .filter((c) => c.population >= 800000 && c.population < 900000)
    .sort((a, b) => b.population - a.population);

  const band70 = all
    .filter((c) => c.population >= 700000 && c.population < 800000)
    .sort((a, b) => b.population - a.population);

  const nearMillion = [...band90, ...band80, ...band70];

  const faq = [
    {
      q: "人口90万人の都市はどこですか？",
      a:
        band90.length > 0
          ? `${band90
              .map((c) => c.name)
              .join(
                "、"
              )}が該当します(人口90万人台)。いずれも100万人まであとわずかという規模で、政令指定都市も含まれます。`
          : "現在、人口が90万人台(90万〜99万9,999人)の自治体はありません。",
    },
    {
      q: "人口80万人の都市はどこですか？",
      a:
        band80.length > 0
          ? `${band80
              .map((c) => c.name)
              .join("、")}が人口80万人台(80万〜89万9,999人)に該当します。`
          : "現在、人口が80万人台の自治体はありません。",
    },
    {
      q: "80万人・90万人というのはどれくらいの規模ですか？",
      a: "人口80万人〜90万人台は、政令指定都市の中でも中堅〜上位クラスの規模にあたります。県庁所在地クラスの都市の多くがこの規模帯に含まれ、100万人都市(12自治体)に次ぐ、日本で2番目に大きな都市規模のグループと言えます。",
    },
    {
      q: "これらの都市はいずれ100万人都市になりますか？",
      a: "都市によって傾向は異なります。千葉市のように100万人まで数万人まで迫り、増加基調にある都市がある一方、日本全体が人口減少局面にあるため、多くの都市では100万人到達よりも、現状維持や微減で推移する可能性の方が高いとみられます。",
    },
  ];

  return (
    <ArticleLayout
      title="人口90万人・80万人の都市一覧｜100万人に迫る「準百万都市」"
      summary={`人口100万人には届かないものの、90万人・80万人台という大規模な自治体が全国に${nearMillion.length}市あります。100万人都市(12自治体)に次ぐ規模のこれらの都市を、人口順の一覧・ランキングで紹介します。`}
      heroLabel="人口70万〜99万人の自治体数"
      heroValue={`${nearMillion.length}自治体`}
      rankingLink="/ranking/population"
      path="/articles/near-million-cities"
      tags={["population"]}
      publishedAt="2026-09-10"
      top3={[
        {
          rank: 1,
          name: nearMillion[0].name,
          value: `${nearMillion[0].population.toLocaleString()}人`,
        },
        {
          rank: 2,
          name: nearMillion[1].name,
          value: `${nearMillion[1].population.toLocaleString()}人`,
        },
        {
          rank: 3,
          name: nearMillion[2].name,
          value: `${nearMillion[2].population.toLocaleString()}人`,
        },
      ]}
    >
      <div style={box}>
        <h2>人口70万〜99万人の自治体一覧</h2>

        <RankingBarChart
          items={nearMillion.map((c) => ({
            name: c.name,
            value: c.population,
            displayValue: `${c.population.toLocaleString()}人`,
          }))}
        />
      </div>

      <div style={box}>
        <h2>90万人台・80万人台・70万人台の内訳</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>人口帯</th>
              <th style={th}>該当自治体数</th>
              <th style={th}>該当自治体</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>90万人台</td>
              <td style={td}>{band90.length}市</td>
              <td style={td}>
                {band90.map((c) => c.name).join("・") || "―"}
              </td>
            </tr>
            <tr>
              <td style={td}>80万人台</td>
              <td style={td}>{band80.length}市</td>
              <td style={td}>
                {band80.map((c) => c.name).join("・") || "―"}
              </td>
            </tr>
            <tr>
              <td style={td}>70万人台</td>
              <td style={td}>{band70.length}市</td>
              <td style={td}>
                {band70.map((c) => c.name).join("・") || "―"}
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginTop: 12, fontSize: 14, color: "#6b7280" }}>
          人口100万人以上の自治体は全国に12(
          <Link href="/articles/million-cities" style={link}>
            100万人都市一覧はこちら
          </Link>
          )ある一方、90万〜70万人台にはさらに{nearMillion.length}
          の自治体が存在します。合わせると、人口70万人以上の
          「大都市」は全国で{12 + nearMillion.length}自治体になります。
        </p>
      </div>

      <div style={box}>
        <h2>特徴と分析</h2>

        <p>
          人口90万人台には{band90.map((c) => c.name).join("・") || "該当自治体"}
          が入ります。政令指定都市としての行政権限を持ちながら、
          100万人まであと一歩というのが共通点です。特に
          {band90[0]?.name}は100万人まで数万人程度まで迫っており、
          今後の人口動態次第では100万人都市入りする可能性が
          最も高い都市のひとつとみられます。
        </p>

        <p>
          80万人台・70万人台まで範囲を広げると、堺市・浜松市・
          新潟市・熊本市・相模原市・岡山市・静岡市といった、
          いずれも政令指定都市クラスの顔ぶれが並びます。
          これらの都市に共通するのは、人口規模こそ100万人に
          届かないものの、都道府県内で圧倒的な中心性を持ち、
          広域の経済・行政の拠点として機能している点です。
          「100万人都市ではないから小規模」というわけでは
          決してなく、日本の都市規模で見れば依然として
          トップクラスの自治体群であることが分かります。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：90万人・80万人都市についてよくある質問</h2>

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
          人口90万人・80万人台の都市は、100万人都市には
          一歩届かないながらも、日本の都市規模ランキングでは
          上位に位置する大都市です。100万人という区切りの
          手前・後ろで都市を見比べることで、単純な人口の
          大小だけでは見えてこない、それぞれの都市の特徴や
          立ち位置が見えてきます。
        </p>

        <p>
          <Link href="/articles/million-cities" style={link}>
            人口100万人以上の都市一覧を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/population-top50" style={link}>
            人口ランキングTOP50を見る
          </Link>
        </p>

        <CompareCTA />
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

const th: React.CSSProperties = {
  textAlign: "left",
  borderBottom: "2px solid #e5e7eb",
  padding: "8px 6px",
  fontSize: 14,
};

const td: React.CSSProperties = {
  borderBottom: "1px solid #f1f5f9",
  padding: "8px 6px",
  fontSize: 14,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
