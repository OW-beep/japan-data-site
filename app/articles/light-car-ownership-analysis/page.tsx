import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import CrossInsight from "@/components/CrossInsight";
import { ARTICLE_CROSS } from "@/lib/articleCross";
import { getMunicipalities } from "@/lib/municipalities";
import { getTax, TAX_META } from "@/lib/taxableIncome";
import { analyzeCross, fullName, shortName } from "@/lib/crossAnalysis";

export const metadata = {
  alternates: { canonical: "/articles/light-car-ownership-analysis" },
  title: "軽自動車が多い街・少ない街ランキング【令和7年度】所得や人口密度との関係を分析",
  description:
    "全国の市区町村の、軽自動車(四輪乗用・自家用)の台数を、人口100人あたりで比較。多い街・少ない街、都道府県別の違い、所得・人口密度・高齢化との関係、軽自動車税の仕組みと、車が必要な街で暮らす人の備えを、令和7年度の課税データで読み解きます。",
};

const PATH = "/articles/light-car-ownership-analysis";

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const dai = (v: number) => `${v.toFixed(1)}台`;
const strength = (r: number) => (Math.abs(r) >= 0.6 ? "強く表れています" : Math.abs(r) >= 0.4 ? "はっきり見られます" : Math.abs(r) >= 0.2 ? "わずかにあります" : "ほとんど見られません");
/** 「Aが高い街ほど、軽自動車は多い/少ない」の形にする(相関の符号から) */
const trend = (a: string, r: number) => (Math.abs(r) < 0.2 ? `${a}と軽自動車の台数には、関係がほとんど見られません` : `${a}が高い街ほど、軽自動車は${r > 0 ? "多い" : "少ない"}傾向が${strength(r)}`);

