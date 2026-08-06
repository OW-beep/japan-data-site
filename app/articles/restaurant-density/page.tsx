import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  title: "飲食店密度ランキング分析｜千代田区とベッドタウンの対極",
  description:
    "人口1,000人あたりの飲食店数をランキング分析。東京都心のオフィス街と、箱根町・白馬村など観光地・温泉地が上位を占める一方、都市近郊のベッドタウンが軒並み下位に沈む理由を解説します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) => c.restaurantCount != null && c.restaurantCount > 0 && c.population >= 3000
    )
    .map((c) => ({
      ...c,
      restaurantPer1000: ((c.restaurantCount ?? 0) / c.population) * 1000,
    }));

  const ranking = [...base].sort(
    (a, b) => b.restaurantPer1000 - a.restaurantPer1000
  );

  const top12 = ranking.slice(0, 12);

  const bottom10 = [...base]
    .sort((a, b) => a.restaurantPer1000 - b.restaurantPer1000)
    .slice(0, 10);

  const chibaTowns = getMunicipalities().filter((c) =>
    ["千葉県 船橋市", "千葉県 市川市", "千葉県 浦安市", "千葉県 松戸市"].includes(
      c.name
    )
  );
  const chibaData = chibaTowns.map((c) => ({
    name: c.name,
    restaurantPer1000: ((c.restaurantCount ?? 0) / c.population) * 1000,
  }));

  const average =
    base.reduce((s, c) => s + c.restaurantPer1000, 0) / base.length;

  const tourismCount = top12.filter((c) =>
    [
      "箱根町",
      "竹富町",
      "八丈町",
      "草津町",
      "野沢温泉村",
      "白馬村",
      "軽井沢町",
      "伊江村",
    ].some((t) => c.name.includes(t))
  ).length;

  return (
    <ArticleLayout
      title="飲食店密度ランキング分析:千代田区と観光地が上位、ベッドタウンが下位という対極構造"
      summary={`人口1,000人あたりの飲食店数を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${average.toFixed(
        2
      )}店に対し、1位の東京都千代田区は${top12[0].restaurantPer1000.toFixed(
        1
      )}店。東京都心のオフィス街と、箱根町・白馬村などの観光地・温泉地が上位を占める一方、都市近郊のベッドタウンは軒並み平均を下回る結果になりました。`}
      heroLabel="飲食店密度 全国1位"
      heroValue={`${top12[0].name} ${top12[0].restaurantPer1000.toFixed(1)}店`}
      rankingLink="/ranking/restaurant"
      tags={["household"]}
      publishedAt="2026-08-06"
      top3={[
        { rank: 1, name: top12[0].name, value: `${top12[0].restaurantPer1000.toFixed(1)}店` },
        { rank: 2, name: top12[1].name, value: `${top12[1].restaurantPer1000.toFixed(1)}店` },
        { rank: 3, name: top12[2].name, value: `${top12[2].restaurantPer1000.toFixed(1)}店` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          人口1,000人あたりの飲食店数は、単純な「外食が
          しやすい街」ランキングのように見えて、実はその街の
          性質を色濃く映し出す指標です。全国
          {base.length.toLocaleString()}
          自治体の平均は
          {average.toFixed(2)}
          店でしたが、上位に並ぶ自治体を見ていくと、大きく
          性質の異なる2つのグループが存在することが分かります。
        </p>
      </div>

      <div style={box}>
        <h2>飲食店密度TOP12</h2>

        <RankingBarChart
          items={top12.map((c) => ({
            name: c.name,
            value: c.restaurantPer1000,
            displayValue: `${c.restaurantPer1000.toFixed(1)}店`,
          }))}
          barColor="#c2410c"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の{top12[0].name}
          は、住民登録人口に対して
          {top12[0].restaurantPer1000.toFixed(1)}
          店と、全国平均の10倍以上に達しました。TOP12のうち
          {tourismCount}
          自治体は、箱根町・八丈町・草津町・野沢温泉村・
          白馬村・軽井沢町・竹富町・伊江村といった、観光地・
          温泉地です。残りは東京都心のオフィス街(千代田区・
          中央区・港区・渋谷区)でした。どちらにも共通するのは、
          「住民登録人口」よりも実際にその街で過ごす人(通勤・
          通学者や観光客)の数がはるかに多いという点です。
        </p>
      </div>

      <div style={box}>
        <h2>逆に飲食店が少ないのは、都市近郊のベッドタウン</h2>

        <RankingBarChart
          items={bottom10.map((c) => ({
            name: c.name,
            value: c.restaurantPer1000,
            displayValue: `${c.restaurantPer1000.toFixed(2)}店`,
          }))}
          barColor="#6b7280"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          下位10自治体は、いずれも人口3,000人〜3万人程度の
          町村で、大都市圏の近郊に位置する自治体が目立ちます。
          最下位の{bottom10[0].name}
          は、人口1,000人あたりわずか
          {bottom10[0].restaurantPer1000.toFixed(2)}
          店でした。住民の多くが近隣の大都市へ通勤・通学し、
          外食も職場や学校の周辺で済ませる生活パターンが、
          この数字の背景にあると考えられます。
        </p>

        <PersonalNote>
          土地勘のある千葉県船橋市・市川市で、この指標を
          実際に調べてみました。船橋市は人口1,000人あたり
          {chibaData
            .find((c) => c.name === "千葉県 船橋市")
            ?.restaurantPer1000.toFixed(2)}
          店、市川市は
          {chibaData
            .find((c) => c.name === "千葉県 市川市")
            ?.restaurantPer1000.toFixed(2)}
          店と、どちらも全国平均
          {average.toFixed(2)}
          店を下回っていました。人が多く、にぎわっている
          印象のある街でも、住民登録人口を分母にすると
          飲食店密度としては平均以下になるというのは、単独
          世帯割合の記事で書いた「体感とデータのズレ」に
          近い発見でした。ベッドタウンの住民は、休日に都心へ
          出て外食を楽しむことが多いのかもしれません。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>「昼間人口」という、もう一つの視点</h2>

        <p>
          総務省統計局が公表する「昼間人口」という指標が
          あります。これは通勤・通学による人の移動を反映した、
          その地域に実際にいる人の数です。東京都千代田区の
          昼間人口は夜間人口(住民登録人口)の10倍以上に
          膨れ上がることで知られており、これが飲食店密度が
          突出して高くなる直接の理由です。観光地についても
          同様で、箱根町や白馬村を訪れる年間の観光客数は、
          住民数の何十倍にも達します。飲食店数を住民登録
          人口だけで割った今回の指標は、こうした「訪れる人の
          多さ」を間接的に浮かび上がらせるものとも言えます。
        </p>
      </div>

      <div style={box}>
        <h2>住む場所選びでこの指標をどう読むか</h2>

        <p>
          単独世帯割合ランキングの記事では、都市部で若年
          単身世帯と高齢単身世帯がともに増えていることを
          紹介しました。単身世帯は自炊よりも外食・中食に
          頼る割合が高いとされ、こうした世帯が集まる都心の
          区で飲食店密度が高くなるのは、ある意味で自然な
          結果とも言えます。逆に、ファミリー世帯の割合が
          高いベッドタウンでは、自宅での食事を基本としつつ、
          外食は休日にまとめて行うという生活スタイルが
          一般的で、これが平日の飲食店の稼働率を左右している
          可能性もあります。
        </p>

        <p>
          飲食店密度が高い街に住めば、日常的に外食や
          テイクアウトを楽しみやすいというメリットがあります。
          一方で、オフィス街は休日の営業時間が短い店舗も
          多く、観光地は観光客向けの価格設定になっている
          場合もあるため、必ずしも「住民にとって便利」とは
          限りません。逆に飲食店密度が低いベッドタウンでも、
          近隣の主要駅や隣接する大都市まで出れば選択肢は
          豊富にあることが多く、この指標単体で「暮らしやすさ」
          を判断するのではなく、最寄り駅からのアクセスと
          あわせて考えるのがおすすめです。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          今回の飲食店数は、カフェ・喫茶店から居酒屋、
          ファストフード店まで幅広い業態を含んだ集計です。
          業態ごとの内訳までは分からないため、例えば「高級
          飲食店が多いのか、チェーン店が多いのか」といった
          街の雰囲気までは、この指標だけでは読み取れません。
          また、宿泊施設内のレストランなど、統計の分類に
          よっては別カテゴリに計上されているケースもあり、
          観光地の実際の飲食店数は、統計上の数字よりさらに
          多い可能性があります。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          飲食店密度ランキングの上位が「オフィス街」と
          「観光地」という一見正反対の性質の街に分かれたのは、
          どちらも住民登録人口だけでは説明できない、外部から
          訪れる人の多さが共通しているからです。逆に下位に
          並ぶベッドタウンは、住民数こそ多くても、生活や
          消費の場が近隣の大都市に分散している街だと言えます。
          人口の数字だけを見て「賑わっている街」を判断するのは
          難しく、こうした周辺指標を組み合わせることで初めて、
          街の実際の姿が見えてきます。
        </p>

        <p>
          <Link href="/ranking/restaurant" style={link}>
            飲食店密度ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/household-analysis" style={link}>
            単独世帯割合ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/density-analysis" style={link}>
            人口密度ランキング分析を見る
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
