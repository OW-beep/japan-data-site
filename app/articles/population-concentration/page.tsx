import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/population-concentration" },
  title: "県内一極集中度ランキング｜高知市は県人口の48%、水戸市はわずか9%",
  description:
    "都道府県ごとに「最大都市に人口がどれだけ集中しているか」を独自集計。高知県は県人口の48%が高知市に集中する一方、茨城県は県庁所在地の水戸市でもわずか9%という対照的な結果になりました。",
};

export default function Page() {
  const municipalities = getMunicipalities().filter(
    (c) => c.population >= 3000
  );

  const totalPopulation = municipalities.reduce(
    (s, c) => s + c.population,
    0
  );

  const prefGroups: Record<
    string,
    { name: string; population: number }[]
  > = {};
  municipalities.forEach((c) => {
    const pref = c.name.split(" ")[0];
    if (!prefGroups[pref]) prefGroups[pref] = [];
    prefGroups[pref].push({ name: c.name, population: c.population });
  });

  const concentration = Object.entries(prefGroups).map(
    ([pref, cities]) => {
      const total = cities.reduce((s, c) => s + c.population, 0);
      const top1 = [...cities].sort(
        (a, b) => b.population - a.population
      )[0];
      const shortName = top1.name.includes(" ")
        ? top1.name.split(" ").slice(1).join(" ")
        : top1.name;
      return {
        pref,
        topCityName: shortName,
        share: (top1.population / total) * 100,
        cityCount: cities.length,
        total,
      };
    }
  );

  const sorted = [...concentration].sort((a, b) => b.share - a.share);
  const top10 = sorted.slice(0, 10);
  const bottom5 = sorted.slice(-5).reverse();
  const avgShare =
    concentration.reduce((s, c) => s + c.share, 0) / concentration.length;

  const gtokyo = ["東京都", "神奈川県", "埼玉県", "千葉県"];
  const gtokyoTotal = gtokyo.reduce(
    (s, p) => s + (prefGroups[p]?.reduce((a, c) => a + c.population, 0) ?? 0),
    0
  );

  const faq = [
    {
      q: "都道府県の中で、最大都市への人口集中度が最も高いのはどこですか？",
      a: `高知県です。県内人口の${top10[0].share.toFixed(1)}%が${top10[0].topCityName}に集中しています。県内に${top10[0].cityCount}の市町村がある中、1つの市に半数近くの人口が集まっている計算です。`,
    },
    {
      q: "逆に、最大都市への集中度が最も低いのはどこですか？",
      a: `茨城県です。県庁所在地である水戸市でも、県内人口に占める割合は${bottom5[bottom5.length - 1].share.toFixed(1)}%にとどまります。県内に大きな人口の受け皿となる都市が複数あり、特定の市に集中しない分散型の構造になっています。`,
    },
    {
      q: "都道府県の集中度には、どんな傾向がありますか？",
      a: `47都道府県平均では、最大都市が県人口の${avgShare.toFixed(1)}%を占めています。四国・九州など、県庁所在地以外に大きな都市を持たない県ほど集中度が高く、関東地方のように複数の中核市が並立する地域ほど集中度が低くなる傾向があります。`,
    },
  ];

  return (
    <ArticleLayout
      title="県内一極集中度ランキング：高知市は県人口の48%、水戸市はわずか9%"
      summary={`都道府県ごとに「最大都市に人口がどれだけ集中しているか」を独自に集計しました。最も集中度が高いのは高知県で、県人口の${top10[0].share.toFixed(1)}%が高知市に集まっています。一方、茨城県は県庁所在地の水戸市でも${bottom5[bottom5.length - 1].share.toFixed(1)}%にとどまり、県内に人口の受け皿となる都市が分散しています。`}
      heroLabel="県内一極集中度 全国1位"
      heroValue={`${top10[0].pref} ${top10[0].share.toFixed(1)}%`}
      rankingLink="/ranking/population"
      path="/articles/population-concentration"
      tags={["population"]}
      publishedAt="2026-02-20"
      top3={[
        { rank: 1, name: top10[0].pref, value: `${top10[0].share.toFixed(1)}%` },
        { rank: 2, name: top10[1].pref, value: `${top10[1].share.toFixed(1)}%` },
        { rank: 3, name: top10[2].pref, value: `${top10[2].share.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          「人口が集中している」という話は、たいてい東京都
          や首都圏を指して語られます。しかし都道府県を
          「県内で見たとき」の集中度に注目すると、まったく
          別の顔が見えてきます。今回、47都道府県それぞれで
          「最大都市が県人口の何%を占めているか」を独自に
          算出しました。
        </p>
      </div>

      <div style={box}>
        <h2>県内一極集中度 TOP10</h2>

        <RankingBarChart
          items={top10.map((c) => ({
            name: `${c.pref}(${c.topCityName})`,
            value: c.share,
            displayValue: `${c.share.toFixed(1)}%`,
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位は高知県で、県人口の{top10[0].share.toFixed(1)}
          %が高知市に集中しています。2位の香川県(高松市
          {top10[1].share.toFixed(1)}%)、3位の大分県(大分市
          {top10[2].share.toFixed(1)}%)と続き、四国・九州の
          県が上位を占めます。これらの県に共通するのは、
          県庁所在地以外に人口10万人を超えるような
          対抗馬となる都市がなく、県内の商業・行政機能が
          1つの都市にほぼ一極集中している点です。興味深いのは
          東京都も{
            top10.find((c) => c.pref === "東京都")?.share.toFixed(1)
          }
          %で全国4位に入ることです。「日本で最も人口が
          多い都道府県」であると同時に、「都内で見ても
          特別区部への一極集中が進んでいる」という、
          二重の集中構造を持っています。
        </p>
      </div>

      <div style={box}>
        <h2>逆に分散しているのは関東の県</h2>

        <RankingBarChart
          items={bottom5.map((c) => ({
            name: `${c.pref}(${c.topCityName})`,
            value: c.share,
            displayValue: `${c.share.toFixed(1)}%`,
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          最も集中度が低いのは茨城県で、県庁所在地の水戸市
          でも県人口の{bottom5[bottom5.length - 1].share.toFixed(1)}
          %しかありません。千葉県・埼玉県・三重県・静岡県も
          同様に低い水準です。これらの県は、県庁所在地
          以外にも人口規模の大きな都市が複数存在し、県内の
          人口が特定の1市に集まらず分散しています。特に
          千葉県・埼玉県は首都圏のベッドタウンとして
          複数の都市が同時に発展してきた歴史があり、
          「県庁所在地が一番人口が多いとは限らない」という
          珍しい現象も起きています。
        </p>
      </div>

      <div style={box}>
        <h2>全国レベルの集中も、桁違いに大きい</h2>

        <p>
          都道府県内の集中とは別に、全国レベルで見ると
          さらに大きな集中が起きています。東京都・神奈川県・
          埼玉県・千葉県の「1都3県(首都圏)」だけで、全国
          {municipalities.length.toLocaleString()}自治体の
          人口のうち
          {((gtokyoTotal / totalPopulation) * 100).toFixed(1)}
          %を占めています。都道府県の数で見れば47のうち
          わずか4県ですが、そこに人口の
          {((gtokyoTotal / totalPopulation) * 100).toFixed(0)}
          %近くが集まっている計算です。つまり日本の人口
          集中は「首都圏への全国レベルの集中」と「県内での
          最大都市への集中」という、スケールの異なる2つの
          集中構造が同時に起きていることになります。
        </p>
      </div>

      <div style={box}>
        <h2>集中度の高さは何を意味するのか</h2>

        <p>
          県内一極集中度が高い県では、県庁所在地に
          行政・商業・医療機能が集約されている分、都市
          機能へのアクセスは効率的です。一方で、その都市に
          何らかの災害や機能停止が起きた場合、県全体への
          影響が大きくなりやすいという弱点もあります。逆に
          集中度が低い県は、複数の都市が機能を分担している
          ぶん、リスクが分散されている半面、県として
          一体感のある都市戦略を描きにくいという側面も
          あります。どちらが良い・悪いという話ではなく、
          その県が歴史的にどう発展してきたかを映す指標
          として読むのが妥当です。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：県内一極集中度についてよくある質問</h2>

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
          都道府県別の集中度を独自に算出したことで、
          「東京一極集中」という全国レベルの話とは別に、
          「県内一極集中」というもう1つの集中構造が
          見えてきました。高知県・香川県・大分県のように
          1つの都市に人口が集まる県もあれば、茨城県・
          千葉県・埼玉県のように複数の都市に分散している
          県もあります。人口ランキングを都道府県単位で
          見るときは、全国順位だけでなく、その県の中で
          どれだけ人口が偏っているかにも目を向けると、
          新しい発見があります。
        </p>

        <p>
          <Link href="/ranking/population" style={link}>
            人口ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/prefecture" style={link}>
            都道府県から探す
          </Link>
          {" ｜ "}
          <Link href="/articles/population-about" style={link}>
            人口ランキングとは？を見る
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
