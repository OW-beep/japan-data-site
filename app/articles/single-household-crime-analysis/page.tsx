import { getMunicipalities } from "@/lib/municipalities";
import { getPrefectureStats } from "@/lib/prefectureStats";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import RakutenGifts from "@/components/RakutenGifts";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";

export const metadata = {
  alternates: { canonical: "/articles/single-household-crime-analysis" },
  title:
    "単身世帯率と犯罪率の関係｜東京都は「一人暮らし率1位なのに犯罪率は7位」",
  description:
    "都道府県別の単身世帯率(本サイト集計)と刑法犯認知件数(総務省)を掛け合わせて分析。相関係数は0.38で、人口密度との相関(0.43)よりやや弱め。東京都は単身世帯率全国1位でありながら犯罪率は7位という意外な結果に。",
};

function corr(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  const cov = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const sx = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0));
  const sy = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0));
  return cov / (sx * sy);
}

export default function Page() {
  const cities = getMunicipalities();
  const prefStats = getPrefectureStats().filter((r) => r.stats.crimeRate != null);

  const agg = new Map<string, { single: number; total: number }>();
  cities.forEach((c) => {
    if (!c.households || c.singleHouseholds == null) return;
    const pref = c.name.split(" ")[0];
    const cur = agg.get(pref) ?? { single: 0, total: 0 };
    cur.single += c.singleHouseholds;
    cur.total += c.households;
    agg.set(pref, cur);
  });

  const rows = prefStats
    .filter((r) => agg.has(r.pref))
    .map((r) => {
      const a = agg.get(r.pref)!;
      return {
        pref: r.pref,
        singleRatio: (a.single / a.total) * 100,
        crimeRate: r.stats.crimeRate ?? 0,
      };
    });

  const correlation = corr(
    rows.map((r) => r.singleRatio),
    rows.map((r) => r.crimeRate)
  );

  const bySingle = [...rows].sort((a, b) => b.singleRatio - a.singleRatio);
  const byCrime = [...rows].sort((a, b) => b.crimeRate - a.crimeRate);

  const tokyo = rows.find((r) => r.pref === "東京都")!;
  const tokyoCrimeRank = byCrime.findIndex((r) => r.pref === "東京都") + 1;
  const osaka = rows.find((r) => r.pref === "大阪府")!;

  const top10Single = bySingle.slice(0, 10);

  const faq = [
    {
      q: "単身世帯率と犯罪率には関係がありますか？",
      a: `一定の関係は見られますが、強い相関ではありません。相関係数は${correlation.toFixed(
        2
      )}で、本サイトの別記事で見た人口密度と犯罪率の相関係数0.43よりもやや弱い結果でした。`,
    },
    {
      q: "単身世帯率が最も高い都道府県はどこですか？",
      a: `東京都で${top10Single[0].singleRatio.toFixed(
        1
      )}%です。2位の大阪府(${top10Single[1].singleRatio.toFixed(
        1
      )}%)を大きく引き離しています。`,
    },
    {
      q: "東京都の犯罪率はどのくらいの順位ですか？",
      a: `単身世帯率は全国1位ですが、犯罪率(人口千人あたり${tokyo.crimeRate})は全国${tokyoCrimeRank}位にとどまります。単身世帯が多いことが、そのまま犯罪率の高さに直結するわけではないことを示す例です。`,
    },
  ];

  return (
    <ArticleLayout
      title="単身世帯率と犯罪率の関係｜東京都は「1位なのに7位」の謎"
      summary={`都道府県別の単身世帯率と刑法犯認知件数を掛け合わせると、相関係数は${correlation.toFixed(
        2
      )}。東京都は単身世帯率が全国1位(${top10Single[0].singleRatio.toFixed(
        1
      )}%)でありながら、犯罪率は全国${tokyoCrimeRank}位という意外な結果になりました。`}
      heroLabel="単身世帯率 全国1位"
      heroValue={`${top10Single[0].pref} ${top10Single[0].singleRatio.toFixed(1)}%`}
      rankingLink="/ranking/crime-rate"
      path="/articles/single-household-crime-analysis"
      tags={["household"]}
      publishedAt="2026-09-23"
      top3={top10Single.slice(0, 3).map((r, i) => ({
        rank: i + 1,
        name: r.pref,
        value: `${r.singleRatio.toFixed(1)}%`,
      }))}
    >
      <div style={box}>
        <p style={lead}>
          「一人暮らしが多い地域は治安が悪いのでは」という印象を持つ人は
          少なくありません。本サイトが持つ市区町村単位の世帯データ(単身
          世帯率)を都道府県ごとに集計し、総務省「社会・人口統計体系」の
          刑法犯認知件数(人口千人あたり)と掛け合わせて、実際の関係を
          検証しました。
        </p>
      </div>

      <div style={box}>
        <h2>単身世帯率TOP10</h2>

        <p>
          1位は{top10Single[0].pref}({top10Single[0].singleRatio.toFixed(1)}
          %)で、2位の{top10Single[1].pref}(
          {top10Single[1].singleRatio.toFixed(1)}%)、3位の
          {top10Single[2].pref}({top10Single[2].singleRatio.toFixed(1)}%)を
          引き離しています。全国平均は
          {(rows.reduce((s, r) => s + r.singleRatio, 0) / rows.length).toFixed(
            1
          )}
          %でした。
        </p>

        <RankingBarChart
          items={top10Single.map((r) => ({
            name: r.pref,
            value: r.singleRatio,
            displayValue: `${r.singleRatio.toFixed(1)}%`,
          }))}
          barColor="#6d28d9"
        />
      </div>

      <div style={box}>
        <h2>相関係数0.38 ── 密度との相関(0.43)よりやや弱い</h2>

        <p>
          単身世帯率と犯罪率の相関係数は{correlation.toFixed(2)}でした。
          正の相関ではあるものの、人口密度と犯罪率の相関係数0.43(別記事
          「刑法犯認知件数ランキング分析」で検証)と比べるとやや弱く、
          「単身世帯が多い＝犯罪が多い」と単純には言い切れない結果です。
        </p>

        <div className="pull-note">
          <strong>{osaka.pref}</strong>
          は単身世帯率{osaka.singleRatio.toFixed(1)}%(全国2位)・犯罪率
          {osaka.crimeRate}(全国1位)と、両方の指標で上位に入る数少ない
          都道府県です。
        </div>
      </div>

      <div style={box}>
        <h2>東京都は「単身世帯率1位なのに犯罪率{tokyoCrimeRank}位」</h2>

        <p>
          最も意外だったのが東京都です。単身世帯率は
          {top10Single[0].singleRatio.toFixed(1)}%で全国1位、2位の大阪府と
          比べても7ポイント以上高い水準ですが、犯罪率(人口千人あたり
          {tokyo.crimeRate})は全国{tokyoCrimeRank}位にとどまります。
          単身世帯が多いこと自体が犯罪率を押し上げるわけではなく、防犯
          カメラの設置数やオートロック物件の普及率など、都市インフラ側
          の要因が影響している可能性があります。
        </p>

        <p>
          一方で、群馬県・茨城県・栃木県のように、単身世帯率は全国平均
          並みでありながら犯罪率が上位に入る県もあります。刑法犯認知件数
          ランキング分析の記事で触れたとおり、幹線道路沿いの広域からの
          人の流入など、単身世帯率とは別の要因が影響していると考えられ
          ます。
        </p>
      </div>

      <RakutenGifts
        keyword="防犯グッズ 一人暮らし 窓"
        heading="一人暮らしの防犯対策として人気の商品を楽天市場で見る"
      />

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          単身世帯率には、都心部で暮らす20〜30代の単身者だけでなく、
          過疎地域で暮らす独居高齢者も含まれます。同じ「単身世帯率が
          高い」でも、地域によって中身が大きく異なる点には注意が必要
          です。また犯罪率は都道府県単位のデータのため、同じ都道府県
          内でも市区町村ごとの差は反映されていません。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：単身世帯率と犯罪率についてよくある質問</h2>

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
          単身世帯率と犯罪率には相関係数0.38の緩やかな関係が見られました
          が、人口密度ほど強い関係ではなく、東京都のような例外も存在
          します。「一人暮らしが多い＝危険」という単純な図式ではなく、
          都市インフラや土地利用など複数の要因が絡み合っていると考える
          のが妥当です。
        </p>

        <p>
          <Link prefetch={false} href="/articles/crime-rate-analysis" style={link}>
            刑法犯認知件数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/household-analysis" style={link}>
            単独世帯割合分析を見る
          </Link>
          {" ｜ "}
          <Link
            prefetch={false}
            href="/articles/real-estate-single-household-analysis"
            style={link}
          >
            地価と単身世帯率の相関分析を見る
          </Link>
        </p>

        <p
          style={{
            fontSize: 13,
            color: "var(--muted, #6b7280)",
            marginTop: 16,
          }}
        >
          出典：総務省「社会・人口統計体系」(刑法犯認知件数)、本サイト集計
          (市区町村別世帯データ)
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
