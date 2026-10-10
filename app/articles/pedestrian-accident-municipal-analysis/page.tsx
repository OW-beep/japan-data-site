import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { DENSITY_EDGES, densityLabel, getDerivedData } from "@/lib/accidentDerived";
import { ACCIDENT_YEAR_LABEL, SOURCE_NOTE } from "@/lib/trafficAccident";
import { describeCorrelation, median, pearson } from "@/lib/rankingAnalysis";

export const metadata = {
  alternates: { canonical: "/articles/pedestrian-accident-municipal-analysis" },
  title:
    "歩行者が関わる事故の割合が高い街はどこ？人身事故のうち歩行者の事故の割合を、人口密度・高齢化率と合わせて調べた",
  description:
    "人身事故のうち、歩行者が関わる事故(人対車両)の割合を市区町村別に計算しました。警察庁の事故データ(令和7年)と国勢調査の人口密度・高齢化率を組み合わせた独自の加工データで、歩行者の事故が多い街の特徴を調べます。",
};

const MIN_ACCIDENTS = 100;

const describeCorr = (r: number, what: string) =>
  describeCorrelation(r)
    .replace("人口が多い自治体ほど値が大きい", `${what}が高い自治体ほど割合が大きい`)
    .replace("人口が多い自治体ほど値が小さい", `${what}が高い自治体ほど割合が小さい`);

