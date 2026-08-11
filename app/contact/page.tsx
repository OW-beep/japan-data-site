import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "お問い合わせ",
  description: "全国自治体データランキングへのお問い合わせはこちらから。",
};

export default function Page() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>お問い合わせ</h1>

      <p>
        全国自治体データランキングは、総務省統計局・e-Stat・国立社会保障
        人口問題研究所などの政府公開統計をもとに、全国1741自治体の
        人口・出生率・高齢化率・財政力指数などをランキング形式で
        紹介しているデータサイトです。
      </p>

      <p>
        掲載データの誤りのご指摘、記事内容へのご意見・ご要望、
        取材・広告掲載に関するお問い合わせなど、以下のメール
        アドレスまでお気軽にご連絡ください。
      </p>

      <p>
        Email: openwave25@gmail.com
      </p>

      <p>
        お問い合わせいただく際は、対象のページURLを添えていただけると
        スムーズに対応できます。内容を確認のうえ、順次ご返信いたします。
      </p>
    </main>
  );
}