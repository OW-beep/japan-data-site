import { getCitiesPopWithTokyo23, getMunicipalitiesPop, shortName, changePct } from "@/lib/cityPopulation";
import ClusterLinks from "@/components/ClusterLinks";
import { isReleased } from "@/lib/release";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import BookRecommendation from "@/components/BookRecommendation";
import { BOOKS } from "@/lib/amazonBooks";
import CompareCTA from "@/components/CompareCTA";
import Link from "next/link";

import CityCompareTable from "@/components/CityCompareTable";
/** 100万人都市の一覧(令和7年国勢調査。取れていなければ令和2年に自動で戻る) */
function getRanking() {
  const { rows, label, use2025 } = getCitiesPopWithTokyo23();
  const sorted = [...rows].sort((a, b) => b.population - a.population);
  return {
    label,
    use2025,
    ranking: sorted.filter((c) => c.population >= 1_000_000),
    below: sorted.filter((c) => c.population < 1_000_000),
  };
}

export function generateMetadata() {
  const { ranking, below, use2025 } = getRanking();
  const next = below[0];
  const gap = next ? 1_000_000 - next.population : 0;
  const year = use2025 ? "2025年国勢調査" : "最新";
  return {
    alternates: { canonical: "/articles/million-cities" },
    // 先頭に検索語(100万人都市一覧)、続けて「いつの数字か」と「答えだけでは終わらない続き」を置く。
    // 「12市」だけを書くと検索結果の画面で答えが完結してクリックされにくいため、
    // 「あと○人で100万人」という続きが気になる要素を加えている。
    // 検索で実際に使われている語(「人口100万人以上の都市」「100万人都市」)を、前半に両方入れる。
    // 続けて「いつの数字か」と、答えを見ただけでは分からない続き(あと○人)を置く。
    title: `人口100万人以上の都市は${ranking.length}市${use2025 ? "【2025年】" : ""}100万人都市一覧｜${shortName(next?.name ?? "")}はあと${gap.toLocaleString()}人`,
    description: `100万人都市(百万都市)は日本に${ranking.length}市(${year}。東京23区は1市として計算)。人口順の一覧表に加え、100万人まであと${gap.toLocaleString()}人の${shortName(next?.name ?? "")}、2020年からの増減、政令指定都市でも100万人に届かない都市までまとめました。`,
  };
}

