import { Suspense } from "react";
import CompareClient from "@/components/CompareClient";

export const metadata = {
  title: "自治体比較ツール｜2つの街を比べる",
  description:
    "2つの自治体を選んで、人口・高齢化率・財政力指数・医師数など16項目を横並びで比較できます。全国1741自治体に対応。",
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
      <h1
        style={{
          fontSize: 32,
          marginBottom: 12,
        }}
      >
        ⚖️ 自治体比較ツール
      </h1>

      <p
        style={{
          color: "#6b7280",
          marginBottom: 30,
          lineHeight: 1.8,
        }}
      >
        2つの自治体を選ぶと、人口・高齢化率・財政力指数・医師数
        など16項目を横並びで比較できます。数字が優れている方を
        青字で表示します(人口・面積・人口密度などは優劣が
        つけられない指標のため、色分けしていません)。
      </p>

      <Suspense fallback={<p>読み込み中...</p>}>
        <CompareClient />
      </Suspense>
    </main>
  );
}
