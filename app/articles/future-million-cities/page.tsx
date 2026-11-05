import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import RankingBarChart from "@/components/RankingBarChart";
import { pickCities } from "@/lib/citySets";
import {
  FUTURE_META,
  crossingYear,
  futureRows,
  getFuture,
  popIndex2050,
  type FutureSeries,
} from "@/lib/futurePopulation";
import { shortName } from "@/lib/crossAnalysis";

export const metadata = {
  alternates: { canonical: "/articles/future-million-cities" },
  title: "100万人都市は2050年にどうなる?人口を保つ都市・減る都市と、75歳以上が増える都市【将来推計】",
  description:
    "国立社会保障・人口問題研究所の将来推計(令和5年推計)で、100万人都市の2050年を分析。100万人を割る都市、人口が増える都市、人口が増えても75歳以上が1.5倍になる都市、5万人以上の市の約2割が5万人を割る見通しまで、データで読み解きます。",
};

const PATH = "/articles/future-million-cities";

type Item = { code: string; name: string; f: FutureSeries; link: boolean };

const man = (v: number) => `${(v / 10_000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}万人`;
const pct1 = (v: number) => `${v.toFixed(1)}%`;

export default function Page() {
  // 100万人以上の政令指定都市(令和7年国勢調査)に、東京23区(合計)を加える。千葉市は参考
  const items: Item[] = [];
  for (const c of pickCities("million")) {
    const f = getFuture(c.code);
    if (f) items.push({ code: c.code, name: shortName(c.name), f, link: true });
  }
  const tokyo = getFuture("13100");
  if (tokyo) items.push({ code: "13100", name: "東京23区(合計)", f: tokyo, link: false });
  const chibaF = getFuture("12100");
  const chiba: Item | null = chibaF ? { code: "12100", name: "千葉市", f: chibaF, link: true } : null;

  const calc = (it: Item) => {
    const f = it.f;
    const idx = popIndex2050(f);
    const work20 = (f.pop[0] * f.working[0]) / 100;
    const work50 = (f.pop[6] * f.working[6]) / 100;
    const old25 = (f.pop[1] * f.old75[1]) / 100;
    const old50 = (f.pop[6] * f.old75[6]) / 100;
    const el20 = (f.pop[0] * f.elderly[0]) / 100;
    const el50 = (f.pop[6] * f.elderly[6]) / 100;
    return {
      idx,
      workChange: (work50 / work20 - 1) * 100,
      old25,
      old50,
      oldRatio: old50 / old25,
      support20: work20 / el20,
      support50: work50 / el50,
      diffToMillion: f.pop[6] - 1_000_000,
      crossYear: crossingYear(f.pop, 1_000_000),
    };
  };
  const rows = items.map((it) => ({ it, m: calc(it) }));
  const byIdx = [...rows].sort((a, b) => b.m.idx - a.m.idx);
  const falls = rows.filter((r) => r.it.f.pop[6] < 1_000_000);
  const stays = rows.filter((r) => r.it.f.pop[6] >= 1_000_000);
  const grows = rows.filter((r) => r.m.idx >= 100);
  const bestOld = [...rows].sort((a, b) => b.m.oldRatio - a.m.oldRatio)[0];
  const worstWork = [...rows].sort((a, b) => a.m.workChange - b.m.workChange)[0];
  const allOldUp = rows.every((r) => r.m.oldRatio > 1);
  const allWorkDown = rows.every((r) => r.m.workChange < 0);
  const growsOld = grows.map((r) => `${r.it.name}(${r.m.oldRatio.toFixed(2)}倍)`);

  // 全国の市(政令市・その他の市): しきい値を割る数
  const all = futureRows();
  const shi = all.filter((r) => r.kind === "1" || r.kind === "2");
  const thresholds = [1_000_000, 500_000, 300_000, 200_000, 100_000, 50_000].map((th) => {
    const base = shi.filter((r) => r.pop[0] >= th);
    const drop = base.filter((r) => r.pop[6] < th);
    return { th, base: base.length, drop: drop.length };
  });
  const t5 = thresholds[thresholds.length - 1];
  const t10 = thresholds[4];
  const under5 = shi
    .filter((r) => r.pop[0] >= 50_000 && r.pop[6] < 50_000)
    .sort((a, b) => b.pop[0] - a.pop[0])
    .slice(0, 10);
  const growers = all
    .filter((r) => ["1", "2", "3"].includes(r.kind) && r.pop[6] >= r.pop[0])
    .sort((a, b) => b.pop[6] / b.pop[0] - a.pop[6] / a.pop[0]);
  const tokyoWardsGrow = all.filter((r) => r.code >= "13101" && r.code <= "13123" && r.pop[6] >= r.pop[0]).length;

  const first = byIdx[0];
  const last = byIdx[byIdx.length - 1];

  const Cell = ({ it }: { it: Item }) =>
    it.link ? (
      <Link prefetch={false} href={`/city/${it.code}`} style={link}>
        {it.name}
      </Link>
    ) : (
      <span>{it.name}</span>
    );

  return (
    <ArticleLayout
      title={`100万人都市の2050年:${falls.length > 0 ? `${falls.map((r) => r.it.name).join("・")}は100万人を割り、` : ""}人口が増えても75歳以上は最大${bestOld.m.oldRatio.toFixed(1)}倍に`}
      summary={`国立社会保障・人口問題研究所の将来推計(令和5年推計)で、100万人以上の都市の2050年を分析しました。2050年も100万人以上を保つ推計なのは${stays.length}都市、割り込む推計は${falls.length > 0 ? falls.map((r) => r.it.name).join("・") : "なし"}です。人口が最も保たれるのは${first.it.name}(2020年の${first.m.idx.toFixed(0)}%)、最も減るのは${last.it.name}(同${last.m.idx.toFixed(0)}%)。人口が増える都市でも、75歳以上は${bestOld.it.name}で${bestOld.m.oldRatio.toFixed(2)}倍になります。`}
      heroLabel={falls.length > 0 ? "2050年に100万人を割る推計の都市" : "2050年に最も人口が減る推計の都市"}
      heroValue={falls.length > 0 ? falls.map((r) => r.it.name).join("・") : `${last.it.name}(2020年の${last.m.idx.toFixed(0)}%)`}
      path={PATH}
      rankingLink="/ranking/large-cities"
      tags={["population", "aging"]}
      publishedAt="2026-11-05"
      dataNote="推計は、令和2(2020)年の国勢調査を基準に、出生中位・死亡中位の仮定でつくった「将来の見通し」で、確定した未来ではありません。"
      top3={byIdx.slice(0, 3).map((r, i) => ({ rank: i + 1, name: r.it.name, value: `2020年の${r.m.idx.toFixed(1)}%` }))}
    >
      <div style={box}>
        <p style={lead}>
          「100万人都市」は、これからも100万人を保てるのか。国立社会保障・人口問題研究所の将来推計(令和5年推計)で、2050年までを見ると、
          2050年も100万人以上を保つのは{stays.length}都市、
          {falls.length > 0 ? (
            <>
              割り込むのは<strong>{falls.map((r) => r.it.name).join("・")}</strong>(2020年{man(falls[0].it.f.pop[0])}→2050年
              {man(falls[0].it.f.pop[6])})だけです。
            </>
          ) : (
            <>割り込む都市はありません。</>
          )}
          ただし、人口が保たれるかどうかと、暮らしの負担が軽いかどうかは別の話です。
          人口が増える都市でも、75歳以上は{growsOld.length > 0 ? growsOld.join("、") : `${bestOld.it.name}(${bestOld.m.oldRatio.toFixed(2)}倍)`}と、大きく増えます。
          支える側の15〜64歳は、{worstWork.it.name}で{Math.abs(worstWork.m.workChange).toFixed(1)}%減ります。
          数字は、住む街、働く街、親の暮らす街を考えるときの手がかりになります。
        </p>
      </div>

      <div style={box}>
        <h2>この記事の数字の見方</h2>
        <ul style={ul}>
          <li>
            <strong>将来の「見通し」であり、予言ではありません。</strong>
            令和2年国勢調査を基準に、近年の人口の動き(出生、死亡、人口移動)の傾向をもとに、2050年まで5年ごとに推計したものです(出生中位・死亡中位の仮定)。
            再開発や、子育て・移住の政策で、実際の人口は変わります。
          </li>
          <li>
            <strong>2025年の実績とは、ずれることがあります。</strong>
            令和7年国勢調査の結果が出ているので、推計と実績の差も、各都市のページで確認できます。
          </li>
          <li>
            <strong>東京23区は、区ごとの推計の合計です。</strong>千葉市は100万人に近いので、参考として並べました。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>100万人を保つ都市、割り込む都市</h2>
        <p style={p}>
          2050年の推計人口を、100万人のラインと比べました。
          {falls.length > 0 &&
            falls.map((r) => (
              <span key={r.it.code}>
                {r.it.name}は、2025年の推計{man(r.it.f.pop[1])}から、2050年に{man(r.it.f.pop[6])}になり、100万人を
                {r.m.crossYear != null ? `${r.m.crossYear.toFixed(1)}年ごろに` : ""}割る見通しです(5年ごとの推計値を直線でつないだ計算)。
              </span>
            ))}
          2050年の時点で、100万人との差が最も小さいのは、{[...stays].sort((a, b) => a.m.diffToMillion - b.m.diffToMillion)[0]?.it.name}(+
          {man([...stays].sort((a, b) => a.m.diffToMillion - b.m.diffToMillion)[0]?.m.diffToMillion ?? 0)})です。
          {chiba && (
            <>
              {" "}
              参考として、千葉市は2020年の{man(chiba.f.pop[0])}から、2050年に{man(chiba.f.pop[6])}になる推計で、100万人には届きません。
            </>
          )}
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={thL}>都市</th>
                <th style={th}>2020年(実績)</th>
                <th style={th}>2035年(推計)</th>
                <th style={th}>2050年(推計)</th>
                <th style={th}>100万人との差(2050年)</th>
                <th style={th}>2020年を100とした2050年</th>
              </tr>
            </thead>
            <tbody>
              {[...rows, ...(chiba ? [{ it: chiba, m: calc(chiba) }] : [])].map((r) => (
                <tr key={r.it.code}>
                  <td style={tdL}>
                    <Cell it={r.it} />
                    {r.it.code === "12100" && "(参考)"}
                  </td>
                  <td style={td}>{man(r.it.f.pop[0])}</td>
                  <td style={td}>{man(r.it.f.pop[3])}</td>
                  <td style={{ ...td, fontWeight: 700, color: r.it.f.pop[6] < 1_000_000 ? "#b91c1c" : undefined }}>{man(r.it.f.pop[6])}</td>
                  <td style={td}>
                    {r.m.diffToMillion >= 0 ? "+" : "−"}
                    {man(Math.abs(r.m.diffToMillion))}
                  </td>
                  <td style={td}>{r.m.idx.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={box}>
        <h2>増える都市・減る都市</h2>
        <RankingBarChart
          items={byIdx.map((r) => ({ name: r.it.name, value: r.m.idx, displayValue: `${r.m.idx.toFixed(1)}` }))}
          title="2050年の推計人口(2020年=100)"
          barColor="#0e7490"
        />
        <p style={{ ...p, marginTop: 14 }}>
          2020年より増える推計の都市は、{grows.length > 0 ? grows.map((r) => `${r.it.name}(${r.m.idx.toFixed(1)})`).join("、") : "ありません"}です。
          最も減るのは{last.it.name}({last.m.idx.toFixed(1)})で、次いで
          {byIdx
            .slice(-3, -1)
            .reverse()
            .map((r) => `${r.it.name}(${r.m.idx.toFixed(1)})`)
            .join("、")}です。
          東京23区は、23区のうち{tokyoWardsGrow}区で、2050年の人口が2020年以上になる推計です。
        </p>
      </div>

      <div style={box}>
        <h2>人口が増えても、75歳以上は増える</h2>
        <p style={p}>
          都市の「支える力」は、総人口ではなく、年齢の構成に表れます。2025年から2050年の25年間で、75歳以上の人口は、
          {allOldUp ? "全ての都市で" : "多くの都市で"}増えます。最も増えるのは{bestOld.it.name}({man(bestOld.m.old25)}→{man(bestOld.m.old50)}、{bestOld.m.oldRatio.toFixed(2)}倍)です。
          人口が増える推計の{grows.length}都市も、75歳以上は{grows.length > 0 ? `${Math.min(...grows.map((r) => r.m.oldRatio)).toFixed(2)}〜${Math.max(...grows.map((r) => r.m.oldRatio)).toFixed(2)}倍` : "増え"}になります。
          一方、介護や医療を支える15〜64歳の人口は、2020年から2050年で、{worstWork.it.name}の{Math.abs(worstWork.m.workChange).toFixed(1)}%減をはじめ、
          {allWorkDown ? "全ての都市で" : "多くの都市で"}減ります。「人口が減らない=負担が増えない」とは言えません。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={thL}>都市</th>
                <th style={th}>15〜64歳の変化(2020→2050年)</th>
                <th style={th}>75歳以上(2025年)</th>
                <th style={th}>75歳以上(2050年)</th>
                <th style={th}>75歳以上の倍率</th>
                <th style={th}>65歳以上1人を支える15〜64歳の人数(2020年→2050年)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.it.code}>
                  <td style={tdL}>
                    <Cell it={r.it} />
                  </td>
                  <td style={td}>{r.m.workChange.toFixed(1)}%</td>
                  <td style={td}>{man(r.m.old25)}</td>
                  <td style={td}>{man(r.m.old50)}</td>
                  <td style={td}>{r.m.oldRatio.toFixed(2)}倍</td>
                  <td style={td}>
                    {r.m.support20.toFixed(1)}人→{r.m.support50.toFixed(1)}人
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={note}>
          「65歳以上1人を支える15〜64歳の人数」は、15〜64歳の人口を、65歳以上の人口で割った値です。実際の社会保障の負担を表すものではなく、年齢構成の目安です。
        </p>
      </div>

      <div style={box}>
        <h2>全国の市で見ると: 5万人以上の市の{((t5.drop / t5.base) * 100).toFixed(0)}%が、5万人を割る</h2>
        <p style={p}>
          都市の規模を、全国の{shi.length.toLocaleString()}市で見ます。2020年に5万人以上だった{t5.base.toLocaleString()}市のうち、
          <strong>{t5.drop.toLocaleString()}市({((t5.drop / t5.base) * 100).toFixed(0)}%)</strong>が、2050年に5万人を割る推計です。
          10万人以上の{t10.base.toLocaleString()}市のうち、10万人を割るのは{t10.drop.toLocaleString()}市({((t10.drop / t10.base) * 100).toFixed(0)}%)です。
          大きな都市ほど割合は小さいものの、50万人以上でも、{thresholds[1].base}市のうち{thresholds[1].drop}市が割ります。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={thL}>2020年の人口</th>
                <th style={th}>該当する市の数</th>
                <th style={th}>2050年に割る市の数</th>
                <th style={th}>割合</th>
              </tr>
            </thead>
            <tbody>
              {thresholds.map((t) => (
                <tr key={t.th}>
                  <td style={tdL}>{(t.th / 10_000).toLocaleString()}万人以上</td>
                  <td style={td}>{t.base.toLocaleString()}市</td>
                  <td style={td}>{t.drop.toLocaleString()}市</td>
                  <td style={td}>{((t.drop / Math.max(1, t.base)) * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...p, marginTop: 12 }}>
          5万人を割る推計の市のうち、2020年の人口が多い順に、{under5.map((r) => `${r.name.replace(/\s+/g, "")}(${man(r.pop[0])}→${man(r.pop[6])})`).join("、")}です。
          なお、「市」になる要件(人口5万人以上など)は、市になるときの条件です。人口が5万人を割っても、市でなくなるわけではありません。
        </p>
        <p style={p}>
          反対に、2050年の人口が2020年以上になる推計の市町村は、全国で{growers.length}です。
          上位は、{growers
            .slice(0, 8)
            .map((r) => `${r.name.replace(/\s+/g, "")}(${((r.pop[6] / r.pop[0]) * 100).toFixed(0)})`)
            .join("、")}です(2020年=100)。
        </p>
      </div>

      <div style={box}>
        <h2>将来の人口を、暮らしの判断にどう使うか</h2>
        <ul style={ul}>
          <li>
            <strong>家や仕事の判断は、期間をそろえて考える。</strong>
            2050年は、いま20代の人が50代、いま40代の人が60代になる時期です。住宅ローンが長期にわたるなら、返済の終わりごろの街の姿として、この数字が参考になります。
          </li>
          <li>
            <strong>人口が増える街でも、介護・医療の備えは別に見る。</strong>
            75歳以上は、100万人都市の{allOldUp ? "すべて" : "多く"}で増えます。親の暮らす街や、将来自分が暮らす街の、介護や見守りの計画を、自治体の高齢者向けの計画(介護保険事業計画など)で確認してください。
          </li>
          <li>
            <strong>人口が減る街でも、暮らしやすさは別の話。</strong>
            人口が減る推計の街は、公共サービスの維持の計画(総合計画、人口ビジョン)を確認すると、街の方針が分かります。
          </li>
          <li>
            <strong>1つの推計だけで決めない。</strong>
            推計は仮定にもとづきます。都市ページで、2025年の実績と推計の差も確認できます。
          </li>
        </ul>
      </div>

      <div style={box}>
        <h2>まとめ</h2>
        <p style={{ margin: 0 }}>
          将来推計では、2050年に100万人を割る100万人都市は、{falls.length > 0 ? falls.map((r) => r.it.name).join("・") : "ありません"}だけで、
          人口が増える推計の{grows.length > 0 ? grows.map((r) => r.it.name).join("・") : "都市"}と、減る推計の都市に分かれます。{allOldUp ? "しかし、75歳以上が増えるのは、すべての都市に共通です。" : ""}
          全国の市では、5万人以上の{((t5.drop / t5.base) * 100).toFixed(0)}%が5万人を割ります。自分の街の将来は、
          <Link prefetch={false} href="/search" style={link}>
            市区町村検索
          </Link>
          で、各自治体のページから確認できます。現在の100万人都市の一覧は、
          <Link prefetch={false} href="/articles/million-cities" style={link}>
            100万人都市の記事
          </Link>
          をご覧ください。出典:
          <a href={FUTURE_META.url} target="_blank" rel="noopener noreferrer" style={link}>
            国立社会保障・人口問題研究所「日本の地域別将来推計人口(令和5(2023)年推計)」(外部サイト)
          </a>
          。
        </p>
      </div>
    </ArticleLayout>
  );
}

const box: React.CSSProperties = { background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 20 };
const lead: React.CSSProperties = { fontSize: 16, color: "#374151", margin: 0, lineHeight: 1.9 };
const p: React.CSSProperties = { margin: "0 0 12px", lineHeight: 1.9, color: "#374151" };
const note: React.CSSProperties = { margin: "10px 0 0", fontSize: 13, color: "#6b7280", lineHeight: 1.8 };
const ul: React.CSSProperties = { margin: 0, paddingLeft: 22, lineHeight: 1.9, color: "#374151" };
const table: React.CSSProperties = { borderCollapse: "collapse", width: "100%", minWidth: 640, fontSize: 14 };
const th: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e5e7eb", background: "#f8fafc", fontWeight: 700, textAlign: "right", verticalAlign: "bottom", lineHeight: 1.4 };
const thL: React.CSSProperties = { ...th, textAlign: "left" };
const td: React.CSSProperties = { padding: "7px 10px", border: "1px solid #e5e7eb", textAlign: "right", whiteSpace: "nowrap" };
const tdL: React.CSSProperties = { ...td, textAlign: "left", fontWeight: 700 };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
