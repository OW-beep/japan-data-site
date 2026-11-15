import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import CrossInsight from "@/components/CrossInsight";
import { ARTICLE_CROSS } from "@/lib/articleCross";
import { getMunicipalities } from "@/lib/municipalities";
import { getTax, nationalIncomePerTaxpayer, TAX_META } from "@/lib/taxableIncome";
import { shortName, fullName } from "@/lib/crossAnalysis";

export const metadata = {
  alternates: { canonical: "/articles/municipal-income-analysis" },
  title: "所得が高い市区町村ランキング【令和7年度】納税義務者1人あたり課税対象所得",
  description:
    "全国の市区町村の、納税義務者1人あたりの課税対象所得を、令和7年度の課税データで分析。所得が高い街・低い街、町村で所得が高い街の中身、高齢化や軽自動車の台数との関係を、データで読み解きます。",
};

const PATH = "/articles/municipal-income-analysis";

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const man = (v: number) => `${Math.round(v).toLocaleString("ja-JP")}万円`;

export default function Page() {
  const rows = getMunicipalities()
    .filter((c) => c.population >= 3000)
    .map((c) => ({ c, t: getTax(c.code) }))
    .filter((r): r is { c: (typeof r)["c"]; t: NonNullable<(typeof r)["t"]> } => r.t != null && r.t.all > 0 && r.t.ti > 0)
    .map(({ c, t }) => ({
      aging: c.elderlyPopulation != null && c.population > 0 ? (c.elderlyPopulation / c.population) * 100 : null,
      code: c.code,
      name: c.name,
      pop: c.population,
      tp: t.tp,
      income: t.incomePerTaxpayer,
      farm: (t.farm / t.all) * 100,
      biz: (t.biz / t.all) * 100,
      stock: (t.st / t.ti) * 100,
    }));

  const national = nationalIncomePerTaxpayer();
  const sorted = [...rows].sort((a, b) => b.income - a.income);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  const top20 = sorted.slice(0, 20);
  const bottom20 = sorted.slice(-20).reverse();
  const above = rows.filter((r) => r.income > national).length;
  const tokyoInTop20 = top20.filter((r) => r.name.startsWith("東京都")).length;
  const nonTokyoTop20 = top20.filter((r) => !r.name.startsWith("東京都")).map((r) => shortName(r.name));
  const agingMedian = median(rows.map((r) => r.aging).filter((v): v is number => v != null));
  const bottomAging = bottom20.map((r) => r.aging).filter((v): v is number => v != null);
  const bottomAgingAvg = bottomAging.length ? bottomAging.reduce((a, b) => a + b, 0) / bottomAging.length : 0;
  const bottomTownVillage = bottom20.filter((r) => /[町村]$/.test(shortName(r.name))).length;
  const over2x = rows.filter((r) => r.income >= national * 2).length;

  // 町村の上位
  const isTownVillage = (name: string) => /[町村]$/.test(shortName(name));
  const villages = sorted.filter((r) => isTownVillage(r.name)).slice(0, 8);
  const vFarm = villages.reduce((a, b) => (b.farm > a.farm ? b : a));
  const vStock = villages.reduce((a, b) => (b.stock > a.stock ? b : a));

  // 都道府県別(市区町村の中央値)
  const prefMap = new Map<string, number[]>();
  for (const r of rows) {
    const pref = r.name.trim().split(/\s+/)[0];
    prefMap.set(pref, [...(prefMap.get(pref) ?? []), r.income]);
  }
  const prefMed = [...prefMap.entries()]
    .filter(([, v]) => v.length >= 5)
    .map(([k, v]) => ({ pref: k, med: median(v), n: v.length }))
    .sort((a, b) => b.med - a.med);

  const list = (xs: typeof rows, key: "farm" | "biz" | "stock", n = 5) =>
    [...xs].sort((a, b) => b[key] - a[key]).slice(0, n);

  const Table = ({ items, startRank, label }: { items: typeof rows; startRank: number; label: string }) => (
    <div style={{ overflowX: "auto" }}>
      <table style={table}>
        <caption style={{ textAlign: "left", fontWeight: 700, padding: "4px 0" }}>{label}</caption>
        <thead>
          <tr>
            <th style={th}>順位</th>
            <th style={thL}>市区町村</th>
            <th style={th}>1人あたり</th>
            <th style={th}>全国の合計の平均との比</th>
            <th style={th}>納税義務者数</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r, i) => (
            <tr key={r.code}>
              <td style={td}>{startRank + i}位</td>
              <td style={tdL}>
                <Link prefetch={false} href={`/city/${r.code}`} style={link}>
                  {fullName(r.name)}
                </Link>
              </td>
              <td style={td}>{man(r.income)}</td>
              <td style={td}>{((r.income / national) * 100).toFixed(0)}%</td>
              <td style={td}>{r.tp.toLocaleString()}人</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <ArticleLayout
      title={`所得が高い市区町村ランキング:1位${shortName(top.name)}は${man(top.income)}、全国平均の${(top.income / national).toFixed(1)}倍`}
      summary={`総務省の令和7年度の課税データで、全国${rows.length.toLocaleString()}の市区町村(人口3,000人以上)の、納税義務者1人あたりの課税対象所得を比べました。全国の合計では${national.toFixed(1)}万円。最も高い${shortName(top.name)}は${man(top.income)}、最も低い${shortName(bottom.name)}は${man(bottom.income)}で、約${(top.income / bottom.income).toFixed(1)}倍の差がありました。`}
      heroLabel={`1位 ${shortName(top.name)} の1人あたり課税対象所得`}
      heroValue={man(top.income)}
      path={PATH}
      rankingLink="/ranking/taxable-income"
      tags={["labor", "finance"]}
      publishedAt="2026-11-04"
      dataNote="令和7年度の課税は、令和6年中の所得にもとづきます。住民税は1月1日の住所の市町村で課税されるため、勤務地ではなく、住んでいる場所の統計です。"
      top3={top20.slice(0, 3).map((r, i) => ({ rank: i + 1, name: r.name, value: man(r.income) }))}
    >
      <div style={box}>
        <p style={lead}>
          「所得が高い街は、どこなのか」。この疑問に、総務省が公表する令和7年度の課税データで答えます。
          住民税(所得割)を納める人の、前年の所得の合計を、その人数で割ると、全国の合計では
          <strong>{national.toFixed(1)}万円</strong>です。人口3,000人以上の{rows.length.toLocaleString()}市区町村のうち、この額を上回るのは
          {above.toLocaleString()}市区町村にとどまり、全体の{((above / rows.length) * 100).toFixed(0)}%です。
          最も高い{fullName(top.name)}は{man(top.income)}、最も低い{fullName(bottom.name)}は{man(bottom.income)}で、
          約{(top.income / bottom.income).toFixed(1)}倍の差があります。上位20のうち、{tokyoInTop20}自治体は東京都です。町村にも、
          所得が高い街があり、その中身は、街ごとに違いました。
        </p>
      </div>

      <div style={box}>
        <h2>この「所得」は、年収ではありません</h2>
        <ul style={ul}>
          <li>
            <strong>収入ではなく、所得です。</strong>収入から必要経費などを引いた金額で、所得控除(基礎控除など)の前の額です。
            給与の場合は、給与収入から、給与所得控除を引いた金額にあたります。年収より、低い数字になります。
          </li>
          <li>
            <strong>住んでいる場所の統計です。</strong>住民税は、1月1日に住んでいる市町村で課税されます。勤務地で集計する賃金の統計とは、
            順位が違います。都道府県単位の賃金の比較は、
            <Link prefetch={false} href="/articles/prefecture-income-analysis" style={link}>
              都道府県別の平均年収の記事
            </Link>
            をご覧ください。
          </li>
          <li>
            <strong>住民全員の平均ではありません。</strong>住民税の所得割を納める人の平均です。含まれるのは、
            総所得金額等のほか、分離課税の譲渡所得、株式等の譲渡所得・配当所得などです。
          </li>
          <li>
            <strong>平均は、少数の高い所得に引き上げられます。</strong>特に、人口が少ない町村では、少数の人の所得が、平均を大きく動かします。
            このため、この記事は、人口3,000人以上の市区町村を対象にしています。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>所得が高い市区町村 上位20</h2>
        <RankingBarChart
          items={top20.slice(0, 10).map((r) => ({
            name: fullName(r.name),
            value: r.income,
            displayValue: man(r.income),
          }))}
          barColor="#1d4ed8"
        />
        <p style={{ margin: "16px 0", color: "#4b5563" }}>
          上位10は、{top20.slice(0, 10).map((r) => shortName(r.name)).join("、")}の順です(令和7年度)。
          上位20のうち、東京都は{tokyoInTop20}自治体、東京都以外では、{nonTokyoTop20.join("、") || "ありません"}が入っています。
          全国の合計の平均の2倍以上になるのは、{over2x}市区町村です。
        </p>
        <Table items={top20} startRank={1} label="納税義務者1人あたり課税対象所得 上位20(人口3,000人以上)" />
      </div>

      <div style={box}>
        <h2>所得が低い市区町村 下位20</h2>
        <p style={{ margin: "0 0 12px", color: "#4b5563" }}>
          最も低いのは{fullName(bottom.name)}の{man(bottom.income)}で、全国の合計の平均の{((bottom.income / national) * 100).toFixed(0)}%です。
          下位20のうち、{bottomTownVillage}自治体は町村で、高齢化率の平均は{bottomAgingAvg.toFixed(1)}%です(対象全体の中央値は{agingMedian.toFixed(1)}%)。
          所得が低いことは、そのまま暮らしの苦しさを意味しません。生活費(家賃など)が低いことも、考えに入れる必要があります。
        </p>
        <Table items={bottom20} startRank={rows.length - 19} label="納税義務者1人あたり課税対象所得 下位20(人口3,000人以上)" />
      </div>

      <div style={box}>
        <h2>町村で所得が高い街は、中身が違う</h2>
        <p style={{ margin: "0 0 12px", color: "#4b5563" }}>
          人口3,000人以上の町村で、所得が高い上位8を、所得の中身とあわせて見ます。
          下の表で、農業所得者の割合が最も高いのは{shortName(vFarm.name)}({vFarm.farm.toFixed(1)}%)、
          株式等の所得が課税対象所得に占める割合が最も高いのは{shortName(vStock.name)}({vStock.stock.toFixed(1)}%)です。
          同じ「所得が高い町村」でも、所得の源は、街によって違うことが分かります。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={thL}>町村</th>
                <th style={th}>1人あたり</th>
                <th style={th}>農業所得者の割合</th>
                <th style={th}>営業等所得者の割合</th>
                <th style={th}>株式等の所得の割合</th>
                <th style={th}>納税義務者数</th>
              </tr>
            </thead>
            <tbody>
              {villages.map((r) => (
                <tr key={r.code}>
                  <td style={tdL}>
                    <Link prefetch={false} href={`/city/${r.code}`} style={link}>
                      {fullName(r.name)}
                    </Link>
                  </td>
                  <td style={td}>{man(r.income)}</td>
                  <td style={td}>{r.farm.toFixed(1)}%</td>
                  <td style={td}>{r.biz.toFixed(1)}%</td>
                  <td style={td}>{r.stock.toFixed(1)}%</td>
                  <td style={td}>{r.tp.toLocaleString()}人</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 14, color: "#6b7280" }}>
          農業所得者・営業等所得者の割合は、住民税の納税義務者(均等割を納める者)に占める割合です。株式等の所得は、一般株式等と
          上場株式等の譲渡所得、上場株式等の配当所得の合計です。人口が少ない町村では、少数の人の所得が、割合を大きく動かします。
        </p>
      </div>

      <div style={box}>
        <h2>都道府県で比べると</h2>
        <p style={{ margin: "0 0 12px", color: "#4b5563" }}>
          市区町村の1人あたり所得の中央値を、都道府県ごとに出すと、最も高いのは{prefMed[0].pref}({man(prefMed[0].med)})、
          最も低いのは{prefMed[prefMed.length - 1].pref}({man(prefMed[prefMed.length - 1].med)})で、
          約{(prefMed[0].med / prefMed[prefMed.length - 1].med).toFixed(1)}倍の差です。
          上位は{prefMed.slice(0, 5).map((p) => `${p.pref}(${man(p.med)})`).join("、")}、
          下位は{prefMed.slice(-5).reverse().map((p) => `${p.pref}(${man(p.med)})`).join("、")}でした。
          (市区町村が5つ以上ある都道府県が対象)
        </p>
      </div>

      <div style={box}>
        <h2>所得の中身を見ると</h2>
        <p style={{ margin: "0 0 10px", color: "#4b5563" }}>
          住民税の納税義務者は、給与所得者、営業等(自営業など)の所得者、農業所得者などに分けて集計されています。
          それぞれの割合が高い街を見ると、産業の違いが見えてきます。ただし、人口が少ない町村では、少数の人で割合が大きく動きます。
        </p>
        <ul style={ul}>
          <li>
            <strong>農業所得者の割合が高い</strong>:
            {list(rows, "farm").map((r, i) => `${i > 0 ? "、" : ""}${shortName(r.name)}(${r.farm.toFixed(1)}%)`).join("")}
          </li>
          <li>
            <strong>営業等(自営業など)の所得者の割合が高い</strong>:
            {list(rows, "biz").map((r, i) => `${i > 0 ? "、" : ""}${shortName(r.name)}(${r.biz.toFixed(1)}%)`).join("")}
          </li>
          <li>
            <strong>株式等の所得の割合が高い</strong>:
            {list(rows, "stock").map((r, i) => `${i > 0 ? "、" : ""}${shortName(r.name)}(${r.stock.toFixed(1)}%)`).join("")}
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>所得を、ほかのデータと重ねる</h2>
        <p style={{ margin: "0 0 4px", color: "#4b5563" }}>
          所得の高さは、街の姿のどこと結びついているのか。まず、高齢化率と重ねます。次の「意外な発見」では、軽自動車の台数と重ねます。
        </p>
      </div>

      <CrossInsight
        slug="municipal-income-analysis-aging"
        cfg={{
          x: "aging",
          y: "income",
          question: "高齢化が進んだ街は、所得が低い?",
          how: "親の住む街や、自分が将来住む街を考えるとき、高齢化率が高い街の中でも、所得が高い赤の街と、低い橙の街があります。所得は、生活費や家賃とあわせて見てください。",
        }}
      />

      <CrossInsight slug="municipal-income-analysis-keicar" cfg={ARTICLE_CROSS["municipal-income-analysis"]} />

      <div style={box}>
        <h2>まとめ</h2>
        <p style={{ margin: 0 }}>
          令和7年度の課税データでは、納税義務者1人あたりの課税対象所得は、全国の合計で{national.toFixed(1)}万円。{fullName(top.name)}の
          {man(top.income)}から、{fullName(bottom.name)}の{man(bottom.income)}まで、約{(top.income / bottom.income).toFixed(1)}倍の差があります。
          所得が高い街は、東京都心の区が中心ですが、町村にも、農業や株式等の所得など、中身の違う高所得の街があります。
          この数字は、住んでいる場所の統計で、年収ではなく所得、住民全員の平均でもありません。自分の街の位置は、
          <Link prefetch={false} href="/search" style={link}>
            市区町村検索
          </Link>
          で、ほかの街との比較は、
          <Link prefetch={false} href="/compare" style={link}>
            自治体比較ツール
          </Link>
          で確認できます。出典:
          <a href={TAX_META.url} target="_blank" rel="noopener noreferrer" style={link}>
            総務省「市町村税課税状況等の調」令和7年度(外部サイト)
          </a>
          。
        </p>
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
const lead: React.CSSProperties = { fontSize: 16, color: "#374151", margin: 0, lineHeight: 1.9 };
const ul: React.CSSProperties = { margin: 0, paddingLeft: 22, lineHeight: 1.9, color: "#374151" };
const table: React.CSSProperties = { borderCollapse: "collapse", width: "100%", minWidth: 520, fontSize: 14 };
const th: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e5e7eb", background: "#f8fafc", fontWeight: 700, textAlign: "right" };
const thL: React.CSSProperties = { ...th, textAlign: "left" };
const td: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e5e7eb", textAlign: "right", whiteSpace: "nowrap" };
const tdL: React.CSSProperties = { ...td, textAlign: "left", fontWeight: 700 };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
