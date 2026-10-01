import Link from "next/link";

import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import JsonLd from "@/components/JsonLd";
import CompareCTA from "@/components/CompareCTA";
import { getMunicipalities } from "@/lib/municipalities";
import { prefectureOf } from "@/lib/rankingAnalysis";

export const metadata = {
  alternates: { canonical: "/articles/prefectural-capital-population" },
  title:
    "県庁所在地が県内で一番大きい都市ではない県はどこ？県庁所在地の人口を全国で比較",
  description:
    "県庁所在地は、その県で最も人口が多い都市とは限りません。全国の県庁所在地の人口を、県内の最大都市や県全体に占める割合と比べ、「県庁所在地が最大都市ではない県」を国勢調査のデータから洗い出しました。",
};

/** 都道府県庁所在地(東京都は特別区が23の自治体に分かれるため対象外) */
const CAPITALS: [string, string][] = [
  ["北海道", "札幌市"],
  ["青森県", "青森市"],
  ["岩手県", "盛岡市"],
  ["宮城県", "仙台市"],
  ["秋田県", "秋田市"],
  ["山形県", "山形市"],
  ["福島県", "福島市"],
  ["茨城県", "水戸市"],
  ["栃木県", "宇都宮市"],
  ["群馬県", "前橋市"],
  ["埼玉県", "さいたま市"],
  ["千葉県", "千葉市"],
  ["神奈川県", "横浜市"],
  ["新潟県", "新潟市"],
  ["富山県", "富山市"],
  ["石川県", "金沢市"],
  ["福井県", "福井市"],
  ["山梨県", "甲府市"],
  ["長野県", "長野市"],
  ["岐阜県", "岐阜市"],
  ["静岡県", "静岡市"],
  ["愛知県", "名古屋市"],
  ["三重県", "津市"],
  ["滋賀県", "大津市"],
  ["京都府", "京都市"],
  ["大阪府", "大阪市"],
  ["兵庫県", "神戸市"],
  ["奈良県", "奈良市"],
  ["和歌山県", "和歌山市"],
  ["鳥取県", "鳥取市"],
  ["島根県", "松江市"],
  ["岡山県", "岡山市"],
  ["広島県", "広島市"],
  ["山口県", "山口市"],
  ["徳島県", "徳島市"],
  ["香川県", "高松市"],
  ["愛媛県", "松山市"],
  ["高知県", "高知市"],
  ["福岡県", "福岡市"],
  ["佐賀県", "佐賀市"],
  ["長崎県", "長崎市"],
  ["熊本県", "熊本市"],
  ["大分県", "大分市"],
  ["宮崎県", "宮崎市"],
  ["鹿児島県", "鹿児島市"],
  ["沖縄県", "那覇市"],
];

type Row = {
  pref: string;
  capital: string;
  capitalPop: number;
  largest: string;
  largestPop: number;
  prefPop: number;
  share: number; // 県庁所在地の人口が県全体に占める割合(%)
  isLargest: boolean;
};

