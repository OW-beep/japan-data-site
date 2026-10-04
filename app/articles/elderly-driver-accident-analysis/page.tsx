import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import RakutenGifts from "@/components/RakutenGifts";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getMunicipalities } from "@/lib/municipalities";
import {
  ACCIDENT_YEAR_LABEL,
  PREF_NAMES,
  SOURCE_NOTE,
  getAllAccidentRows,
} from "@/lib/trafficAccident";
import {
  POP2020_LABEL,
  POP2025_LABEL,
  getAgeGroups2025,
} from "@/lib/population2025";
import { describeCorrelation, median, pearson } from "@/lib/rankingAnalysis";

const MIN_ACCIDENTS = 100;

type Row = {
  name: string;
  accidents: number;
  elderly: number;
  share: number; // 75歳以上の運転者が第1当事者の事故の割合(%)
  aging: number; // 高齢化率(%)
};

function summarize() {
  const cities = getMunicipalities();
  const byCode = new Map(cities.map((c) => [c.code, c]));
  const all = getAllAccidentRows();

  // 高齢化率は、令和7年国勢調査(年齢まで取れている自治体が9割以上のとき)か、なければ令和2年
  const covered = all.filter((r) => getAgeGroups2025(r.code) != null).length;
  const use2025 = all.length > 0 && covered / all.length >= 0.9;
  const agingLabel = use2025 ? POP2025_LABEL : POP2020_LABEL;

  const totalAcc = all.reduce((s, r) => s + r.accidents, 0);
  const totalElderly = all.reduce((s, r) => s + r.elderlyDriverAccidents, 0);
  const nationalShare = totalAcc > 0 ? (totalElderly / totalAcc) * 100 : 0;

  const rows: Row[] = [];
  for (const r of all) {
    const c = byCode.get(r.code);
    if (!c || r.accidents < MIN_ACCIDENTS) continue;
    let aging: number | null = null;
    if (use2025) {
      const g = getAgeGroups2025(r.code);
      if (g && g.population > 0) aging = (g.elderly / g.population) * 100;
    }
    if (aging == null && c.population > 0 && c.elderlyPopulation != null) {
      aging = (c.elderlyPopulation / c.population) * 100;
    }
    if (aging == null) continue;
    rows.push({
      name: c.name,
      accidents: r.accidents,
      elderly: r.elderlyDriverAccidents,
      share: (r.elderlyDriverAccidents / r.accidents) * 100,
      aging,
    });
  }

  // 都道府県別(全市区町村の合算)
  const prefMap = new Map<string, { name: string; acc: number; el: number }>();
  for (const r of all) {
    const p = r.code.slice(0, 2);
    const cur = prefMap.get(p) ?? { name: PREF_NAMES[p] ?? p, acc: 0, el: 0 };
    cur.acc += r.accidents;
    cur.el += r.elderlyDriverAccidents;
    prefMap.set(p, cur);
  }
  const prefs = [...prefMap.values()]
    .filter((p) => p.acc > 0)
    .map((p) => ({ ...p, share: (p.el / p.acc) * 100 }))
    .sort((a, b) => b.share - a.share);

  return { rows, prefs, totalAcc, totalElderly, nationalShare, agingLabel, use2025 };
}

export function generateMetadata() {
  const s = summarize();
  return {
    alternates: { canonical: "/articles/elderly-driver-accident-analysis" },
    title: `高齢ドライバーの事故が多いのはどこ？75歳以上が第1当事者の事故は全国で${s.nationalShare.toFixed(1)}%、高齢化率との関係を調べた`,
    description: `警察庁の交通事故オープンデータ(令和7年)で、75歳以上の運転者が第1当事者の人身事故${s.totalElderly.toLocaleString()}件を分析。都道府県別・市区町村別の割合と、高齢化率との関係を調べました。`,
  };
}

