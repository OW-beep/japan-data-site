import Link from "next/link";
import { getMunicipalities } from "@/lib/municipalities";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";

export const metadata = {
  title: "財政の中身分析｜自主財源比率63.8%の村",
  description:
    "全国自治体の歳入に占める地方税の割合(自主財源比率)を分析。企業城下町・リゾート地・原子力研究施設の町が上位を占める一方、離島・山村は国からの財政移転にほぼ全面依存している実態を、これまでの財政関連記事とあわせて解説します。",
};

export default function Page() {
  const base = getMunicipalities()
    .filter(
      (c) =>
        c.totalRevenue != null &&
        c.localTax != null &&
        c.totalRevenue > 0
    )
    .map((c) => ({
      ...c,
      taxRatio: ((c.localTax ?? 0) / (c.totalRevenue ?? 1)) * 100,
    }));

  const top15 = [...base]
    .sort((a, b) => b.taxRatio - a.taxRatio)
    .slice(0, 15);

  const bottom15 = [...base]
    .sort((a, b) => a.taxRatio - b.taxRatio)
    .slice(0, 15);

  const average =
    base.reduce((s, c) => s + c.taxRatio, 0) / base.length;

  return (
    <ArticleLayout
      title="財政の中身分析：歳入の63.8%を自前で賄う愛知県飛島村、1.7%しかない離島の村"
      summary={`全国${base.length.toLocaleString()}自治体の歳入に占める地方税の割合(自主財源比率)を比較すると、全国平均${average.toFixed(
        1
      )}%に対し、1位の愛知県飛島村は${top15[0].taxRatio.toFixed(
        1
      )}%と自前の税収でほぼ運営できている一方、最下位の鹿児島県十島村はわずか${bottom15[0].taxRatio.toFixed(
        1
      )}%で、財源のほとんどを国からの財政移転に頼っています。`}
      heroLabel="地方税自主財源比率 全国1位"
      heroValue={`${top15[0].name} ${top15[0].taxRatio.toFixed(1)}%`}
      rankingLink="/ranking/tax-ratio"
      tags={["finance"]}
      publishedAt="2026-07-30"
      top3={[
        { rank: 1, name: top15[0].name, value: `${top15[0].taxRatio.toFixed(1)}%` },
        { rank: 2, name: top15[1].name, value: `${top15[1].taxRatio.toFixed(1)}%` },
        { rank: 3, name: top15[2].name, value: `${top15[2].taxRatio.toFixed(1)}%` },
      ]}
    >
      <div style={box}>
        <p style={lead}>
          これまでの財政力指数関連の記事では、財政力指数
          という合成指標を使って自治体の財政基盤を比較して
          きました。今回は、その中身をもう一段階分解し、
          歳入決算総額に占める地方税の割合(自主財源比率)を
          直接比較します。財政力指数よりも直感的に「歳入の
          何%を自前の税収でまかなえているか」が分かる指標
          です。同じ財政力指数の自治体同士でも、その内訳を
          見ると、大きく異なる財源構造を持っていることが
          少なくありません。
        </p>
      </div>

      <div style={box}>
        <h2>自主財源比率TOP15</h2>

        <RankingBarChart
          items={top15.map((c) => ({
            name: c.name,
            value: c.taxRatio,
            displayValue: `${c.taxRatio.toFixed(1)}%`,
          }))}
          barColor="#047857"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          1位の愛知県飛島村は、名古屋港に隣接し、大企業の
          工場・物流施設が集積する「日本一の高所得村」として
          知られています。人口はわずか5,000人前後ですが、
          企業からの固定資産税・法人住民税によって、歳入の
          {top15[0].taxRatio.toFixed(1)}
          %を地方税だけで賄っています。国からの財政移転に
          頼らずとも行政サービスを維持できる、極めて恵まれた
          財政基盤を持つ自治体だと言えます。
        </p>
      </div>

      <div style={box}>
        <h2>上位に共通する3つのパターン</h2>

        <p>
          TOP15の顔ぶれは、これまでの財政関連記事で見てきた
          パターンがきれいに再登場します。1つ目は飛島村・
          京都府久御山町・愛知県豊田市・武豊町・みよし市・
          三重県川越町といった、大企業の工場や物流拠点が
          集積する「ものづくりの町」です。7位の豊田市は、
          産業構造分析の記事で製造業就業者比率の高さを紹介
          した、まさにその町です。2つ目は千葉県浦安市(東京
          ディズニーリゾート)、長野県軽井沢町、神奈川県
          箱根町、山梨県山中湖村といった観光・別荘地です。
          3つ目は茨城県東海村で、日本原子力研究開発機構
          (JAEA)をはじめとする原子力関連の研究機関が集積
          しており、高齢化率と財政力指数の関係を扱った記事
          で紹介した原発立地自治体と同じ構造です。
        </p>

        <p>
          12位の東京都武蔵野市(吉祥寺を含む住宅地)だけは
          やや毛色が異なり、大企業の工場や観光資源ではなく、
          比較的所得水準の高い住民から得られる住民税収入
          によって高い自主財源比率を実現しています。
        </p>

        <p>
          こうした「特定資源依存型」の自主財源比率の高さは、
          諸刃の剣でもあります。工場の海外移転や生産縮小、
          観光需要の落ち込み、研究機関の統廃合などが起きれば、
          地方税収入は大きく減少しかねません。自主財源比率が
          高いこと自体が「行政運営が優れている」ことを直接
          意味するわけではなく、地理的・産業的な条件に強く
          規定された結果である点には注意が必要です。
        </p>
      </div>

      <div style={box}>
        <h2>自主財源比率が低い自治体TOP15</h2>

        <RankingBarChart
          items={bottom15.map((c) => ({
            name: c.name,
            value: c.taxRatio,
            displayValue: `${c.taxRatio.toFixed(1)}%`,
          }))}
          barColor="#dc2626"
        />

        <p style={{ marginTop: 16, color: "#4b5563" }}>
          最下位の鹿児島県十島村は、歳入のわずか
          {bottom15[0].taxRatio.toFixed(1)}
          %しか地方税で賄えていません。トカラ列島の7つの
          離島からなる村で、人口は700人程度。上位15自治体
          はいずれも人口数百人〜2000人程度の離島・山村で
          占められており、地方交付税・国庫支出金といった
          国からの財政移転がなければ、行政サービスの維持が
          極めて困難な状況にあることが分かります。
        </p>
      </div>

      <div style={box}>
        <h2>「自主財源比率が低い=財政が悪い」わけではない</h2>

        <p>
          ここで注意したいのは、自主財源比率が低いことが
          必ずしも「その自治体の財政運営に問題がある」こと
          を意味しないという点です。離島や山村は、そもそも
          企業立地や大規模な観光開発が地理的・物理的に
          難しく、税源そのものが乏しい構造にあります。
          地方交付税制度は、こうした税源の乏しい自治体でも
          全国一律の行政サービスを提供できるよう、国が
          財源を再配分する仕組みであり、自主財源比率が
          低いこと自体は、この制度が意図したとおりに機能
          している結果とも言えます。
        </p>

        <p>
          むしろ注目すべきは、上位に並ぶ自治体がいずれも
          「特定の産業・観光資源・研究機関」という、地理的
          に代替のきかない資源を持っている点です。これは、
          自主財源比率の高さが、必ずしも行政運営の巧拙では
          なく、立地の幸運によってもたらされている部分が
          大きいことを示唆しています。
        </p>
      </div>

      <div style={box}>
        <h2>財政関連記事のまとめ</h2>

        <p>
          本サイトではこれまで、高齢化率・人口密度・子ども
          人口割合という3つの角度から財政力指数との関係を
          分析し、いずれも原子力関連施設・観光地・大規模
          工場といった特定の産業基盤が「例外」を生む要因
          であることを確認してきました。今回、財政の中身を
          地方税自主財源比率として直接見ることで、これらの
          分析が指し示していた構造が、より明確なかたちで
          裏付けられたと言えます。
        </p>

        <p>
          <Link href="/ranking/tax-ratio" style={link}>
            地方税自主財源比率ランキングを見る
          </Link>
          {" ｜ "}
          <Link href="/articles/aging-finance" style={link}>
            高齢化率と財政力指数の関係を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/industry-structure" style={link}>
            産業構造分析を見る
          </Link>
          {" ｜ "}
          <Link href="/articles/prefecture-composite" style={link}>
            都道府県総合スコアを見る
          </Link>
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <p>
          自主財源比率は、歳入決算総額に占める地方税の割合
          という単純な計算式で算出しています。歳入には
          地方税のほか、地方交付税・国庫支出金・地方債など
          さまざまな財源が含まれており、自主財源比率が
          低いからといって、その自治体の歳入総額そのものが
          少ないとは限りません。あくまで「歳入の構成比」を
          示す指標であり、歳入の絶対額や住民一人あたりの
          歳入水準とはあわせて解釈する必要があります。地方
          交付税制度によって歳入総額そのものは一定水準が
          確保されている自治体も多く、自主財源比率の低さを
          そのまま「財政が苦しい」と読み替えるのは早計です。
        </p>
      </div>

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          地方税自主財源比率ランキングでは、全国平均
          {average.toFixed(1)}
          %に対し、上位は50〜60%台、下位は1〜3%台という、
          非常に大きな地域差が明らかになりました。上位には
          製造業の集積地・観光地・研究機関の立地自治体が
          並び、これまでの財政関連記事で見てきた「例外」の
          正体を、より直接的な指標で確認できる結果となり
          ました。同じ日本の自治体でも、財源構造はこれほど
          までに多様です。
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
