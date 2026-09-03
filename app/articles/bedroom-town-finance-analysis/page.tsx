import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/bedroom-town-finance-analysis" },
  title: "「豊かなベッドタウン」ランキング分析｜市川市はなぜ財政力指数1.07なのか",
  description:
    "昼夜間人口比率(職住近接度)と財政力指数を掛け合わせて分析。ベッドタウンは平均的に財政力が弱い一方、千葉県市川市のように財政力指数1.07という「雇用を生まなくても豊かな」自治体が48市町見つかりました。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.population >= 3000 &&
        c.daytimePopulation &&
        c.nighttimePopulation &&
        c.financeIndex != null
    )
    .map((c) => ({
      ...c,
      dayNightRatio: ((c.daytimePopulation ?? 0) / (c.nighttimePopulation ?? 1)) * 100,
    }));

  const sorted = [...base].sort((a, b) => a.dayNightRatio - b.dayNightRatio);
  const bedroomTowns = sorted.slice(0, Math.floor(sorted.length * 0.2));
  const jobCenters = [...base]
    .sort((a, b) => b.dayNightRatio - a.dayNightRatio)
    .slice(0, Math.floor(sorted.length * 0.2));

  const avgFinBedroom =
    bedroomTowns.reduce((s, c) => s + (c.financeIndex ?? 0), 0) /
    bedroomTowns.length;
  const avgFinJob =
    jobCenters.reduce((s, c) => s + (c.financeIndex ?? 0), 0) /
    jobCenters.length;

  const wealthyBedroomTowns = bedroomTowns
    .filter((c) => (c.financeIndex ?? 0) > 0.8)
    .sort((a, b) => (b.financeIndex ?? 0) - (a.financeIndex ?? 0));

  const top10Wealthy = wealthyBedroomTowns.slice(0, 10);

  const faq = [
    {
      q: "ベッドタウンは財政力が弱いのですか？",
      a: `平均的にはその傾向があります。昼夜間人口比率が低い(ベッドタウン度が高い)自治体の財政力指数の平均は${avgFinBedroom.toFixed(
        3
      )}であるのに対し、比率が高い(雇用の受け皿となっている)自治体の平均は${avgFinJob.toFixed(
        3
      )}でした。`,
    },
    {
      q: "ベッドタウンなのに財政力が高い自治体はありますか？",
      a: `あります。今回の集計では、ベッドタウン(昼夜間人口比率が下位20%)に分類される自治体のうち${wealthyBedroomTowns.length}市町村で、財政力指数が0.8を超えていました。代表例は千葉県市川市(財政力指数${top10Wealthy[0]?.financeIndex?.toFixed(
        2
      )})です。`,
    },
    {
      q: "なぜ市川市は雇用の受け皿ではないのに財政力が高いのですか？",
      a: "東京都心へのアクセスが良く、比較的所得水準の高い層が居住していることが要因と考えられます。住民税収入が、地元での雇用創出を経なくても自治体の税収基盤を支えている状態です。",
    },
  ];

  return (
    <ArticleLayout
      title="「豊かなベッドタウン」ランキング分析：市川市はなぜ財政力指数1.07なのか"
      summary={`昼夜間人口比率(職住近接度)と財政力指数を掛け合わせて分析しました。ベッドタウン(昼間人口が少ない自治体)は平均的に財政力指数${avgFinBedroom.toFixed(
        3
      )}と、雇用の受け皿となる自治体(平均${avgFinJob.toFixed(
        3
      )})より弱い傾向がありますが、千葉県市川市のように財政力指数${top10Wealthy[0]?.financeIndex?.toFixed(
        2
      )}という「雇用を生まなくても豊かな」自治体も見つかりました。`}
      heroLabel="豊かなベッドタウン 財政力指数トップ"
      heroValue={`${top10Wealthy[0]?.name} ${top10Wealthy[0]?.financeIndex?.toFixed(2)}`}
      rankingLink="/ranking/bedroom-town-finance"
      path="/articles/bedroom-town-finance-analysis"
      tags={["finance"]}
      publishedAt="2026-08-24"
      top3={[
        { rank: 1, name: top10Wealthy[0]?.name ?? "", value: top10Wealthy[0]?.financeIndex?.toFixed(2) ?? "" },
        { rank: 2, name: top10Wealthy[1]?.name ?? "", value: top10Wealthy[1]?.financeIndex?.toFixed(2) ?? "" },
        { rank: 3, name: top10Wealthy[2]?.name ?? "", value: top10Wealthy[2]?.financeIndex?.toFixed(2) ?? "" },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          昼夜間人口比率ランキング分析の記事では、比率が低い
          (夜間人口の方が多い)自治体を「典型的なベッドタウン」
          として紹介しました。今回はそこに財政力指数を掛け
          合わせ、「雇用を生み出しているかどうか」と「税収
          基盤の強さ」の関係を分析しました。
        </p>
      </div>

      <div style={box}>
        <h2>ベッドタウンは平均的に財政力が弱い</h2>

        <p>
          昼夜間人口比率が下位20%の自治体(ベッドタウン)の
          財政力指数の平均は{avgFinBedroom.toFixed(3)}で
          あるのに対し、上位20%の自治体(雇用の受け皿)の
          平均は{avgFinJob.toFixed(3)}でした。日中に人が
          集まり、企業が立地する自治体ほど、法人関連の
          税収も含めて財政基盤が強くなる傾向があると
          考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>それでも財政力の高い「豊かなベッドタウン」TOP10</h2>

        <RankingBarChart
          items={top10Wealthy.map((c) => ({
            name: c.name,
            value: c.financeIndex ?? 0,
            displayValue: (c.financeIndex ?? 0).toFixed(2),
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の千葉県市川市は、昼夜間人口比率
          {top10Wealthy[0]?.dayNightRatio.toFixed(1)}という
          典型的なベッドタウンでありながら、財政力指数は
          {top10Wealthy[0]?.financeIndex?.toFixed(2)}と、
          全国平均を大きく上回ります。東京都心への交通
          アクセスの良さから、比較的所得水準の高い層が
          居住しており、地元で雇用を生み出さなくても、
          住民税収入だけで強い財政基盤を維持できている
          状態です。国分寺市・守谷市・朝霞市なども同様の
          パターンに当てはまります。
        </p>

        <PersonalNote>
          この分析をしていて、「自治体が豊かになる道は1つ
          ではない」ということを改めて感じました。企業を
          誘致して雇用を生み出す道と、市川市のように「住む
          場所として選ばれる」道は、どちらも財政力を高める
          方法ですが、性質はまったく異なります。産業の
          多様性指数の記事で見た「一極集中ほど財政が豊か」
          という発見とあわせて考えると、日本の自治体の
          豊かさは、産業構造だけでなく、どんな人にどこに
          住んでもらうかという都市戦略によっても大きく
          左右されると感じています。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          財政力指数は住民税・固定資産税・法人関連税など
          複数の要因が組み合わさって決まるため、昼夜間
          人口比率だけで財政力の高低が説明できるわけでは
          ありません。今回の「豊かなベッドタウン」も、
          交通利便性・地価・産業誘致の歴史など、個別の
          事情が背景にあります。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：ベッドタウンの財政力についてよくある質問</h2>

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
          ベッドタウンは平均的には財政力が弱いものの、
          市川市のような「豊かなベッドタウン」も一定数
          存在することが分かりました。昼夜間人口比率
          ランキング分析、産業の多様性指数とあわせて
          読むことで、自治体が豊かになる道筋の多様さが
          見えてきます。
        </p>

        <p>
          <Link href="/articles/daytime-ratio-analysis" style={link}>
            昼夜間人口比率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/industry-diversity-index" style={link}>
            産業の多様性指数(HHI)を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/fiscal-health-composite" style={link}>
            財政健全度スコア(4指標統合)を見る
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