export default function Page() {
  const all = getMunicipalities();

  const byPref = new Map<string, typeof all>();
  for (const c of all) {
    const p = prefectureOf(c.name);
    if (!byPref.has(p)) byPref.set(p, []);
    byPref.get(p)!.push(c);
  }

  const rows: Row[] = [];
  for (const [pref, cityName] of CAPITALS) {
    const list = byPref.get(pref);
    if (!list || list.length === 0) continue;
    const capital = list.find((c) => c.name === `${pref} ${cityName}`);
    if (!capital) continue;
    const largest = [...list].sort((a, b) => b.population - a.population)[0];
    const prefPop = list.reduce((s, c) => s + c.population, 0);
    rows.push({
      pref,
      capital: cityName,
      capitalPop: capital.population,
      largest: largest.name.split(" ").pop() ?? largest.name,
      largestPop: largest.population,
      prefPop,
      share: prefPop > 0 ? (capital.population / prefPop) * 100 : 0,
      isLargest: largest.code === capital.code,
    });
  }

  if (rows.length < 10) return null;

  const notLargest = rows
    .filter((r) => !r.isLargest)
    .sort((a, b) => b.largestPop / b.capitalPop - a.largestPop / a.capitalPop);
  const largestCount = rows.length - notLargest.length;

  const byCapitalPop = [...rows].sort((a, b) => b.capitalPop - a.capitalPop);
  const byShare = [...rows].sort((a, b) => b.share - a.share);
  const shareTop = byShare.slice(0, 5);
  const shareBottom = byShare.slice(-5).reverse();

  const medianShare = (() => {
    const s = byShare.map((r) => r.share).sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  })();

  const fmt = (n: number) => n.toLocaleString();
  const short = (r: Row) => r.capital;
  const notLargestNames = notLargest.map(
    (r) => `${r.pref}(${r.capital}より${r.largest}が大きい)`
  );

  const faq = [
    {
      q: "県庁所在地は、その県で一番人口が多い都市ですか？",
      a:
        notLargest.length > 0
          ? `多くの県ではそうですが、すべてではありません。このデータでは、調べた${rows.length}道府県のうち${largestCount}で県庁所在地が県内の最大都市で、${notLargest.length}では別の都市のほうが人口が多くなっています。`
          : `このデータでは、調べた${rows.length}道府県のすべてで、県庁所在地が県内で最も人口の多い自治体でした。`,
    },
    {
      q: "県庁所在地が県内で最大の都市ではないのは、どの県ですか？",
      a:
        notLargest.length > 0
          ? `${notLargestNames.join("、")}です。`
          : "このデータでは、該当する県はありません。",
    },
    {
      q: "県庁所在地の人口が県全体に占める割合が最も高いのはどこですか？",
      a: `${shareTop[0].pref}の${short(shareTop[0])}で、県の人口の約${shareTop[0].share.toFixed(1)}%を占めます。反対に最も低いのは${shareBottom[0].pref}の${short(shareBottom[0])}で、約${shareBottom[0].share.toFixed(1)}%です(中央値は約${medianShare.toFixed(1)}%)。`,
    },
    {
      q: "東京都が表に入っていないのはなぜですか？",
      a: "東京都の都庁所在地は新宿区ですが、特別区は23の自治体に分かれていて、「1つの県庁所在市」とは性質が異なります。比較の前提をそろえるため、この記事では東京都を除く道府県を対象にしています。",
    },
  ];

  return (
    <ArticleLayout
      title="県庁所在地が県内で一番大きい都市ではない県はどこ？県庁所在地の人口を全国で比較"
      summary={`県庁所在地の人口を、県内の最大都市や県全体に占める割合と比較しました。調べた${rows.length}道府県のうち、県庁所在地が県内の最大都市ではない県は${notLargest.length}あります。`}
      heroLabel="県庁所在地が県内最大の都市ではない県"
      heroValue={`${notLargest.length}県`}
      rankingLink="/ranking/population"
      path="/articles/prefectural-capital-population"
      tags={["population", "geography"]}
      publishedAt="2026-10-01"
      top3={byCapitalPop.slice(0, 3).map((r, i) => ({
        rank: i + 1,
        name: `${r.pref} ${r.capital}`,
        value: `${fmt(r.capitalPop)}人`,
      }))}
    >
      <div style={box}>
        <h2>結論:県庁所在地が「県内最大」とは限らない</h2>

        <p>
          国勢調査のデータで、{rows.length}道府県の県庁所在地と、県内で最も人口の多い
          自治体を比べました。
          {notLargest.length > 0 ? (
            <>
              県庁所在地が県内の最大都市だったのは<strong>{largestCount}</strong>
              道府県で、<strong>{notLargest.length}</strong>
              道府県では別の都市のほうが人口が多い結果でした。
            </>
          ) : (
            <>すべての道府県で、県庁所在地が県内の最大都市でした。</>
          )}
        </p>

        {notLargest.length > 0 && (
          <>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>県</th>
                  <th style={th}>県庁所在地</th>
                  <th style={thNum}>人口(人)</th>
                  <th style={th}>県内最大の都市</th>
                  <th style={thNum}>人口(人)</th>
                  <th style={thNum}>最大都市は県庁所在地の何倍</th>
                </tr>
              </thead>
              <tbody>
                {notLargest.map((r) => (
                  <tr key={r.pref}>
                    <td style={td}>{r.pref}</td>
                    <td style={td}>{r.capital}</td>
                    <td style={tdNum}>{fmt(r.capitalPop)}</td>
                    <td style={{ ...td, fontWeight: 700 }}>{r.largest}</td>
                    <td style={tdNum}>{fmt(r.largestPop)}</td>
                    <td style={tdNum}>
                      {(r.largestPop / r.capitalPop).toFixed(2)}倍
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={note}>
              東京都は、特別区が23の自治体に分かれているため対象外です。
              人口は令和2年国勢調査に基づきます。
            </p>
          </>
        )}
      </div>

      <div style={box}>
        <h2>県庁所在地の人口ランキング(上位10)</h2>

        <RankingBarChart
          items={byCapitalPop.slice(0, 10).map((r) => ({
            name: `${r.pref} ${r.capital}`,
            value: r.capitalPop,
            displayValue: `${fmt(r.capitalPop)}人`,
          }))}
        />

        <p style={{ marginTop: 16 }}>
          人口が最も多い県庁所在地は{byCapitalPop[0].capital}(
          {fmt(byCapitalPop[0].capitalPop)}人)、最も少ないのは
          {byCapitalPop[byCapitalPop.length - 1].capital}(
          {fmt(byCapitalPop[byCapitalPop.length - 1].capitalPop)}人)で、その差は約
          {(
            byCapitalPop[0].capitalPop /
            byCapitalPop[byCapitalPop.length - 1].capitalPop
          ).toFixed(0)}
          倍です。同じ「県庁所在地」でも、都市の規模には大きな開きがあります。
        </p>
      </div>

      <div style={box}>
        <h2>県庁所在地は、県の人口の何%を占めるか</h2>

        <p>
          県庁所在地の人口が県全体の人口に占める割合は、中央値で約
          {medianShare.toFixed(1)}%でした。割合が高いのは
          {shareTop
            .map((r) => `${r.pref}${short(r)}(${r.share.toFixed(1)}%)`)
            .join("、")}
          で、県の人口が県庁所在地に集中しています。反対に割合が低いのは
          {shareBottom
            .map((r) => `${r.pref}${short(r)}(${r.share.toFixed(1)}%)`)
            .join("、")}
          で、県内に人口が分散しています。
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 560 }}>
            <thead>
              <tr>
                <th style={th}>県</th>
                <th style={th}>県庁所在地</th>
                <th style={thNum}>人口(人)</th>
                <th style={thNum}>県の人口に占める割合</th>
                <th style={th}>県内最大か</th>
              </tr>
            </thead>
            <tbody>
              {byShare.map((r) => (
                <tr key={r.pref}>
                  <td style={td}>{r.pref}</td>
                  <td style={td}>{r.capital}</td>
                  <td style={tdNum}>{fmt(r.capitalPop)}</td>
                  <td style={tdNum}>{r.share.toFixed(1)}%</td>
                  <td style={td}>{r.isLargest ? "○" : "×"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={box}>
        <h2>なぜ県庁所在地が最大の都市にならないことがあるのか</h2>

        <p>
          県庁所在地は、明治初期の廃藩置県のころに、旧藩の城下町や交通の要所など、
          当時の行政上の事情で決まった例が多いとされています。その後、産業の発展や
          鉄道・港湾の整備、平成の大合併などを経て、都市ごとの人口の増え方には
          差が生まれました。県庁所在地ではない都市が、人口で上回るようになった県が
          あるのは、こうした経緯の結果と考えられます。
        </p>

        <p>
          ただし、この記事の数字は人口だけの比較です。県庁所在地は、行政機関や
          オフィスが集まる政治・行政の中心であり、人口が最大でなくても、県の
          中心としての役割を担っています。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A：県庁所在地の人口についてよくある質問</h2>

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
          県庁所在地が県内最大の都市だったのは、調べた{rows.length}道府県のうち
          {largestCount}です。県庁所在地の「顔」と人口の大きさは、必ずしも一致しません。
          県庁所在地の高低差(標高)に注目した記事もあわせてご覧ください。
        </p>

        <p>
          <Link prefetch={false} href="/articles/capital-elevation-analysis" style={link}>
            県庁所在地の標高ランキング分析
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/articles/million-cities" style={link}>
            100万人都市一覧
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/large-cities" style={link}>
            人口50万人以上の都市ランキング
          </Link>
          {" ｜ "}
          <Link prefetch={false} href="/ranking/population" style={link}>
            人口ランキング
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
