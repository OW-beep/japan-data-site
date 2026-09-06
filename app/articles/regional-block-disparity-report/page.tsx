import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";
import BookRecommendation from "@/components/BookRecommendation";
import { BOOKS } from "@/lib/amazonBooks";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  alternates: { canonical: "/articles/regional-block-disparity-report" },
  title: "地方ブロック格差レポート｜関東の強さと、唯一の弱点",
  description:
    "全国1,741市区町村を8つの地方ブロックに集約して比較。関東は財政力・産業構造・若年層定着率のほぼ全てで1位ながら出生率は全国最低。九州・沖縄は財政力が中位でも出生率トップ。都道府県別では見えない、地方ブロック単位の構造的な格差を分析します。",
};

const REGIONS: Record<string, string[]> = {
  北海道: ["北海道"],
  東北: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  関東: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
  中部: [
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
  ],
  近畿: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
  中国: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
  四国: ["徳島県", "香川県", "愛媛県", "高知県"],
  "九州・沖縄": [
    "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
  ],
};

const prefToRegion: Record<string, string> = {};
Object.entries(REGIONS).forEach(([region, prefs]) => {
  prefs.forEach((p) => (prefToRegion[p] = region));
});

function avg(values: number[]) {
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export default function Page() {
  const base = getMunicipalities()
    .filter((c) => c.population >= 3000)
    .map((c) => ({
      ...c,
      region: prefToRegion[c.name.split(" ")[0]] ?? "不明",
    }))
    .filter((c) => c.region !== "不明");

  const regionNames = Object.keys(REGIONS);

  const totalPop = base.reduce((s, c) => s + c.population, 0);

  const regionStats = regionNames.map((region) => {
    const cities = base.filter((c) => c.region === region);
    const pop = cities.reduce((s, c) => s + c.population, 0);

    const agingRate =
      avg(cities.map((c) => (c.elderlyPopulation / c.population) * 100));

    const finCities = cities.filter((c) => c.financeIndex != null);
    const financeIndex = avg(finCities.map((c) => c.financeIndex ?? 0));

    const birthCities = cities.filter((c) => c.birthRate != null);
    const birthRate = avg(birthCities.map((c) => c.birthRate ?? 0));

    const migrCities = cities.filter((c) => c.youngAdultNetMigration != null);
    const youngMigration = avg(
      migrCities.map((c) => ((c.youngAdultNetMigration ?? 0) / c.population) * 100)
    );

    const vacantCities = cities.filter((c) => c.totalHousingCount);
    const vacancyRate = avg(
      vacantCities.map((c) => ((c.vacantHouseCount ?? 0) / (c.totalHousingCount ?? 1)) * 100)
    );

    const industryCities = cities.filter((c) => c.tertiaryIndustryWorkers != null);
    const p1 = industryCities.reduce((s, c) => s + (c.primaryIndustryWorkers ?? 0), 0);
    const p2 = industryCities.reduce((s, c) => s + (c.secondaryIndustryWorkers ?? 0), 0);
    const p3 = industryCities.reduce((s, c) => s + (c.tertiaryIndustryWorkers ?? 0), 0);
    const industryTotal = p1 + p2 + p3;

    return {
      region,
      cityCount: cities.length,
      population: pop,
      popShare: (pop / totalPop) * 100,
      agingRate,
      financeIndex,
      birthRate,
      youngMigration,
      vacancyRate,
      tertiaryShare: (p3 / industryTotal) * 100,
    };
  });

  const byFinance = [...regionStats].sort((a, b) => b.financeIndex - a.financeIndex);
  const byBirth = [...regionStats].sort((a, b) => b.birthRate - a.birthRate);
  const byAging = [...regionStats].sort((a, b) => b.agingRate - a.agingRate);
  const byVacancy = [...regionStats].sort((a, b) => b.vacancyRate - a.vacancyRate);
  const byMigration = [...regionStats].sort((a, b) => b.youngMigration - a.youngMigration);

  const kanto = regionStats.find((r) => r.region === "関東")!;
  const kyushu = regionStats.find((r) => r.region === "九州・沖縄")!;
  const shikoku = regionStats.find((r) => r.region === "四国")!;

  const kantoFinanceRank = byFinance.findIndex((r) => r.region === "関東") + 1;
  const kantoBirthRank = byBirth.findIndex((r) => r.region === "関東") + 1;
  const kyushuFinanceRank = byFinance.findIndex((r) => r.region === "九州・沖縄") + 1;
  const kyushuBirthRank = byBirth.findIndex((r) => r.region === "九州・沖縄") + 1;

  const faq = [
    {
      q: "地方ブロック別に見て、最も財政力が高いのはどこですか？",
      a: `関東です。財政力指数の平均は${kanto.financeIndex.toFixed(
        3
      )}で、全8ブロック中1位でした。産業構造でも第3次産業(サービス業)の割合が${kanto.tertiaryShare.toFixed(
        1
      )}%と最も高く、若年層の流出も最も少ないなど、複数の指標で優位に立っています。`,
    },
    {
      q: "財政力が高い地方ほど、出生率も高いのですか？",
      a: `いいえ、逆の傾向が見られます。財政力1位の関東は出生率で見ると8ブロック中${kantoBirthRank}位(最下位)でした。一方、財政力${kyushuFinanceRank}位の九州・沖縄は出生率で8ブロック中${kyushuBirthRank}位(1位)と、財政力と出生率が逆転する構造になっています。`,
    },
    {
      q: "高齢化・人口流出・空き家など、複数の課題を抱える地方ブロックはありますか？",
      a: `四国地方です。高齢化率(${shikoku.agingRate.toFixed(
        1
      )}%)、20代の純移動率(${shikoku.youngMigration.toFixed(
        2
      )}%、流出超過)、空き家率(${shikoku.vacancyRate.toFixed(
        1
      )}%)の3つの指標すべてで、8ブロック中最下位でした。`,
    },
  ];

  return (
    <ArticleLayout
      title="地方ブロック格差レポート：関東の強さと、唯一の弱点"
      summary={`全国1,741市区町村を北海道・東北・関東・中部・近畿・中国・四国・九州沖縄の8ブロックに集約して比較しました。関東は財政力・産業構造・若年層定着率のほぼ全てで1位ながら、出生率は8ブロック中最下位。逆に財政力が中位の九州・沖縄は出生率トップという、都道府県別では見えにくい「豊かさと家族形成の逆相関」が明らかになりました。`}
      heroLabel="財政力指数 8ブロック中1位"
      heroValue={`関東 ${kanto.financeIndex.toFixed(3)}`}
      rankingLink="/ranking/finance"
      path="/articles/regional-block-disparity-report"
      tags={["finance"]}
      publishedAt="2026-08-21"
      top3={[
        { rank: 1, name: byFinance[0].region, value: byFinance[0].financeIndex.toFixed(3) },
        { rank: 2, name: byFinance[1].region, value: byFinance[1].financeIndex.toFixed(3) },
        { rank: 3, name: byFinance[2].region, value: byFinance[2].financeIndex.toFixed(3) },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          これまで本サイトでは、市区町村単位や都道府県単位で
          さまざまなランキングを分析してきました。しかし
          47都道府県という単位では、細かすぎて全国レベルの
          大きな構造が見えにくいこともあります。そこで今回、
          全国1,741市区町村を北海道・東北・関東・中部・
          近畿・中国・四国・九州沖縄という8つの地方ブロックに
          集約し、財政力・出生率・高齢化率・人口移動・
          空き家率・産業構造という6つの指標を横断的に
          比較しました。
        </p>
      </div>

      <div style={box}>
        <h2>関東の一人勝ちと、唯一の弱点</h2>

        <p>
          関東地方は、財政力指数({kanto.financeIndex.toFixed(3)}
          ・1位)、第3次産業比率({kanto.tertiaryShare.toFixed(1)}
          %・1位)、20代純移動率({kanto.youngMigration.toFixed(2)}
          %・最も流出が少ない)、空き家率({kanto.vacancyRate.toFixed(1)}
          %・最も低い)と、ほぼすべての指標で1位でした。人口も
          全国の{kanto.popShare.toFixed(1)}%を占め、8ブロック
          中で圧倒的な存在感を持っています。
        </p>

        <p>
          しかし、出生率だけは8ブロック中{kantoBirthRank}位
          (最下位)で、平均{kanto.birthRate.toFixed(2)}に
          とどまります。高齢化率も{kanto.agingRate.toFixed(1)}
          %で最も低く、これは「高齢者が少ない」という意味では
          良いことですが、裏を返せば「次の世代を生み出す力も
          弱い」ことを意味します。財政的に最も豊かなブロックが、
          人口の再生産という面では最も弱いという、単純な
          「豊かさ=良い地域」では説明できない構造が見えてきます。
        </p>

        <RankingBarChart
          items={regionStats.map((r) => ({
            name: r.region,
            value: r.financeIndex,
            displayValue: r.financeIndex.toFixed(3),
          }))}
        />
      </div>

      <div style={box}>
        <h2>出生率トップは、財政力では中位の九州・沖縄</h2>

        <RankingBarChart
          items={byBirth.map((r) => ({
            name: r.region,
            value: r.birthRate,
            displayValue: r.birthRate.toFixed(2),
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          出生率が最も高いのは九州・沖縄({kyushu.birthRate.toFixed(2)})
          でした。財政力指数では8ブロック中{kyushuFinanceRank}
          位と中位〜下位に位置するにもかかわらず、出生率では
          関東の約1.3倍にのぼります。出生率ランキング分析の
          記事で見た「鹿児島県・沖縄県の島しょ部が上位を
          占める」という市区町村レベルの発見が、地方ブロック
          単位で見ても同じ傾向として再現されている形です。
          豊かさと子どもを産み育てる力は、必ずしも比例
          しないということが、これだけ大きな単位で見ても
          裏付けられました。
        </p>
      </div>

      <div style={box}>
        <h2>四国地方が抱える「三重苦」</h2>

        <p>
          高齢化率({shikoku.agingRate.toFixed(1)}%)、20代
          純移動率({shikoku.youngMigration.toFixed(2)}%、
          流出超過)、空き家率({shikoku.vacancyRate.toFixed(1)}
          %)の3つの指標すべてで、四国地方は8ブロック中
          最下位でした。これは特定の1つの県だけの問題では
          なく、四国地方全体が構造的に抱える課題として
          浮かび上がります。県内一極集中度ランキング分析の
          記事で紹介した高知県の一極集中も、四国地方全体の
          この傾向と無関係ではないと考えられます。
        </p>

        <RankingBarChart
          items={byAging.map((r) => ({
            name: r.region,
            value: r.agingRate,
            displayValue: `${r.agingRate.toFixed(1)}%`,
          }))}
          barColor="#dc2626"
        />

        <PersonalNote>
          都道府県別のデータを見ているときは、県ごとの
          個別事情(産業構造や地理的条件)に目が向きがちですが、
          こうして地方ブロックまで単位を大きくすると、
          「四国地方全体」「関東地方全体」という、より大きな
          構造的な傾向が見えてきます。個々の自治体の努力だけで
          解決できる規模の課題ではなく、地方ブロック単位での
          広域的な政策が必要になってくる場面もあるだろうと、
          このデータを見て感じました。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>産業構造で見る、地方ブロックごとの個性</h2>

        <RankingBarChart
          items={[...regionStats]
            .sort((a, b) => b.tertiaryShare - a.tertiaryShare)
            .map((r) => ({
              name: r.region,
              value: r.tertiaryShare,
              displayValue: `${r.tertiaryShare.toFixed(1)}%`,
            }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          第3次産業(サービス業)の比率は関東・北海道・
          九州沖縄で高く、逆に中部地方は
          {regionStats.find((r) => r.region === "中部")?.tertiaryShare.toFixed(1)}
          %と8ブロック中最も低い水準でした。中部地方には
          自動車関連産業をはじめとする製造業(第2次産業)の
          集積地が多く、産業の多様性指数の記事で見た豊田市の
          ような、ものづくり中心の経済構造が地方ブロック
          全体の数字にも表れています。北海道は農林水産業
          (第1次産業)の比率が高い一方で、観光業を含む
          サービス業の比率も高く、第2次産業(製造業)の比率が
          最も低いという独自の産業構造を持っています。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          地方ブロックは県境をまたぐ広い括りのため、同じ
          ブロックの中でも都道府県ごと、市区町村ごとに
          大きなばらつきがあります。たとえば関東地方には
          東京都心区のような突出した都市部と、山間部の
          過疎地域が混在しており、ブロック単位の平均値は
          あくまで「大まかな傾向」として捉えるのが妥当です。
          個別の地域を知りたい場合は、都道府県別・市区町村別の
          ランキングとあわせてご覧ください。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：地方ブロック格差についてよくある質問</h2>

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

      <BookRecommendation
        books={[BOOKS.chiikiJinkouGensyou, BOOKS.chihouShoumetsu2]}
      />

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          8つの地方ブロックで比較したことで、都道府県別
          では見えにくかった大きな構造が見えてきました。
          関東の圧倒的な財政力と、その裏返しとしての
          低い出生率。九州・沖縄の、財政力に見合わない
          高い出生率。四国地方が抱える構造的な三重苦。
          いずれも、個別の自治体の記事とあわせて読むことで、
          より立体的に日本の地域格差を理解する手がかりに
          なると思います。
        </p>

        <p>
          <Link href="/articles/finance-analysis" style={link}>
            財政力指数ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/birth-rate" style={link}>
            出生率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/population-concentration" style={link}>
            県内一極集中度ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/industry-diversity-index" style={link}>
            産業の多様性指数(HHI)を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/prefecture-income-analysis" style={link}>
            都道府県別平均年収ランキング分析を見る
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
