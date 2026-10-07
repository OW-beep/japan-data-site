import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { DENSITY_EDGES, densityLabel, getDerivedData } from "@/lib/accidentDerived";
import { ACCIDENT_YEAR_LABEL, SOURCE_NOTE } from "@/lib/trafficAccident";
import { describeCorrelation, median, pearson } from "@/lib/rankingAnalysis";

export const metadata = {
  alternates: { canonical: "/articles/fatal-accident-rate-analysis" },
  title:
    "交通事故が多い街ほど、死亡事故になりにくい？人身事故のうち死亡事故になる割合を市区町村別に調べた",
  description:
    "人身事故の件数が多い自治体と、事故が重大になりやすい自治体は、同じではありません。警察庁の事故データ(令和7年)から、死亡事故になる割合(致死率)を市区町村別に計算し、人口密度・高齢化率との関係を調べました。",
};

const MIN_ACCIDENTS = 100;

const describeCorr = (r: number, what: string, adj = "が高い") =>
  describeCorrelation(r)
    .replace("人口が多い自治体ほど値が大きい", `${what}${adj}自治体ほど割合が大きい`)
    .replace("人口が多い自治体ほど値が小さい", `${what}${adj}自治体ほど割合が小さい`);

export default function Page() {
  const { rows: all, popLabel } = getDerivedData();

  const rows = all
    .filter((r) => r.accidents >= MIN_ACCIDENTS)
    .map((r) => ({
      ...r,
      fatalRate: (r.fatalAccidents / r.accidents) * 100,
    }));
  if (rows.length < 50) return null;

  const totalAcc = all.reduce((s, r) => s + r.accidents, 0);
  const totalFatal = all.reduce((s, r) => s + r.fatalAccidents, 0);
  const nationalRate = totalAcc > 0 ? (totalFatal / totalAcc) * 100 : 0;
  const medianRate = median(rows.map((r) => r.fatalRate));

  const withDensity = rows.filter((r) => r.density != null && r.density > 0);
  const withAging = rows.filter((r) => r.aging != null);

  const corrDensity = pearson(
    withDensity.map((r) => Math.log10(r.density as number)),
    withDensity.map((r) => r.fatalRate)
  );
  const corrAging = pearson(
    withAging.map((r) => r.aging as number),
    withAging.map((r) => r.fatalRate)
  );
  const corrVolume = pearson(
    rows.map((r) => Math.log10(r.accidents)),
    rows.map((r) => r.fatalRate)
  );

  // 人口密度の区分ごとの致死率の中央値
  const bins = DENSITY_EDGES.slice(0, -1)
    .map((lo, i) => {
      const hi = DENSITY_EDGES[i + 1];
      const list = withDensity.filter((r) => (r.density as number) >= lo && (r.density as number) < hi);
      return {
        label: densityLabel(lo, hi),
        count: list.length,
        med: list.length ? median(list.map((r) => r.fatalRate)) : NaN,
      };
    })
    .filter((b) => b.count >= 5);
  const lowBin = bins[0];
  const highBin = bins[bins.length - 1];

  const sorted = [...rows].sort((a, b) => b.fatalRate - a.fatalRate);
  const high10 = sorted.slice(0, 10);
  const low5 = sorted.slice(-5).reverse();

  const faq = [
    {
      q: "「死亡事故になる割合(致死率)」とは何ですか？",
      a: "人身事故(死者または負傷者が出た事故)のうち、事故から24時間以内に死者が出た「死亡事故」の割合です。この記事では、死亡事故の件数を人身事故の件数で割って求めています。",
    },
    {
      q: "全国では、人身事故のうち何%が死亡事故ですか？",
      a: `${ACCIDENT_YEAR_LABEL}は、人身事故${totalAcc.toLocaleString()}件のうち死亡事故が${totalFatal.toLocaleString()}件で、約${nationalRate.toFixed(2)}%です。`,
    },
    {
      q: "死亡事故になる割合が最も高い自治体は、どこですか？",
      a: `人身事故が${MIN_ACCIDENTS}件以上の自治体では${high10[0].name}で、人身事故${high10[0].accidents.toLocaleString()}件のうち${high10[0].fatalAccidents.toLocaleString()}件(${high10[0].fatalRate.toFixed(1)}%)が死亡事故でした。ただし、件数が少ない自治体では、数件の違いで割合が大きく動きます。`,
    },
    {
      q: "人口密度が低い自治体ほど、死亡事故になりやすいのですか？",
      a:
        corrDensity != null
          ? `このデータでは、人口密度(対数)と致死率の相関係数は${corrDensity.toFixed(2)}で、${describeCorr(corrDensity, "人口密度")}。ただし、市区町村ごとの傾向であり、速度や道路の種類など、ほかの条件の違いも影響していると考えられます。`
          : "相関を計算できませんでした。",
    },
  ];

  return (
    <ArticleLayout
      title="交通事故が多い街ほど、死亡事故になりにくい？人身事故のうち死亡事故になる割合を市区町村別に調べた"
      summary={`令和7年の人身事故のうち死亡事故になった割合は、全国で約${nationalRate.toFixed(2)}%です。市区町村別に見ると差が大きく、${high10[0].name}(${high10[0].fatalRate.toFixed(1)}%)のような自治体もあります。人口密度や高齢化率との関係を調べました。`}
      heroLabel="人身事故のうち死亡事故になる割合(全国)"
      heroValue={`約${nationalRate.toFixed(2)}%`}
      rankingLink="/ranking/traffic-accident-city"
      path="/articles/fatal-accident-rate-analysis"
      tags={["geography"]}
      publishedAt="2026-10-05"
      dataNote="警察庁の交通事故統計オープンデータ(令和7年)×国勢調査の人口密度・高齢化率"
      top3={high10.slice(0, 3).map((r, i) => ({
        rank: i + 1,
        name: r.name,
        value: `${r.fatalRate.toFixed(1)}%`,
      }))}
    >
      <div style={box}>
        <h2>結論:事故の「件数」と、事故が「重大になる割合」は別のものです</h2>

        <p>
          人身事故のうち、死亡事故になった割合(致死率)は、全国で<strong>約{nationalRate.toFixed(2)}%</strong>
          です。人身事故が{MIN_ACCIDENTS}件以上の{rows.length.toLocaleString()}市区町村で見ると、
          中央値は{medianRate.toFixed(2)}%でした。
          {corrVolume != null ? (
            <>
              事故の件数と致死率の相関係数は<strong>{corrVolume.toFixed(2)}</strong>で、
              {describeCorr(corrVolume, "事故の件数", "が多い")}。
            </>
          ) : null}
        </p>

        <p style={note}>
          致死率は、死亡事故の件数 ÷ 人身事故の件数です。件数が少ない自治体では、死亡事故が
          1件増えるだけで割合が大きく動くため、人身事故が{MIN_ACCIDENTS}件未満の自治体は除いています。
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
                  <th style={thNum}>致死率の中央値</th>
                </tr>
              </thead>
              <tbody>
                {bins.map((b) => (
                  <tr key={b.label}>
                    <td style={td}>{b.label}</td>
                    <td style={tdNum}>{b.count.toLocaleString()}</td>
                    <td style={tdNum}>{b.med.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: 14 }}>
              人口密度が{lowBin.label}の自治体では致死率の中央値が{lowBin.med.toFixed(2)}%、
              {highBin.label}の自治体では{highBin.med.toFixed(2)}%でした。
              {corrDensity != null
                ? `人口密度(対数)との相関係数は${corrDensity.toFixed(2)}で、${describeCorr(corrDensity, "人口密度")}。`
                : ""}
            </p>
          </>
        )}

        <p style={note}>
          一般に、市街地では速度が低く、事故が起きても死亡に至りにくい一方、郊外や地方では
          速度が高く、道路の事情も異なるとされています。ただし、このデータだけで原因は
          特定できません。
        </p>
      </div>

      <div style={box}>
        <h2>高齢化率との関係</h2>

        <p>
          高齢化率({popLabel}の65歳以上人口の割合)と致死率を比べると、
          {corrAging != null
            ? `相関係数は${corrAging.toFixed(2)}で、${describeCorr(corrAging, "高齢化率")}。`
            : "相関を計算できませんでした。"}
          高齢化率が高い自治体は、人口密度が低い自治体と重なることが多く、
          2つの関係を切り分けることは、このデータだけではできません。
        </p>
      </div>

      <div style={box}>
        <h2>致死率が高い自治体 上位10(人身事故{MIN_ACCIDENTS}件以上)</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 520 }}>
            <thead>
              <tr>
                <th style={th}>自治体</th>
                <th style={thNum}>致死率</th>
                <th style={thNum}>死亡事故</th>
                <th style={thNum}>人身事故</th>
                <th style={thNum}>人口密度(人/km²)</th>
              </tr>
            </thead>
            <tbody>
              {high10.map((r) => (
                <tr key={r.code}>
                  <td style={{ ...td, fontWeight: 600 }}>{r.name}</td>
                  <td style={tdNum}>{r.fatalRate.toFixed(1)}%</td>
                  <td style={tdNum}>{r.fatalAccidents.toLocaleString()}件</td>
                  <td style={tdNum}>{r.accidents.toLocaleString()}件</td>
                  <td style={tdNum}>{r.density != null ? Math.round(r.density).toLocaleString() : "―"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 14 }}>
          反対に、致死率が低い自治体は、{low5.map((r) => `${r.name}(${r.fatalRate.toFixed(2)}%)`).join("、")}
          などです。
        </p>
        <p style={note}>
          上位は、件数が{MIN_ACCIDENTS}件台の自治体が多く、死亡事故が数件増減するだけで順位が
          入れ替わります。順位の小さな差を、危険度の優劣と受け取らないでください。
        </p>
      </div>

      <div style={box}>
        <h2>この記事のデータについて(独自の加工)</h2>

        <ul>
          <li>
            <strong>元データ。</strong>
            警察庁「交通事故統計情報のオープンデータ」(令和7年・本票)の人身事故件数と
            死亡事故件数、国勢調査の人口密度({"令和2年"})・高齢化率({popLabel})です。
          </li>
          <li>
            <strong>加工。</strong>
            自治体ごとに、死亡事故の件数を人身事故の件数で割って致死率を求め、人口密度と
            高齢化率の区分ごとに中央値を比べました。政令指定都市の区は市に合算しています。
          </li>
          <li>
            <strong>限界。</strong>
            事故は発生した場所の自治体で数えており、通過する車の事故も含みます。
            道路の種類、速度、時間帯、車の種類など、致死率に影響する条件は、この集計には
            含まれていません。
          </li>
        </ul>

        <p style={note}>{SOURCE_NOTE}。</p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：事故の致死率についてよくある質問</h2>

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
          人身事故のうち死亡事故になる割合は、全国で約{nationalRate.toFixed(2)}%でした。
          事故の件数が多い自治体が、事故が重大になりやすい自治体とは限りません。
          事故の「件数」と「重大になる割合」は、別々に見る必要があります。
        </p>

        <p>
          <Link prefetch={false} href="/ranking/traffic-accident-city" style={link}>
            市区町村別 交通事故ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/icy-road-accident-analysis" style={link}>
            雪道・凍結路の事故の分析
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/elderly-driver-accident-analysis" style={link}>
            高齢ドライバーの事故の分析
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
