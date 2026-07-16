import Link from "next/link";
import DataAsOf from "@/components/DataAsOf";
import RankingBarChart from "@/components/RankingBarChart";
import { getMunicipalities } from "@/lib/municipalities";

export const metadata = {
  title: "日本で最も人口が集中している地域は？",
  description:
    "人口データから日本の人口集中地域を、都道府県別の実数とともに分析します。",
};

export default function Page() {
  const municipalities = getMunicipalities();

  const totalPopulation = municipalities.reduce(
    (s, c) => s + c.population,
    0
  );

  const prefTotals: Record<string, number> = {};
  municipalities.forEach((c) => {
    const pref = c.name.split(" ")[0];
    prefTotals[pref] = (prefTotals[pref] || 0) + c.population;
  });

  const prefRanking = Object.entries(prefTotals).sort(
    (a, b) => b[1] - a[1]
  );

  const top6Total = prefRanking
    .slice(0, 6)
    .reduce((s, [, v]) => s + v, 0);

  const gtokyo = ["東京都", "神奈川県", "埼玉県", "千葉県"];
  const gtokyoTotal = gtokyo.reduce(
    (s, p) => s + (prefTotals[p] || 0),
    0
  );

  const under5000 = municipalities.filter(
    (c) => c.population < 5000
  ).length;

  const under1000 = municipalities.filter(
    (c) => c.population < 1000
  ).length;

  const topCities = [...municipalities]
    .sort((a, b) => b.population - a.population)
    .slice(0, 5);

  return (
    <div style={container}>
      <h1 style={h1}>日本で最も人口が集中している地域は？</h1>

      <DataAsOf />

      <p style={lead}>
        日本の人口は全国に均等に分布しているわけではありません。
        本サイトが集計している全国{municipalities.length.toLocaleString()}
        自治体・総人口
        {totalPopulation.toLocaleString()}
        人のデータを都道府県単位で集計すると、特に首都圏への集中が
        際立って浮かび上がります。
      </p>

      <h2 style={h2}>数字で見る人口集中</h2>

      <RankingBarChart
        title="都道府県別 人口TOP10"
        items={prefRanking.slice(0, 10).map(([pref, pop]) => ({
          name: pref,
          value: pop,
          displayValue: `${Math.round(
            pop / 10000
          ).toLocaleString()}万人`,
        }))}
      />

      <p style={{ marginTop: 20 }}>
        都道府県別の人口を見ると、1位は{prefRanking[0][0]}で
        {prefRanking[0][1].toLocaleString()}人
        (全国の
        {((prefRanking[0][1] / totalPopulation) * 100).toFixed(1)}
        %)、2位は{prefRanking[1][0]}で
        {prefRanking[1][1].toLocaleString()}人
        (
        {((prefRanking[1][1] / totalPopulation) * 100).toFixed(1)}
        %)、3位は{prefRanking[2][0]}で
        {prefRanking[2][1].toLocaleString()}人
        (
        {((prefRanking[2][1] / totalPopulation) * 100).toFixed(1)}
        %)です。上位6都府県の合計は
        {top6Total.toLocaleString()}人で、全国人口の
        {((top6Total / totalPopulation) * 100).toFixed(1)}
        %を占めており、残る41道府県で残りの
        {(100 - (top6Total / totalPopulation) * 100).toFixed(1)}
        %を分け合っている計算になります。
      </p>

      <p>
        中でも注目すべきは、東京都・神奈川県・埼玉県・千葉県の
        「1都3県(首都圏)」の合計です。この4都県だけで
        {gtokyoTotal.toLocaleString()}人、全国人口の
        {((gtokyoTotal / totalPopulation) * 100).toFixed(1)}
        %を占めています。都道府県の数で見ると47のうちわずか
        4県(
        {((4 / 47) * 100).toFixed(1)}
        %)にすぎない地域に、人口の
        {((gtokyoTotal / totalPopulation) * 100).toFixed(0)}
        %近くが集中していることになります。
      </p>

      <h2 style={h2}>人口はどこに集中しているのか</h2>

      <p>
        自治体単位で見ると、{topCities
          .map(
            (c) =>
              `${c.name}(約${Math.round(
                c.population / 10000
              )}万人)`
          )
          .join("・")}
        が人口上位を占め、いずれも各都市圏の中心都市です。
        これは就業機会や交通利便性、教育機関の集積などが
        背景にあります。特に新幹線や地下鉄などの交通インフラが
        整備された都市ほど、周辺自治体からの通勤・通学者を
        吸収しやすく、昼間人口(実際にその地域で活動する人口)は
        夜間人口(住民登録上の人口)をさらに上回る傾向があります。
      </p>

      <h2 style={h2}>人口集中のメリット</h2>

      <ul>
        <li>
          公共交通が発達しやすく、自動車がなくても生活しやすい
        </li>
        <li>
          大学病院や専門医療機関など高度な医療機関が充実しやすい
        </li>
        <li>
          企業や求人が集まりやすく、就業機会の選択肢が広い
        </li>
      </ul>

      <h2 style={h2}>人口集中の課題</h2>

      <ul>
        <li>
          住宅価格・家賃の上昇により、若年層の住居費負担が増す
        </li>
        <li>
          通勤ラッシュや交通混雑が慢性化しやすい
        </li>
        <li>
          地方の人口流出が加速し、地域間格差が拡大する
        </li>
      </ul>

      <p>
        一方で、人口5,000人未満の小規模自治体は全国に
        {under5000}あり、全体の約
        {((under5000 / municipalities.length) * 100).toFixed(1)}
        %を占めています。人口1,000人未満の自治体も
        {under1000}存在し、その多くは離島や山間部に
        位置しています。こうした自治体では、人口集中地域とは
        正反対の課題、すなわち行政サービスの担い手不足や、
        インフラ維持コストの負担増といった問題に直面しています。
      </p>

      <h2 style={h2}>ランキングで確認する</h2>

      <p>
        実際の人口ランキングは以下から確認できます。
        都道府県別のデータは「都道府県から探す」ページでも
        比較できます。
      </p>

      <p>
        <Link href="/ranking/population" style={link}>
          人口ランキングを見る
        </Link>
        {" ｜ "}
        <Link href="/prefecture" style={link}>
          都道府県から探す
        </Link>
      </p>

      <h2 style={h2}>人口集中は今後も続くのか</h2>

      <p>
        日本全体の人口が減少局面に入る中でも、首都圏への
        人口集中はしばらく続くと見られています。これは
        地方から都市部への人口流出(社会増減)が、
        出生・死亡による自然な人口変動(自然増減)よりも
        大きな影響を与えているためです。特に進学や就職を
        きっかけとした若年層の移動は、地方の人口減少と
        都市部の人口維持を同時に引き起こす要因になっています。
      </p>

      <h2 style={h2}>集中と分散、どちらが望ましいのか</h2>

      <p>
        人口集中には効率性というメリットがある一方、
        災害リスクの集中や、地方の担い手不足という
        デメリットも伴います。首都直下地震のような
        大規模災害が発生した場合、人口が集中している
        地域ほど被害の規模も大きくなりやすく、
        行政機能や経済活動への影響も深刻になります。
        こうしたリスクを分散する観点から、政府や
        自治体は「地方創生」を掲げ、企業の地方移転や
        テレワークの推進、地方への移住支援などに
        取り組んできました。統計データを見る限り、
        こうした施策の効果は限定的とされ、大都市圏への
        人口集中の構図が大きく崩れた形跡は見られません。
      </p>

      <h2 style={h2}>都道府県別ランキングもあわせて確認</h2>

      <p>
        本サイトでは、都道府県ごとの自治体データも
        確認できます。「都道府県から探す」ページでは、
        気になる都道府県を選ぶと、その中に含まれる
        市区町村の一覧と人口規模を確認できます。
        全国レベルの集中だけでなく、都道府県内での
        集中傾向も、あわせて見てみると新たな発見が
        あるはずです。
      </p>
    </div>
  );
}

const container: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 24,
  lineHeight: 1.8,
};

const h1: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  marginBottom: 16,
};

const lead: React.CSSProperties = {
  fontSize: 18,
};

const h2: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  marginTop: 28,
  marginBottom: 10,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
