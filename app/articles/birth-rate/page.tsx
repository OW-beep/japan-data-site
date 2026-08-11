import Link from "next/link";
import DataAsOf from "@/components/DataAsOf";
import RankingBarChart from "@/components/RankingBarChart";
import ArticleTags from "@/components/ArticleTags";
import PublishedDate from "@/components/PublishedDate";
import PersonalNote from "@/components/PersonalNote";
import AuthorByline from "@/components/AuthorByline";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import meta from "@/data/meta.json";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { getMunicipalities } from "@/lib/municipalities";

export const metadata = {
  alternates: { canonical: "/articles/birth-rate" },
  title: "出生率ランキング分析：なぜ鹿児島・沖縄の島しょ部が上位なのか",
  description:
    "市区町村別の合計特殊出生率で、鹿児島県徳之島町が全国1位。厚生労働省の統計をもとに、離島の出生率が高い理由を分析します。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter((c) => c.birthRate != null)
    .sort((a, b) => (b.birthRate ?? 0) - (a.birthRate ?? 0));

  const top15 = ranking.slice(0, 15);
  const bottom10 = ranking.slice(-10).reverse();

  const average =
    ranking.reduce((s, c) => s + (c.birthRate ?? 0), 0) /
    ranking.length;

  const okinawa = ranking.filter((c) => c.name.startsWith("沖縄県"));
  const okinawaAvg =
    okinawa.reduce((s, c) => s + (c.birthRate ?? 0), 0) /
    okinawa.length;

  const tokyoWardsInBottom10 = bottom10.filter((c) =>
    c.name.startsWith("東京都")
  ).length;

  const PREFECTURES = [
    "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
    "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
    "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
    "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
    "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
    "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
    "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
  ];

  const prefectureAverages = PREFECTURES.map((pref) => {
    const cities = ranking.filter((c) => c.name.startsWith(pref));
    const avg =
      cities.length > 0
        ? cities.reduce((s, c) => s + (c.birthRate ?? 0), 0) / cities.length
        : null;
    return { pref, avg, count: cities.length };
  }).filter((p) => p.avg != null) as {
    pref: string;
    avg: number;
    count: number;
  }[];

  const prefRankingDesc = [...prefectureAverages].sort(
    (a, b) => b.avg - a.avg
  );
  const prefTop5 = prefRankingDesc.slice(0, 5);
  const prefBottom5 = prefRankingDesc.slice(-5).reverse();

  const faq = [
    {
      q: "出生率が全国1位の自治体はどこですか？",
      a: `鹿児島県徳之島町が${top15[0].birthRate?.toFixed(
        2
      )}で全国1位です。2位も同じ徳之島の天城町で、3位以下も沖縄県の自治体が多数を占めています。`,
    },
    {
      q: "なぜ鹿児島・沖縄の島しょ部は出生率が高いのですか？",
      a: "晩婚化・晩産化の影響が本土より小さいこと、三世代同居や地域の子育て支援ネットワークが比較的強く残っていること、子育てにかかる住宅費の負担が大都市圏より軽いことなどが背景として指摘されています。ただし人口が少ない自治体は出生数の少しの増減で数値が大きく振れやすいという統計上の特性も影響しています。",
    },
    {
      q: "出生率が最も低い自治体はどこですか？",
      a: `全体では埼玉県毛呂山町(${bottom10[0].birthRate?.toFixed(
        2
      )})が最も低く、下位10自治体のうち${tokyoWardsInBottom10}自治体を東京都特別区が占めています。子どものいない単身世帯・共働き世帯の割合が高いことが背景にあると考えられます。`,
    },
    {
      q: "出生率と子ども人口割合はどう違いますか？",
      a: "出生率(合計特殊出生率)は「今、その地域で子どもが何人生まれているか」を示す指標で、子ども人口割合は「過去に生まれた子どもが今どれだけその地域に住んでいるか」を示す指標です。出生率が高くても子育て世帯が転出すれば子ども人口割合は上がらず、逆に出生率がそれほど高くなくても子育て世帯の転入が続けば子ども人口割合は高くなります。",
    },
  ];

  return (
    <div style={container}>
      <ArticleTags tags={["child"]} />

      <Breadcrumbs
        items={[
          { name: "記事一覧", href: "/articles" },
          { name: "出生率ランキング分析：なぜ鹿児島・沖縄の島しょ部が上位なのか" },
        ]}
      />

      <h1 style={title}>
        出生率ランキング分析：なぜ鹿児島・沖縄の島しょ部が上位なのか
      </h1>

      <PublishedDate date="2026-03-20" />
      <DataAsOf />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "出生率ランキング分析：なぜ鹿児島・沖縄の島しょ部が上位なのか",
          description:
            "市区町村別の合計特殊出生率で、鹿児島県徳之島町が全国1位。厚生労働省の統計をもとに、離島の出生率が高い理由を分析します。",
          datePublished: "2026-03-20",
          dateModified: meta.updatedAt,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/articles/birth-rate`,
          },
          author: {
            "@type": "Person",
            name: `${SITE_NAME} 運営者`,
            url: `${SITE_URL}/about`,
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
        }}
      />

      <p style={lead}>
        市区町村別の合計特殊出生率で全国1位となったのは、
        鹿児島県徳之島町({top15[0].birthRate?.toFixed(2)})でした。
        2位も同じ徳之島の天城町({top15[1].birthRate?.toFixed(2)})、
        3位以下も沖縄県の自治体が並びます。今回は、この統計の出典と
        算出方法を明らかにしたうえで、なぜ南西諸島の島しょ部に
        出生率の高い自治体が集中するのかを分析します。
      </p>

      <div style={box}>
        <h2>出生率TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.birthRate ?? 0,
            displayValue: (c.birthRate ?? 0).toFixed(2),
          }))}
        />
      </div>

      <div style={box}>
        <h2>この統計について</h2>

        <p>
          市区町村別の合計特殊出生率は、厚生労働省が公表する
          「人口動態保健所・市区町村別統計」の最新版(平成30年〜
          令和4年、2024年4月公表)にもとづいています。この統計は
          毎年ではなく、国勢調査に合わせて5年に1度程度公表される
          特別な集計です。人口が少ない自治体では、出生数の
          わずかな変動でも出生率が大きく振れてしまうため、
          この統計では近隣の状況を踏まえて数値を補正する
          「ベイズ推定」という統計手法が用いられています。
          単純な「その年の出生数÷女性人口」の計算値ではない点に
          注意が必要です。なお、東日本大震災の影響で長期避難が
          続いていた福島県の一部自治体は、この統計から除外
          されています。
        </p>
      </div>

      <div style={box}>
        <h2>なぜ島しょ部の出生率が高いのか</h2>

        <p>
          沖縄県全体の合計特殊出生率の単純平均は
          {okinawaAvg.toFixed(2)}で、全国平均の
          {average.toFixed(2)}を大きく上回ります。沖縄県は
          厚生労働省が毎年公表する都道府県別の出生率でも、
          長年にわたり全国トップの水準を維持しています。
          2024年の都道府県別データでも沖縄県は1.54で全国1位、
          全国平均の1.15を大きく上回りました。
        </p>

        <p>
          鹿児島県・沖縄県の島しょ部に共通する背景として、
          晩婚化・晩産化の影響が本土より小さいこと、
          三世代同居や地域の子育て支援ネットワークが
          比較的強く残っていること、そして子育てにかかる
          住宅費の負担が大都市圏より軽いことなどが、
          研究や行政資料でしばしば指摘されています。
          もっとも、これらの島は人口自体が少ないため、
          出生数の少しの増減が出生率を大きく動かしやすいという
          統計上の特性も影響しています。
        </p>

        <p>
          TOP15の顔ぶれを見ると、鹿児島県・沖縄県以外にも、
          長崎県の離島部など、島しょ部の自治体が目立ちます。
          離島は都市部への通勤・通学が物理的に難しく、
          地元で結婚・出産・子育てを完結させるライフスタイルが
          今も比較的多く残っていることが、共通した背景として
          指摘されています。一方で、こうした離島の多くは
          人口減少と高齢化が同時に進んでおり、出生率の高さ
          だけでは地域の将来人口を楽観視できない点にも
          注意が必要です。
        </p>
      </div>

      <div style={box}>
        <h2>最も低いのは東京都の都心区</h2>

        <p>
          出生率が最も低いのは埼玉県毛呂山町
          ({bottom10[0].birthRate?.toFixed(2)})ですが、
          下位10自治体のうち{tokyoWardsInBottom10}
          自治体を東京都特別区(豊島区・中野区・渋谷区・杉並区・
          目黒区・新宿区など)が占めています。これは、
          進学や就職で上京した若年層、特に子どものいない
          単身世帯・共働き世帯の割合が高いことが背景にあると
          考えられます。人口密度ランキングの分析記事でも
          触れたとおり、東京都心部は人口密度が高く「若い街」
          である一方、出生率で見ると全国最下位クラスという、
          一見矛盾するような特徴を持っています。
        </p>

        <p>
          これは、子ども人口割合ランキングの分析とも関連します。
          高齢化率が低い都心区は「子育て世代の流入」ではなく
          「単身・DINKs世帯の集中」によって若さが保たれている
          ケースが多く、出生率の低さはその裏返しと言えます。
        </p>
      </div>

      <div style={box}>
        <h2>都道府県別 平均出生率ランキング</h2>

        <p>
          市区町村単位では人口の少ない自治体の数値が
          振れやすいため、都道府県単位で市区町村の出生率を
          平均すると、より安定した傾向が見えてきます。
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>順位</th>
              <th style={th}>都道府県</th>
              <th style={th}>平均出生率</th>
            </tr>
          </thead>
          <tbody>
            {prefTop5.map((p, i) => (
              <tr key={p.pref}>
                <td style={td}>上位{i + 1}位</td>
                <td style={td}>{p.pref}</td>
                <td style={td}>{p.avg.toFixed(2)}</td>
              </tr>
            ))}
            {prefBottom5.map((p, i) => (
              <tr key={p.pref}>
                <td style={td}>下位{i + 1}位</td>
                <td style={td}>{p.pref}</td>
                <td style={td}>{p.avg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ marginTop: 12, fontSize: 14, color: "#6b7280" }}>
          都道府県単位で見ても、上位は沖縄県・鹿児島県・宮崎県などの
          九州・沖縄勢が占め、下位は東京都・北海道など大都市圏・
          寒冷地が並ぶ傾向がはっきり出ています。市区町村単位の
          ランキングと同じ傾向が、より大きな単位でも再現されている
          ことから、これは特定の自治体だけの特殊事情ではなく、
          地域全体の構造的な傾向だと考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>出生率と子ども人口割合、何が違うのか</h2>

        <p>
          出生率(合計特殊出生率)は「今、その地域で子どもが
          何人生まれているか」を映す指標であるのに対し、
          子ども人口割合は「過去に生まれた子どもが今どれだけ
          その地域に住んでいるか」を映す指標です。出生率が
          高くても、子育て世帯が別の自治体へ転出すれば子ども
          人口割合は上がりません。逆に出生率がそれほど高くなくても、
          子育て世帯の転入が続く自治体では子ども人口割合が
          高くなります。
        </p>

        <PersonalNote>
          このサイトを作る前は、なんとなく「出生率は地方の方が
          高い」というイメージを持っていました。ですが実際に
          データを見ると、都市近郊で子育て世帯の流入が続く
          自治体の方が高い数値を示すことも珍しくありません。
          離島のように「昔からその土地で産み育てる」出生率の
          高さと、ベッドタウンのように「よそから子育て世代が
          集まってくる」子ども人口割合の高さは、似ているようで
          まったく別の現象だと気づかされました。
        </PersonalNote>

        <p>
          <Link href="/ranking/child" style={link}>
            子ども人口割合ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/ranking/birth-rate" style={link}>
            出生率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/child-top50" style={link}>
            子ども人口ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/child-finance" style={link}>
            子ども人口割合と財政力指数の関係を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>統計を読むときの注意点</h2>

        <p>
          今回のランキングのもとになった統計は、全国
          {ranking.length.toLocaleString()}
          自治体分のデータが公表されていますが、これは平成30年
          (2018年)から令和4年(2022年)までの5年間をまとめた
          数値です。したがって、直近1〜2年で急激に状況が
          変化した自治体があっても、この数値にはまだ十分に
          反映されていない可能性があります。また、次回の
          同種の調査は次の国勢調査(2025年)のデータをもとに、
          数年後に公表される見込みです。本サイトでは、
          新しい統計が公表され次第、順次データを更新して
          いく予定です。
        </p>

        <p>
          全国平均は{average.toFixed(2)}で、これは厚生労働省が
          毎年公表する全国の合計特殊出生率(2024年で1.15)とは
          異なる数値です。この違いは、集計期間(5年平均か単年か)
          や、算出手法(ベイズ推定の有無)の違いによるもので、
          どちらも公式な統計ですが、性質の異なる数値を比較して
          いる点にご留意ください。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：出生率ランキングについてよくある質問</h2>

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

      <AuthorByline />
    </div>
  );
}

const container: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: "28px 24px",
  lineHeight: 1.9,
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

const title: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 800,
  marginBottom: 10,
};

const lead: React.CSSProperties = {
  fontSize: 17,
  color: "#374151",
  marginBottom: 24,
};

const box: React.CSSProperties = {
  background: "#fff",
  padding: 16,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 20,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
