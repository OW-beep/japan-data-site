import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import Link from "next/link";

export const metadata = {
  alternates: { canonical: "/articles/population-churn-analysis" },
  title: "人口の入れ替わり率ランキング分析｜大熊町・離島・都心区が上位の理由",
  description:
    "転入者数と転出者数を足した「人口の入れ替わり率(churn rate)」でランキング。人口が増えている・減っているだけでは見えない、住民がどれだけ入れ替わっているかを分析します。",
};

export default function Page() {
  const all = getMunicipalities().filter(
    (c) =>
      c.inMigrants != null && c.outMigrants != null && c.population > 0
  );

  const ranked = all
    .map((c) => ({
      name: c.name,
      population: c.population,
      churn: ((c.inMigrants! + c.outMigrants!) / c.population) * 100,
      net: ((c.inMigrants! - c.outMigrants!) / c.population) * 100,
    }))
    .sort((a, b) => b.churn - a.churn);

  const top15 = ranked.slice(0, 15);
  const bottom10 = ranked.slice(-10).reverse();
  const average =
    ranked.reduce((s, c) => s + c.churn, 0) / ranked.length;

  const faq = [
    {
      q: "人口の入れ替わり率が最も高い自治体はどこですか？",
      a: `${top15[0].name}で、人口の${top15[0].churn.toFixed(
        1
      )}%が1年間で転入・転出しています(全国平均は${average.toFixed(
        1
      )}%)。ただし転入超過率は${top15[0].net >= 0 ? "+" : ""}${top15[0].net.toFixed(
        1
      )}%で、入れ替わりが激しいことと人口が増えているかどうかは別の話です。`,
    },
    {
      q: "人口の入れ替わり率が最も低い自治体はどこですか？",
      a: `${bottom10[0].name}で、入れ替わり率は${bottom10[0].churn.toFixed(
        1
      )}%にとどまります。転入も転出もほとんどなく、同じ住民がそのまま高齢化していく「静かな人口減少」のタイプです。`,
    },
    {
      q: "入れ替わり率と転入超過率は何が違いますか？",
      a: "転入超過率(転入-転出)は人口が増えているか減っているかを示す指標です。一方、入れ替わり率(転入+転出)は、母数となる住民のうち何%が1年間で新しい顔ぶれに変わったかを示します。転入超過率がゼロでも、入れ替わり率が高ければ「人口は変わらないが住んでいる人は毎年大きく変わる」自治体だということになります。",
    },
  ];

  return (
    <ArticleLayout
      title="人口の入れ替わり率ランキング分析｜住民は毎年何%入れ替わる？"
      summary={`転入者数と転出者数を足し合わせた「人口の入れ替わり率」でランキングすると、人口増減ランキングとは全く違う顔ぶれが上位に並びます。全国平均は${average.toFixed(1)}%です。`}
      heroLabel="全国平均の人口入れ替わり率"
      heroValue={`${average.toFixed(1)}%`}
      rankingLink="/ranking/population"
      path="/articles/population-churn-analysis"
      tags={["population"]}
      publishedAt="2026-09-13"
      top3={top15.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `${c.churn.toFixed(1)}%`,
      }))}
    >
      <div style={box}>
        <h2>人口の「入れ替わり率」とは</h2>

        <p>
          自治体の人口統計というと、増えているか減っているか
          (転入超過率)に注目が集まりがちです。しかし、転入者数と
          転出者数を単純に足し合わせた「入れ替わり率」を見ると、
          全く別の実態が見えてきます。たとえ人口が全く変わって
          いなくても、転入と転出が両方とも活発であれば、住んでいる
          顔ぶれは毎年大きく変わっていることになります。
        </p>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.churn,
            displayValue: `${c.churn.toFixed(1)}%`,
          }))}
        />
      </div>

      <div style={box}>
        <h2>上位に並ぶ、3つの異なるパターン</h2>

        <p>
          入れ替わり率が高い自治体をTOP15まで見ていくと、
          背景が全く異なる3つのグループに分かれます。
        </p>

        <div className="pull-note">
          <strong>パターン1・原発事故からの復興途上にある町</strong>
          <div style={{ margin: "8px 0" }}>
            <span className="stat-chip">福島県 大熊町</span>
            <span className="stat-chip">福島県 富岡町</span>
            <span className="stat-chip">福島県 浪江町</span>
            <span className="stat-chip">福島県 葛尾村</span>
          </div>
          東京電力福島第一原発の事故で避難指示が出た町です。
          帰還した住民と、除染・復興工事に従事する作業員の
          転入出が入り混じり、入れ替わり率を大きく押し上げて
          います。大熊町は入れ替わり率こそ全国1位ですが、
          転入超過率はプラスに転じており、避難指示解除後の
          帰還が進んでいる町であることも分かります。
        </div>

        <div className="pull-note">
          <strong>パターン2・人口の少ない離島</strong>
          <div style={{ margin: "8px 0" }}>
            <span className="stat-chip">東京都 青ヶ島村</span>
            <span className="stat-chip">沖縄県 竹富町</span>
            <span className="stat-chip">鹿児島県 十島村</span>
            <span className="stat-chip">鹿児島県 三島村</span>
            <span className="stat-chip">沖縄県 与那国町</span>
            <span className="stat-chip">東京都 御蔵島村</span>
          </div>
          いずれも人口が数百人規模の離島です。母数が小さいため、
          役場や診療所、観光関連の仕事で数人が入れ替わるだけで
          入れ替わり率の数字は跳ね上がります。地域おこし協力隊や
          季節雇用の観光スタッフの出入りも影響していると考えられます。
        </div>

        <div className="pull-note">
          <strong>パターン3・都心のワンルームが多い区</strong>
          <div style={{ margin: "8px 0" }}>
            <span className="stat-chip">名古屋市 中区</span>
            <span className="stat-chip">大阪市 浪速区</span>
            <span className="stat-chip">大阪市 中央区</span>
            <span className="stat-chip">東京都 中央区</span>
          </div>
          単身世帯向けの賃貸住宅が集積するエリアです。進学・
          就職・転勤のたびに引っ越す若い単身者が多いため、
          人口自体は安定していても、住民の顔ぶれは数年単位で
          大きく入れ替わっています。
        </div>
      </div>

      <div style={box}>
        <h2>入れ替わりが少ない、「静かな人口減少」の町</h2>

        <p>
          逆に入れ替わり率が最も低いのは、山形県・秋田県・
          新潟県・福井県などの内陸の中規模都市や町村です。
        </p>

        <div style={{ margin: "12px 0" }}>
          {bottom10.slice(0, 6).map((c) => (
            <span className="stat-chip" key={c.name}>{c.name}</span>
          ))}
        </div>

        <p>
          これらの自治体は、転入超過率もマイナス(人口減少)では
          あるものの、その減り方は転出者が多いからではなく、
          そもそも人の移動自体が少ないことが原因です。新しい
          住民がほとんど入ってこないまま、既存の住民がそのまま
          高齢化していく「静かな人口減少」とでも呼べるパターンで、
          パターン1・2で見た「入れ替わりの激しい人口減少」とは
          性質が異なります。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：人口の入れ替わり率についてよくある質問</h2>

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
          「人口が増えているか減っているか」という転入超過率だけを
          見ていると、住民がどれだけ入れ替わっているかという、
          もう1つの重要な側面を見落としてしまいます。同じ
          人口減少でも、パターン1・2のように活発な入れ替わりの
          末の減少なのか、パターン3のように住民自体は安定した
          減少なのかによって、地域が抱える課題や必要な対策は
          大きく異なります。
        </p>

        <p>
          <Link href="/articles/young-adult-migration-analysis" style={link}>
            若年層の転出入ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/decline" style={link}>
            人口減少率ランキングを見る
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
