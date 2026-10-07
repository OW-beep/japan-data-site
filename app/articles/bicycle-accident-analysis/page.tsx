import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import RakutenGifts from "@/components/RakutenGifts";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { DENSITY_EDGES, densityLabel, getDerivedData } from "@/lib/accidentDerived";
import { ACCIDENT_YEAR_LABEL, SOURCE_NOTE } from "@/lib/trafficAccident";
import { describeCorrelation, median, pearson } from "@/lib/rankingAnalysis";

/** 楽天ブロックの取得に失敗しても、6時間以内に自動で再生成されるようにする */
export const revalidate = 21600;

export const metadata = {
  alternates: { canonical: "/articles/bicycle-accident-analysis" },
  title:
    "自転車が関わる事故の割合が高い街はどこ？人身事故のうち自転車が絡む割合を、人口密度と合わせて調べた",
  description:
    "人身事故のうち、自転車が関わる事故の割合を市区町村別に計算しました。警察庁の事故データ(令和7年)と人口密度を組み合わせた独自の加工データで、自転車事故が多い街の特徴を調べます。",
};

const MIN_ACCIDENTS = 100;

const describeCorr = (r: number, what: string) =>
  describeCorrelation(r)
    .replace("人口が多い自治体ほど値が大きい", `${what}が高い自治体ほど割合が大きい`)
    .replace("人口が多い自治体ほど値が小さい", `${what}が高い自治体ほど割合が小さい`);