export default function Page() {
  const designatedCityCount = 20; // 全国の政令指定都市数

  // 「100万人都市」では東京都特別区部(23区の合計)を1つの都市として数え、
  // 政令指定都市の区は除く。人口は令和7年国勢調査(取れていなければ令和2年)。
  const { ranking, below, label, use2025 } = getRanking();
  const all = getCitiesPopWithTokyo23().rows;
  // 全国人口(政令市の区・特別区部の集計行を除いた自治体の合計)
  const nationalTotal = getMunicipalitiesPop().rows.reduce((s, c) => s + c.population, 0);
  const nationalLabel = `約${(nationalTotal / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 0 })}万人`;
  const chiba = below[0];
  const chibaGap = 1_000_000 - chiba.population;
  // 首都圏4都県(東京・神奈川・埼玉・千葉)の人口
  const metroPopulation = getMunicipalitiesPop()
    .rows.filter((c) => ["東京都", "神奈川県", "埼玉県", "千葉県"].includes(c.name.split(" ")[0]))
    .reduce((s, c) => s + c.population, 0);
  const biggest = ranking[0].name === "東京都 特別区部" ? ranking[1] : ranking[0];

  const total = ranking.reduce(
    (s, c) => s + c.population,
    0
  );

  const metroAreas: { label: string; prefs: string[] }[] = [
    { label: "首都圏(東京・神奈川・埼玉・千葉)", prefs: ["東京都", "神奈川県", "埼玉県", "千葉県"] },
    { label: "近畿圏(大阪・京都・兵庫・奈良)", prefs: ["大阪府", "京都府", "兵庫県", "奈良県"] },
    { label: "中京圏(愛知・岐阜・三重)", prefs: ["愛知県", "岐阜県", "三重県"] },
  ];

  const regionBreakdown = metroAreas.map((area) => {
    const cities = ranking.filter((c) =>
      area.prefs.some((pref) => c.name.startsWith(pref))
    );
    return {
      label: area.label,
      count: cities.length,
      cities: cities.map((c) => c.name).join("・"),
      population: cities.reduce((s, c) => s + c.population, 0),
    };
  });

  const metroTotal = regionBreakdown.reduce((s, r) => s + r.count, 0);
  const otherCities = ranking.filter(
    (c) => !metroAreas.some((a) => a.prefs.some((p) => c.name.startsWith(p)))
  );

  const faq = [
    {
      q: "政令指定都市は人口100万人以上ですか？",
      a: "いいえ、政令指定都市の指定要件は法律上「人口50万人以上」です。100万人という数字は目安として語られることが多いものの、実際には堺市・浜松市・熊本市など、人口100万人未満の政令指定都市も多数存在します。",
    },
    {
      q: "日本に人口100万人以上の都市はいくつありますか？",
      a: `${ranking.length}市です(東京都特別区部を1つの都市として数えた場合)。特別区部を除いた「市」だけで数えると${ranking.length - 1}市になります。`,
    },
    {
      q: "日本で人口100万人以上の都市の一覧を教えてください",
      a: `日本で人口100万人以上の都市は、${ranking
        .map((c) => c.name)
        .join("、")}の${ranking.length}自治体です。この記事の冒頭にある一覧・ランキング表でも、人口が多い順に確認できます。`,
    },
    {
      q: "「百万都市」「100万都市」とはどういう意味ですか？",
      a: "「百万都市」「100万都市」は、人口100万人を超える都市を指す通称で、法律上の正式な区分ではありません。日本ではこの記事で紹介している12自治体が該当し、いずれも政令指定都市または東京都特別区部です。",
    },
    {
      q: "100万人都市は今後増えますか？",
      a: "日本全体の人口が減少局面にあるため、新たに100万人都市が誕生する可能性は低いと考えられます。むしろ、現在100万人をわずかに超えている仙台市やさいたま市が、将来的に100万人を下回る可能性も否定できません。",
    },
    {
      q: "人口90万人・80万人の都市はどこですか？",
      a: `${below.filter((c) => c.population >= 700000).slice(0, 5).map((c) => `${shortName(c.name)}(約${Math.round(c.population / 10000)}万人)`).join("・")}などが該当します。100万人には届かないものの、政令指定都市クラスの規模を持つこれらの都市は「準百万都市」とも呼べる存在です。詳しくは人口90万人・80万人都市一覧の記事で紹介しています。`,
    },
  ];

  return (
    <ArticleLayout
      title={`日本の100万人都市一覧｜人口100万人以上の都市は${ranking.length}市`}
      summary={`日本で人口100万人を超える都市は${ranking.length}市(${label}、東京23区は1市として計算)。政令指定都市20市のうち、実際に100万人を超えているのは半数程度にとどまり、${shortName(chiba.name)}はあと${chibaGap.toLocaleString()}人です。人口順に一覧で紹介します。`}
      heroLabel="100万人超自治体数"
      heroValue={`${ranking.length}自治体`}
      rankingLink="/ranking/population"
      path="/articles/million-cities"
      tags={["population"]}
      publishedAt="2026-02-13"
      top3={[
        {
          rank: 1,
          name: ranking[0].name,
          value: `${ranking[0].population.toLocaleString()}人`,
        },
        {
          rank: 2,
          name: ranking[1].name,
          value: `${ranking[1].population.toLocaleString()}人`,
        },
        {
          rank: 3,
          name: ranking[2].name,
          value: `${ranking[2].population.toLocaleString()}人`,
        },
      ]}
    >
      <div style={box}>
        <h2>日本の人口100万人超自治体一覧</h2>

        <RankingBarChart
          items={ranking.map((c) => ({
            name: c.name,
            value: c.population,
            displayValue: `${c.population.toLocaleString()}人`,
          }))}
        />
      </div>

      <div style={box}>
        <h2>基本データ</h2>

        <ul>
          <li>
            該当自治体数：{ranking.length}
            (全国政令指定都市{designatedCityCount}市中)
          </li>

          <li>
            合計人口：{total.toLocaleString()}人
          </li>

          <li>
            最大：{ranking[0].name}（
            {ranking[0].population.toLocaleString()}人）
          </li>

          <li>
            最小(100万人ライン付近)：
            {ranking[ranking.length - 1].name}（
            {ranking[
              ranking.length - 1
            ].population.toLocaleString()}
            人）
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>100万人都市の人口は増えている？(2020年→2025年)</h2>

        <p style={{ color: "#4b5563", lineHeight: 1.9 }}>
          令和2年と令和7年の国勢調査を比べると、{ranking.length}都市のうち
          {ranking.filter((c) => c.population > c.pop2020).length}
          都市で人口が増え、{ranking.filter((c) => c.population < c.pop2020).length}
          都市で減りました。増加が最も大きいのは
          {shortName([...ranking].sort((a, b) => changePct(b) - changePct(a))[0].name)}
          (+{changePct([...ranking].sort((a, b) => changePct(b) - changePct(a))[0]).toFixed(1)}%)、
          減少が最も大きいのは
          {shortName([...ranking].sort((a, b) => changePct(a) - changePct(b))[0].name)}
          ({changePct([...ranking].sort((a, b) => changePct(a) - changePct(b))[0]).toFixed(1)}%)です。
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={th}>都市</th>
                <th style={th}>2025年</th>
                <th style={th}>2020年</th>
                <th style={th}>増減率</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((c, i) => (
                <tr key={c.code}>
                  <td style={td}>{i + 1}</td>
                  <td style={td}>{c.name}</td>
                  <td style={td}>{c.population.toLocaleString()}人</td>
                  <td style={td}>{c.pop2020.toLocaleString()}人</td>
                  <td style={td}>
                    {changePct(c) > 0 ? "+" : ""}
                    {changePct(c).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 12, fontSize: 14, color: "#6b7280" }}>
          {use2025
            ? "人口は令和7年国勢調査(確定値)、比較の2020年は令和2年国勢調査です。"
            : "人口は令和2年国勢調査です。"}
          {isReleased("/articles/million-cities-population-change") && (
            <>
          詳しい分析は
          <Link prefetch={false} href="/articles/million-cities-population-change" style={link}>
            100万人都市の人口増減の記事
          </Link>
          で解説しています。
            </>
          )}
        </p>
      </div>

      <div style={box}>
        <h2>特徴と分析</h2>

        <p>
          人口100万人超の自治体は、日本の人口が集中する
          大都市の代表格です。今回のデータでは{ranking.length}
          の自治体が該当し、これは全国1,741自治体のうち
          わずか0.1〜0.2%程度にすぎません。一方でこの
          {ranking.length}自治体だけで合計{total.toLocaleString()}
          人、全国人口({nationalLabel})のおよそ
          {((total / nationalTotal) * 100).toFixed(0)}
          %を占めており、極めて少数の自治体に人口が
          集中している実態が分かります。
        </p>

        <p>
          注目したいのは、全国に20ある政令指定都市のうち、
          実際に人口100万人を超えているのは
          {ranking.length}市にとどまる点です。政令指定都市の
          指定要件は法律上「人口50万人以上」とされており、
          実際には人口70万人台〜90万人台で指定されている
          都市も少なくありません。つまり「政令指定都市」という
          肩書きと「人口100万人超」は必ずしもイコールではなく、
          都市の規模を見る際にはこの違いに注意が必要です。
        </p>

        <p>
          地域別に見ると、上位に入る自治体は首都圏(横浜市・川崎市・
          さいたま市)、関西圏(大阪市・神戸市・京都市)、
          中京圏(名古屋市)、そして各地方の広域中心都市(札幌市・
          福岡市・仙台市・広島市)に大別されます。
          このうち首都圏だけで3市がランクインしており、
          一つの都市圏からこれだけ多くの100万人都市を
          輩出しているのは首都圏のみです。関西圏も大阪市・
          神戸市・京都市の3市がランクインしており、
          首都圏に次ぐ集積度を持っています。
        </p>
      </div>

      <div style={box}>
        <h2>三大都市圏 vs それ以外：内訳データ</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>都市圏</th>
              <th style={th}>該当市数</th>
              <th style={th}>合計人口</th>
              <th style={th}>該当都市</th>
            </tr>
          </thead>
          <tbody>
            {regionBreakdown.map((r) => (
              <tr key={r.label}>
                <td style={td}>{r.label}</td>
                <td style={td}>{r.count}市</td>
                <td style={td}>{r.population.toLocaleString()}人</td>
                <td style={td}>{r.cities || "―"}</td>
              </tr>
            ))}
            <tr>
              <td style={td}>その他の地方中心都市</td>
              <td style={td}>{otherCities.length}市</td>
              <td style={td}>
                {otherCities
                  .reduce((s, c) => s + c.population, 0)
                  .toLocaleString()}
                人
              </td>
              <td style={td}>
                {otherCities.map((c) => c.name).join("・")}
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginTop: 12, fontSize: 14, color: "#6b7280" }}>
          三大都市圏(首都圏・近畿圏・中京圏)だけで{metroTotal}市、全{ranking.length}
          市中の{Math.round((metroTotal / ranking.length) * 100)}%を占めています。
          残る{otherCities.length}市は、いずれも各地方ブロックで唯一の100万人都市です。
        </p>
      </div>

      <div style={box}>
        <h2>100万人都市になれなかった大都市</h2>

        <p>
          政令指定都市20市のうち、人口100万人に届いていない
          都市も少なくありません。相模原市・岡山市・熊本市・
          静岡市・新潟市・浜松市・堺市(僅差で100万人を割る
          年もあります)などがこれにあたり、いずれも
          人口70万人〜80万人台で推移しています。これらの
          都市は政令指定都市としての行政権限(都道府県並みの
          事務を担う権限)を持ちながら、人口規模では
          100万人都市に一歩及ばないという、やや特殊な
          立ち位置にあります。
        </p>

        <p>
          また、人口100万人に迫りながらも政令指定都市では
          ない自治体として、東京都世田谷区(人口約{Math.round((all.find((c) => c.name === "東京都 世田谷区")?.population ?? 0) / 10000)}万人)が
          挙げられます。世田谷区は特別区であるため政令指定都市の
          制度対象ではありませんが、人口規模だけで見れば
          多くの政令指定都市を上回っており、単純な制度上の
          区分と実際の人口規模が必ずしも一致しない好例です。
        </p>

        <p>
          このように「政令指定都市」「人口100万人」
          「県庁所在地」という3つの指標は、重なり合う部分も
          多い一方で、それぞれ独立した基準です。自治体の
          規模や重要性を判断する際には、どの指標を見ているのか
          を意識することが、データを正しく読み解く上で
          重要になります。
        </p>
      </div>

      <div style={box}>
        <h2>もう少しで100万人に届かなかった都市</h2>

        <RankingBarChart
          items={below
            .filter((c) => c.population >= 700000)
            .slice(0, 8)
            .map((c) => ({
              name: c.name,
              value: c.population,
              displayValue: `${c.population.toLocaleString()}人`,
            }))}
          barColor="#6b7280"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          「80万人都市」「90万人都市」と呼べる規模の都市も
          全国に複数あります。{shortName(chiba.name)}は100万人まであと{chibaGap.toLocaleString()}人
          まで迫っており、政令指定都市の中でも人口増加が続けば
          将来的に100万人都市入りする可能性がある都市の
          筆頭です(2020年からの増加率は{changePct(chiba).toFixed(1)}%)。北九州市・堺市・浜松市・新潟市・熊本市・
          相模原市はいずれも政令指定都市でありながら、100万人
          には届いていません。90万人・80万人台の都市を
          まとめて比較したい方は、
          <Link prefetch={false} href="/articles/near-million-cities" style={link}>
            人口90万人・80万人都市一覧
          </Link>
          もあわせてご覧ください。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：100万人都市についてよくある質問</h2>

        {faq.map((item) => (
          <p key={item.q}>
            <strong>Q. {item.q}</strong>
            <br />
            A. {item.a}
          </p>
        ))}
      </div>

      <ClusterLinks current="/articles/million-cities" />

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
        <h2>今後、100万人都市は増えるのか</h2>

        <p>
          日本全体の人口が減少局面にある中、新たに
          人口100万人を突破する自治体が今後現れる
          可能性は低いと考えられます。むしろ、現在
          100万人をわずかに超えている自治体(仙台市・
          広島市など)が、今後の人口減少によって
          100万人を割り込む可能性の方が高いとみられています。
          実際、堺市はすでに100万人を割り込んでおり、
          統計の取り方や年によって100万人前後を
          行き来している自治体もあります。
        </p>

        <p>
          一方で、人口が減少する中でも、周辺自治体からの
          転入によって人口を維持・微増させている都市も
          あります。こうした都市に共通するのは、
          鉄道網の充実や再開発による都心回帰(郊外から
          都心部への人口移動)、そして子育て世代を
          意識した住宅・保育施設の整備です。人口
          100万人という大台を維持できるかどうかは、
          今後の各都市の政策や産業構造の変化によって
          左右される、注目すべきテーマの一つです。
        </p>
      </div>

      <div style={box}>
        <h2>海外の大都市との比較で見えること</h2>

        <p>
          人口100万人という基準は、世界的に見ても
          「大都市」の一つの目安とされています。
          国連の統計などでは、人口100万人以上の
          都市圏は「メガシティ」に準じる規模として
          扱われることが多く、世界には人口1,000万人を
          超える都市圏も数多く存在します。それと比べると、
          日本最大の{shortName(biggest.name)}(約{Math.round(biggest.population / 10000)}万人)でも世界的には
          中堅規模にとどまり、東京都区部を含めた
          首都圏全体(約{Math.round(metroPopulation / 10000).toLocaleString()}万人)で見て初めて、
          世界有数のメガシティ規模に達します。
          単独の自治体としての人口ランキングと、
          都市圏・経済圏としての規模は分けて
          考える必要がある点も、押さえておきたい
          ポイントです。
        </p>
      </div>

      <BookRecommendation books={[BOOKS.chihouShoumetsu]} />

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          人口100万人超の自治体は、日本の経済・行政・
          文化の中心的な役割を担う、限られた大都市です。
          その顔ぶれは首都圏・関西圏・中京圏、そして
          各地方の広域中心都市に集約されており、
          人口ランキング全体の縮図とも言えます。
          一方で、政令指定都市であっても100万人に
          届かない都市があるなど、制度上の区分と
          実際の人口規模には差があることも分かりました。
          ランキングページでは最新の順位を確認できますので、
          あわせてご覧ください。
        </p>


        <p>
          <Link prefetch={false} href="/articles/near-million-cities" style={link}>
            90万人・80万人都市一覧を見る
          </Link>

          {" ｜ "}
          <Link prefetch={false} href="/articles/population-top50" style={link}>
            人口ランキングTOP50を見る
          </Link>

          {" ｜ "}
          <Link prefetch={false} href="/articles/population-about" style={link}>
            人口ランキングとは？を見る
          </Link>

          {" ｜ "}
          <Link prefetch={false} href="/ranking/large-cities" style={link}>
            人口50万人以上の都市ランキングを見る
          </Link>

          {" ｜ "}
          <Link prefetch={false} href="/articles/designated-cities-comparison" style={link}>
            政令指定都市20市の比較を見る
          </Link>
        </p>

        <CompareCTA />
      </div>
      <CityCompareTable
        kind="million"
        heading="暮らしの指標で、100万人都市を比べる"
        lead="転勤や進学で、どの大都市に住むか迷っている人のために、人口が100万人以上の政令指定都市を、高齢化・子育て・財政・医療・住まいの指標で並べました。"
      />
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
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
};

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
