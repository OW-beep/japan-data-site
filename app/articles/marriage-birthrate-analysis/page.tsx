import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/marriage-birthrate-analysis" },
  title: "婚姻率と出生率の関係｜東京都心は「結婚は多いのに子どもは少ない」",
  description:
    "人口1,000人あたりの婚姻件数(婚姻率)と出生率の相関係数は、全自治体では0.17とほぼ無相関ですが、人口30万人以上の大都市に絞ると-0.51と強い逆相関に。東京都心の特別区ほど婚姻率が高く出生率が低いという、意外な関係を検証します。",
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
  const all = getMunicipalities()
    .filter(
      (c) => c.marriages != null && c.birthRate != null && c.population >= 3000
    )
    .map((c) => ({ ...c, marriageRate: ((c.marriages ?? 0) / c.population) * 1000 }));

  const correlationAll = corr(
    all.map((c) => c.marriageRate),
    all.map((c) => c.birthRate ?? 0)
  );

  const big = all.filter((c) => c.population >= 300000);
  const correlationBig = corr(
    big.map((c) => c.marriageRate),
    big.map((c) => c.birthRate ?? 0)
  );

  const byMarriage = [...big].sort((a, b) => b.marriageRate - a.marriageRate);
  const topMarriage = byMarriage.slice(0, 8);
  const byBirth = [...big].sort((a, b) => (b.birthRate ?? 0) - (a.birthRate ?? 0));
  const topBirth = byBirth.slice(0, 5);
  const avgBirthBig = big.reduce((s, c) => s + (c.birthRate ?? 0), 0) / big.length;

  const faq = [
    {
      q: "婚姻率と出生率には関係がありますか？",
      a: `人口3,000人以上の全${all.length}自治体で相関係数を計算すると${correlationAll.toFixed(
        2
      )}とほぼ無相関でした。ただし人口30万人以上の大都市${big.length}市区に絞ると相関係数は${correlationBig.toFixed(
        2
      )}と、強い逆相関になります。`,
    },
    {
      q: "婚姻率が最も高い大都市はどこですか？",
      a: `${topMarriage[0].name}で、人口1,000人あたり${topMarriage[0].marriageRate.toFixed(
        2
      )}件です。ただし出生率は${topMarriage[0].birthRate?.toFixed(2)}と、大都市平均(${avgBirthBig.toFixed(
        2
      )})を下回ります。`,
    },
    {
      q: "なぜ婚姻率が高い都市ほど出生率が低いのですか？",
      a: "婚姻届は居住地以外でも提出できるため、婚姻率には利便性やイメージで届出先に選ばれた「結婚だけの街」という側面が含まれます。加えて都心部は住宅費や共働き世帯の労働時間の長さから、結婚後に出産・子育ての段階で郊外や地方に転出するケースも多いと考えられます。",
    },
  ];

  return (
    <ArticleLayout
      title="婚姻率と出生率の関係｜東京都心は「結婚は多いのに子どもは少ない」"
      summary={`人口1,000人あたりの婚姻件数(婚姻率)と出生率の相関係数は、全自治体では${correlationAll.toFixed(
        2
      )}とほぼ無相関ですが、人口30万人以上の大都市に絞ると${correlationBig.toFixed(
        2
      )}と強い逆相関に転じます。${topMarriage[0].name}は婚姻率が大都市トップながら、出生率は平均を下回るという結果でした。`}
      heroLabel="婚姻率 大都市トップ"
      heroValue={`${topMarriage[0].name.split(" ")[1] ?? topMarriage[0].name} 1,000人あたり${topMarriage[0].marriageRate.toFixed(2)}件`}
      rankingLink="/articles/marriage-rate-analysis"
      path="/articles/marriage-birthrate-analysis"
      tags={["child"]}
      publishedAt="2026-09-29"
      top3={topMarriage.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `婚姻率${c.marriageRate.toFixed(2)} / 出生率${c.birthRate?.toFixed(2)}`,
      }))}
    >
      <div style={box}>
        <p style={lead}>
          「結婚する人が多い街は、子どもも多いはず」と考えるのが自然
          です。ところが実際にデータを見ると、少なくとも大都市に
          関しては、この直感は裏切られます。婚姻率(人口1,000人あたり
          の婚姻件数)と出生率の関係を検証しました。
        </p>
      </div>

      <div style={box}>
        <h2>全自治体ではほぼ無関係、しかし大都市だけを見ると</h2>

        <p>
          人口3,000人以上の全{all.length}自治体で相関係数を計算すると
          {correlationAll.toFixed(2)}で、婚姻率と出生率にはほとんど
          関係が見られません。ところが、人口30万人以上の大都市
          {big.length}市区に絞り込むと、相関係数は
          <strong>{correlationBig.toFixed(2)}</strong>
          という、はっきりとした逆相関に転じます。婚姻率が高い大都市
          ほど、出生率は低い傾向があるということです。
        </p>

        <RankingBarChart
          items={topMarriage.map((c) => ({
            name: c.name.split(" ")[1] ?? c.name,
            value: c.marriageRate,
            displayValue: `婚姻率${c.marriageRate.toFixed(2)}`,
          }))}
          barColor="#be185d"
        />
      </div>

      <div style={box}>
        <h2>{topMarriage[0].name}をはじめ、東京都心が上位を独占</h2>

        <p>
          婚姻率トップの{topMarriage[0].name}
          ({topMarriage[0].marriageRate.toFixed(2)})をはじめ、
          上位には
          {topMarriage
            .slice(1, 5)
            .map((c) => c.name.split(" ")[1] ?? c.name)
            .join("・")}
          など東京都心の特別区が並びます。一方で、これらの区の出生率
          は軒並み大都市平均({avgBirthBig.toFixed(2)})を下回っています。
        </p>

        <PersonalNote>
          婚姻届は本籍地・住所地に関わらず提出できるため、利便性や
          「結婚式のついでに」といった理由で都心区に届け出るケースも
          あります。婚姻率の高さがそのまま「その街で家庭を築く人が
          多い」ことを意味するとは限らない、という点には注意が必要
          です。
        </PersonalNote>

        <p>
          対照的に、出生率が高い大都市には
          {topBirth
            .map((c) => `${c.name.split(" ")[1] ?? c.name}(${c.birthRate?.toFixed(2)})`)
            .join("・")}
          などが並びます。{topBirth[0].name.split(" ")[1] ?? topBirth[0].name}
          は子育て支援策で知られる自治体で、婚姻率自体は
          {topMarriage[0].name.split(" ")[1] ?? topMarriage[0].name}
          ほど高くないものの、出生率では大都市の中でも上位に入って
          います。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：婚姻率と出生率についてよくある質問</h2>

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
          婚姻率と出生率は、全国全体で見るとほぼ無関係ですが、大都市
          同士で比べると、婚姻率が高い街ほど出生率が低いという、
          直感に反する結果になりました。婚姻届の提出先という手続き上
          の特性と、都心部特有の住宅費・働き方が影響していると考え
          られます。「結婚が多い街」と「子育てしやすい街」は、
          必ずしも同じではないという点が、このデータから見えてきます。
        </p>

        <p>
          <Link prefetch={false} href="/articles/marriage-rate-analysis" style={link}>
            婚姻率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/birth-rate" style={link}>
            出生率ランキング分析を見る
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
          出典：本サイト集計(市区町村別婚姻件数・出生率データ)。大都市の
          比較対象は人口30万人以上の{big.length}市区。
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