export default function Page() {
  const rows = getMunicipalities()
    .filter((c) => c.population >= 3000)
    .map((c) => ({ c, t: getTax(c.code) }))
    .filter((r): r is { c: (typeof r)["c"]; t: NonNullable<(typeof r)["t"]> } => r.t != null)
    .map(({ c, t }) => ({ code: c.code, name: c.name, pop: c.population, kei: t.kei, per100: (t.kei / c.population) * 100 }));

  const sorted = [...rows].sort((a, b) => b.per100 - a.per100);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  const top20 = sorted.slice(0, 20);
  const bottom20 = sorted.slice(-20).reverse();
  const med = median(rows.map((r) => r.per100));
  const overall = (rows.reduce((s, r) => s + r.kei, 0) / rows.reduce((s, r) => s + r.pop, 0)) * 100;
  const okinawaTop20 = top20.filter((r) => r.name.startsWith("沖縄県")).length;
  const tokyoBottom20 = bottom20.filter((r) => r.name.startsWith("東京都")).length;
  const over10 = rows.filter((r) => r.per100 >= 10).length;
  const under1 = rows.filter((r) => r.per100 < 1).length;

  // 都道府県別(市区町村の中央値)
  const prefMap = new Map<string, number[]>();
  for (const r of rows) {
    const pref = r.name.trim().split(/\s+/)[0];
    prefMap.set(pref, [...(prefMap.get(pref) ?? []), r.per100]);
  }
  const prefMed = [...prefMap.entries()]
    .filter(([, v]) => v.length >= 5)
    .map(([k, v]) => ({ pref: k, med: median(v), n: v.length }))
    .sort((a, b) => b.med - a.med);
  const hokkaido = prefMed.find((p) => p.pref === "北海道");
  const hokkaidoBelow = (analyzeCross("density", "keiCar")?.below ?? []).filter((r) => r.name.startsWith("北海道"));

  // 他の指標との関係(相関係数)
  const rIncome = analyzeCross("income", "keiCar");
  const rDensity = analyzeCross("density", "keiCar");
  const rAging = analyzeCross("aging", "keiCar");
  const rFuture = analyzeCross("index2050", "keiCar");

  const rels = [
    { label: "所得", r: rIncome?.r, sentence: rIncome ? trend("所得(納税義務者1人あたり課税対象所得)", rIncome.r) : "" },
    { label: "人口密度", r: rDensity?.r, sentence: rDensity ? trend("人口密度", rDensity.r) : "" },
    { label: "2050年の推計人口", r: rFuture?.r, sentence: rFuture ? trend("2050年の推計人口(2020年=100)", rFuture.r) : "" },
    { label: "高齢化率", r: rAging?.r, sentence: rAging ? trend("高齢化率", rAging.r) : "" },
  ]
    .filter((x): x is { label: string; r: number; sentence: string } => x.r != null)
    .sort((a, b) => Math.abs(b.r) - Math.abs(a.r));

  const Table = ({ items, startRank, label }: { items: typeof rows; startRank: number; label: string }) => (
    <div style={{ overflowX: "auto" }}>
      <table style={table}>
        <caption style={{ textAlign: "left", fontWeight: 700, padding: "4px 0" }}>{label}</caption>
        <thead>
          <tr>
            <th style={th}>順位</th>
            <th style={thL}>市区町村</th>
            <th style={th}>人口100人あたり</th>
            <th style={th}>台数</th>
            <th style={th}>人口</th>
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
              <td style={td}>{dai(r.per100)}</td>
              <td style={td}>{r.kei.toLocaleString()}台</td>
              <td style={td}>{r.pop.toLocaleString()}人</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <ArticleLayout
      title={`軽自動車が多い街・少ない街:1位${shortName(top.name)}は人口100人あたり${top.per100.toFixed(1)}台、最下位${shortName(bottom.name)}は${bottom.per100.toFixed(1)}台`}
      summary={`総務省の令和7年度の課税データで、全国${rows.length.toLocaleString()}の市区町村(人口3,000人以上)の、軽自動車(四輪乗用・自家用)の台数を人口100人あたりで比べました。中央値は${med.toFixed(1)}台。最も多い${shortName(top.name)}は${top.per100.toFixed(1)}台、最も少ない${shortName(bottom.name)}は${bottom.per100.toFixed(1)}台です。所得との相関係数は${rIncome ? rIncome.r.toFixed(2) : "—"}です。`}
      heroLabel={`1位 ${shortName(top.name)} の軽自動車(人口100人あたり)`}
      heroValue={dai(top.per100)}
      path={PATH}
      rankingLink="/ranking/light-car"
      tags={["geography", "finance"]}
      publishedAt="2026-11-06"
      dataNote="令和7年度の軽自動車税の課税台数(令和7年4月1日現在)です。軽四輪の乗用・自家用だけで、普通車、軽貨物、営業用は含みません。"
      top3={top20.slice(0, 3).map((r, i) => ({ rank: i + 1, name: r.name, value: dai(r.per100) }))}
    >
      <div style={box}>
        <p style={lead}>
          軽自動車は、どんな街で多いのか。総務省の令和7年度の課税データで、軽自動車(四輪の乗用・自家用)の台数を、人口100人あたりで比べると、
          全国の中央値は<strong>{med.toFixed(1)}台</strong>です。最も多い{fullName(top.name)}は{dai(top.per100)}、最も少ない{fullName(bottom.name)}は
          {dai(bottom.per100)}で、{(top.per100 / bottom.per100).toFixed(0)}倍以上の差があります。上位20のうち、{okinawaTop20}自治体は沖縄県です。
          {rIncome && (
            <>
              {" "}
              他のデータと重ねると、<strong>{trend("所得", rIncome.r)}</strong>(相関係数は{rIncome.r.toFixed(2)})。
            </>
          )}
          ただし、軽自動車が多いことは、車の台数が多いことを意味しません。この記事では、数字の意味と、車が必要な街で暮らす人の備えまで、まとめます。
        </p>
      </div>

      <div style={box}>
        <h2>この数字は「車の台数」ではありません</h2>
        <ul style={ul}>
          <li>
            <strong>軽四輪の乗用・自家用だけです。</strong>軽自動車税の課税台数(令和7年4月1日現在)のうち、一般的な軽自動車(自家用の乗用)を数えています。
            普通車、軽トラックなどの軽貨物、営業用(緑ナンバー)は含みません。
          </li>
          <li>
            <strong>軽自動車が少ない=車が少ない、ではありません。</strong>普通車が多い地域は、数字が小さく出ます。
            この数字が示すのは、軽自動車がどれだけ普及しているかです。
          </li>
          <li>
            <strong>観光地では、レンタカーが含まれている可能性があります。</strong>
            人口あたりの数字で、沖縄県や奄美の観光地が上位に並ぶ点は、読むときに注意してください(確認できていないので、可能性として書いています)。
          </li>
          <li>
            <strong>人口が少ない町村は、少数の台数で値が動きます。</strong>このため、人口3,000人以上の市区町村を対象にしています。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>軽自動車が多い街 上位20</h2>
        <RankingBarChart
          items={top20.slice(0, 10).map((r) => ({ name: fullName(r.name), value: r.per100, displayValue: dai(r.per100) }))}
          barColor="#0e7490"
        />
        <p style={{ margin: "16px 0", color: "#4b5563" }}>
          上位10は、{top20.slice(0, 10).map((r) => shortName(r.name)).join("、")}の順です(令和7年度)。
          上位20のうち、沖縄県は{okinawaTop20}自治体で、沖縄県以外では、
          {top20.filter((r) => !r.name.startsWith("沖縄県")).map((r) => shortName(r.name)).join("、") || "ありません"}が入っています。
          人口100人あたり10台以上の自治体は、{over10}です。
        </p>
        <Table items={top20} startRank={1} label="軽自動車(四輪乗用・自家用)の台数 人口100人あたり 上位20(人口3,000人以上)" />
      </div>

      <div style={box}>
        <h2>軽自動車が少ない街 下位20</h2>
        <p style={{ margin: "0 0 12px", color: "#4b5563" }}>
          最も少ないのは{fullName(bottom.name)}の{dai(bottom.per100)}です。下位20のうち、{tokyoBottom20}自治体は東京都の区です。
          人口100人あたり1台に満たない自治体は、{under1}あります。下位の街は、電車やバスで暮らせる街で、車を持たない人が多い可能性があります。
          ただし、この数字だけでは、駐車場の事情なのか、公共交通の便なのかは分かりません。
        </p>
        <Table items={bottom20} startRank={rows.length - 19} label="軽自動車(四輪乗用・自家用)の台数 人口100人あたり 下位20(人口3,000人以上)" />
      </div>

      <div style={box}>
        <h2>都道府県で比べると:沖縄県が高く、北海道は低い</h2>
        <p style={{ margin: "0 0 12px", color: "#4b5563" }}>
          市区町村の中央値を都道府県ごとに出すと、最も高いのは{prefMed[0].pref}({dai(prefMed[0].med)})、最も低いのは
          {prefMed[prefMed.length - 1].pref}({dai(prefMed[prefMed.length - 1].med)})です。
          上位は{prefMed.slice(0, 5).map((p) => `${p.pref}(${dai(p.med)})`).join("、")}、
          下位は{prefMed.slice(-5).reverse().map((p) => `${p.pref}(${dai(p.med)})`).join("、")}でした
          (市区町村が5つ以上ある都道府県が対象)。
          {hokkaido && hokkaido.med < med && (
            <>
              {" "}
              意外なのは北海道で、{dai(hokkaido.med)}と、全国の中央値({dai(med)})より少なくなっています。広い地域で、車が欠かせない地域が多いはずですが、
              軽自動車は多くありません。寒冷地や長距離の移動といった地域の事情が影響している可能性があります(この数字からは、理由は分かりません)。
              {hokkaidoBelow.length >= 2 && (
                <>
                  実際、後ろの掛け合わせの図でも、人口密度が低いのに軽自動車が少ない(予想を大きく下回る)自治体として、
                  {hokkaidoBelow.map((r) => fullName(r.name)).join("、")}など、北海道の町が挙がっています。
                </>
              )}
            </>
          )}
        </p>
      </div>

      <div style={box}>
        <h2>軽自動車は、どんな街で多いのか</h2>
        <p style={{ margin: "0 0 10px", color: "#4b5563" }}>
          いくつかの指標と重ねて、関係の強さ(相関係数)を調べました。関係の強さは、{rels.map((x) => x.label).join("、")}の順でした。
          相関は、2つの値が一緒に動く傾向であって、原因を示すものではありません。
        </p>
        <ul style={ul}>
          {rels.map((x) => (
            <li key={x.label}>
              <strong>{x.label}</strong>:相関係数{x.r.toFixed(2)}。{x.sentence}。
              {x.label === "所得" && (
                <>
                  図と、所得の高い街・低い街の分析は、
                  <Link prefetch={false} href="/articles/municipal-income-analysis" style={link}>
                    所得の記事
                  </Link>
                  にあります。
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <CrossInsight
        slug="light-car-ownership-analysis-density"
        cfg={{
          x: "density",
          y: "keiCar",
          question: "人が密集する街ほど、軽自動車は少ない?",
          how: "電車やバスで暮らせる密度の街か、車が日常の足になる街かの、目安になります。引っ越し先を選ぶときは、自宅の近くの駅や、バスの本数も、地図や時刻表で確認してください。",
        }}
      />

      <CrossInsight slug="light-car-ownership-analysis-future" cfg={ARTICLE_CROSS["light-car-ownership-analysis"]} />

      <div style={box}>
        <h2>軽自動車の税金:軽自動車税(種別割)</h2>
        <p style={{ margin: "0 0 10px", color: "#4b5563" }}>
          軽自動車を持つと、毎年4月1日現在の所有者に、軽自動車税(種別割)がかかります。四輪の乗用・自家用の年額は、次のとおりです(標準の税率)。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={thL}>初度検査の時期</th>
                <th style={th}>年額</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdL}>平成27年(2015年)4月1日以降</td>
                <td style={td}>10,800円</td>
              </tr>
              <tr>
                <td style={tdL}>平成27年3月31日以前(旧税率)</td>
                <td style={td}>7,200円</td>
              </tr>
              <tr>
                <td style={tdL}>新車登録から13年を経過した車(重課)</td>
                <td style={td}>12,900円</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: "#6b7280" }}>
          初度検査の年月は、車検証で確認できます。電気自動車などは、新車登録の翌年度に限り軽減される場合があります。最終的な額は、市町村が決めます。
          参考:
          <a href="https://www.city.sagamihara.kanagawa.jp/kurashi/1026448/zeikin/1026477/1007757/1007760.html" target="_blank" rel="noopener noreferrer" style={link}>
            相模原市「軽自動車税(種別割)」(外部サイト)
          </a>
          。車検、保険、駐車場、ガソリン代などの維持費は、車種や地域で違うので、ここでは取り上げていません。
        </p>
      </div>

      <div style={box}>
        <h2>車が必要な街で暮らす人の備え</h2>
        <ul style={ul}>
          <li>
            <strong>車が必要かを、街で判断する。</strong>軽自動車が多い街は、車が日常の足になっている可能性があります。
            引っ越し前に、自宅候補の最寄りの駅やバス停、買い物先までの距離を、地図で確認してください。
          </li>
          <li>
            <strong>運転できなくなったときの移動手段を、先に調べる。</strong>
            軽自動車が多い街では、運転できなくなったあとの足が、大きな課題になります。免許を返納したあとの買い物や通院の足(コミュニティバス、乗合タクシーなど)は、自治体の公式サイトで確認できます。
            高齢の親の運転が心配なときは、
            <Link prefetch={false} href="/articles/elderly-driver-accident-analysis" style={link}>
              高齢ドライバーの事故の記事
            </Link>
            もご覧ください。
          </li>
          <li>
            <strong>車を持たない暮らしも、選べる。</strong>軽自動車が少ない街は、電車やバスで暮らせる可能性があります。ただし、家賃は高めのことが多いので、
            <Link prefetch={false} href="/articles/municipal-income-analysis" style={link}>
              所得の記事
            </Link>
            や不動産の情報とあわせて、比べてください。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>まとめ</h2>
        <p style={{ margin: 0 }}>
          軽自動車(四輪乗用・自家用)の台数は、全国の中央値で人口100人あたり{med.toFixed(1)}台。{fullName(top.name)}の{dai(top.per100)}から、
          {fullName(bottom.name)}の{dai(bottom.per100)}まで、大きな差があります。{rels.length > 0 ? `${rels.slice(0, 3).map((x) => trend(x.label === "所得" ? "所得" : x.label, x.r)).join("。")}。` : ""}
          ただし、軽自動車が多いことは、車が多いことではなく、観光地ではレンタカーが含まれる可能性もあります。自分の街の位置は、
          <Link prefetch={false} href="/search" style={link}>
            市区町村検索
          </Link>
          で、ほかの街との比較は、
          <Link prefetch={false} href="/compare" style={link}>
            自治体比較ツール
          </Link>
          で確認できます。出典:
          <a href={TAX_META.url} target="_blank" rel="noopener noreferrer" style={link}>
            総務省「市町村税課税状況等の調」令和7年度 第21表(外部サイト)
          </a>
          。
        </p>
      </div>
    </ArticleLayout>
  );
}

const box: React.CSSProperties = { background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 20 };
const lead: React.CSSProperties = { fontSize: 16, color: "#374151", margin: 0, lineHeight: 1.9 };
const ul: React.CSSProperties = { margin: 0, paddingLeft: 22, lineHeight: 1.9, color: "#374151" };
const table: React.CSSProperties = { borderCollapse: "collapse", width: "100%", minWidth: 480, fontSize: 14 };
const th: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e5e7eb", background: "#f8fafc", fontWeight: 700, textAlign: "right" };
const thL: React.CSSProperties = { ...th, textAlign: "left" };
const td: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e5e7eb", textAlign: "right", whiteSpace: "nowrap" };
const tdL: React.CSSProperties = { ...td, textAlign: "left", fontWeight: 700 };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
