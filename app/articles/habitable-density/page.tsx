import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  title: "可住地人口密度ランキング分析｜尾鷲市の実態",
  description:
    "山地・湖沼などを除いた可住地面積あたりの人口密度を分析。単純な人口密度ランキングでは目立たない三重県尾鷲市や和歌山県新宮市が、可住地ベースで見ると大きく順位を上げる理由を解説します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.habitableArea != null &&
        c.habitableArea > 0 &&
        c.population > 0 &&
        c.area != null &&
        c.area > 0
    )
    .map((c) => ({
      ...c,
      habitableDensity: c.population / ((c.habitableArea ?? 1) / 100),
      habitableRatio:
        ((c.habitableArea ?? 0) / 100 / (c.area ?? 1)) * 100,
    }));

  const byRaw = [...base].sort(
    (a, b) => (b.populationDensity ?? 0) - (a.populationDensity ?? 0)
  );
  const byHabitable = [...base].sort(
    (a, b) => b.habitableDensity - a.habitableDensity
  );
  byRaw.forEach((c, i) => ((c as any).rawRank = i + 1));
  byHabitable.forEach((c, i) => ((c as any).habRank = i + 1));

  const jumps = base
    .map((c: any) => ({ ...c, jump: c.rawRank - c.habRank }))
    .sort((a, b) => b.jump - a.jump)
    .slice(0, 15);

  const top15 = byHabitable.slice(0, 15);

  const average =
    base.reduce((s, c) => s + c.habitableDensity, 0) / base.length;

  const avgHabitableRatio =
    base.reduce((s, c) => s + c.habitableRatio, 0) / base.length;

  return (
    <ArticleLayout
      title="可住地人口密度ランキング分析：三重県尾鷲市は「見た目より混んでいる」自治体だった"
      summary={`日本の国土は7割近くが山地です。総面積ではなく「住める土地(可住地)」だけで人口密度を計算し直すと、単純な人口密度ランキングでは目立たない自治体の姿が見えてきます。三重県尾鷲市は通常の人口密度ランキングで1148位ですが、可住地ベースでは520位まで順位が跳ね上がります。`}
      heroLabel="可住地人口密度で最も順位が上がった自治体"
      heroValue={`${jumps[0].name}`}
      rankingLink="/ranking/habitable-density"
      tags={["geography"]}
      publishedAt="2026-08-03"
      top3={[
        { rank: 1, name: top15[0].name, value: `${Math.round(top15[0].habitableDensity).toLocaleString()}人/km²` },
        { rank: 2, name: top15[1].name, value: `${Math.round(top15[1].habitableDensity).toLocaleString()}人/km²` },
        { rank: 3, name: top15[2].name, value: `${Math.round(top15[2].habitableDensity).toLocaleString()}人/km²` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          人口密度ランキングは「人口 ÷ 総面積」で計算されますが、
          総面積には山地・湖沼・河川など、そもそも人が住めない
          土地も含まれています。全国自治体の平均可住地率(総面積
          に占める可住地面積の割合)は
          {avgHabitableRatio.toFixed(1)}
          %にとどまり、残りの半分以上は山や水面が占めています。
          そこで今回は、可住地面積だけをもとに人口密度を
          計算し直すことで、「本当の混雑度」を再検証しました。
          国土交通省の統計でも、日本の国土面積のうち山地が
          およそ7割を占めるとされており、今回の分析結果は
          その数字とも整合的です。
        </p>
      </div>

      <div style={box}>
        <h2>可住地人口密度TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.habitableDensity,
            displayValue: `${Math.round(
              c.habitableDensity
            ).toLocaleString()}人/km²`,
          }))}
          barColor="#0e7490"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          可住地人口密度そのもののTOP15は、東京都豊島区・
          中野区・荒川区といった東京都心の区が並び、通常の
          人口密度ランキングとほぼ同じ顔ぶれになります。これは、
          東京都心の区はもともと可住地率がほぼ100%(平坦な
          市街地で山地がない)であるため、可住地ベースで
          計算しても数値がほとんど変わらないためです。
        </p>
      </div>

      <div style={box}>
        <h2>「見た目より混んでいる」自治体TOP15</h2>

        <RankingBarChart
          items={jumps.map((c: any) => ({
            name: c.name,
            value: c.jump,
            displayValue: `${c.jump}位アップ`,
          }))}
          barColor="#d97706"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          このグラフは、通常の人口密度ランキングでの順位と、
          可住地人口密度ランキングでの順位を比べ、最も順位が
          上がった(=見た目より実際は混んでいる)自治体を
          並べたものです。1位の奈良県黒滝村は可住地率
          {jumps[0].habitableRatio.toFixed(1)}
          %、2位の三重県尾鷲市は
          {jumps[1].habitableRatio.toFixed(1)}
          %しかなく、住民のほとんどが国土のごく一部に
          集中して暮らしています。
        </p>
      </div>

      <div style={box}>
        <h2>山と海に挟まれた町の共通点</h2>

        <p>
          TOP15の顔ぶれを見ると、三重県尾鷲市・和歌山県新宮市・
          那智勝浦町といった紀伊半島南部の自治体、岩手県山田町・
          釜石市といった三陸海岸の自治体が目立ちます。いずれも
          背後に急峻な山地が迫り、平地がわずかな沿岸部に
          市街地が張り付くように形成された、日本の典型的な
          「山と海に挟まれた町」です。尾鷲市は日本有数の多雨
          地帯としても知られ、急峻な地形と豊富な降水量が、
          可住地の少なさに直結しています。北海道泊村(原子力
          発電所の立地自治体としてこれまでの記事でも紹介)も、
          可住地率わずか1.0%と、TOP15の中でも際立って
          低い数値でした。可住地率が低いほど、住民は限られた
          土地に集まって暮らさざるを得ず、道路や上下水道
          などのインフラ整備コストが割高になりやすいという
          課題も抱えています。
        </p>

        <p>
          長野県下諏訪町・広島県廿日市市のように、盆地や
          谷筋に市街地が集中する内陸の自治体も含まれています。
          これらの自治体は、通常の人口密度ランキングだけを
          見ると「人口が少なく、余裕のある町」という印象を
          持たれがちですが、実際に住民が暮らす範囲だけを
          切り出すと、都市部に匹敵する密集度になっている
          ケースが少なくありません。
        </p>
      </div>

      <div style={box}>
        <h2>可住地の狭さは災害リスクとも結びつく</h2>

        <p>
          可住地が国土の1割程度しかない自治体の多くは、
          住宅地が急峻な斜面のすぐ下や、川沿いの限られた
          平地に集中せざるを得ない地形的な制約を抱えて
          います。三重県尾鷲市や岩手県山田町・釜石市の
          ように山と海に挟まれた地域は、土砂災害や津波の
          リスクとも隣り合わせであることが多く、可住地の
          狭さは同時に防災上の課題の大きさも意味します。
          可住地人口密度が高い自治体ほど、限られた安全な
          土地を有効に使うための都市計画や、災害時の
          避難経路の確保が、より切実な課題になっていると
          考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>人口密度ランキングの「見え方」を変える指標</h2>

        <p>
          人口密度ランキング分析の記事では、人口密度と高齢化率
          や財政力指数との関係を扱いましたが、その際に使った
          「人口密度」はあくまで総面積ベースの数値でした。
          可住地面積という切り口を加えることで、同じ自治体でも
          まったく違う姿が見えてきます。特に山がちな地形を
          持つ地方の自治体を評価する際には、総面積ベースの
          密度だけでなく、可住地ベースの密度もあわせて確認
          することで、より実態に近い「暮らしの密集度」を
          把握できます。
        </p>

        <p>
          <Link href="/ranking/habitable-density" style={link}>
            可住地人口密度ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/density-analysis" style={link}>
            人口密度ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/area-analysis" style={link}>
            面積ランキング分析を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          可住地面積は、国土交通省国土地理院の「全国都道府県
          市区町村別面積調」をもとに、総面積から林野面積・
          主要湖沼面積を控除して算出されたものです。傾斜地の
          農地や、実際には居住に適さない造成困難な土地なども
          「可住地」に含まれる場合があり、必ずしも住宅地として
          即座に利用可能な土地の面積と完全に一致するわけでは
          ありません。あくまで、総面積よりも実態に近い密度を
          推計するための指標として活用してください。宅地
          開発や防災計画の検討においては、より詳細な地形
          データとあわせて確認することをおすすめします。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          可住地人口密度ランキングでは、東京都心の区が引き続き
          上位を占める一方、三重県尾鷲市や和歌山県新宮市・
          那智勝浦町、岩手県山田町・釜石市といった、山と海に
          挟まれた地方の自治体が、通常の人口密度ランキングより
          はるかに高い順位に浮上しました。日本の国土の7割が
          山地であるという事実を踏まえると、総面積だけを
          もとにした人口密度は、地方の自治体の「本当の暮らしの
          密集度」を過小評価している可能性があります。人口
          密度という一見単純な指標も、切り口を変えるだけで
          まったく違う地域の姿を映し出すことが分かりました。
          今後、地方移住や二拠点生活を検討する際には、単純な
          人口密度の数字だけでなく、こうした可住地ベースの
          指標もあわせて参考にしてみてください。
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
