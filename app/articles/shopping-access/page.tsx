import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  alternates: { canonical: "/articles/shopping-access" },
  title: "買い物難民ランキング分析｜郊外の落とし穴",
  description:
    "高齢者人口あたりの小売店数を分析し、「買い物難民」問題が深刻な自治体を紹介。過疎の山村よりも、車移動を前提に開発された都市近郊のニュータウンで、買い物の難しさが際立つ実態を解説します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.retailStoreCount != null &&
        c.elderlyPopulation != null &&
        c.elderlyPopulation > 0 &&
        c.population > 5000
    )
    .map((c) => ({
      ...c,
      per1000elderly:
        ((c.retailStoreCount ?? 0) / (c.elderlyPopulation ?? 1)) *
        1000,
      agingRate: (c.elderlyPopulation / c.population) * 100,
    }));

  const bottom15 = [...base]
    .sort((a, b) => a.per1000elderly - b.per1000elderly)
    .slice(0, 15);

  const average =
    base.reduce((s, c) => s + c.per1000elderly, 0) / base.length;

  function correlation(xs: number[], ys: number[]) {
    const n = xs.length;
    const mx = xs.reduce((s, v) => s + v, 0) / n;
    const my = ys.reduce((s, v) => s + v, 0) / n;
    let num = 0;
    let dx = 0;
    let dy = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      dx += (xs[i] - mx) ** 2;
      dy += (ys[i] - my) ** 2;
    }
    return num / Math.sqrt(dx * dy);
  }

  const r = correlation(
    base.map((c) => c.agingRate),
    base.map((c) => c.per1000elderly)
  );

  const osakaNaraCount = bottom15.filter(
    (c) => c.name.startsWith("大阪府") || c.name.startsWith("奈良県")
  ).length;

  const top15 = [...base]
    .sort((a, b) => b.per1000elderly - a.per1000elderly)
    .slice(0, 15);

  return (
    <ArticleLayout
      title="買い物難民ランキング分析：過疎の山村より郊外ニュータウンが危ない"
      summary={`高齢者(65歳以上)人口1,000人あたりの小売店数を比較すると、全国平均${average.toFixed(
        1
      )}店に対し、最下位の大阪府豊能町はわずか${bottom15[0].per1000elderly.toFixed(
        1
      )}店でした。意外にも、下位には過疎の山村ではなく、車移動を前提に開発された大都市近郊のニュータウンが並びます。`}
      heroLabel="高齢者あたり小売店数 最少"
      heroValue={`${bottom15[0].name} ${bottom15[0].per1000elderly.toFixed(1)}店`}
      rankingLink="/ranking/retail-access"
      tags={["aging"]}
      publishedAt="2026-08-06"
      top3={[
        { rank: 1, name: bottom15[0].name, value: `${bottom15[0].per1000elderly.toFixed(1)}店` },
        { rank: 2, name: bottom15[1].name, value: `${bottom15[1].per1000elderly.toFixed(1)}店` },
        { rank: 3, name: bottom15[2].name, value: `${bottom15[2].per1000elderly.toFixed(1)}店` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          「買い物難民」とは、日常の買い物に不便を感じる高齢者
          を指す言葉で、過疎地域の課題として語られることが
          多くあります。経済産業省の調査でも、こうした状態に
          ある人は全国で数百万人規模にのぼると推計されて
          おり、社会的にも関心の高いテーマです。買い物の
          しやすさは、日々の暮らしの質を左右する身近な問題
          でもあります。しかし、
          高齢者人口あたりの小売店数を実際に計算してみると、
          意外な自治体が下位に並びました。全国平均
          {average.toFixed(1)}
          店に対し、人口5,000人以上の
          {base.length.toLocaleString()}
          自治体のうち、最も店舗数が少ないのは大阪府豊能町で、
          わずか{bottom15[0].per1000elderly.toFixed(1)}
          店にとどまります。
        </p>
      </div>

      <div style={box}>
        <h2>高齢者あたり小売店数が少ない自治体TOP15</h2>

        <RankingBarChart
          items={bottom15.map((c) => ({
            name: c.name,
            value: c.per1000elderly,
            displayValue: `${c.per1000elderly.toFixed(1)}店`,
          }))}
          barColor="#c2410c"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          TOP15のうち{osakaNaraCount}
          自治体を大阪府・奈良県の自治体が占め、埼玉県鳩山町、
          宮城県七ヶ浜町、千葉県栄町なども並びます。いずれも
          高度経済成長期以降、大都市への通勤圏として開発
          された住宅専用のニュータウンです。工場や商業施設を
          あえて誘致せず、閑静な住宅街としての環境を優先して
          開発された経緯があり、その結果として地元での買い物
          拠点が育ちにくい土地柄になっています。
        </p>
      </div>

      <div style={box}>
        <h2>なぜ「高齢化率が高い=買い物困難」ではないのか</h2>

        <p>
          高齢化率と高齢者あたり小売店数の相関係数を計算すると
          {r.toFixed(2)}
          と、ほぼ無相関という結果になりました。これは意外に
          思われるかもしれません。実は、過疎の山村には昔ながら
          の個人商店が地域に根ざして残っているケースが多く、
          人口が少なくても最低限の買い物拠点が維持されている
          ことがあります。一方、大都市近郊のニュータウンは、
          そもそも「クルマで郊外のスーパーへ行く」ことを前提に
          設計された住宅地であるため、地元に小売店がほとんど
          立地していません。開発当初の現役世代がそのまま
          高齢化し、運転免許を返納する年齢に差しかかると、
          一気に買い物が困難になるという構造的な弱さを
          抱えています。開発当初は先進的で快適な住宅地
          として人気を集めた郊外ニュータウンが、数十年の
          時を経て、皮肉にも生活インフラの面で脆弱さを
          露呈するという構図は、日本各地で今後さらに
          広がっていく可能性があります。
        </p>

        <p>
          少子高齢化ギャップ分析の記事や、単独世帯割合と
          高齢化率のU字関係を扱った記事でも、こうした郊外
          ニュータウンが将来的に急速な高齢化に直面しやすい
          ことを紹介しましたが、今回のデータは、その先に
          待ち受ける「生活インフラの脆弱さ」という、より
          具体的な課題を浮き彫りにしています。買い物という
          日常的な行為の便利さは、統計上の高齢化率という
          数字だけでは見えてこない、生活の質に直結する
          重要な視点です。
        </p>
      </div>

      <div style={box}>
        <h2>各地で進む対策</h2>

        <p>
          買い物難民問題への対策として、全国の自治体では
          移動販売車の巡回、乗り合いタクシーやコミュニティ
          バスの運行、宅配サービスと連携した見守り事業などが
          進められています。特に郊外ニュータウンでは、住民の
          年齢層が一斉に高齢化するという特性上、対策が後手に
          回ると影響が短期間で一気に広がりやすいという特徴が
          あります。医師数ランキング分析の記事で見た医療
          アクセスの課題と同様、買い物というごく日常的な
          行為も、地域によって大きな格差があることが、
          今回のデータから見えてきます。人口が多く豊かに
          見える都市近郊であっても、こうした生活インフラの
          格差が潜んでいることは、意外と見落とされがちです。
        </p>
      </div>

      <div style={box}>
        <h2>逆に小売店が充実している自治体</h2>

        <RankingBarChart
          items={top15.slice(0, 10).map((c) => ({
            name: c.name,
            value: c.per1000elderly,
            displayValue: `${c.per1000elderly.toFixed(1)}店`,
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          上位には東京都心の区(千代田区・中央区・渋谷区など)
          が並びますが、これは職場や商業施設としての小売店が
          多く、住民の高齢者数に対して店舗数が突出して多く
          カウントされるためです。山梨県昭和町・長野県軽井沢町・
          香川県琴平町のような、大型商業施設や観光地の門前町
          を抱える自治体も、高齢者あたりで見ると店舗が充実
          している側に入ります。
        </p>
      </div>

      <div style={box}>
        <h2>郊外ニュータウンが抱える二重の課題</h2>

        <p>
          郊外ニュータウンの多くは、開発から数十年が経過し、
          今まさに住民の高齢化が進行している最中です。今回
          「小売店が少ない」上位に挙がった自治体の多くは、
          高齢化率がまだ全国平均程度か、それ以下の水準に
          とどまっています。つまり、これらの町が抱える買い物
          アクセスの課題は、住民がさらに高齢化していくこれから
          こそ、より深刻な形で表面化してくる可能性が高いと
          考えられます。生活インフラの整備が、人口構成の変化
          に追いついていない典型的な例だと言えるでしょう。
        </p>

        <PersonalNote>
          人口が減っている地域を見ていて、買い物のしづらさは
          特に分かりやすい変化の一つだと感じています。近所の
          商店が1つ、また1つと閉まっていくことで、車を運転
          できない高齢者ほど生活が不便になっていきます。
          データ上は「小売店が少ない」という数字ですが、
          その裏には長い時間をかけて商店が撤退していった
          過程があり、単純にお店を1つ誘致すれば解決する
          という話ではないと感じています。
        </PersonalNote>

        <p>
          <Link href="/ranking/retail-access" style={link}>
            高齢者あたり小売店数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/aging-gap" style={link}>
            少子高齢化ギャップ分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/household-aging-ushape" style={link}>
            単独世帯割合と高齢化率のU字関係を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          小売店数は経済センサスなどに基づく事業所単位の
          統計であり、コンビニエンスストアや移動販売、
          ネットスーパーの普及状況までは反映されていません。
          近年は移動販売車やネット注文の宅配サービスが、
          実店舗の少なさを補う手段として広がりつつあり、
          小売店数だけで実際の「買い物のしやすさ」を完全に
          測ることはできない点にご留意ください。また、
          今回は人口5,000人以上の自治体に絞って比較して
          いますが、これは極端に人口が少ない自治体で数値が
          振れやすくなることを避けるための措置です。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          高齢者あたり小売店数ランキングでは、過疎の山村
          ではなく、車移動を前提に設計された大都市近郊の
          ニュータウンが下位に並ぶという、意外な結果になり
          ました。高齢化率との相関係数はほぼ0で、「高齢化が
          進んでいるかどうか」と「買い物が便利かどうか」は、
          必ずしも一致しません。むしろ、今はまだ高齢化率が
          低くても、将来的に一気に高齢化が進む郊外ニュータウン
          こそ、生活インフラの備えが求められていると言える
          でしょう。
        </p>

        <p>
          こうした「静かに進行するリスク」は、統計上の
          高齢化率だけを見ていては気づきにくいものです。
          複数の指標を掛け合わせて初めて、まだ表面化して
          いない地域課題の兆候が見えてくることがあります。
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