export default function Page() {
  const { rows: all, popLabel } = getDerivedData();

  const rows = all
    .filter((r) => r.accidents >= MIN_ACCIDENTS)
    .map((r) => ({ ...r, share: (r.pedestrianAccidents / r.accidents) * 100 }));
  if (rows.length < 50) return null;

  const totalAcc = all.reduce((s, r) => s + r.accidents, 0);
  const totalPed = all.reduce((s, r) => s + r.pedestrianAccidents, 0);
  const nationalShare = totalAcc > 0 ? (totalPed / totalAcc) * 100 : 0;
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
      q: "「歩行者が関わる事故」とは、どういう事故ですか？",
      a: "この記事では、事故類型が「人対車両」の人身事故を数えています。歩行者と車両が当事者となった事故で、歩行者が被害者の場合も、歩行者側にも過失があった場合も含みます。",
    },
    {
      q: "全国では、人身事故の何%が歩行者の事故ですか？",
      a: `${ACCIDENT_YEAR_LABEL}は、人身事故${totalAcc.toLocaleString()}件のうち、人対車両の事故が${totalPed.toLocaleString()}件で、約${nationalShare.toFixed(1)}%です。`,
    },
    {
      q: "歩行者の事故の割合が最も高い自治体は、どこですか？",
      a: `人身事故が${MIN_ACCIDENTS}件以上の自治体では${top10[0].name}で、人身事故${top10[0].accidents.toLocaleString()}件のうち${top10[0].pedestrianAccidents.toLocaleString()}件(${top10[0].share.toFixed(1)}%)が歩行者の事故です。`,
    },
    {
      q: "人口密度が高い街ほど、歩行者の事故の割合も高いですか？",
      a:
        corrDensity != null
          ? `このデータでは、人口密度(対数)と、歩行者の事故の割合の相関係数は${corrDensity.toFixed(2)}で、${describeCorr(corrDensity, "人口密度")}。ただし、市区町村ごとの傾向であり、歩く人の多さなどの違いも影響していると考えられます。`
          : "相関を計算できませんでした。",
    },
  ];

  return (
    <ArticleLayout
      title="歩行者が関わる事故の割合が高い街はどこ？人身事故のうち歩行者の事故の割合を、人口密度・高齢化率と合わせて調べた"
      summary={`令和7年の人身事故のうち、歩行者が関わる事故は約${nationalShare.toFixed(1)}%です。市区町村別では${top10[0].name}(${top10[0].share.toFixed(1)}%)が最も高く、人口密度・高齢化率との関係も調べました。`}
      heroLabel="人身事故のうち歩行者が関わる割合(全国)"
      heroValue={`約${nationalShare.toFixed(1)}%`}
      rankingLink="/ranking/traffic-accident-city"
      path="/articles/pedestrian-accident-municipal-analysis"
      tags={["aging", "geography"]}
      publishedAt="2026-10-08"
      dataNote={`警察庁の交通事故統計オープンデータ(${ACCIDENT_YEAR_LABEL})×国勢調査の人口密度・高齢化率`}
      top3={top10.slice(0, 3).map((r, i) => ({
        rank: i + 1,
        name: r.name,
        value: `${r.share.toFixed(1)}%`,
      }))}
    >
      <div style={box}>
        <h2>結論:人身事故の約{nationalShare.toFixed(1)}%は、歩行者が関わる事故</h2>

        <p>
          {ACCIDENT_YEAR_LABEL}の人身事故{totalAcc.toLocaleString()}件のうち、歩行者が関わる事故
          (人対車両)は{totalPed.toLocaleString()}件(<strong>約{nationalShare.toFixed(1)}%</strong>)
          でした。人身事故が{MIN_ACCIDENTS}件以上の{rows.length.toLocaleString()}市区町村で見ると、
          割合の中央値は{medianShare.toFixed(1)}%で、最も高い{top10[0].name}は
          {top10[0].share.toFixed(1)}%です。
        </p>

        <p style={note}>
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
                  <th style={thNum}>歩行者の事故の割合(中央値)</th>
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
      </div>

      <div style={box}>
        <h2>高齢化率との関係</h2>

        <p>
          高齢化率({popLabel}の65歳以上人口の割合)と、歩行者の事故の割合を比べると、
          {corrAging != null
            ? `相関係数は${corrAging.toFixed(2)}で、${describeCorr(corrAging, "高齢化率")}。`
            : "相関を計算できませんでした。"}
          高齢化率が高い地域は、人口密度が低い地域と重なることが多いため、2つの影響を
          切り分けることは、このデータだけではできません。
        </p>
        <p style={note}>
          歩行者の事故で、高齢の歩行者が亡くなる割合が高いことは、
          <Link prefetch={false} href="/articles/pedestrian-accident-age-analysis" style={link}>
            年齢別の分析記事
          </Link>
          で確かめています。
        </p>
      </div>

      <div style={box}>
        <h2>歩行者の事故の割合が高い自治体 上位10(人身事故{MIN_ACCIDENTS}件以上)</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 520 }}>
            <thead>
              <tr>
                <th style={th}>自治体</th>
                <th style={thNum}>割合</th>
                <th style={thNum}>歩行者が関わる事故</th>
                <th style={thNum}>人身事故</th>
                <th style={thNum}>人口密度(人/km²)</th>
              </tr>
            </thead>
            <tbody>
              {top10.map((r) => (
                <tr key={r.code}>
                  <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
                  <td style={tdNum}>{r.share.toFixed(1)}%</td>
                  <td style={tdNum}>{r.pedestrianAccidents.toLocaleString()}件</td>
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
        <h2>この記事のデータについて(独自の加工)</h2>

        <ul>
          <li>
            <strong>元データ。</strong>
            警察庁「交通事故統計情報のオープンデータ」(令和7年・本票)の人身事故件数と、
            事故類型が「人対車両」の件数、国勢調査の人口密度(令和2年)・高齢化率です。
          </li>
          <li>
            <strong>加工。</strong>
            自治体ごとに、人対車両の事故の件数を人身事故の件数で割って、割合を求めました。
            政令指定都市の区は市に合算しています。
          </li>
          <li>
            <strong>限界。</strong>
            歩いている人の数は含まれていないため、「歩行者1人あたりの事故のしやすさ」では
            ありません。事故は発生した場所の自治体で数えます。
          </li>
        </ul>

        <p style={note}>{SOURCE_NOTE}。</p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：歩行者の事故についてよくある質問</h2>

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
          令和7年の人身事故のうち、約{nationalShare.toFixed(1)}%に歩行者が関わっていました。
          自治体ごとの割合は大きく異なり、人口密度などの地域の特徴と関係している可能性があります。
          歩く人が多い街では、運転する人も歩く人も、特に夕方から夜の安全に気を配ることが大切です。
        </p>

        <p>
          <Link prefetch={false} href="/ranking/traffic-accident-city" style={link}>
            市区町村別 交通事故ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/dusk-accident-analysis" style={link}>
            薄暮・夜の事故の分析
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/bicycle-accident-analysis" style={link}>
            自転車が関わる事故の割合
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
