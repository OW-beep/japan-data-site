import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import PersonalNote from "@/components/PersonalNote";

export const metadata = {
  alternates: { canonical: "/articles/unemployment-analysis" },
  title: "完全失業率ランキング分析｜筑豊地方が上位に",
  description:
    "全国自治体の完全失業率をランキング分析。全国平均3.6%に対し上位は8〜10%台に達し、特に福岡県筑豊地方の旧産炭地が15位以内に6自治体もランクインする構造的な背景を解説します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.unemployedCount != null && c.laborForceCount != null
    )
    .map((c) => {
      const labor =
        (c.laborForceCount ?? 0) + (c.unemployedCount ?? 0);
      return {
        ...c,
        rate:
          labor > 0
            ? ((c.unemployedCount ?? 0) / labor) * 100
            : 0,
      };
    });

  const ranking = [...base]
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 15);

  const average =
    base.reduce((s, c) => s + c.rate, 0) / base.length;

  const fukuokaTowns = ranking.filter((c) =>
    c.name.startsWith("福岡県")
  );

  const lowest = [...base]
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 10);

  return (
    <ArticleLayout
      title="完全失業率ランキング分析：福岡県筑豊地方の旧産炭地がなぜ上位に並ぶのか"
      summary={`全国${base.length.toLocaleString()}自治体の完全失業率を比較すると、全国平均${average.toFixed(
        1
      )}%に対し、上位は8〜10%台に達しました。特にTOP15のうち6自治体を福岡県筑豊地方の旧産炭地が占めており、炭鉱閉山から半世紀以上を経てもなお続く雇用面での構造的な課題が見えてきます。`}
      heroLabel="完全失業率 全国1位"
      heroValue={`${ranking[0].name} ${ranking[0].rate.toFixed(1)}%`}
      rankingLink="/ranking/unemployment"
      tags={["labor"]}
      publishedAt="2026-07-28"
      top3={[
        { rank: 1, name: ranking[0].name, value: `${ranking[0].rate.toFixed(1)}%` },
        { rank: 2, name: ranking[1].name, value: `${ranking[1].rate.toFixed(1)}%` },
        { rank: 3, name: ranking[2].name, value: `${ranking[2].rate.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          完全失業率は、労働力人口(就業者+完全失業者)に占める
          完全失業者の割合を示す、雇用情勢の代表的な指標です。
          全国{base.length.toLocaleString()}
          自治体で比較すると、全国平均は
          {average.toFixed(1)}
          %であり、自治体ごとの数値のばらつきが非常に
          大きい指標であることが分かります。1位の北海道
          上砂川町は
          {ranking[0].rate.toFixed(1)}
          %と、平均の3倍近い水準に達しています。人口規模の
          小さな町村が多いランキングの上位10自治体だけでなく、
          10位以降も含めた全体の傾向を見ることで、地域雇用の
          格差がどれだけ大きいかがより鮮明になります。
        </p>
      </div>

      <div style={box}>
        <h2>完全失業率TOP15</h2>

        <RankingBarChart
          items={ranking.map((c) => ({
            name: c.name,
            value: c.rate,
            displayValue: `${c.rate.toFixed(1)}%`,
          }))}
          barColor="#c2410c"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          TOP15のうち{fukuokaTowns.length}
          自治体を福岡県の自治体が占めており、これは
          偶然とは考えにくい、極めて高い集中度です。
          なかでも
          {fukuokaTowns
            .map((c) => c.name.replace("福岡県 ", ""))
            .join("・")}
          は、いずれも「筑豊(ちくほう)」と呼ばれる、かつて
          日本有数の産炭地として栄えた地域に属しています。
          隣接する自治体同士が軒並み上位に並ぶという
          偏りは、他のどのランキングよりも際立っています。
        </p>
      </div>

      <div style={box}>
        <h2>炭鉱閉山から半世紀、続く構造的な課題</h2>

        <p>
          筑豊地方は、明治から昭和にかけて石炭産業で栄え、
          最盛期には多くの炭鉱労働者とその家族が集まり
          ました。しかし1960年代のエネルギー政策転換(石炭
          から石油へ)によって炭鉱が次々と閉山し、基幹産業を
          失いました。人口密度と高齢化率の関係を扱った記事
          でも、この地域を含む旧産炭都市が「かつて人口が
          密集していたのに、その後の産業転換に失敗した」
          事例として取り上げましたが、雇用の面でも同様の
          構造的な課題が、半世紀以上を経た今も続いている
          ことが、完全失業率のデータからも裏付けられました。
        </p>

        <p>
          このほか、北海道上砂川町・七飯町も、かつて炭鉱
          (上砂川町)や産業構造の変化(七飯町)の影響を受けた
          地域です。奈良県三宅町、青森県今別町、福島県小野町、
          群馬県大泉町など、産炭地以外の自治体も上位に
          含まれており、必ずしも旧産炭地だけが要因のすべて
          ではありませんが、筑豊地方の集中度の高さは、この
          ランキングの際立った特徴だと言えます。
        </p>
      </div>

      <div style={box}>
        <h2>財政力指数との関係</h2>

        <p>
          高齢化率と財政力指数の関係を扱った記事や、人口
          密度と財政力指数の関係を扱った記事では、旧産炭
          都市が「密度は高いが財政力は平均的」という
          位置づけにとどまっていることを紹介しました。雇用
          情勢の厳しさが続けば、住民の税収基盤も弱くなり
          やすく、結果として財政力にも影響が及びます。実際、
          筑豊地方の多くの自治体は、財政力指数ランキングでも
          相対的に低い順位にあり、完全失業率の高さと財政力の
          弱さが、同じ地域構造の異なる側面として表れている
          と考えられます。
        </p>

        <p>
          炭鉱閉山という1つの出来事が、雇用・財政・人口動態
          という複数の統計に長期にわたって影響を及ぼし続けて
          いる様子は、地域経済における産業転換の難しさを
          象徴していると言えるでしょう。
        </p>
      </div>

      <div style={box}>
        <h2>完全失業率が低い自治体の特徴</h2>

        <p>
          逆に完全失業率が低い自治体には、
          {lowest
            .slice(0, 5)
            .map((c) => c.name)
            .join("・")}
          など、人口数百人〜数千人規模の離島・山村が並びます。
          こうした地域は、農業・漁業・林業など地域に根ざした
          自営的な仕事の割合が高く、「完全失業者」として
          統計上カウントされにくい就業形態が多いことが
          背景にあると考えられます。また母数となる労働力
          人口自体が小さいため、数値が振れやすい点にも
          注意が必要です。
        </p>

        <p>
          離島・山村と旧産炭地という、完全失業率の両極端
          に位置する地域は、いずれも人口の少なさという
          点では共通していますが、その背景にある産業構造は
          まったく異なります。単純な数値の高低だけでなく、
          その地域の主要産業が何かを合わせて見ることが、
          正しい理解につながります。
        </p>
      </div>

      <div style={box}>
        <h2>失業率という指標の限界</h2>

        <p>
          完全失業率は、あくまで「求職活動をしているが
          仕事に就いていない人」の割合であり、就業を諦めて
          求職活動自体をしていない人(いわゆる非労働力人口)
          は含まれません。過疎地域では、高齢化によって
          そもそも働くことを希望しない住民の割合が高い
          ケースもあり、完全失業率だけでは地域の雇用情勢の
          厳しさを完全には捉えきれない面があります。とは
          いえ、筑豊地方のように明確に高い数値が繰り返し
          現れる地域については、産業構造の転換の難しさを
          示す重要なシグナルだと言えるでしょう。
        </p>

        <p>
          全国の自治体を横断的に比較できるという統計の強み
          を活かせば、こうした「数字には表れにくい地域課題」
          の輪郭を、間接的にではあっても浮かび上がらせる
          ことができます。完全失業率単体では見えてこない
          背景も、財政力・人口動態など他の指標とあわせて
          読み解くことで、より立体的に理解できます。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          今回のランキングは、単に「失業率が高い・低い」を
          並べるだけでなく、その背景にある地域の産業史
          (炭鉱の盛衰、離島・山村ならではの就業構造)まで
          踏み込むことで、初めて意味のある情報になります。
          全国平均{average.toFixed(1)}
          %に対し、上位は8〜10%台に達し、なかでも福岡県
          筑豊地方の旧産炭地が際立って高い水準にありました。
          炭鉱閉山という半世紀以上前の出来事が、産業構造の
          転換の難しさというかたちで今なお地域経済に影響を
          及ぼしていることが、この数値からも読み取れます。
        </p>

        <PersonalNote>
          失業率も「地方の方が高い」というイメージを持って
          いたのですが、実際には観光業など特定の産業に偏った
          地域ほど、景気や季節の影響を受けて数値の振れ幅が
          大きくなる傾向があります。一方で都市部は、雇用の
          流動性が高いぶん、転職や求職中の人が一定数
          常にいるため、失業率がゼロに近づくことはありません。
          「都市は安定、地方は不安定」と単純に切り分けられる
          話ではないと感じました。
        </PersonalNote>

        <p>
          <Link href="/ranking/unemployment" style={link}>
            完全失業率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/density-aging" style={link}>
            人口密度と高齢化率の相関分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/finance-analysis" style={link}>
            財政力指数ランキング分析を見る
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
