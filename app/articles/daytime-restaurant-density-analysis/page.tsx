import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import RakutenGifts from "@/components/RakutenGifts";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/daytime-restaurant-density-analysis" },
  title:
    "昼間人口比率と飲食店密度の関係｜千代田区は住民1,000人あたり飲食店45件",
  description:
    "昼夜間人口比率と、夜間人口(住民)1,000人あたりの飲食店数を人口5万人以上の都市で突き合わせると、相関係数は0.87と非常に強い関係に。東京都千代田区は住民1,000人あたり45.4件と突出しており、オフィス街のランチ需要が飲食店密度を押し上げている実態が見えます。",
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
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.population >= 50000 &&
        c.daytimePopulation &&
        c.nighttimePopulation &&
        c.restaurantCount != null
    )
    .map((c) => ({
      ...c,
      dayNightRatio: (c.daytimePopulation! / c.nighttimePopulation!) * 100,
      restPer1000: ((c.restaurantCount ?? 0) / c.nighttimePopulation!) * 1000,
    }));

  const correlation = corr(
    base.map((c) => c.dayNightRatio),
    base.map((c) => c.restPer1000)
  );

  const ranking = [...base].sort((a, b) => b.dayNightRatio - a.dayNightRatio).slice(0, 15);
  const avgRest = base.reduce((s, c) => s + c.restPer1000, 0) / base.length;
  const top = ranking[0];

  const faq = [
    {
      q: "昼間人口比率と飲食店密度には関係がありますか？",
      a: `人口5万人以上の${base.length}都市で相関係数を計算したところ${correlation.toFixed(
        2
      )}と、本サイトで扱う指標の中でもかなり強い相関でした。昼間人口比率が高い(=通勤者が多く流入する)街ほど、住民数に対して飲食店の数が多い傾向がはっきり表れています。`,
    },
    {
      q: "住民1,000人あたりの飲食店数が全国で一番多いのはどこですか？",
      a: `${top.name}で、夜間人口(住民)1,000人あたり${top.restPer1000.toFixed(
        1
      )}件です。全国平均(${avgRest.toFixed(1)}件)の10倍以上にのぼります。`,
    },
    {
      q: "なぜオフィス街で「住民あたり」の飲食店数が跳ね上がるのですか？",
      a: "飲食店の主な客層は住民ではなく、日中に通勤してくるオフィスワーカーだからです。住民数を分母にすると、実際の利用者数に対して分母が極端に小さくなり、数値が跳ね上がります。",
    },
  ];

  return (
    <ArticleLayout
      title="昼間人口比率と飲食店密度の関係｜千代田区は住民1,000人あたり飲食店45件"
      summary={`昼夜間人口比率と、住民1,000人あたりの飲食店数の相関係数は${correlation.toFixed(
        2
      )}。東京都千代田区は住民1,000人あたり${top.restPer1000.toFixed(
        1
      )}件と全国平均の10倍以上で、オフィス街のランチ需要が飲食店密度を押し上げている実態が数字にはっきり表れています。`}
      heroLabel="飲食店密度(住民あたり) 全国1位"
      heroValue={`${top.name.split(" ")[1] ?? top.name} 1,000人あたり${top.restPer1000.toFixed(1)}件`}
      rankingLink="/ranking/restaurant"
      path="/articles/daytime-restaurant-density-analysis"
      tags={["industry"]}
      publishedAt="2026-09-25"
      top3={ranking.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `1,000人あたり${c.restPer1000.toFixed(1)}件`,
      }))}
    >
      <div style={box}>
        <p style={lead}>
          「オフィス街はランチ激戦区」というイメージを、データで確認
          してみます。本サイトの昼夜間人口比率(通勤・通学による人口の
          流入出)と、夜間人口(住民)1,000人あたりの飲食店数を、人口5万
          人以上の{base.length}都市で突き合わせました。
        </p>
      </div>

      <div style={box}>
        <h2>昼間人口比率TOP15と飲食店密度</h2>

        <p>
          1位の{top.name}は昼夜間人口比率{top.dayNightRatio.toFixed(1)}%、
          住民1,000人あたりの飲食店数は{top.restPer1000.toFixed(1)}件と、
          いずれも他を大きく引き離しています。上位には東京都心部の
          オフィス街(中央区・港区・新宿区・渋谷区)が並びます。
        </p>

        <RankingBarChart
          items={ranking.map((c) => ({
            name: c.name.split(" ")[1] ?? c.name,
            value: c.restPer1000,
            displayValue: `${c.restPer1000.toFixed(1)}件`,
          }))}
          barColor="#ea580c"
        />
      </div>

      <div style={box}>
        <h2>相関係数{correlation.toFixed(2)} ── かなり強い関係</h2>

        <p>
          昼間人口比率と飲食店密度の相関係数は{correlation.toFixed(2)}
          でした。本サイトで扱ってきた指標の中でも際立って強い相関で、
          「通勤者が多く流入する街ほど、住民数に対して飲食店が多い」
          という関係は、データ上かなりはっきりしています。全都市平均の
          飲食店密度は住民1,000人あたり{avgRest.toFixed(1)}件でした。
        </p>

        <div className="pull-note">
          {top.name}の飲食店密度は全国平均の
          {(top.restPer1000 / avgRest).toFixed(0)}倍。ただしこれは
          「住民が飲食店をよく使う」のではなく、
          「昼間だけ大量に流入する通勤者が主な客層になっている」ために
          住民数を分母にした数値が跳ね上がっている、という点に注意が
          必要です。
        </div>
      </div>

      <RakutenGifts
        keyword="ランチバッグ 保冷 弁当箱"
        heading="オフィスでのお弁当派に人気のランチグッズを楽天市場で見る"
      />

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          飲食店数は「夜間人口(住民)あたり」で計算しているため、
          オフィス街のように昼間人口が極端に多い地域では、実際の
          利用者数(通勤者を含む)に対する飲食店の充実度としては、
          この数値より緩やかである可能性があります。住宅街の
          飲食店事情を知りたい場合は、昼夜間人口比率が100%に近い
          都市同士で比較する方が実態に近くなります。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：昼間人口比率と飲食店密度についてよくある質問</h2>

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
          昼間人口比率と飲食店密度には、相関係数{correlation.toFixed(2)}
          という強い関係が見られました。ただしこれは「住民が外食好き」
          ということではなく、通勤者というデータに表れにくい客層が
          飲食店需要を支えていることの裏返しです。住民あたりの数値を
          見るときは、その街が「住宅街」か「オフィス街」かを念頭に
          置くことが大切です。
        </p>

        <p>
          <Link prefetch={false} href="/articles/daytime-ratio-analysis" style={link}>
            昼夜間人口比率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/restaurant-density" style={link}>
            飲食店密度ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/bedroom-town-finance-analysis" style={link}>
            ベッドタウン自治体の財政分析を見る
          </Link>
        </p>

        <p
          style={{
            fontSize: 13,
            color: "var(--muted, #6b7280)",
            marginTop: 16,
          }}
        >
          出典：本サイト集計(市区町村別昼夜間人口・飲食店数データ)。対象は
          人口5万人以上の{base.length}都市。
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
