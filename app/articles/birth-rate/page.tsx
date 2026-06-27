import Link from "next/link";

export const metadata = {
  title: "出生率ランキング｜全国自治体データ",
  description:
    "出生率が高い自治体をランキング形式で紹介します。",
};

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
      <h1>👶 出生率ランキング</h1>

      <p
        style={{
          marginTop: 20,
          lineHeight: 1.9,
        }}
      >
        出生率とは、一人の女性が生涯に産む子どもの平均人数を表す指標です。
      </p>

      <p style={{ lineHeight: 1.9 }}>
        少子化の状況を把握するためによく利用され、
        自治体ごとの子育て環境や人口構造を考える上でも重要なデータです。
      </p>

      <div
        style={{
          marginTop: 30,
          padding: 24,
          background: "#f3f4f6",
          borderRadius: 16,
        }}
      >
        ランキングページは現在準備中です。
      </div>

      <Link href="/" style={{ display: "inline-block", marginTop: 40 }}>
        ← トップへ戻る
      </Link>
    </main>
  );
}