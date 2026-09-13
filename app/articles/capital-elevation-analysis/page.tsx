import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getCapitalElevationRanking } from "@/lib/capitalElevation";

export const metadata = {
  alternates: { canonical: "/articles/capital-elevation-analysis" },
  title: "都道府県庁所在地 標高ランキング分析｜上位3県はすべて「盆地」",
  description:
    "国土地理院のデータで都道府県庁所在地の標高を比較。1位長野市(371.5m)・2位甲府市(270.4m)・3位山形市(198.6m)は、いずれも周囲を山に囲まれた「盆地」の都市でした。",
};

export default function Page() {
  const ranking = getCapitalElevationRanking();
  const top12 = ranking.slice(0, 12);
  const bottom10 = ranking.slice(-10);
  const average =
    ranking.reduce((s, c) => s + c.elevationM, 0) / ranking.length;

  const faq = [
    {
      q: "都道府県庁所在地の標高で1位はどこですか？",
      a: `${ranking[0].pref}${ranking[0].city}で、標高371.5mです。日本アルプスに囲まれた長野盆地に位置しています。`,
    },
    {
      q: "なぜ上位の県庁所在地には盆地の都市が多いのですか？",
      a: "長野市・甲府市・山形市はいずれも、周囲を山に囲まれた盆地に発達した城下町です。盆地は水資源が豊富で農業に適し、周囲の山地からの交通の要衝にもなりやすいため、古くから人が集まり、都市として発展しやすい地形だったと考えられます。",
    },
    {
      q: "標高が最も低い県庁所在地はどこですか？",
      a: `${ranking[ranking.length - 1].pref}${
        ranking[ranking.length - 1].city
      }で、標高${ranking[ranking.length - 1].elevationM}mです。港湾都市として発展した県庁所在地の多くは、海に近い低地に位置しています。`,
    },
  ];

  return (
    <ArticleLayout
      title="都道府県庁所在地 標高ランキング分析｜上位3県はすべて「盆地」の都市"
      summary={`国土地理院のデータで47都道府県庁所在地の標高を比較すると、平均は${average.toFixed(
        1
      )}mでした。上位3県(長野市・甲府市・山形市)は、いずれも周囲を山に囲まれた「盆地」の都市という共通点がありました。`}
      heroLabel="都道府県庁所在地の平均標高"
      heroValue={`${average.toFixed(1)}m`}
      rankingLink="/ranking/capital-elevation"
      path="/articles/capital-elevation-analysis"
      tags={["population"]}
      publishedAt="2026-09-13"
      top3={top12.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: `${c.pref} ${c.city}`,
        value: `${c.elevationM}m`,
      }))}
    >
      <div style={box}>
        <h2>標高TOP12</h2>

        <p>
          国土地理院「都道府県の庁舎及び東西南北端点の経緯度」データを
          もとに、47都道府県庁所在地の標高を比較しました。平均は
          {average.toFixed(1)}mですが、最も高い長野市と最も低い長崎市
          では、実に180倍近い差があります。
        </p>

        <RankingBarChart
          items={top12.map((c) => ({
            name: `${c.pref} ${c.city}`,
            value: c.elevationM,
            displayValue: `${c.elevationM}m`,
          }))}
        />
      </div>

      <div style={box}>
        <h2>上位3県は、すべて「盆地」の都市</h2>

        <p>
          1位の長野市(371.5m)、2位の甲府市(270.4m)、3位の山形市
          (198.6m)には、共通点があります。いずれも、周囲を山に
          囲まれた「盆地」に発達した城下町だということです。
        </p>

        <div className="pull-note">
          <span className="stat-chip">長野盆地(長野市)</span>
          <span className="stat-chip">甲府盆地(甲府市)</span>
          <span className="stat-chip">山形盆地(山形市)</span>
          <br style={{ display: "block", marginBottom: 8 }} />
          盆地は周囲の山地からの水資源に恵まれ、農業に適した
          土地であると同時に、山を越える交通路が集まる要衝にも
          なりやすい地形です。城下町として発展した都市の多くが
          盆地に位置しているのは、決して偶然ではありません。
        </div>

        <p>
          4位の盛岡市(128.3m)、6位の前橋市(108.4m)も、内陸に
          位置する都市です。標高の高い県庁所在地の多くが、海から
          離れた内陸県に集中していることが分かります。
        </p>
      </div>

      <div style={box}>
        <h2>標高が低いのは、港湾都市</h2>

        <p>
          逆に標高が低い県庁所在地は、古くから港として栄えた
          都市が中心です。
        </p>

        <div style={{ margin: "12px 0" }}>
          {bottom10.map((c) => (
            <span className="stat-chip" key={c.pref}>
              {c.pref} {c.city}({c.elevationM}m)
            </span>
          ))}
        </div>

        <p>
          最も低い{ranking[ranking.length - 1].pref}
          {ranking[ranking.length - 1].city}(
          {ranking[ranking.length - 1].elevationM}m)をはじめ、
          神奈川県横浜市(2.5m)、青森県青森市(2.6m)など、いずれも
          港を中心に発展してきた都市です。人口の多い大都市である
          東京都(新宿区、34.9m)や大阪府(大阪市、15.5m)も、実は
          そこまで標高が高くありません。都市の規模と標高には、
          直接の関係がないことが分かります。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：県庁所在地の標高についてよくある質問</h2>

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
          都道府県庁所在地の標高を比較すると、盆地に発達した内陸の
          城下町(長野市・甲府市・山形市)と、港を中心に発展した
          臨海都市(長崎市・横浜市)という、日本の都市が歩んできた
          2つの発展パターンが、標高という一つの数字からも見えて
          きます。
        </p>

        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 16 }}>
          出典：国土地理院「都道府県の庁舎及び東西南北端点の経緯度
          (世界測地系)」(約5m四方間隔の航空レーザ測量、誤差0.3m以内)
        </p>

        <p>
          <Link href="/ranking/capital-elevation" style={link}>
            都道府県庁所在地 標高ランキングを見る
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
