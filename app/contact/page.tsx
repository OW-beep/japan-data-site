import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "全国自治体データランキングへのお問い合わせはこちらから。",
};

export default function Page() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>お問い合わせ</h1>

      <p>
        ご連絡は以下までお願いします。
      </p>

      <p>
        Email: openwave25@gmail.com
      </p>
    </main>
  );
}