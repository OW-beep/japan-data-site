import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  title: "ごみのリサイクル率ランキング分析｜大崎町はなぜ日本一なのか",
  description:
    "ごみのリサイクル率ランキングを分析。全国的に知られる鹿児島県大崎町の28品目分別の仕組みと、上位自治体に共通する住民参加型の取り組みを、2023年度の最新データから読み解きます。",
};

export default function Page() {
  const base = getMunicipalities().filter(
    (c) => c.recyclingRate != null && c.recyclingRate > 0
  );

  const ranking = [...base].sort(
    (a, b) => (b.recyclingRate ?? 0) - (a.recyclingRate ?? 0)
  );
  const top15 = ranking.slice(0, 15);

  const bottom10 = [...base]
    .sort((a, b) => (a.recyclingRate ?? 0) - (b.recyclingRate ?? 0))
    .slice(0, 10);

  const bigCities = base
    .filter((c) => c.population >= 200000)
    .sort((a, b) => (b.recyclingRate ?? 0) - (a.recyclingRate ?? 0));
  const bigTop10 = bigCities.slice(0, 10);

  const average =
    base.reduce((s, c) => s + (c.recyclingRate ?? 0), 0) / base.length;

  const osaki = base.find((c) => c.name === "鹿児島県 大崎町");
  const osakiRank = ranking.findIndex((c) => c.name === "鹿児島県 大崎町") + 1;

  return (
    <ArticleLayout
      title="ごみのリサイクル率ランキング分析:大崎町はなぜ「日本一」と呼ばれるのか"
      summary={`ごみのリサイクル率を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${average.toFixed(
        1
      )}%に対し、住民参加型の分別収集で知られる鹿児島県大崎町は${
        osaki?.recyclingRate?.toFixed(1) ?? "-"
      }%(全体${osakiRank}位)でした。上位には99%台という統計的に不自然な数値も見られ、集計方法の違いについても解説します。`}
      heroLabel="ごみのリサイクル率 全国1位"
      heroValue={`${top15[0].name} ${top15[0].recyclingRate?.toFixed(1)}%`}
      rankingLink="/ranking/recycling-rate"
      tags={["geography"]}
      publishedAt="2026-08-10"
      top3={[
        { rank: 1, name: top15[0].name, value: `${top15[0].recyclingRate?.toFixed(1)}%` },
        { rank: 2, name: top15[1].name, value: `${top15[1].recyclingRate?.toFixed(1)}%` },
        { rank: 3, name: top15[2].name, value: `${top15[2].recyclingRate?.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          ごみのリサイクル率は、ごみ総排出量のうちどれだけが
          資源として再利用されたかを示す指標です。令和5年度
          「一般廃棄物処理事業実態調査」をもとに全国
          {base.length.toLocaleString()}
          自治体を比較したところ、全国平均は
          {average.toFixed(1)}
          %でした。環境省が掲げる目標(令和12年度で27%程度)
          と比べても、多くの自治体がまだ道半ばであることが
          分かります。ごみ処理は数少ない「自治体ごとに
          ルールが大きく異なる」身近な行政サービスであり、
          リサイクル率の差は住民の分別への協力度合いを
          映す鏡でもあります。
        </p>
      </div>

      <div style={box}>
        <h2>リサイクル率TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.recyclingRate ?? 0,
            displayValue: `${c.recyclingRate?.toFixed(1)}%`,
          }))}
          barColor="#16a34a"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          上位には埼玉県日高市・高知県中土佐町など99%台の
          自治体が並びますが、この水準は全国的にも極めて
          異例です。通常、リサイクル率が高いとされる自治体
          でも70〜80%台にとどまることが多く、集計方法(直接
          資源化量の計上の仕方など)の違いによって数値が
          押し上げられている可能性があります。順位の細部
          よりも、上位に共通する「住民参加型の分別」という
          傾向に注目するのがおすすめです。
        </p>
      </div>

      <div style={box}>
        <h2>大崎町はなぜ「日本一」と呼ばれるのか</h2>

        <p>
          今回のランキングでは
          {osakiRank}
          位となった鹿児島県大崎町(
          {osaki?.recyclingRate?.toFixed(1)}
          %)ですが、実はごみ処理の分野では全国で最も有名な
          自治体のひとつです。人口1万2千人ほどの小さな町
          でありながら、大崎町には可燃ごみを燃やす
          焼却炉がなく、生ごみを含む27〜28品目にごみを
          細かく分別し、そのほとんどを資源化する「大崎
          システム」を1998年から続けてきました。埋立処分場を
          延命させるために始まったこの取り組みは、今では
          国内外から視察が絶えない先進事例として知られて
          います。
        </p>

        <PersonalNote>
          行政の現場では、ごみの分別ルールを変えるというのは
          住民の理解と協力が絶対条件になる、非常にハードルの
          高い施策です。大崎町のように27品目もの分別を
          長年続けられているのは、単に自治体が制度を作った
          からではなく、住民一人ひとりが日々の生活の中で
          分別を習慣化してくれているからこそだと思います。
          リサイクル率という数字の裏には、その街の住民の
          意識の高さが表れているとも言えるかもしれません。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>大都市(人口20万人以上)では、どこが健闘しているか</h2>

        <RankingBarChart
          items={bigTop10.map((c) => ({
            name: c.name,
            value: c.recyclingRate ?? 0,
            displayValue: `${c.recyclingRate?.toFixed(1)}%`,
          }))}
          barColor="#2563eb"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          人口20万人以上の都市に絞ると、大崎町のような
          小規模自治体ほどの高水準には及ばないものの、
          分別収集に力を入れている都市が上位に並びました。
          大規模な自治体では、住民の入れ替わりが激しく、
          転入者への分別ルールの周知が難しいという事情も
          影響していると考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>逆にリサイクル率が低い自治体は</h2>

        <RankingBarChart
          items={bottom10.map((c) => ({
            name: c.name,
            value: c.recyclingRate ?? 0,
            displayValue: `${c.recyclingRate?.toFixed(1)}%`,
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          下位には沖縄県や東京都の離島が目立ちます。離島は
          資源ごみを本土まで船で運ぶコストが高く、分別しても
          再資源化の仕組みに乗せにくいという、地理的な制約が
          大きく影響していると考えられます。リサイクル率の
          低さを、そのまま「意識が低い」と結びつけるのは
          早計です。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          東京23区は「東京二十三区清掃一部事務組合」が共同で
          ごみ処理を担っているため、区ごとのリサイクル率は
          公表されておらず、今回のランキングには含まれて
          いません。また、リサイクル率の算出方法は自治体に
          よって「集団回収量」の扱いなどに差があり、単純な
          横並び比較には一定の限界がある点もご留意ください。
          今回のデータは令和5年度(2023年度)時点のもので、
          分別ルールの見直しなどにより、今後数値が変動する
          可能性もあります。
        </p>
      </div>

      <div style={box}>
        <h2>この指標は暮らしにどう関係するか</h2>

        <p>
          リサイクル率が高い自治体は、分別区分が細かく設定
          されている傾向があり、引っ越し直後は分別ルールを
          覚えるのに少し手間がかかるかもしれません。一方で、
          こうした自治体はごみ収集カレンダーやアプリでの
          通知など、住民サポートの仕組みも充実している
          ケースが多く見られます。環境意識の高い暮らしを
          重視する人にとっては、リサイクル率の高さは
          「住民の意識が高い街」を見分ける一つの目安にも
          なりそうです。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          ごみのリサイクル率ランキングからは、全国的に知られる
          大崎町のような先進事例だけでなく、離島など地理的な
          制約を抱える自治体の存在も見えてきました。順位の
          高さは自治体の努力だけでなく、人口規模や地理的
          条件にも左右されるため、単純な優劣ではなく、それぞれの
          街が置かれた状況をふまえて読むことをおすすめします。
          引っ越し先を検討する際は、この指標もぜひ他の
          ランキングとあわせて参考にしてみてください。
        </p>

        <p>
          <Link href="/ranking/recycling-rate" style={link}>
            ごみのリサイクル率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/vacant-house-analysis" style={link}>
            空き家率ランキング分析を見る
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
