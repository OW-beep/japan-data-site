import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  alternates: { canonical: "/articles/community-center-analysis" },
  title: "公民館数ランキング分析｜集落ごとに公民館がある町、長野県が上位独占",
  description:
    "公民館数ランキングを分析。長野県の町村が上位を独占する理由と、大都市の多くで公民館がゼロになっている背景を、令和3年度社会教育調査の最新データから読み解きます。",
};

export default function Page() {
  const all = getMunicipalities().filter(
    (c) => c.communityCenterCount != null && c.population >= 3000
  );

  const zeroCount = all.filter((c) => c.communityCenterCount === 0).length;

  const base = all
    .filter((c) => (c.communityCenterCount ?? 0) > 0)
    .map((c) => ({
      ...c,
      perFacility: c.population / (c.communityCenterCount ?? 1),
    }));

  const ranking = [...base].sort((a, b) => a.perFacility - b.perFacility);
  const top15 = ranking.slice(0, 15);

  const bigCities = base
    .filter((c) => c.population >= 200000)
    .sort((a, b) => a.perFacility - b.perFacility);
  const bigTop10 = bigCities.slice(0, 10);

  const zeroBigCities = getMunicipalities().filter(
    (c) => c.population >= 200000 && c.communityCenterCount === 0
  ).length;

  const average =
    base.reduce((s, c) => s + c.perFacility, 0) / base.length;

  const naganoInTop15 = top15.filter((c) =>
    c.name.startsWith("長野県")
  ).length;

  return (
    <ArticleLayout
      title="公民館数ランキング分析:集落ごとに公民館がある町、長野県が上位を独占"
      summary={`公民館1館あたりの人口を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${Math.round(
        average
      ).toLocaleString()}人に対し、上位には長野県の町村が数多く入りました。一方、人口20万人以上の都市の${zeroBigCities}自治体で公民館が1館もないなど、都市部との差が際立つ結果になりました。`}
      heroLabel="公民館 充実度 全国1位"
      heroValue={`${top15[0].name} ${Math.round(top15[0].perFacility).toLocaleString()}人/館`}
      rankingLink="/ranking/community-center"
      tags={["geography"]}
      publishedAt="2026-08-10"
      top3={[
        { rank: 1, name: top15[0].name, value: `${Math.round(top15[0].perFacility).toLocaleString()}人` },
        { rank: 2, name: top15[1].name, value: `${Math.round(top15[1].perFacility).toLocaleString()}人` },
        { rank: 3, name: top15[2].name, value: `${Math.round(top15[2].perFacility).toLocaleString()}人` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          公民館1館あたりの人口は、数字が小さいほど、その
          地域に公民館が密に配置されていることを意味します。
          令和3年度社会教育調査をもとに全国
          {base.length.toLocaleString()}
          自治体を比較したところ、全国平均は
          {Math.round(average).toLocaleString()}
          人でしたが、公民館が1館もない自治体も
          {zeroCount}
          あり、都市と地方でくっきりと傾向が分かれました。
          人口密度や高齢化率だけでは見えてこない、地域の
          「つながりの厚み」を映す指標として読んでみると、
          いつものランキングとは違う発見があります。
        </p>
      </div>

      <div style={box}>
        <h2>公民館数TOP15、長野県の町村が上位独占</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.perFacility,
            displayValue: `${Math.round(c.perFacility).toLocaleString()}人`,
          }))}
          barColor="#7c3aed"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の{top15[0].name}
          は公民館1館あたりわずか
          {Math.round(top15[0].perFacility).toLocaleString()}
          人。TOP15のうち
          {naganoInTop15}
          自治体を長野県の町村が占めています。長野県は
          明治時代から「学びの県」として社会教育に力を
          入れてきた歴史があり、集落(区)ごとに公民館を
          設置する伝統が今も色濃く残っています。人口の
          少ない山あいの集落でも、それぞれが独自の公民館を
          維持し、住民同士の顔が見える関係を保っている
          ことがうかがえます。上位15自治体のうち長野県以外
          にも、山形県・秋田県・熊本県の町村が名を連ねており、
          いずれも山間部や農村部という共通点があります。
          都市化の波が及びにくかった地域ほど、公民館文化が
          色濃く残っているとも言えそうです。
        </p>
      </div>

      <div style={box}>
        <h2>大都市では、多くの自治体で公民館がゼロに</h2>

        <RankingBarChart
          items={bigTop10.map((c) => ({
            name: c.name,
            value: c.perFacility,
            displayValue: `${Math.round(c.perFacility).toLocaleString()}人`,
          }))}
          barColor="#2563eb"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          人口20万人以上の都市の中で最も公民館に余裕が
          あったのは福島県郡山市でしたが、それでも1館あたり
          {Math.round(bigTop10[0].perFacility).toLocaleString()}
          人と、長野県の町村とは桁違いの差があります。さらに、
          人口20万人以上の都市のうち
          {zeroBigCities}
          自治体では、公民館が統計上1館も存在しません。
          郡山市を除く上位も、長岡市・福井市・富山市・
          豊橋市など、地方の中核都市が中心です。三大都市圏の
          大都市がほとんど見当たらない点も、この指標ならでは
          の特徴と言えます。
        </p>

        <PersonalNote>
          ここで注意したいのは、公民館がゼロだからといって、
          その街に地域活動の拠点が本当に無いわけではないという
          点です。多くの都市部では、「公民館」という名称では
          なく「コミュニティセンター」「地区センター」
          「市民センター」といった別の名称の施設が、実質的に
          同じ役割を担っています。統計上の分類にとらわれず、
          実際に住む街の施設を自治体の公式サイトで確認する
          ことをおすすめします。行政の統計は、名称が変わる
          だけで数字が大きく変わってしまう典型的な例だと
          感じます。似たような「呼び方の違いで見えなくなる
          データ」は、他の統計にも潜んでいる可能性があり、
          数字を鵜呑みにしない姿勢が大切だと改めて思います。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          この調査は3年に一度実施される社会教育調査に基づく
          もので、今回は令和3年度(2021年度)時点のデータ
          です。次回調査は令和6年度に実施される予定で、
          コロナ禍を経て公民館の利用形態や統廃合がどう
          変化したかも注目されます。また、上述の通り「公民館」
          という名称の施設
          のみを対象としているため、類似施設が多い都市部
          ほど実態より少なく見える傾向がある点にご留意
          ください。人口3,000人未満の小規模な自治体は、
          分母が小さく数値が不安定になりやすいため、今回の
          集計対象からは除外しています。
        </p>
      </div>

      <div style={box}>
        <h2>公民館という制度の成り立ち</h2>

        <p>
          公民館は、戦後の1949年に制定された社会教育法に
          基づく施設で、地域住民の学習・交流・文化活動の
          拠点として全国に設置されてきました。特に農山村
          地域では、公民館が単なる集会所ではなく、成人教育・
          青年団活動・防災訓練など、地域運営そのものを支える
          インフラとして機能してきた歴史があります。長野県
          の公民館密度の高さは、こうした戦後の社会教育運動
          が今も根強く受け継がれていることの表れとも言えます。
          高齢化が進む中山間地域では、公民館が防災の避難所や
          見守り活動の拠点を兼ねているケースも多く、単なる
          「学びの場」を超えた役割を担っています。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          公民館数ランキングは、長野県をはじめとする地方の
          町村が持つ「集落単位の地域コミュニティ」という
          強みを浮き彫りにしました。一方で都市部の少なさは、
          コミュニティの希薄さというより、施設の呼び方や
          運営形態の違いによるところが大きいと考えられます。
          地域とのつながりを重視して住む場所を選ぶ際は、
          この数字だけでなく、実際にどんな地域活動が
          行われているかも確認してみることをおすすめします。
          公民館数は、その街の「人と人との距離感」を
          間接的に映す、少し変わった切り口の指標と言える
          かもしれません。
        </p>

        <p>
          <Link href="/ranking/community-center" style={link}>
            公民館数ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/ranking/library" style={link}>
            図書館数ランキングを見る
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
