import type { Metadata } from "next";
import Link from "next/link";
import MatchClient from "@/components/MatchClient";
import citiesData from "@/data/match-cities.json";

const CITY_COUNT = citiesData.length;

export const metadata: Metadata = {
  alternates: { canonical: "/tools/match" },
  title: "街えらびマッチング(簡易版)|重視する条件から街を探す",
  description:
    "医療の充実、地価・家賃の安さ、にぎわい・仕事、子育ての4つの優先度を選ぶと、人口10万人以上の277自治体の中から、あなたに合いそうな街を上位8件まで表示します。公的統計の実データだけで計算する簡易マッチングです。",
};

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "28px 24px",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 12 }}>
        🧭 街えらびマッチング(簡易版)
      </h1>

      <p
        style={{
          color: "#6b7280",
          marginBottom: 24,
          lineHeight: 1.9,
        }}
      >
        引っ越し先や移住先の候補探しに、「何を重視するか」から
        逆引きできる簡易ツールです。対象は当サイトで詳しく扱っている
        人口10万人以上の{CITY_COUNT}自治体。4つの優先度に
        「重視する／ふつう／気にしない」を付けると、条件に合う街を
        上位8件まで表示します。
      </p>

      <MatchClient />

      <section
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: "20px 22px",
          marginTop: 32,
          lineHeight: 1.9,
        }}
      >
        <h2 style={{ fontSize: 20, marginTop: 0 }}>仕組み(どう計算しているか)</h2>
        <p>
          各自治体について、優先度ごとに「対象{CITY_COUNT}自治体の中での
          相対位置(パーセンタイル)」を点数化しています。たとえば
          「医療の充実」は人口10万人あたり医師数、「地価・家賃の安さ」は
          取引実勢価格の地価(安いほど高得点)、「にぎわい・仕事」は
          昼夜間人口比率と人口あたり小売店数、「子育て」は子どもの割合と
          保育園1施設あたり子ども人口(少ないほど高得点)です。
          あなたが付けた重み(重視する=2、ふつう=1、気にしない=0)で
          平均したものが「マッチ度」です。データのない指標は計算から
          除外しています。
        </p>
        <p>
          使っているデータは、令和7年国勢調査、医師・歯科医師・薬剤師統計、
          国土交通省「不動産情報ライブラリ」、市町村税課税状況等の調など、
          当サイトの各ランキングと同じ公的統計です。出典と算出方法の
          詳細は
          <Link href="/methodology" style={{ color: "#2563eb" }}>
            データの出典と算出方法
          </Link>
          にまとめています。
        </p>
      </section>

      <section
        style={{
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: 14,
          padding: "20px 22px",
          marginTop: 20,
          lineHeight: 1.9,
        }}
      >
        <h2 style={{ fontSize: 20, marginTop: 0 }}>ご利用にあたっての注意</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            マッチ度は{CITY_COUNT}自治体の中での相対的な位置を示す
            目安です。「住みやすさ」の絶対評価ではありません。
          </li>
          <li>
            地価は自治体全体の平均で、駅前と郊外では大きく異なります。
            家賃の実額は物件情報で確認してください。
          </li>
          <li>
            病院までの距離、坂道、冬の気候、夜の街の様子など、
            統計では測れないものは現地確認が欠かせません。
          </li>
          <li>
            対象は人口10万人以上の自治体のみです。小規模な町村への
            移住を考えている方は、各
            <Link href="/ranking/population" style={{ color: "#2563eb" }}>
              ランキング
            </Link>
            から探してください。
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 28, lineHeight: 2 }}>
        <h2 style={{ fontSize: 20 }}>あわせて読みたい</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            <Link href="/articles/moving-city-data-guide" style={{ color: "#2563eb" }}>
              移住先の選び方｜データで見る自治体選びの5指標と失敗しない手順
            </Link>
          </li>
          <li>
            <Link href="/articles/retirement-city-guide" style={{ color: "#2563eb" }}>
              老後の移住先・セカンドライフの街選びガイド
            </Link>
          </li>
          <li>
            <Link href="/articles/young-single-city-guide" style={{ color: "#2563eb" }}>
              初めての一人暮らしの街選びガイド
            </Link>
          </li>
          <li>
            <Link href="/compare" style={{ color: "#2563eb" }}>
              自治体比較ツール(気になる2市を並べて比べる)
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