export default function Page() {
  const s = summarize();
  const { rows, prefs } = s;
  if (rows.length < 30 || prefs.length < 10) return null;

  const top = [...rows].sort((a, b) => b.share - a.share);
  const top10 = top.slice(0, 10);
  const medianShare = median(rows.map((r) => r.share));

  const r = pearson(
    rows.map((x) => x.aging),
    rows.map((x) => x.share)
  );

  // 高齢化率の区分ごとの、事故割合の中央値
  const EDGES = [0, 25, 30, 35, 40, Infinity];
  const bins = EDGES.slice(0, -1)
    .map((lo, i) => {
      const hi = EDGES[i + 1];
      const list = rows.filter((x) => x.aging >= lo && x.aging < hi);
      const label =
        lo === 0 ? "25%未満" : hi === Infinity ? `${lo}%以上` : `${lo}%〜${hi}%未満`;
      return { label, count: list.length, med: list.length ? median(list.map((x) => x.share)) : NaN };
    })
    .filter((b) => b.count >= 5);
  const lowBin = bins[0];
  const highBin = bins[bins.length - 1];

  const prefTop = prefs.slice(0, 5);
  const prefBottom = prefs.slice(-5).reverse();
  const prefRatio = prefs[prefs.length - 1].share > 0 ? prefs[0].share / prefs[prefs.length - 1].share : null;

  const faq = [
    {
      q: "高齢ドライバーの事故は、全国でどれくらいありますか？",
      a: `${ACCIDENT_YEAR_LABEL}の人身事故${s.totalAcc.toLocaleString()}件のうち、75歳以上の運転者(原付以上の車両)が第1当事者だった事故は${s.totalElderly.toLocaleString()}件で、全体の約${s.nationalShare.toFixed(1)}%です。`,
    },
    {
      q: "第1当事者とは何ですか？",
      a: "交通事故の当事者のうち、過失が最も重いとされた人のことです(過失が同程度の場合は、人身損傷の程度が軽い人とされています)。第1当事者が75歳以上、という数え方なので、75歳以上の人が被害者になった事故は含みません。",
    },
    {
      q: "高齢ドライバーの事故の割合が最も高い都道府県はどこですか？",
      a: `${prefTop[0].name}で、約${prefTop[0].share.toFixed(1)}%です。反対に最も低いのは${prefs[prefs.length - 1].name}で、約${prefs[prefs.length - 1].share.toFixed(1)}%です。`,
    },
    {
      q: "高齢化率が高い自治体ほど、高齢ドライバーの事故の割合も高いですか？",
      a:
        r != null
          ? `このデータでは、高齢化率と、75歳以上の運転者が第1当事者の事故の割合の相関係数は${r.toFixed(2)}で、${describeCorrelation(r).replace("人口が多い自治体ほど値が大きい", "高齢化率が高い自治体ほど割合が大きい").replace("人口が多い自治体ほど値が小さい", "高齢化率が高い自治体ほど割合が小さい")}。ただし、人身事故が${MIN_ACCIDENTS}件以上の${rows.length}自治体の傾向であり、個々の自治体が当てはまるとは限りません。`
          : "相関を計算できませんでした。",
    },
  ];

  return (
    <ArticleLayout
      title={`高齢ドライバーの事故が多いのはどこ？75歳以上が第1当事者の事故は全国で${s.nationalShare.toFixed(1)}%、高齢化率との関係を調べた`}
      summary={`令和7年の人身事故のうち、75歳以上の運転者が第1当事者だった事故は${s.totalElderly.toLocaleString()}件(約${s.nationalShare.toFixed(1)}%)でした。都道府県別では${prefTop[0].name}(${prefTop[0].share.toFixed(1)}%)が最も高く、${prefs[prefs.length - 1].name}(${prefs[prefs.length - 1].share.toFixed(1)}%)が最も低くなっています。`}
      heroLabel="75歳以上が第1当事者の事故の割合(全国)"
      heroValue={`${s.nationalShare.toFixed(1)}%`}
      rankingLink="/ranking/traffic-accident-city"
      path="/articles/elderly-driver-accident-analysis"
      tags={["aging", "geography"]}
      publishedAt="2026-10-05"
      dataNote={`警察庁の交通事故統計オープンデータ(${ACCIDENT_YEAR_LABEL})、高齢化率は${s.agingLabel}`}
      top3={prefTop.slice(0, 3).map((p, i) => ({
        rank: i + 1,
        name: p.name,
        value: `${p.share.toFixed(1)}%`,
      }))}
    >
      <p style={prNote}>
        ※本記事には広告(PR)が含まれます。広告を経由して購入された場合、
        当サイトが報酬を受け取ることがあります。データの分析内容は、広告主の
        意向とは関係ありません。
      </p>

      <div style={box}>
        <h2>結論:75歳以上の運転者が第1当事者の事故は、全体の約{s.nationalShare.toFixed(1)}%</h2>

        <p>
          警察庁の交通事故統計オープンデータ({ACCIDENT_YEAR_LABEL}・本票)で、人身事故
          {s.totalAcc.toLocaleString()}件のうち、<strong>75歳以上の運転者が第1当事者</strong>
          だった事故は{s.totalElderly.toLocaleString()}件(約{s.nationalShare.toFixed(1)}%)でした。
          地域別に見ると差が大きく、都道府県別では最も高い{prefTop[0].name}
          ({prefTop[0].share.toFixed(1)}%)と最も低い{prefs[prefs.length - 1].name}
          ({prefs[prefs.length - 1].share.toFixed(1)}%)で、
          {prefRatio != null ? `約${prefRatio.toFixed(1)}倍` : "大きな"}の開きがあります。
        </p>

        <p style={note}>
          「第1当事者」は、事故の当事者のうち過失が最も重いとされた人です。ここでの
          「高齢ドライバー」は、原付以上の車両(乗用車・貨物車・二輪車など)を運転していた
          75歳以上の第1当事者を指します。自転車や歩行者は含みません。
        </p>
      </div>

      <div style={box}>
        <h2>都道府県別:高齢ドライバーが第1当事者の事故の割合</h2>

        <RankingBarChart
          items={prefTop.map((p) => ({
            name: p.name,
            value: p.share,
            displayValue: `${p.share.toFixed(1)}%`,
          }))}
        />

        <p style={{ marginTop: 16 }}>
          割合が高いのは、{prefTop.map((p) => `${p.name}(${p.share.toFixed(1)}%)`).join("、")}
          です。反対に低いのは、
          {prefBottom.map((p) => `${p.name}(${p.share.toFixed(1)}%)`).join("、")}
          でした。背景には、公共交通機関の整備状況や、車を運転する高齢者の割合の違いなどが
          考えられますが、このデータだけでは理由までは分かりません。
        </p>
      </div>

      <div style={box}>
        <h2>高齢化率との関係</h2>

        <p>
          人身事故が{MIN_ACCIDENTS}件以上の{rows.length}市区町村について、高齢化率
          ({s.agingLabel}の65歳以上人口の割合)と、高齢ドライバーが第1当事者の事故の割合を
          比べました。
          {r != null ? (
            <>
              相関係数は<strong>{r.toFixed(2)}</strong>で、
              {describeCorrelation(r)
                .replace("人口が多い自治体ほど値が大きい", "高齢化率が高い自治体ほど割合が大きい")
                .replace("人口が多い自治体ほど値が小さい", "高齢化率が高い自治体ほど割合が小さい")}
              。
            </>
          ) : null}
        </p>

        {bins.length >= 2 && (
          <>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>高齢化率</th>
                  <th style={thNum}>自治体数</th>
                  <th style={thNum}>事故の割合の中央値</th>
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
              高齢化率が{lowBin.label}の自治体では事故の割合の中央値が{lowBin.med.toFixed(1)}%、
              {highBin.label}の自治体では{highBin.med.toFixed(1)}%でした。
            </p>
          </>
        )}

        <p style={note}>
          この関係は、市区町村ごとの集計での傾向です。個人や個々の地域に当てはまるとは
          限りません。また、高齢化が進んだ地域は、車が生活に欠かせない地域であることが多く、
          高齢者の運転の機会そのものが多い可能性もあります。
        </p>
      </div>

      <div style={box}>
        <h2>市区町村別:割合が高い自治体(人身事故{MIN_ACCIDENTS}件以上)</h2>

        <ol>
          {top10.map((x) => (
            <li key={x.name}>
              {x.name}:{x.share.toFixed(1)}%(人身事故{x.accidents.toLocaleString()}件のうち
              {x.elderly.toLocaleString()}件)、高齢化率{x.aging.toFixed(1)}%
            </li>
          ))}
        </ol>

        <p style={note}>
          {rows.length}自治体の中央値は{medianShare.toFixed(1)}%です。件数が少ない自治体では、
          事故が数件増減するだけで割合が大きく動くため、人身事故が{MIN_ACCIDENTS}件
          未満の自治体は除いています。
        </p>
      </div>

      <div style={box}>
        <h2>データを読むときの注意点</h2>

        <ul>
          <li>
            事故の割合であり、「高齢ドライバー1人あたりの事故のしやすさ」ではありません。
            75歳以上の運転者の人数は、この集計に含まれていません。
          </li>
          <li>
            事故は発生した場所の自治体で数えています。観光地や幹線道路沿いでは、地域の
            住民以外の運転者の事故も含まれます。
          </li>
          <li>
            第1当事者でなかった高齢ドライバー(被害者側)の事故は、ここには含まれません。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>運転を続ける家族のために:できること</h2>

        <ul>
          <li>
            <strong>運転の様子を記録する。</strong>
            ドライブレコーダーがあると、事故のときの状況が分かるだけでなく、日ごろの
            運転を家族で振り返る材料にもなります。
          </li>
          <li>
            <strong>安全運転を支える装置を活用する。</strong>
            衝突被害軽減ブレーキなどを備えた車や、後付けの装置もあります。
          </li>
          <li>
            <strong>運転免許の自主返納も、選択肢の一つ。</strong>
            返納の手続きや、返納後の移動手段の支援は、お住まいの自治体や警察署に
            確認できます。
          </li>
        </ul>
      </div>

      <RakutenGifts
        keyword="ドライブレコーダー"
        heading="運転の記録に:ドライブレコーダーを楽天市場で見る"
      />

      <div style={box}>
        <h2>Q&amp;A：高齢ドライバーの事故についてよくある質問</h2>

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
          75歳以上の運転者が第1当事者の事故は、全体の約{s.nationalShare.toFixed(1)}%でした。
          地域差は大きく、{prefTop[0].name}({prefTop[0].share.toFixed(1)}%)から
          {prefs[prefs.length - 1].name}({prefs[prefs.length - 1].share.toFixed(1)}%)まで
          開きがあります。高齢化率との関係も、データで確かめました。大切なのは、
          数字を高齢の方への批判にするのではなく、運転を続ける人と家族が、無理なく
          安全に暮らせる方法を考えることです。
        </p>

        <p style={note}>
          {SOURCE_NOTE}。人身事故は、死者または負傷者が出た交通事故で、物損事故は含まれません。
        </p>

        <p>
          <Link prefetch={false} href="/ranking/traffic-accident-city" style={link}>
            市区町村別 交通事故ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/aging" style={link}>
            高齢化率ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/icy-road-accident-analysis" style={link}>
            雪道・凍結路の事故の分析
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/aging-top50" style={link}>
            高齢化率ランキングTOP50
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
