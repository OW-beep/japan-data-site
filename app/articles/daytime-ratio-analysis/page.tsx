import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  alternates: { canonical: "/articles/daytime-ratio-analysis" },
  title: "昼夜間人口比率ランキング分析｜千代田区が1355%になる理由",
  description:
    "昼夜間人口比率ランキングを分析。東京都心のオフィス街が上位を占める一方、福島県の被災地では震災復興作業員の日中滞在が比率を押し上げていました。ベッドタウンとの対比から「通勤」の実態を読み解きます。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.daytimePopulation != null &&
        c.nighttimePopulation != null &&
        c.nighttimePopulation > 0
    )
    .map((c) => ({
      ...c,
      daytimeRatio: ((c.daytimePopulation ?? 0) / (c.nighttimePopulation ?? 1)) * 100,
    }));

  const ranking = [...base].sort((a, b) => b.daytimeRatio - a.daytimeRatio);
  const top12 = ranking.slice(0, 12);

  const bottom10 = [...base]
    .sort((a, b) => a.daytimeRatio - b.daytimeRatio)
    .slice(0, 10);

  const bigCities = base
    .filter((c) => c.population >= 300000)
    .sort((a, b) => b.daytimeRatio - a.daytimeRatio);

  const bigTop10 = bigCities.slice(0, 10);

  const average = base.reduce((s, c) => s + c.daytimeRatio, 0) / base.length;

  const fukushimaTowns = top12.filter((c) => c.name.startsWith("福島県"));

  return (
    <ArticleLayout
      title="昼夜間人口比率ランキング分析:千代田区が1355%になる理由と、福島県の被災地が上位に入った背景"
      summary={`夜間人口に対する昼間人口の割合(昼夜間人口比率)を全国${base.length.toLocaleString()}自治体で比較すると、全国平均${average.toFixed(
        1
      )}%に対し、1位の東京都千代田区は${top12[0].daytimeRatio.toFixed(
        1
      )}%に達しました。上位には東京・大阪・名古屋の都心区に加え、福島県内の震災被災地も複数入っており、性質の異なる2種類の「人が集まる街」が見えてきます。`}
      heroLabel="昼夜間人口比率 全国1位"
      heroValue={`${top12[0].name} ${top12[0].daytimeRatio.toFixed(1)}%`}
      rankingLink="/ranking/daytime-ratio"
      tags={["population"]}
      publishedAt="2026-08-08"
      top3={[
        { rank: 1, name: top12[0].name, value: `${top12[0].daytimeRatio.toFixed(1)}%` },
        { rank: 2, name: top12[1].name, value: `${top12[1].daytimeRatio.toFixed(1)}%` },
        { rank: 3, name: top12[2].name, value: `${top12[2].daytimeRatio.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          昼夜間人口比率は、夜間人口(住民登録上の常住人口)に
          対して、昼間その地域にいる人口(通勤・通学による
          流入を反映した人口)がどれだけの割合かを示す指標
          です。令和2年国勢調査をもとに全国
          {base.length.toLocaleString()}
          自治体を比較したところ、全国平均は
          {average.toFixed(1)}
          %(ほぼ100%)でしたが、1位の東京都千代田区は
          {top12[0].daytimeRatio.toFixed(1)}
          %と、住民登録人口の13倍以上の人が日中この街に
          いるという結果になりました。「住んでいる人」と
          「その街で活動している人」の数が、これほど違う
          自治体があるという事実は、人口という言葉の意味を
          あらためて考えさせられます。
        </p>
      </div>

      <div style={box}>
        <h2>昼夜間人口比率TOP12</h2>

        <RankingBarChart
          items={top12.map((c) => ({
            name: c.name,
            value: c.daytimeRatio,
            displayValue: `${c.daytimeRatio.toFixed(1)}%`,
          }))}
          barColor="#7c3aed"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          千代田区の夜間人口はわずか
          {top12[0].population.toLocaleString()}
          人ですが、霞が関の官庁街と丸の内・大手町のオフィス街
          を抱えているため、昼間はその十数倍の人が働いています。
          同様に大阪市中央区・北区、名古屋市中区、東京都港区・
          新宿区・渋谷区といった、全国有数のオフィス街が
          上位に並びました。
        </p>
      </div>

      <div style={box}>
        <h2>もう一つの「上位グループ」:福島県の被災地</h2>

        <p>
          TOP12の中には、{fukushimaTowns.map((c) => c.name).join("・")}
          という、東日本大震災の被災地である福島県内の自治体
          が複数含まれていました。これらの自治体は、原発事故
          に伴う避難指示の影響で夜間人口(住民登録人口)が
          数百〜数千人まで落ち込んでいる一方、除染作業や
          復興関連のインフラ整備に従事する作業員が日中は
          多数滞在しているため、結果として昼夜間人口比率が
          押し上げられています。オフィス街とはまったく異なる
          背景を持つ「昼間人口の多さ」であることに、注意が
          必要です。
        </p>

        <PersonalNote>
          同じ「昼夜間人口比率が高い」という数字でも、その
          中身は正反対です。千代田区の高さは経済活動の
          活発さを示すポジティブな指標として語られやすい
          一方、福島県の自治体の高さは、震災からの復興が
          道半ばであることの裏返しでもあります。データを
          ランキングだけで見ると同じ「上位」に並んでしまい
          ますが、背景にある文脈を無視してはいけない典型的な
          例だと感じます。
        </PersonalNote>
      </div>

      <div style={box}>
        <h2>大都市(人口30万人以上)では、大阪市がトップ</h2>

        <RankingBarChart
          items={bigTop10.map((c) => ({
            name: c.name,
            value: c.daytimeRatio,
            displayValue: `${c.daytimeRatio.toFixed(1)}%`,
          }))}
          barColor="#2563eb"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          人口30万人以上の都市に絞ると、大阪市が
          {bigTop10[0].daytimeRatio.toFixed(1)}
          %でトップでした。大阪市は「昼の街」としての性格が
          強く、周辺の衛星都市から多くの通勤者を集めている
          ことがうかがえます。経常収支比率ランキング分析の
          記事で紹介した、東京23区の財政的な健全さの背景
          にも、こうした昼間の経済活動の集積が関係している
          と考えられます。
        </p>
      </div>

      <div style={box}>
        <h2>飲食店密度・空き家率との関係</h2>

        <p>
          飲食店密度ランキング分析の記事では、千代田区が
          飲食店密度でも全国1位だったことを紹介しました。
          今回の昼夜間人口比率でも同じく千代田区が1位で
          あることから、「昼間人口の多さ」と「飲食店の
          多さ」が強く結びついていることが裏付けられます。
          また、空き家率ランキング分析で紹介した福島県の
          被災自治体(大熊町・富岡町・浪江町など)が、今回も
          上位に登場しました。夜間人口が少なく空き家が
          多いにもかかわらず、日中は復興作業員で賑わうという、
          一見矛盾するような街の姿が、複数の指標を重ねる
          ことで具体的に見えてきます。
        </p>
      </div>

      <div style={box}>
        <h2>逆に比率が低いのは、典型的なベッドタウン</h2>

        <RankingBarChart
          items={bottom10.map((c) => ({
            name: c.name,
            value: c.daytimeRatio,
            displayValue: `${c.daytimeRatio.toFixed(1)}%`,
          }))}
          barColor="#059669"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          最も比率が低かったのは宮城県七ヶ浜町(
          {bottom10[0].daytimeRatio.toFixed(1)}
          %)でした。下位10自治体には東京都狛江市、川崎市宮前区
          といった首都圏のベッドタウンが目立ち、住民の多くが
          都心へ通勤・通学し、日中は街を離れていることが
          分かります。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          今回の数値は令和2年(2020年)国勢調査時点のものです。
          この調査は新型コロナウイルス感染拡大の直前にあたる
          ため、テレワークの普及が進んだ現在の実態とは、
          特にオフィス街を中心にズレが生じている可能性が
          あります。次回の国勢調査(2025年)のデータが公表
          されれば、都心区の昼夜間人口比率がどう変化したか、
          あらためて比較する価値があるテーマです。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          昼夜間人口比率は、単なる「賑わっている街」ランキング
          ではありません。上位には、経済活動が活発なオフィス街
          と、震災からの復興途上にある被災地という、まったく
          性質の異なる自治体が同居していました。数字だけを
          見るのではなく、その自治体がなぜその数値になって
          いるのかという背景まで確認することの大切さを、
          改めて示すランキングだと思います。住む場所を選ぶ
          際にも、夜間人口だけでなく、日中どれだけの人が
          集まる街なのかを知っておくと、平日と休日で街の
          雰囲気がどう変わるかをイメージしやすくなります。
        </p>

        <p>
          <Link href="/ranking/daytime-ratio" style={link}>
            昼夜間人口比率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/restaurant-density" style={link}>
            飲食店密度ランキング分析を見る
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
