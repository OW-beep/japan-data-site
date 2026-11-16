import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import RakutenGifts from "@/components/RakutenGifts";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getMunicipalities } from "@/lib/municipalities";
import { isShi, shortName } from "@/lib/cityPopulation";

const PATH = "/articles/child-friendly-city-data-guide";
const MIN_POP = 100_000;

export const metadata = {
  alternates: { canonical: PATH },
  title: "子育てしやすい街の見方｜出生率だけでは分からない5つのデータ",
  description:
    "「子育てしやすい街」を出生率ランキングだけで選ぶと失敗します。子どもの割合、保育園の入りやすさ、子育て世代の転入、小学校の規模、医療の5つのデータで見る方法を、人口10万人以上の市の実例とあわせて解説します。",
};

export default function Page() {
  const all = getMunicipalities().filter(
    (c) =>
      isShi(c.name) &&
      c.population >= MIN_POP &&
      c.childPopulation != null &&
      c.population > 0
  );
  const rows = all.map((c) => ({
    ...c,
    childRatio: ((c.childPopulation ?? 0) / c.population) * 100,
    daycarePer1000:
      c.daycareCount != null && (c.childPopulation ?? 0) > 0
        ? (c.daycareCount / (c.childPopulation as number)) * 1000
        : null,
    youngRate:
      c.youngAdultNetMigration != null
        ? (c.youngAdultNetMigration / c.population) * 100
        : null,
  }));
  const childTop = [...rows].sort((a, b) => b.childRatio - a.childRatio).slice(0, 5);
  // 子どもの割合が高く、かつ20代の転入超過もある市(=子育て世代に実際に選ばれている市)
  const both = rows
    .filter((c) => c.youngRate != null && c.youngRate > 0)
    .sort((a, b) => b.childRatio - a.childRatio)
    .slice(0, 5);

  const faq = [
    {
      q: "子育てしやすい街は、出生率が高い街のことですか？",
      a: "同じではありません。出生率は、その年に生まれた子どもの数を女性人口などと比べた指標で、島しょ部や小規模な自治体が高く出やすい性質があります。共働きでの預けやすさや学校・医療の環境とは別の話なので、引っ越し先選びでは子どもの割合や保育のデータとあわせて見る必要があります。",
    },
    {
      q: "待機児童が少ない街はどうやって調べますか？",
      a: "待機児童数は自治体が毎年公表しています(厚生労働省のまとめもあり)。この記事の「子ども1,000人あたり保育園数」は施設数の目安で、実際の空き状況とは一致しません。候補の街が決まったら、自治体の保育課のページで最新の待機児童数と、希望する園の空き状況を必ず確認してください。",
    },
    {
      q: "子どもの割合が高い街には、どんな特徴がありますか？",
      a: `人口${MIN_POP.toLocaleString()}人以上の市では、${childTop
        .map((c) => shortName(c.name))
        .join("、")}などが上位です。新興住宅地を抱える郊外の市が多く、住宅価格が都心より抑えめで、若い世帯が入ってきやすい条件がそろっています。`,
    },
    {
      q: "小学校は大きいほうがよいですか？",
      a: "一長一短です。大規模校は友人関係の選択肢や部活動・行事の幅が広い一方、先生の目が届きにくいと感じることもあります。小規模校は一人ひとりへの目配りが期待できますが、クラス替えがない・行事の規模が小さいといった面もあります。お子さんの性格に合うかどうかが判断軸です。",
    },
    {
      q: "子育て支援の手厚さはデータで分かりますか？",
      a: "医療費助成の対象年齢や保育料の軽減など、自治体独自の支援は制度ごとに条件が違い、統計データだけでは比べにくいのが実情です。候補を絞ったあと、各自治体の「子育て支援」ページで、医療費助成・給食費・習い事補助などの有無を直接確認してください。",
    },
  ];

  return (
    <ArticleLayout
      title="子育てしやすい街の見方｜出生率だけでは分からない5つのデータ"
      summary="「出生率ランキング上位=子育てしやすい街」とは限りません。子どもの割合、保育園の入りやすさ、子育て世代の転入、小学校の規模、医療の5つを、人口10万人以上の市の実データで比べます。"
      heroLabel="子どもの割合が最も高い市(人口10万人以上)"
      heroValue={shortName(childTop[0].name)}
      rankingLink="/ranking/child"
      path={PATH}
      tags={["child"]}
      publishedAt="2026-11-16"
      dataNote="人口・子どもの数: 国勢調査ベース(当サイト収録分)。保育園数は施設数の収録値で、定員ベースではありません。対象は人口10万人以上の市。"
      top3={childTop.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: shortName(c.name),
        value: `子ども割合 ${c.childRatio.toFixed(1)}%`,
      }))}
    >
      <div style={box}>
        <h2>結論:出生率ランキングは、引っ越し先選びの答えにならない</h2>
        <p>
          出生率の上位は、島しょ部や人口の少ない自治体が占めることが
          多くあります。若い女性の人口そのものが少ない地域では、
          少しの出生数の変化で率が大きく動くためです。つまり出生率は
          「その地域の人口構造」を映す数字であって、「共働きで子どもを
          預けやすいか」「学校や小児科が近いか」という暮らしの
          条件とは別物です。
        </p>
        <p>
          引っ越し先として見るべきなのは、次の5つです。どれも
          自治体ごとの実データで確認できます。
        </p>
      </div>

      <div style={box}>
        <h2>データ1:子どもの割合 ― 同世代の子がどれだけいるか</h2>
        <p>
          人口に占める15歳未満の割合が高い街は、子育て世帯が厚く、
          公園・児童館・小児科などの需要が安定している環境です。
          人口{MIN_POP.toLocaleString()}人以上の市での上位は次のとおりです。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={{ ...th, textAlign: "left" }}>市</th>
                <th style={thR}>子どもの割合</th>
                <th style={thR}>子ども1,000人あたり保育園数</th>
              </tr>
            </thead>
            <tbody>
              {childTop.map((c, i) => (
                <tr key={c.code}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>{c.name}</td>
                  <td style={tdR}>{c.childRatio.toFixed(1)}%</td>
                  <td style={tdR}>
                    {c.daycarePer1000 != null ? `${c.daycarePer1000.toFixed(1)}施設` : "―"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <RankingBarChart
          title="子どもの割合が高い市(人口10万人以上)"
          barColor="#be185d"
          items={childTop.map((c) => ({
            name: shortName(c.name),
            value: c.childRatio,
            displayValue: `${c.childRatio.toFixed(1)}%`,
          }))}
        />
        <p>
          全国の市の子ども割合は
          <Link prefetch={false} href="/ranking/child" style={link}>
            子ども人口ランキング
          </Link>
          で確認できます。なお割合が高い街は住宅地としての人気が
          高い分、地価も上がりやすい点は押さえておいてください。
        </p>
      </div>

      <div style={box}>
        <h2>データ2:保育園の入りやすさ ― 施設数は目安、本命は待機児童数</h2>
        <p>
          上の表の「子ども1,000人あたり保育園数」は、施設の絶対数の
          多さを子どもの数で割った目安です。施設が多くても定員が
          小さければ入りやすいとは限らず、逆もあり得ます。最終的には
          自治体が公表する待機児童数と、各園の空き状況が判断材料に
          なります。「駅前の園は激戦だが、少し離れると空きがある」
          といった地域差も大きいため、園単位で見ることが大切です。
        </p>
      </div>

      <div style={box}>
        <h2>データ3:子育て世代の転入 ― 実際に選ばれている街か</h2>
        <p>
          20代の純移動(転入超過)は、進学・就職・結婚・出産のタイミングで
          人が動いた結果です。子どもの割合が高く、かつ20代が転入超過の
          街は、「これから子育てをする世代に、今まさに選ばれている街」と
          言えます。人口{MIN_POP.toLocaleString()}人以上の市で両方を
          満たす上位は次のとおりです。
        </p>
        <ul>
          {both.map((c) => (
            <li key={c.code}>
              {c.name}:子ども割合{c.childRatio.toFixed(1)}%、20代純移動率
              {c.youngRate != null ? `+${c.youngRate.toFixed(2)}%` : "―"}
            </li>
          ))}
        </ul>
        <p>
          転入が多い街は保育需要も増えるため、園の競争が激しくなる
          場合があります。データ2とあわせて見るのがポイントです。
        </p>
      </div>

      <div style={box}>
        <h2>データ4:小学校の規模 ― 1校あたりの児童数</h2>
        <p>
          子どもの数を小学校数で割ると、1校あたりの児童数の目安が
          出ます。数百人規模の学校が多い地域と、1校数十人の地域では、
          クラス替えの有無や行事の形がまったく違います。どちらが
          よいかはお子さん次第ですが、「思っていた規模と違った」は
          引っ越し後の後悔になりやすい点です。学区ごとの学校規模は
          自治体の教育委員会のページで確認できます。
        </p>
      </div>

      <div style={box}>
        <h2>データ5:医療 ― 小児科までの距離は地図で確認</h2>
        <p>
          人口あたりの医師数や病院数は街全体の医療の厚みを示しますが、
          子育てで実際に困るのは「夜間・休日に診てくれる小児科が
          どれだけ近いか」です。これは統計よりも地図の問題です。
          候補の住宅エリアから、小児科と休日夜間診療所までの実際の
          移動時間を必ず確認してください。自治体によっては
          子ども医療費の助成範囲(年齢・所得制限)にも差があります。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ:数字で候補を絞り、制度と現地で決める</h2>
        <p>
          子どもの割合と転入のデータで候補を2〜3に絞り、各自治体の
          子育て支援制度(医療費助成・保育料・給食費)を公式ページで
          比べ、最後に園と学校と小児科の位置を地図で確かめる。
          この順番なら、「出生率が高そうだったから」という理由だけで
          決めて後悔するリスクを減らせます。2つの街を直接比べたい
          ときは
          <Link prefetch={false} href="/compare" style={link}>
            自治体比較ツール
          </Link>
          が使えます。
        </p>
        <CompareCTA />
      </div>

      {/* 子育て用品を探す人向けの導線(APIキー未設定なら非表示) */}
      <RakutenGifts
        keyword="知育玩具 絵本 セット"
        heading="楽天市場で知育玩具・絵本を見る"
        hits={3}
      />

      <div style={box}>
        <h2>Q&amp;A</h2>
        {faq.map((f) => (
          <p key={f.q}>
            <strong>Q. {f.q}</strong>
            <br />
            A. {f.a}
          </p>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </ArticleLayout>
  );
}

const box: React.CSSProperties = { background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 20, lineHeight: 1.9 };
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thR: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdR: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
