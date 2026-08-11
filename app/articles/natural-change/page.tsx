import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  alternates: { canonical: "/articles/natural-change" },
  title: "自然増減率ランキング分析｜自然増はわずか34",
  description:
    "出生数から死亡数を引いた自然増減率を全国自治体で分析。全国のわずか2%の自治体でしか自然増加が起きていない実態と、社会増減率(転入出)との違いを、これまでの記事とあわせて解説します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) => c.births != null && c.deaths != null && c.population > 0
    )
    .map((c) => ({
      ...c,
      naturalRate:
        (((c.births ?? 0) - (c.deaths ?? 0)) / c.population) * 1000,
      netMigrationRate:
        c.inMigrants != null && c.outMigrants != null
          ? ((c.inMigrants - c.outMigrants) / c.population) * 100
          : null,
    }));

  const top15 = [...base]
    .sort((a, b) => b.naturalRate - a.naturalRate)
    .slice(0, 15);

  const bottom15 = [...base]
    .sort((a, b) => a.naturalRate - b.naturalRate)
    .slice(0, 15);

  const positiveCount = base.filter((c) => c.naturalRate > 0).length;
  const positiveShare = (positiveCount / base.length) * 100;

  const average =
    base.reduce((s, c) => s + c.naturalRate, 0) / base.length;

  const naturalUpMigrationDown = base
    .filter(
      (c) =>
        c.naturalRate > 0 &&
        c.netMigrationRate != null &&
        c.netMigrationRate < 0
    )
    .sort((a, b) => b.naturalRate - a.naturalRate);

  const okinawaCount = top15.filter((c) =>
    c.name.startsWith("沖縄県")
  ).length;

  return (
    <ArticleLayout
      title="自然増減率ランキング分析：全国1740自治体中、自然増加はわずか34自治体だけ"
      summary={`出生数から死亡数を引いた自然増減率を計算すると、全国${base.length.toLocaleString()}自治体のうち、プラス(自然増加)なのはわずか${positiveCount}自治体(${positiveShare.toFixed(
        1
      )}%)でした。1位の沖縄県北大東村でも人口千人あたり${top15[0].naturalRate.toFixed(
        1
      )}人の増加にとどまり、日本の人口減少が「社会移動」だけでなく「自然減」によって、ほぼ全国的に進行している実態が浮き彫りになりました。`}
      heroLabel="自然増減率 全国1位"
      heroValue={`${top15[0].name} ${top15[0].naturalRate.toFixed(1)}‰`}
      rankingLink="/ranking/natural-change"
      tags={["population", "child"]}
      publishedAt="2026-08-03"
      top3={[
        { rank: 1, name: top15[0].name, value: `${top15[0].naturalRate.toFixed(1)}‰` },
        { rank: 2, name: top15[1].name, value: `${top15[1].naturalRate.toFixed(1)}‰` },
        { rank: 3, name: top15[2].name, value: `${top15[2].naturalRate.toFixed(1)}‰` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          社会増減率ランキング分析の記事では、転入者数と転出者数
          の差である「社会増減」を扱いました。しかし人口の
          増減には、もう1つ別の要因があります。それが、出生数
          から死亡数を引いた「自然増減」です。今回、全国
          {base.length.toLocaleString()}
          自治体の自然増減率を計算したところ、プラスだったのは
          わずか{positiveCount}自治体、全体の
          {positiveShare.toFixed(1)}
          %にとどまりました。少子高齢化ギャップ分析など、
          これまでの記事でも触れてきた日本の人口構造の
          変化が、出生・死亡という最も基本的な統計からも
          明確に裏付けられた結果です。
        </p>
      </div>

      <div style={box}>
        <h2>自然増減率TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.naturalRate,
            displayValue: `${c.naturalRate.toFixed(1)}‰`,
          }))}
          barColor="#1d4ed8"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の沖縄県北大東村は、出生5人・死亡1人という
          小さな村ならではの数字ですが、プラスを維持して
          います。TOP15のうち{okinawaCount}
          自治体を沖縄県が占め、出生率ランキング分析の記事
          で見た沖縄県の高い出生率が、自然増減率という
          指標でもはっきりと裏付けられました。熊本県菊陽町
          は、大手半導体メーカーの工場進出で近年人口が
          急増している町で、子育て世代の転入と出生数の
          増加が同時に起きている代表例です。半導体産業の
          集積によって雇用が生まれ、子育て世代の転入と
          出生数の増加が連動して起きている点は、産業構造
          分析の記事で紹介した「企業城下町」のパターンとも
          重なります。
        </p>
      </div>

      <div style={box}>
        <h2>自然増加でも安心はできない理由</h2>

        <p>
          自然増減率がプラスの{positiveCount}
          自治体の中には、実は社会増減(転入出)がマイナスの
          自治体も含まれています。つまり、生まれる子どもの
          数は死亡数を上回っているものの、それ以上に多くの
          人が転出してしまい、結果として総人口は減少して
          いる自治体です。
          {naturalUpMigrationDown.length > 0 && (
            <>
              今回のデータでは
              {naturalUpMigrationDown
                .slice(0, 3)
                .map((c) => c.name)
                .join("・")}
              などが該当します。
            </>
          )}
          自然増減と社会増減は、それぞれ独立して動く別の
          要因であり、両方を確認しなければ、その自治体の
          人口が実際にどちらの方向に向かっているかを正しく
          判断できません。
        </p>
      </div>

      <div style={box}>
        <h2>自然減少TOP15：福島県が上位を独占</h2>

        <RankingBarChart
          items={bottom15.map((c) => ({
            name: c.name,
            value: c.naturalRate,
            displayValue: `${c.naturalRate.toFixed(1)}‰`,
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          最下位の福島県浪江町は、人口千人あたり
          {Math.abs(bottom15[0].naturalRate).toFixed(1)}
          人もの自然減少という、突出した数値になっています。
          浪江町・大熊町・飯舘村・富岡町・葛尾村という、
          東日本大震災の帰還困難区域を抱えた5町村がTOP5を
          独占しました。これは、震災前から住民登録は残る
          一方で、実際に帰還して暮らしているのが高齢者
          中心であるため、出生がほとんどなく死亡だけが
          計上されるという、特殊な事情によるものです。
        </p>

        <p>
          福島の特殊事情を除くと、東京都奥多摩町・檜原村、
          長野県天龍村・根羽村、群馬県神流町・南牧村と
          いった、少子高齢化ギャップ分析の記事で紹介した
          高齢化率の高い山村が並びます。子どもの出生数が
          極めて少ない一方、高齢者の死亡数が相対的に多い
          という、これらの村の年齢構成をそのまま反映した
          結果だと言えます。
        </p>
      </div>

      <div style={box}>
        <h2>「消滅可能性」の議論との関係</h2>

        <p>
          近年、若年女性人口の減少をもとにした「消滅可能性
          自治体」という議論が注目を集めていますが、自然
          増減率はその議論の根っこにある、最も基本的な
          データだと言えます。子育て世代への支援や移住
          促進策によって社会増減をプラスに転じさせることは
          可能ですが、出生数そのものが死亡数を上回る自治体
          を増やすことは、はるかに長い時間軸での取り組みが
          必要です。全国のわずか2%の自治体でしか自然増加が
          起きていないという今回の結果は、日本の人口減少が
          一時的な現象ではなく、構造的かつ全国的な課題である
          ことを改めて示しています。
        </p>
      </div>

      <div style={box}>
        <h2>「自然減」と「社会減」、日本の人口減少はどちらが主因か</h2>

        <p>
          今回の分析で最も重要なのは、全国のわずか2%の
          自治体でしか自然増加が起きていないという事実
          です。社会増減率ランキング分析の記事で見た
          「転入超過」は、あくまである自治体が他の自治体
          から人口を奪っているに過ぎず、日本全体で見れば
          ゼロサムです。一方、自然増減は日本全体の人口が
          実際に増えているか減っているかを直接反映する
          指標であり、その大部分の地域がマイナスという
          ことは、たとえ転入超過によって人口を維持できて
          いる自治体であっても、出生数の少なさという
          長期的な課題からは逃れられないことを意味します。
          自治体の人口政策を評価する際は、社会増減と自然増減
          の両方を切り分けて見る視点が欠かせません。
        </p>

        <p>
          <Link href="/ranking/natural-change" style={link}>
            自然増減率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/decline" style={link}>
            社会増減率ランキング分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/birth-rate" style={link}>
            出生率ランキング分析を見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          出生数・死亡数は住民基本台帳をもとにした人口動態
          統計であり、実際に居住している人口(国勢調査ベース)
          とは、特に福島県の避難指示区域などで大きな乖離が
          生じる場合があります。また、自然増減率は年による
          変動が大きい指標であるため、単年のデータだけで
          その自治体の将来を断定的に判断することは避け、
          複数年の推移とあわせて確認することをおすすめ
          します。特に人口規模が小さな自治体では、出生・
          死亡がそれぞれ数人単位で変動するだけで、率としては
          大きく振れる点にも留意してください。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          自然増減率がプラスの自治体は、全国
          {base.length.toLocaleString()}
          のうちわずか{positiveCount}
          にとどまり、日本の人口減少が一部地域の問題ではなく、
          ほぼ全国的な自然減によって進行している実態が
          明らかになりました。社会増減率(転入出)だけを見て
          「人口が増えている」と判断するのは早計で、その
          裏にある自然増減率を見て初めて、本当に若い世代が
          定着している街なのかが分かります。平均
          {average.toFixed(1)}
          ‰という全国平均の数字は、日本が直面する少子高齢化
          の厳しさを、シンプルながら雄弁に物語っています。
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
