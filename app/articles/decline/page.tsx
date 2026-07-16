import Link from "next/link";

export const metadata = {
  title: "人口減少ランキング",
  description:
    "人口減少が進む自治体をランキング形式で紹介します。",
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
      <h1>📉 人口減少ランキング</h1>

      <p
        style={{
          marginTop: 20,
          lineHeight: 1.9,
        }}
      >
        人口減少率は、一定期間で人口がどれだけ減少したかを示す指標です。
      </p>

      <p style={{ lineHeight: 1.9 }}>
        少子高齢化や都市部への人口流出など、
        地域が抱える課題を把握するために利用されています。
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