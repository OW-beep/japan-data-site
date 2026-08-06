import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  title: "外国人人口比率ランキング分析｜1位は19%の村",
  description:
    "全国自治体の外国人人口比率を分析。高原野菜の産地・自動車部品の企業城下町・東京都心の区という、性質の異なる3つのパターンが上位を占める理由を、これまでの記事とあわせて解説します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) => c.foreignPopulation != null && c.population > 0
    )
    .map((c) => ({
      ...c,
      ratio: ((c.foreignPopulation ?? 0) / c.population) * 100,
    }));

  const top15 = [...base]
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 15);

  const average =
    base.reduce((s, c) => s + c.ratio, 0) / base.length;

  const naganoCount = top15.filter((c) =>
    c.name.startsWith("長野県")
  ).length;

  const tokyoCount = top15.filter((c) =>
    c.name.startsWith("東京都")
  ).length;

  const manufacturingTowns = [
    "美濃加茂市",
    "常総市",
    "可児市",
    "菊川市",
    "高浜市",
    "碧南市",
  ];
  const manufacturingCount = top15.filter((c) =>
    manufacturingTowns.some((k) => c.name.includes(k))
  ).length;

  return (
    <ArticleLayout
      title="外国人人口比率ランキング分析：1位は人口の19%を占める長野県の農村"
      summary={`全国${base.length.toLocaleString()}自治体の外国人人口比率を比較すると、全国平均${average.toFixed(
        2
      )}%に対し、1位の長野県川上村は${top15[0].ratio.toFixed(
        1
      )}%と、住民のおよそ5人に1人が外国籍でした。高原野菜の産地・自動車部品の企業城下町・東京都心の区という、性質の異なる3つのパターンが上位を占めています。`}
      heroLabel="外国人人口比率 全国1位"
      heroValue={`${top15[0].name} ${top15[0].ratio.toFixed(1)}%`}
      rankingLink="/ranking/foreign-population"
      tags={["international"]}
      publishedAt="2026-08-05"
      top3={[
        { rank: 1, name: top15[0].name, value: `${top15[0].ratio.toFixed(1)}%` },
        { rank: 2, name: top15[1].name, value: `${top15[1].ratio.toFixed(1)}%` },
        { rank: 3, name: top15[2].name, value: `${top15[2].ratio.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          日本で暮らす外国人住民の数は近年増加を続けていますが、
          その分布は全国一様ではありません。全国
          {base.length.toLocaleString()}
          自治体で外国人人口比率(人口に占める外国人住民の
          割合)を比較すると、全国平均
          {average.toFixed(2)}
          %に対し、1位の長野県川上村は
          {top15[0].ratio.toFixed(1)}
          %と、平均の14倍以上に達しました。全国的にはまだ
          少数派とはいえ、特定の地域では外国人住民が
          コミュニティの重要な一部になっていることが、
          今回のデータからはっきりと見えてきます。人口減少
          が進む日本社会にとって、この傾向は今後さらに
          重要性を増していくと考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>外国人人口比率TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.ratio,
            displayValue: `${c.ratio.toFixed(1)}%`,
          }))}
          barColor="#a16207"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の長野県川上村は、産業構造分析の記事でも「第1次
          産業就業者比率が全国トップの農業の村」として紹介
          した、高原レタス栽培で知られる村です。TOP15には
          {naganoCount}
          自治体を長野県が占め、いずれも高原野菜の産地として、
          農業の担い手を海外から受け入れています。標高
          1000m級の高原という共通の気候条件が、レタスなど
          高原野菜の一大産地を形成し、その労働需要が外国人
          比率の高さに直結しているという構図です。
        </p>
      </div>

      <div style={box}>
        <h2>3つの異なるパターン</h2>

        <p>
          TOP15の顔ぶれは、大きく3つのパターンに分かれます。
          1つ目は川上村・南牧村(長野県)のような高原野菜の
          産地で、農作業の担い手として技能実習生をはじめと
          する外国人労働者を受け入れています。2位の群馬県
          大泉町は、産業構造分析の記事で紹介したSUBARUの
          主力工場を抱える町で、日系ブラジル人住民が多いこと
          で知られています。北海道占冠村は、単独世帯割合と
          高齢化率のU字関係を扱った記事でも「若い単身者が
          多い町」として紹介した、大規模スキーリゾート
          (トマム)を擁する町で、リゾート運営に伴う外国人
          スタッフの存在が背景にあると考えられます。
        </p>

        <p>
          2つ目は{manufacturingCount}
          自治体が該当する、岐阜県美濃加茂市・可児市、茨城県
          常総市、静岡県菊川市、愛知県高浜市・碧南市といった
          製造業の集積地です。いずれも自動車関連産業を中心と
          した工場が立地し、外国人労働者が地域の産業を支えて
          います。3つ目は{tokyoCount}
          自治体が該当する東京都豊島区・新宿区・荒川区と
          いった都心の区で、留学生や多様な業種で働く外国人
          住民が集まる、国際色豊かなエリアです。
        </p>

        <p>
          このほか、埼玉県蕨市は、クルド系住民をはじめとする
          コミュニティが形成されていることで知られ、メディア
          でもたびたび取り上げられている自治体です。
        </p>
      </div>

      <div style={box}>
        <h2>外国人住民が支える地域産業</h2>

        <p>
          今回のランキング上位の多くは、農業・製造業という、
          国内の労働力だけでは担い手が不足しがちな産業を、
          外国人労働者が支えている構図が共通しています。
          産業構造分析の記事で紹介した「農業の村」「ものづくり
          の町」の多くが、今回の外国人人口比率ランキングにも
          再登場しているのは偶然ではありません。人口減少と
          高齢化が進む日本において、外国人労働者の存在は、
          特定の地域の産業と人口を維持するうえで、すでに
          欠かせない役割を担っていることが、このデータからも
          読み取れます。
        </p>

        <p>
          <Link href="/ranking/foreign-population" style={link}>
            外国人人口比率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/industry-structure" style={link}>
            産業構造分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/household-aging-ushape" style={link}>
            単独世帯割合と高齢化率のU字関係を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>外国人住民がほとんどいない自治体もある</h2>

        <p>
          今回の集計では、外国人住民が1人も登録されていない
          自治体も4町村ありました。人口規模が小さく、産業
          基盤も限られる離島や山村では、外国人労働者を
          受け入れる産業自体が少ないことが背景にあると
          考えられます。全国平均が
          {average.toFixed(2)}
          %にとどまっていることからも分かるとおり、外国人
          住民の存在感が大きい自治体は、全体で見ればまだ
          少数派です。地域による偏りの大きさは、高齢化率や
          人口密度といった他の指標以上に際立っていると
          言えるでしょう。この偏りの大きさこそが、外国人
          人口比率という指標の最大の特徴だと言えます。
        </p>
      </div>

      <div style={box}>
        <h2>労働力不足と外国人材受け入れの広がり</h2>

        <p>
          日本では少子高齢化に伴う労働力人口の減少が進んで
          おり、農業・製造業・介護・宿泊業など、幅広い産業
          で人手不足が課題となっています。完全失業率
          ランキング分析の記事では、地域によって雇用情勢に
          大きな差があることを紹介しましたが、その一方で、
          今回上位に並んだ農業・製造業の町のように、外国人
          労働者の受け入れによって人手不足を補っている
          地域も少なくありません。技能実習制度は2027年を
          めどに新たな「育成就労制度」へ移行することが
          決まっており、今後もこうした地域における外国人
          住民の比率は変化していくと見られます。
        </p>

        <p>
          こうした産業別の受け入れパターンは、都市部の
          国際化とは異なる性質を持っています。東京都心の
          区に住む外国人住民は、留学・専門職・国際結婚
          など多様な背景を持つのに対し、地方の農業・製造業
          の町では、特定の産業の労働力として受け入れられて
          いるケースが中心です。同じ「外国人人口比率が
          高い」という結果でも、その内実は地域によって
          大きく異なることが、今回のランキングからも
          見えてきます。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          外国人人口は住民基本台帳に登録されている外国人住民
          の数であり、観光客や短期滞在者は含まれません。また、
          技能実習生や特定技能などの在留資格別の内訳は今回の
          データには含まれておらず、どのような資格・目的で
          滞在しているかまでは分かりません。人口規模が小さい
          自治体では、少人数の増減でも比率が大きく変動しやすい
          点にも注意が必要です。将来的に在留資格別のデータが
          公開されれば、技能実習・特定技能・留学・永住といった
          属性ごとに、より詳細な地域分析が可能になると
          期待されます。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          外国人人口比率ランキングでは、全国平均
          {average.toFixed(2)}
          %に対し、上位は7〜19%という高い水準に達しました。
          農業の村・製造業の町・都心の区という、成り立ちの
          異なる3つのパターンが浮かび上がった点が、
          このランキングの面白さです。
        </p>

        <p>
          人口減少が続く日本において、外国人住民の受け入れは
          今後さらに拡大していく可能性があります。自然増減率
          ランキング分析の記事で見たとおり、自然増加している
          自治体はわずか34にとどまる一方、外国人住民の増加が
          地域の人口を下支えしているケースも増えています。
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
