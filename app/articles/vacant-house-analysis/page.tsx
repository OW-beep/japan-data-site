import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  title: "空き家率ランキング分析｜軽井沢町と夕張市、2つの空き家率",
  description:
    "空き家率ランキングを分析。別荘地の軽井沢町・那須町・熱海市と、旧産炭地の夕張市・三笠市が上位に並ぶ一方、この2つは性質がまったく異なる「空き家」であることを、e-Statの一次データから読み解きます。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.vacantHouseCount != null &&
        c.totalHousingCount != null &&
        c.totalHousingCount > 0
    )
    .map((c) => ({
      ...c,
      vacancyRate: ((c.vacantHouseCount ?? 0) / (c.totalHousingCount ?? 1)) * 100,
    }));

  const ranking = [...base].sort((a, b) => b.vacancyRate - a.vacancyRate);
  const top15 = ranking.slice(0, 15);

  const bottom10 = [...base]
    .sort((a, b) => a.vacancyRate - b.vacancyRate)
    .slice(0, 10);

  const bigCities = base
    .filter((c) => c.population >= 200000)
    .sort((a, b) => b.vacancyRate - a.vacancyRate);

  const bigTop10 = bigCities.slice(0, 10);

  const average = base.reduce((s, c) => s + c.vacancyRate, 0) / base.length;

  const resortKeywords = [
    "軽井沢",
    "那須",
    "熱海",
    "北杜",
    "白浜",
    "茅野",
    "伊東",
    "別府",
    "箱根",
    "日光",
  ];
  const resortTop15 = top15.filter((c) =>
    resortKeywords.some((k) => c.name.includes(k))
  ).length;

  return (
    <ArticleLayout
      title="空き家率ランキング分析:軽井沢町と夕張市、上位に並ぶ「性質の違う空き家」"
      summary={`総住宅数に占める空き家の割合(空き家率)を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${average.toFixed(
        1
      )}%に対し、1位の長野県軽井沢町は${top15[0].vacancyRate.toFixed(
        1
      )}%に達しました。上位には別荘地・観光地と、かつての産炭地という、まったく性質の異なる2種類の自治体が並んでいます。`}
      heroLabel="空き家率 全国1位"
      heroValue={`${top15[0].name} ${top15[0].vacancyRate.toFixed(1)}%`}
      rankingLink="/ranking/vacant-house"
      tags={["geography"]}
      publishedAt="2026-08-07"
      top3={[
        { rank: 1, name: top15[0].name, value: `${top15[0].vacancyRate.toFixed(1)}%` },
        { rank: 2, name: top15[1].name, value: `${top15[1].vacancyRate.toFixed(1)}%` },
        { rank: 3, name: top15[2].name, value: `${top15[2].vacancyRate.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          空き家率は、総住宅数に占める空き家の割合を示す指標
          です。総務省「令和5年(2023年)住宅・土地統計調査」を
          もとに、市・区および人口1万5千人以上の町村
          {base.length.toLocaleString()}
          自治体を比較したところ、全国平均は
          {average.toFixed(1)}
          %でした。しかし上位に並ぶ自治体をよく見ると、
          「空き家率が高い」という同じ結果の裏に、まったく
          異なる2つの背景があることが分かります。
        </p>
      </div>

      <div style={box}>
        <h2>空き家率TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.vacancyRate,
            displayValue: `${c.vacancyRate.toFixed(1)}%`,
          }))}
          barColor="#b91c1c"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の{top15[0].name}
          は空き家率
          {top15[0].vacancyRate.toFixed(1)}
          %と、住宅の実に7割近くが空き家という結果でした。
          TOP15のうち
          {resortTop15}
          自治体は、軽井沢町・那須町・熱海市・北杜市・白浜町・
          茅野市・伊東市といった、別荘やセカンドハウスの
          需要が高い観光地です。残りは北海道夕張市・三笠市・
          歌志内市など、かつて炭鉱で栄えた地域でした。
        </p>
      </div>

      <div style={box}>
        <h2>「二次的住宅」としての空き家 vs「放置された」空き家</h2>

        <p>
          別荘地の空き家率が高いのは、所有者が普段は都市部に
          住み、週末や夏季だけ利用する「二次的住宅」が
          住宅・土地統計調査上は空き家に分類されるためです。
          軽井沢町や熱海市の空き家の多くは、持ち主がいて
          管理もされている別荘・セカンドハウスであり、
          いわゆる「放置された廃屋」とは性質が異なります。
        </p>

        <p>
          一方、夕張市や三笠市のような旧産炭地では、1960〜
          70年代の炭鉱閉山以降、人口が長期にわたって流出し
          続けており、住む人がいなくなったまま放置される
          住宅が増えています。経常収支比率ランキング分析の
          記事で紹介したとおり、夕張市は財政破綻の歴史を
          持つ自治体でもあり、空き家対策に十分な予算を割く
          余裕が乏しいという構造的な問題も抱えています。
        </p>

        <PersonalNote>
          自治体職員として空き家対策に近い業務に触れた経験
          から言うと、この2つの空き家は行政の対応方針が
          まったく異なります。別荘地の空き家は、所有者への
          課税や管理条例で対応する「資産」としての空き家
          ですが、旧産炭地の放置空き家は、倒壊や治安の
          悪化を防ぐための「除却(取り壊し)」が課題になる
          ことが多く、財源の確保自体が難しい自治体も
          少なくありません。同じ「空き家率」という数字でも、
          その地域が抱えている本当の課題は大きく異なる
          ことを、この統計を見るたびに感じます。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>大都市(人口20万人以上)で見ると、上位は地方都市</h2>

        <RankingBarChart
          items={bigTop10.map((c) => ({
            name: c.name,
            value: c.vacancyRate,
            displayValue: `${c.vacancyRate.toFixed(1)}%`,
          }))}
          barColor="#ea580c"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          人口20万人以上の都市
          {bigCities.length}
          自治体に絞ると、1位は広島県呉市(
          {bigTop10[0].vacancyRate.toFixed(1)}
          %)でした。呉市はかつて海軍工廠の街として栄え、
          戦後は造船業の街として発展しましたが、産業構造の
          変化とともに人口減少が続いています。上位には
          和歌山市・函館市・下関市・佐世保市など、かつて
          港湾・造船・水産業で栄えた地方中核都市が多く
          並んでいます。
        </p>
      </div>

      <div style={box}>
        <h2>逆に空き家率が低いのは、新興住宅地</h2>

        <RankingBarChart
          items={bottom10.map((c) => ({
            name: c.name,
            value: c.vacancyRate,
            displayValue: `${c.vacancyRate.toFixed(1)}%`,
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          空き家率が最も低かったのは秋田県美郷町(
          {bottom10[0].vacancyRate.toFixed(1)}
          %)でしたが、下位10自治体には横浜市泉区・さいたま市
          緑区・横浜市都筑区など、比較的新しい住宅開発が
          進んだ大都市近郊の区が多く含まれています。宮城県
          富谷市も名を連ねており、住宅の築年数が浅い地域
          ほど、空き家率が低く抑えられる傾向がうかがえます。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          この調査は、市・区および人口1万5千人以上の町村
          のみを対象としているため、人口の少ない小規模な
          村では今回のランキングに含まれていません。また、
          住宅・土地統計調査は5年に一度の実施であるため、
          今回のデータは2023年10月1日時点のものです。
          空き家対策特別措置法の施行(2015年)以降、多くの
          自治体で除却・活用が進められているため、次回
          2028年調査では数値が変化している可能性があります。
        </p>
      </div>

      <div style={box}>
        <h2>空き家率が高い街を住まい選びでどう見るか</h2>

        <p>
          別荘地系の空き家率の高さは、移住先や別荘購入を
          検討する人にとってはむしろポジティブな材料にも
          なり得ます。中古の別荘や別荘地の土地が比較的
          手に入りやすい可能性があるためです。一方、旧
          産炭地系の空き家率の高さは、人口減少や空き家の
          管理不全といった課題のシグナルであることが多く、
          移住を検討する際は、自治体の空き家バンク制度や
          リフォーム補助の有無なども含めて確認することを
          おすすめします。同じ「空き家率が高い街」という
          言葉でも、その先にある暮らしの実態は大きく異なります。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          空き家率ランキングの上位は、別荘・セカンドハウスの
          需要が支える観光地と、産業の衰退とともに人口が
          流出した旧産業都市という、正反対の背景を持つ
          自治体で構成されていました。同じ「空き家率が
          高い」という数字でも、それが「豊かさの副産物」
          なのか「衰退の結果」なのかを見分けるには、その
          自治体の人口動態や産業構造もあわせて確認する
          必要があります。
        </p>

        <p>
          <Link href="/ranking/vacant-house" style={link}>
            空き家率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/balance-ratio-analysis" style={link}>
            経常収支比率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/decline" style={link}>
            社会増減率ランキング分析を見る
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
