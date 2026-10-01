import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import AffiliateSlot from "@/components/AffiliateSlot";
import BookRecommendation from "@/components/BookRecommendation";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { BOOKS } from "@/lib/amazonBooks";
import { getFurusatoNozeiRanking } from "@/lib/furusatoNozei";
import { median, POPULATION_BANDS } from "@/lib/rankingAnalysis";

export const metadata = {
  alternates: { canonical: "/articles/furusato-nozei-concentration" },
  title:
    "ふるさと納税の受入額は一部の自治体に集中している？上位10自治体のシェアと人口規模別の傾向",
  description:
    "令和7年度のふるさと納税の受入額を、総務省のデータで分析。上位10自治体・100自治体が全体の何%を占めるか、半分に達するまでに何自治体かかるか、人口規模別の傾向を調べました。寄付先を選ぶときのチェックポイントも紹介します。",
};

const oku = (yen: number, d = 1) => (yen / 100_000_000).toFixed(d);
const pct = (n: number, d: number) => (d > 0 ? (n / d) * 100 : 0);

export default function Page() {
  const all = getFurusatoNozeiRanking().filter((c) => c.amountYen >= 0);
  if (all.length < 50) return null;

  const sorted = [...all].sort((a, b) => b.amountYen - a.amountYen);
  const total = sorted.reduce((s, c) => s + c.amountYen, 0);
  const totalCount = sorted.reduce((s, c) => s + c.count, 0);
  if (total <= 0) return null;

  const share = (n: number) =>
    pct(
      sorted.slice(0, n).reduce((s, c) => s + c.amountYen, 0),
      total
    );
  const share1 = share(1);
  const share10 = share(10);
  const share50 = share(50);
  const share100 = share(100);

  // 全体の50%・80%に達するまでに何自治体かかるか
  const reach = (ratio: number) => {
    let cum = 0;
    for (let i = 0; i < sorted.length; i++) {
      cum += sorted[i].amountYen;
      if (cum >= total * ratio) return i + 1;
    }
    return sorted.length;
  };
  const n50 = reach(0.5);
  const n80 = reach(0.8);

  const med = median(sorted.map((c) => c.amountYen));
  const under1oku = sorted.filter((c) => c.amountYen < 100_000_000).length;
  const avgPerCase = totalCount > 0 ? total / totalCount : 0;

  // 人口規模別
  const withPop = sorted.filter((c) => c.population != null && c.population > 0);
  const popTotal = withPop.reduce((s, c) => s + (c.population ?? 0), 0);
  const amountTotalWithPop = withPop.reduce((s, c) => s + c.amountYen, 0);
  const bands = POPULATION_BANDS.map((b) => {
    const list = withPop.filter(
      (c) => (c.population ?? 0) >= b.min && (c.population ?? 0) < b.max
    );
    const amount = list.reduce((s, c) => s + c.amountYen, 0);
    const pop = list.reduce((s, c) => s + (c.population ?? 0), 0);
    const perCap = list
      .map((c) => c.amountPerCapita)
      .filter((v): v is number => v != null);
    return {
      label: b.label,
      count: list.length,
      amountShare: pct(amount, amountTotalWithPop),
      popShare: pct(pop, popTotal),
      medianPerCapita: perCap.length ? median(perCap) : NaN,
    };
  }).filter((b) => b.count > 0);

  const top10 = sorted.slice(0, 10);

  const faq = [
    {
      q: "ふるさと納税の受入額が最も多い自治体はどこですか？",
      a: `令和7年度は${sorted[0].name}で、約${oku(sorted[0].amountYen)}億円です。全国の受入額に占める割合は約${share1.toFixed(1)}%です。`,
    },
    {
      q: "上位10自治体で、全国の受入額の何%を占めますか？",
      a: `約${share10.toFixed(1)}%です。上位100自治体では約${share100.toFixed(1)}%を占めます。`,
    },
    {
      q: "受入額の半分に達するまで、何自治体かかりますか？",
      a: `受入額の多い順に足していくと、${n50.toLocaleString()}自治体で全体の半分に達します(対象は全${sorted.length.toLocaleString()}自治体)。全体の8割に達するには${n80.toLocaleString()}自治体が必要です。`,
    },
    {
      q: "受入額が多い自治体に寄付するほうがよいのですか？",
      a: "受入額の多さは、人気や返礼品の魅力の目安にはなりますが、寄付先として優れているかどうかを示すものではありません。使い道や、自分が応援したい自治体かどうかを基準に選ぶことが大切です。",
    },
  ];

  return (
    <ArticleLayout
      title="ふるさと納税の受入額は一部の自治体に集中している？上位10自治体のシェアと人口規模別の傾向"
      summary={`令和7年度のふるさと納税の受入額は、上位10自治体で全体の約${share10.toFixed(0)}%、上位100自治体で約${share100.toFixed(0)}%を占めます。受入額の半分に達するまでに${n50.toLocaleString()}自治体、人口規模別の違いも調べました。`}
      heroLabel="上位10自治体のシェア"
      heroValue={`約${share10.toFixed(0)}%`}
      rankingLink="/ranking/furusato-nozei"
      path="/articles/furusato-nozei-concentration"
      tags={["finance", "population"]}
      publishedAt="2026-10-02"
      top3={top10.slice(0, 3).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `約${oku(c.amountYen)}億円`,
      }))}
    >
      <p style={prNote}>
        ※本記事には広告(PR)が含まれます。広告を経由して寄付・購入された場合、
        当サイトが報酬を受け取ることがあります。内容は総務省の公表データに
        基づいており、広告主の意向は反映していません。
      </p>

      <div style={box}>
        <h2>結論:上位の自治体に寄付が集まっている</h2>

        <p>
          総務省の現況調査(令和7年度の受入額)をもとに、全国{sorted.length.toLocaleString()}
          自治体の受入額を集計しました。受入額の合計は約{oku(total, 0)}億円で、
          上位10自治体だけで<strong>約{share10.toFixed(1)}%</strong>、上位100自治体で
          <strong>約{share100.toFixed(1)}%</strong>を占めています。
        </p>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>上位</th>
              <th style={thNum}>全体に占める割合</th>
            </tr>
          </thead>
          <tbody>
            {(
              [
                ["1自治体", share1],
                ["10自治体", share10],
                ["50自治体", share50],
                ["100自治体", share100],
              ] as const
            ).map(([label, v]) => (
              <tr key={label}>
                <td style={td}>{label}</td>
                <td style={tdNum}>{v.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ marginTop: 14 }}>
          受入額の多い順に足していくと、<strong>{n50.toLocaleString()}自治体</strong>
          で全体の半分に、{n80.toLocaleString()}自治体で8割に達します。一方、受入額の
          中央値は約{oku(med, 2)}億円で、{under1oku.toLocaleString()}自治体(約
          {pct(under1oku, sorted.length).toFixed(0)}%)は1億円に届いていません。
        </p>
      </div>

      <div style={box}>
        <h2>受入額が多い自治体 上位10(令和7年度)</h2>

        <RankingBarChart
          items={top10.map((c) => ({
            name: c.name,
            value: c.amountYen,
            displayValue: `約${oku(c.amountYen)}億円`,
          }))}
        />

        <p style={{ marginTop: 16 }}>
          寄付1件あたりの平均額は、全国平均で約{Math.round(avgPerCase).toLocaleString()}
          円です。全自治体の順位や、人口1人あたりの受入額は
          <Link prefetch={false} href="/ranking/furusato-nozei" style={link}>
            ふるさと納税受入額ランキング
          </Link>
          で確認できます。
        </p>
      </div>

      <div style={box}>
        <h2>人口規模別に見ると</h2>

        <p>
          人口規模ごとに、受入額のシェアと人口のシェアを比べました。人口のシェアより
          受入額のシェアが大きい区分は、人口の割に寄付が集まっている区分です。
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 560 }}>
            <thead>
              <tr>
                <th style={th}>人口規模</th>
                <th style={thNum}>自治体数</th>
                <th style={thNum}>人口のシェア</th>
                <th style={thNum}>受入額のシェア</th>
                <th style={thNum}>1人あたり受入額の中央値</th>
              </tr>
            </thead>
            <tbody>
              {bands.map((b) => (
                <tr key={b.label}>
                  <td style={td}>{b.label}</td>
                  <td style={tdNum}>{b.count.toLocaleString()}</td>
                  <td style={tdNum}>{b.popShare.toFixed(1)}%</td>
                  <td style={tdNum}>{b.amountShare.toFixed(1)}%</td>
                  <td style={tdNum}>
                    {Number.isFinite(b.medianPerCapita)
                      ? `${Math.round(b.medianPerCapita).toLocaleString()}円`
                      : "―"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={note}>
          人口は国勢調査、受入額は総務省の現況調査です。自治体名が一致しなかった
          データは、この表から除いています。
        </p>
      </div>

      <div style={box}>
        <h2>寄付先を選ぶときのチェックポイント</h2>

        <ul>
          <li>
            <strong>寄付金の使い道。</strong>
            自治体が公表している使い道(子育て、医療、環境など)を確認し、応援したい
            分野で選ぶ方法があります。
          </li>
          <li>
            <strong>返礼品の内容と地場産品の基準。</strong>
            2026年10月開始の指定対象期間から、総務省の指定基準の見直しが
            適用されています。返礼品が変更・終了する場合があるので、寄付前に
            最新の掲載を確認してください。
          </li>
          <li>
            <strong>控除上限額。</strong>
            年収や家族構成で異なります。各ポータルのシミュレーターで確認し、上限を
            超えない範囲で寄付しましょう。
          </li>
          <li>
            <strong>期限。</strong>
            2026年分は12月31日までに決済を完了する必要があります。
            詳しくは
            <Link prefetch={false} href="/articles/furusato-nozei-2026-guide" style={link}>
              2026年の期限と制度変更の記事
            </Link>
            をご覧ください。
          </li>
        </ul>

        <p style={note}>
          受入額の多さは、人気の目安であって、寄付先としての優劣を示すものでは
          ありません。
        </p>
      </div>

      <AffiliateSlot topic="furusato" />

      <div style={box}>
        <h2>Q&amp;A：ふるさと納税の受入額についてよくある質問</h2>

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
          令和7年度のふるさと納税は、上位10自治体で約{share10.toFixed(0)}%、上位100
          自治体で約{share100.toFixed(0)}%を占め、受入額は一部の自治体に集中して
          います。ただし、寄付先を選ぶ基準は、受入額の多さだけではありません。
          使い道や返礼品、自分の控除上限額を確認して選びましょう。
        </p>

        <BookRecommendation books={[BOOKS.jichitaiZaisei]} />

        <p>
          <Link prefetch={false} href="/articles/furusato-nozei-analysis" style={link}>
            ふるさと納税の受入額分析
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/furusato-nozei-finance-analysis" style={link}>
            受入額と財政力の関係
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/furusato-nozei-2026-guide" style={link}>
            2026年の期限と制度変更
          </Link>
        </p>

        <CompareCTA />
      </div>
    </ArticleLayout>
  );
}

const prNote: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: "10px 14px",
  lineHeight: 1.8,
  marginBottom: 20,
};

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
  fontSize: 14,
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
  whiteSpace: "nowrap",
};

const thNum: React.CSSProperties = { ...th, textAlign: "right" };

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f5f9",
};

const tdNum: React.CSSProperties = { ...td, textAlign: "right" };

const note: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  lineHeight: 1.8,
};

const link: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
};
