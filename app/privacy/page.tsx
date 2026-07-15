import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "全国自治体データランキングのプライバシーポリシーです。広告配信、Cookie、アクセス解析、掲載データについて説明しています。",
};

export default function Page() {
  return (
    <main style={wrap}>
      <h1 style={h1}>プライバシーポリシー</h1>

      <p style={p}>
        「全国自治体データランキング」(以下「当サイト」)は、利用者のプライバシーを尊重し、
        個人情報の保護に努めます。当サイトの利用にあたっては、本ポリシーに同意いただいたものとみなします。
      </p>

      <h2 style={h2}>広告の配信について</h2>
      <p style={p}>
        当サイトは第三者配信の広告サービス(Google
        AdSense)を利用しています。Googleを含む第三者配信事業者は、Cookieを使用して、
        当サイトや他のサイトへの過去のアクセス情報に基づいて広告を配信することがあります。
      </p>
      <p style={p}>
        Googleが広告配信にCookieを使用することにより、当サイトや他のサイトにアクセスした際の情報に基づいて、
        Googleおよびそのパートナーが適切な広告を表示できます。ユーザーは
        <a
          href="https://adssettings.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={link}
        >
          広告設定
        </a>
        にアクセスすることで、パーソナライズ広告を無効にできます。また
        <a
          href="https://optout.aboutads.info/"
          target="_blank"
          rel="noopener noreferrer"
          style={link}
        >
          www.aboutads.info
        </a>
        にアクセスすることで、パーソナライズ広告に使われるCookieを無効にすることもできます。
      </p>

      <h2 style={h2}>アクセス解析ツールについて</h2>
      <p style={p}>
        当サイトでは、サイトの利用状況を把握するためにアクセス解析ツールを導入する場合があります。
        これらのツールはCookieを使用してデータを収集しますが、氏名・住所・電話番号など、
        個人を特定できる情報は含まれません。
      </p>

      <h2 style={h2}>Cookieの無効化について</h2>
      <p style={p}>
        ユーザーはブラウザの設定により、Cookieを無効にすることができます。
        Cookieを無効にした場合、当サイトの一部機能が正しく動作しない場合があります。
      </p>

      <h2 style={h2}>掲載データについて</h2>
      <p style={p}>
        当サイトが掲載する自治体データは、総務省統計局(e-Stat)などの政府統計・公的機関が公表する
        オープンデータを基に、当サイトが独自に加工・集計・可視化したものです。出典は各ページに明記しています。
      </p>
      <p style={p}>
        統計の性質上、データには反映のタイムラグがあり、最新の実態と異なる場合があります。
        当サイトの情報を利用したことにより生じたいかなる損害についても、当サイトは責任を負いかねます。
        重要な意思決定には、必ず一次情報(各省庁・自治体の公式発表)をご確認ください。
      </p>

      <h2 style={h2}>免責事項</h2>
      <p style={p}>
        当サイトからリンクやバナーなどによって他のサイトに移動した場合、
        移動先サイトで提供される情報・サービス等について当サイトは一切の責任を負いません。
      </p>

      <h2 style={h2}>プライバシーポリシーの変更について</h2>
      <p style={p}>
        当サイトは、法令の変更や運営方針の見直しに応じて、本ポリシーを予告なく変更することがあります。
        変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。
      </p>

      <h2 style={h2}>お問い合わせ</h2>
      <p style={p}>
        本ポリシーに関するお問い合わせは、
        <a href="/contact" style={link}>
          お問い合わせページ
        </a>
        よりご連絡ください。
      </p>

      <p style={{ ...p, color: "#9ca3af", fontSize: 13 }}>
        最終更新日：2026年7月
      </p>
    </main>
  );
}

const wrap: React.CSSProperties = {
  maxWidth: 800,
  margin: "0 auto",
  padding: "40px 24px",
  lineHeight: 1.9,
};

const h1: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 800,
  marginBottom: 24,
};

const h2: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginTop: 32,
  marginBottom: 8,
};

const p: React.CSSProperties = {
  color: "#374151",
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