export default function Page() {
  const { rows: all } = getDerivedData();

  const rows = all
    .filter((r) => r.accidents >= MIN_ACCIDENTS)
    .map((r) => ({ ...r, share: (r.bicycleAccidents / r.accidents) * 100 }));
  if (rows.length < 50) return null;

  const totalAcc = all.reduce((s, r) => s + r.accidents, 0);
  const totalBike = all.reduce((s, r) => s + r.bicycleAccidents, 0);
  const nationalShare = totalAcc > 0 ? (totalBike / totalAcc) * 100 : 0;
  const medianShare = median(rows.map((r) => r.share));

  const withDensity = rows.filter((r) => r.density != null && r.density > 0);
  const withAging = rows.filter((r) => r.aging != null);

  const corrDensity = pearson(
    withDensity.map((r) => Math.log10(r.density as number)),
    withDensity.map((r) => r.share)
  );
  const corrAging = pearson(
    withAging.map((r) => r.aging as number),
    withAging.map((r) => r.share)
  );

  const bins = DENSITY_EDGES.slice(0, -1)
    .map((lo, i) => {
      const hi = DENSITY_EDGES[i + 1];
      const list = withDensity.filter((r) => (r.density as number) >= lo && (r.density as number) < hi);
      return {
        label: densityLabel(lo, hi),
        count: list.length,
        med: list.length ? median(list.map((r) => r.share)) : NaN,
      };
    })
    .filter((b) => b.count >= 5);
  const lowBin = bins[0];
  const highBin = bins[bins.length - 1];

  const sorted = [...rows].sort((a, b) => b.share - a.share);
  const top10 = sorted.slice(0, 10);
  const low5 = sorted.slice(-5).reverse();

  const faq = [
    {
      q: "自転車が関わる事故とは、どういう事故ですか？",
      a: "この記事では、事故の当事者(第1当事者または第2当事者)のどちらかが自転車(電動アシスト自転車を含む)だった人身事故を数えています。自転車が車にぶつけられた事故も、自転車が歩行者にぶつかった事故も含みます。",
    },
    {
      q: "全国では、人身事故の何%に自転車が関わっていますか？",
      a: `${ACCIDENT_YEAR_LABEL}は、人身事故${totalAcc.toLocaleString()}件のうち、自転車が関わった事故が${totalBike.toLocaleString()}件で、約${nationalShare.toFixed(1)}%です。`,
    },
    {
      q: "自転車が関わる事故の割合が最も高い自治体は、どこですか？",
      a: `人身事故が${MIN_ACCIDENTS}件以上の自治体では${top10[0].name}で、人身事故${top10[0].accidents.toLocaleString()}件のうち${top10[0].bicycleAccidents.toLocaleString()}件(${top10[0].share.toFixed(1)}%)に自転車が関わっています。`,
    },
    {
      q: "人口密度が高い街ほど、自転車の事故の割合も高いですか？",
      a:
        corrDensity != null
          ? `このデータでは、人口密度(対数)と、自転車が関わる事故の割合の相関係数は${corrDensity.toFixed(2)}で、${describeCorr(corrDensity, "人口密度")}。ただし、市区町村ごとの傾向であり、自転車の利用の多さなどの違いも影響していると考えられます。`
          : "相関を計算できませんでした。",
    },
  ];

  return (
    <ArticleLayout
      title="自転車が関わる事故の割合が高い街はどこ？人身事故のうち自転車が絡む割合を、人口密度と合わせて調べた"
      summary={`令和7年の人身事故のうち、自転車が関わった事故は約${nationalShare.toFixed(1)}%です。市区町村別では${top10[0].name}(${top10[0].share.toFixed(1)}%)が最も高く、人口密度との関係も調べました。`}
      heroLabel="人身事故のうち自転車が関わる割合(全国)"
      heroValue={`約${nationalShare.toFixed(1)}%`}
      rankingLink="/ranking/traffic-accident-city"
      path="/articles/bicycle-accident-analysis"
      tags={["geography"]}
      publishedAt="2026-10-05"
      dataNote="警察庁の交通事故統計オープンデータ(令和7年)×国勢調査の人口密度"
      top3={top10.slice(0, 3).map((r, i) => ({
        rank: i + 1,
        name: r.name,
        value: `${r.share.toFixed(1)}%`,
      }))}
    >
      <p style={prNote}>
        ※本記事には広告(PR)が含まれます。広告を経由して購入された場合、
        当サイトが報酬を受け取ることがあります。データの分析内容は、広告主の
        意向とは関係ありません。
      </p>

      <div style={box}>
        <h2>結論:人身事故の約{nationalShare.toFixed(1)}%に、自転車が関わっている</h2>

        <p>
          {ACCIDENT_YEAR_LABEL}の人身事故{totalAcc.toLocaleString()}件のうち、当事者に自転車が
          含まれる事故は{totalBike.toLocaleString()}件(<strong>約{nationalShare.toFixed(1)}%</strong>)でした。
          人身事故が{MIN_ACCIDENTS}件以上の{rows.length.toLocaleString()}市区町村で見ると、
          割合の中央値は{medianShare.toFixed(1)}%で、最も高い{top10[0].name}は
          {top10[0].share.toFixed(1)}%です。
        </p>

        <p style={note}>
          自転車が関わる事故は、自転車が被害者になる事故と、加害側になる事故の両方を含みます。
          件数が少ない自治体では、数件の違いで割合が大きく動くため、人身事故が{MIN_ACCIDENTS}件
          未満の自治体は除いています。
        </p>
      </div>

      <div style={box}>
        <h2>人口密度で比べると</h2>

        {bins.length >= 2 && (
          <>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>人口密度</th>
                  <th style={thNum}>自治体数</th>
                  <th style={thNum}>自転車が関わる事故の割合(中央値)</th>
                </tr>
              </thead>
              <tbody>
                {bins.map((b) => (
                  <tr key={b.label}>
                    <td style={td}>{b.label}</td>
                    <td style={tdNum}>{b.count.toLocaleString()}</td>
                    <td style={tdNum}>{b.med.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: 14 }}>
              人口密度が{lowBin.label}の自治体では割合の中央値が{lowBin.med.toFixed(1)}%、
              {highBin.label}の自治体では{highBin.med.toFixed(1)}%でした。
              {corrDensity != null
                ? `人口密度(対数)との相関係数は${corrDensity.toFixed(2)}で、${describeCorr(corrDensity, "人口密度")}。`
                : ""}
            </p>
          </>
        )}

        <p style={note}>
          高齢化率との相関係数は
          {corrAging != null ? `${corrAging.toFixed(2)}(${describeCorr(corrAging, "高齢化率")})` : "計算できませんでした"}
          です。
        </p>
      </div>

      <div style={box}>
        <h2>自転車が関わる事故の割合が高い自治体 上位10(人身事故{MIN_ACCIDENTS}件以上)</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 520 }}>
            <thead>
              <tr>
                <th style={th}>自治体</th>
                <th style={thNum}>割合</th>
                <th style={thNum}>自転車が関わる事故</th>
                <th style={thNum}>人身事故</th>
                <th style={thNum}>人口密度(人/km²)</th>
              </tr>
            </thead>
            <tbody>
              {top10.map((r) => (
                <tr key={r.code}>
                  <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
                  <td style={tdNum}>{r.share.toFixed(1)}%</td>
                  <td style={tdNum}>{r.bicycleAccidents.toLocaleString()}件</td>
                  <td style={tdNum}>{r.accidents.toLocaleString()}件</td>
                  <td style={tdNum}>{r.density != null ? Math.round(r.density).toLocaleString() : "―"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 14 }}>
          反対に、割合が低い自治体は、{low5.map((r) => `${r.name}(${r.share.toFixed(1)}%)`).join("、")}
          などです。
        </p>
      </div>

      <div style={box}>
        <h2>自転車に乗るときに:備えておきたいこと</h2>

        <ul>
          <li>
            <strong>ヘルメットをかぶる。</strong>
            2023年4月から、自転車に乗るすべての人に、ヘルメットの着用が努力義務になっています。
            万一の事故のときに、頭を守る備えになります。
          </li>
          <li>
            <strong>夜間はライトをつける。</strong>
            自分が見えるだけでなく、周囲から気づかれやすくなります。
          </li>
          <li>
            <strong>交差点では、一時停止と安全確認を。</strong>
            見通しの悪い交差点では、車と自転車が出会い頭に衝突する事故が起きやすいとされています。
          </li>
        </ul>
      </div>

      <RakutenGifts
        keyword="自転車 ヘルメット"
        heading="自転車の安全に:ヘルメットを楽天市場で見る"
      />

      <div style={box}>
        <h2>この記事のデータについて(独自の加工)</h2>

        <ul>
          <li>
            <strong>元データ。</strong>
            警察庁「交通事故統計情報のオープンデータ」(令和7年・本票)の人身事故件数と、
            自転車が関わった事故の件数、国勢調査の人口密度(令和2年)・高齢化率です。
          </li>
          <li>
            <strong>加工。</strong>
            当事者A・Bのどちらかが「軽車両-自転車」または「軽車両-駆動補助機付自転車」の
            事故を数え、自治体ごとに人身事故の件数で割って、割合を求めました。政令指定都市の区は
            市に合算しています。
          </li>
          <li>
            <strong>限界。</strong>
            事故は発生した場所の自治体で数えます。自転車の利用者の数は含まれていないため、
            「自転車に乗る人1人あたりの事故のしやすさ」ではありません。
          </li>
        </ul>

        <p style={note}>{SOURCE_NOTE}。</p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：自転車の事故についてよくある質問</h2>

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
          令和7年の人身事故のうち、約{nationalShare.toFixed(1)}%に自転車が関わっていました。
          自治体ごとの割合は大きく異なり、人口密度などの地域の特徴と関係している可能性があります。
          自転車に乗るときは、ヘルメットの着用など、日ごろの備えを心がけましょう。
        </p>

        <p>
          <Link prefetch={false} href="/ranking/traffic-accident-city" style={link}>
            市区町村別 交通事故ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/fatal-accident-rate-analysis" style={link}>
            事故の致死率の分析
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/accident-daytime-population" style={link}>
            昼間人口あたりの事故の分析
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/density" style={link}>
            人口密度ランキング
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
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", marginTop: 12, fontSize: 14 };
const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
  whiteSpace: "nowrap",
};
const thNum: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f1f5f9" };
const tdNum: React.CSSProperties = { ...td, textAlign: "right" };
const note: React.CSSProperties = { fontSize: 13, color: "#6b7280", lineHeight: 1.8 };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
