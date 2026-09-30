import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import AffiliateSlot from "@/components/AffiliateSlot";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getFurusatoNozeiRanking } from "@/lib/furusatoNozei";

export const metadata = {
  alternates: { canonical: "/articles/furusato-nozei-2026-guide" },
  title:
    "ふるさと納税2026｜期限はいつまで？10月の制度変更と、寄付先選びに使える自治体別データ",
  description:
    "2026年分のふるさと納税は12月31日までに決済完了、ワンストップ特例は2027年1月10日必着。2026年10月からの指定基準の見直しと、ポイント付与禁止後の選び方、総務省データによる受入額が多い自治体の傾向をまとめました。",
};

export default function Page() {
  const all = getFurusatoNozeiRanking();

  const byAmount = [...all].sort((a, b) => b.amountYen - a.amountYen);
  const top5 = byAmount.slice(0, 5);

  const perCapita = all
    .filter((c) => c.population != null && c.population >= 1000)
    .sort((a, b) => (b.amountPerCapita ?? 0) - (a.amountPerCapita ?? 0));
  const perCapitaTop5 = perCapita.slice(0, 5);

  const total = all.reduce((s, c) => s + c.amountYen, 0);
  const oku = (yen: number) => (yen / 100_000_000).toFixed(1);

  const faq = [
    {
      q: "2026年分のふるさと納税はいつまでに寄付すればいいですか？",
      a: "2026年12月31日までに寄付金の決済が完了していれば、2026年分として扱われます。申し込みだけでなく決済の完了が基準です。銀行振込などは入金までに日数がかかるため、年末はクレジットカード決済のほうが確実です。混雑や決済の遅れを避けるため、12月中旬までに済ませておくと安心です。",
    },
    {
      q: "ワンストップ特例制度の申請期限はいつですか？",
      a: "寄付をした翌年の1月10日必着です。2026年分は2027年1月10日が期限になります。マイナンバーカードを使ったオンライン申請に対応している自治体もあります。",
    },
    {
      q: "ワンストップ特例が使えないのはどんな場合ですか？",
      a: "1年間の寄付先が6自治体以上になった場合や、医療費控除などで確定申告をする場合は、ワンストップ特例は使えません。その場合は、すべての寄付を確定申告に記載する必要があります。",
    },
    {
      q: "ワンストップ特例の期限に間に合わなかったらどうなりますか？",
      a: "確定申告(期限後申告を含む)をすれば、寄付金控除を受けられます。確定申告の期限は例年3月中旬で、2027年は3月15日ごろの見込みです。",
    },
    {
      q: "ふるさと納税のポイント付与は今もできますか？",
      a: "ポータルサイトによるポイント付与は、2025年10月1日から総務省のルールで禁止されています。自己負担2,000円と控除上限の仕組み自体は変わっていません。",
    },
  ];

  return (
    <ArticleLayout
      title="ふるさと納税2026｜期限はいつまで？10月の制度変更と、寄付先選びに使える自治体別データ"
      summary="2026年分の期限(12月31日)とワンストップ特例の期限(2027年1月10日必着)、2026年10月からの制度の見直し、ポイント付与禁止後の選び方を整理しました。あわせて、総務省の公表データから、受入額が多い自治体の傾向も紹介します。"
      heroLabel="2026年分の寄付の期限"
      heroValue="12月31日"
      rankingLink="/ranking/furusato-nozei"
      path="/articles/furusato-nozei-2026-guide"
      tags={["finance"]}
      publishedAt="2026-09-30"
      top3={[
        { rank: 1, name: "寄付の決済完了", value: "2026年12月31日" },
        { rank: 2, name: "ワンストップ特例の申請", value: "2027年1月10日必着" },
        { rank: 3, name: "確定申告", value: "2027年3月15日ごろ" },
      ]}
    >
      <div style={box}>
        <h2>結論:2026年分は12月31日までに「決済完了」</h2>

        <p>
          ふるさと納税は1月1日から12月31日までの寄付が、その年の控除の対象です。
          ここで注意したいのは、申し込みではなく
          <strong>決済の完了日</strong>
          で判定される点です。銀行振込やコンビニ払いは入金まで日数がかかるため、
          年末に申し込むと翌年分になってしまうことがあります。
        </p>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>手続き</th>
              <th style={th}>期限(2026年分)</th>
              <th style={th}>ポイント</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>寄付(決済完了)</td>
              <td style={td}>2026年12月31日</td>
              <td style={td}>クレジットカード決済なら確実。混雑を避けて12月中旬までに</td>
            </tr>
            <tr>
              <td style={td}>ワンストップ特例の申請</td>
              <td style={td}>2027年1月10日必着</td>
              <td style={td}>郵送は余裕を持って1月上旬までに。オンライン申請対応の自治体もあり</td>
            </tr>
            <tr>
              <td style={td}>確定申告</td>
              <td style={td}>2027年3月15日ごろ(見込み)</td>
              <td style={td}>ワンストップ特例を使わない人、使えない人が対象</td>
            </tr>
          </tbody>
        </table>

        <p style={note}>
          期限は国の制度上の目安です。寄付先の自治体が独自に銀行振込の受付を前倒しで
          締め切る場合もあるため、最終的な日程は各自治体・ポータルサイトの案内で
          確認してください。
        </p>
      </div>

      <div style={box}>
        <h2>ワンストップ特例が使えないケース</h2>

        <ul>
          <li>1年間の寄付先が<strong>6自治体以上</strong>になった場合</li>
          <li>医療費控除など、ほかの理由で<strong>確定申告をする</strong>場合</li>
        </ul>

        <p>
          この場合はワンストップ特例の申請が無効になり、すべての寄付を確定申告に
          記載する必要があります。申告漏れがあると、その分の控除を受けられません。
        </p>
      </div>

      <div style={box}>
        <h2>2026年10月からの制度見直しと、ポイント付与の禁止</h2>

        <p>
          総務省は、ふるさと納税の指定基準の見直しを発表しています。この見直しは
          <strong>令和8年(2026年)10月から始まる指定対象期間</strong>
          に係る指定から適用され、内容は「募集費用の透明化」と「地場産品基準の明確化」
          とされています。
        </p>

        <p>
          基準が変わることで、自治体によっては返礼品の内容や寄付額の設定が
          変わる可能性があります。気になる返礼品がある場合は、寄付前に最新の
          掲載内容を確認しておくと安心です。
        </p>

        <p>
          また、ポータルサイトによる<strong>ポイント付与は2025年10月1日から禁止</strong>
          されています。影響を受けるのは仲介サイトのポイント還元で、自己負担2,000円と
          控除上限という仕組み自体は変わっていません。ポイントの多さではなく、
          返礼品の内容や自治体の取り組みで寄付先を選ぶ形になっています。
        </p>

        <p style={note}>
          出典:
          <a
            href="https://www.soumu.go.jp/menu_news/s-news/01zeimu04_02000144.html"
            target="_blank"
            rel="noopener noreferrer"
            style={link}
          >
            総務省「ふるさと納税の指定基準の見直し等」
          </a>
          。詳細は必ず一次情報でご確認ください。
        </p>
      </div>

      <div style={box}>
        <h2>寄付先選びに:受入額が多い自治体は?(令和7年度)</h2>

        <p>
          総務省の現況調査では、令和7年度のふるさと納税受入額は全国の市区町村の
          合計で約{oku(total)}億円でした。受入額が多い自治体は次のとおりです。
        </p>

        <ol>
          {top5.map((c) => (
            <li key={c.name}>
              {c.name}:約{oku(c.amountYen)}億円({c.count.toLocaleString()}件)
            </li>
          ))}
        </ol>

        <p>
          総額では大きな自治体が上位に並びますが、住民1人あたりの受入額で見ると
          顔ぶれは大きく変わります(人口1,000人以上の自治体が対象)。
        </p>

        <ol>
          {perCapitaTop5.map((c) => (
            <li key={c.name}>
              {c.name}:1人あたり約
              {Math.round(c.amountPerCapita ?? 0).toLocaleString()}円
            </li>
          ))}
        </ol>

        <p>
          100位までの受入額と、1人あたりの受入額ランキングは
          <Link prefetch={false} href="/ranking/furusato-nozei" style={link}>
            ふるさと納税受入額ランキング
          </Link>
          で見られます。受入額の多さは人気の目安になりますが、寄付額の
          何割が費用として使われているかなどは、自治体によって違います。
          詳しくは
          <Link prefetch={false} href="/articles/furusato-nozei-analysis" style={link}>
            ふるさと納税の受入額分析
          </Link>
          をご覧ください。
        </p>
      </div>

      <AffiliateSlot topic="furusato" />

      <div style={box}>
        <h2>控除上限額の目安は、必ずシミュレーターで</h2>

        <p>
          自己負担2,000円で済む寄付額の上限(控除上限額)は、年収・家族構成・
          ほかの控除の有無によって人それぞれ違います。このサイトでは個別の上限額は
          算出していません。各ポータルサイトが提供しているシミュレーターで確認し、
          上限を超えないように寄付額を決めてください。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：ふるさと納税の期限についてよくある質問</h2>

        {faq.map((item) => (
          <p key={item.q}>
            <strong>Q. {item.q}</strong>
            <br />
            A. {item.a}
          </p>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      <div style={box}>
        <h2>まとめ</h2>

        <p>
          2026年分のふるさと納税は、12月31日までの決済完了が期限です。
          ワンストップ特例は2027年1月10日必着、使えない場合は確定申告が必要です。
          年末は混み合うため、早めの寄付をおすすめします。
        </p>

        <p style={note}>
          本記事は制度の一般的な説明であり、個別の税務相談ではありません。
          税額や手続きの詳細は、お住まいの自治体や税務署、税理士にご確認ください。
          本記事には広告(PR)が含まれます。
        </p>

        <CompareCTA />
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

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 12,
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
};

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
  verticalAlign: "top",
};

const note: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  lineHeight: 1.8,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
