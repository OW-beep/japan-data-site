import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleLayout from "@/components/ArticleLayout";
import RakutenGifts from "@/components/RakutenGifts";
import JsonLd from "@/components/JsonLd";
import { allAgriCities, type AgriCity } from "@/lib/agriCity";
import { AGRI_META, oku } from "@/lib/agriOutput";
import { isReleased, releaseDate } from "@/lib/release";

const PATH = "/articles/agri-top-municipalities";

const PARTS: { key: keyof AgriCity["parts"]; label: string; type: string }[] = [
  { key: "livestock", label: "畜産", type: "畜産型" },
  { key: "veg", label: "野菜", type: "野菜型" },
  { key: "rice", label: "米", type: "米型" },
  { key: "fruit", label: "果実", type: "果実型" },
  { key: "flower", label: "花き", type: "花き型" },
];

function classify(a: AgriCity) {
  const total = a.total ?? 0;
  const shares = PARTS.map((p) => ({ ...p, share: a.parts[p.key] != null && total > 0 ? ((a.parts[p.key] as number) / total) * 100 : null }));
  const best = [...shares].filter((s) => s.share != null).sort((x, y) => (y.share as number) - (x.share as number))[0];
  // 最大の部門が産出額の4割以上なら「〇〇型」、そうでなければ複合型
  const type = best && (best.share as number) >= 40 ? best.type : "複合型";
  return { shares, type };
}

function getRows() {
  return allAgriCities()
    .filter(([, a]) => a.totalRn != null && a.totalRn <= 20 && a.total != null)
    .map(([code, a]) => ({ code, a, ...classify(a) }))
    .sort((x, y) => (x.a.totalRn as number) - (y.a.totalRn as number));
}

export function generateMetadata() {
  if (!isReleased(PATH)) return {};
  const rows = getRows();
  const cnt = (t: string) => rows.filter((r) => r.type === t).length;
  return {
    alternates: { canonical: PATH },
    title: `農業産出額が多い市町村の稼ぎ方｜上位20は畜産型${cnt("畜産型")}・野菜型${cnt("野菜型")}・米型${cnt("米型")}(令和6年)`,
    description: `農業産出額(令和6年・推計)の上位20市町村について、米・野菜・果実・花き・畜産のどれで稼いでいるかの内訳を比べました。1位${rows[0].a.city}は野菜と花き、2位${rows[1].a.city}は畜産が中心です。`,
  };
}

export default function Page() {
  if (!isReleased(PATH)) notFound();
  const rows = getRows();
  const types = ["畜産型", "野菜型", "米型", "果実型", "花き型", "複合型"].map((t) => ({ t, n: rows.filter((r) => r.type === t).length })).filter((x) => x.n > 0);
  // 上位20市町村の産出額が、全国の合計に占める割合
  const nationalTotal = allAgriCities()
    .filter(([, a]) => a.total != null)
    .reduce((s, [, a]) => s + (a.total ?? 0), 0);
  const top20Total = rows.reduce((s, r) => s + (r.a.total ?? 0), 0);
  const top20Share = nationalTotal > 0 ? (top20Total / nationalTotal) * 100 : 0;
  const faq = [
    {
      q: "農業産出額が多い市町村は、何で稼いでいるのですか？",
      a: `上位20市町村を最も大きい部門で分けると、${types.map((x) => `${x.t}が${x.n}`).join("、")}です。畜産(肉用牛・豚・鶏・生乳)は1戸あたりの規模が大きく単価も高いため、産出額の上位に畜産型が多く並びます。`,
    },
    {
      q: "農業産出額の上位20市町村で、全国の何割を占めますか？",
      a: `上位20市町村の合計は約${oku(top20Total)}億円で、全国の市町村の合計(約${oku(nationalTotal)}億円)の約${top20Share.toFixed(1)}%です。農業の産地は全国に広く分布しているため、特定の市町村への集中度は、製造業などと比べると高くありません。`,
    },
    {
      q: "米どころが上位に少ないのはなぜですか？",
      a: "米は作付面積こそ最大級ですが、面積あたりの産出額では施設野菜や畜産に及ばないことが多いためです。米型の市町村は産出額の絶対額よりも、人口あたりで見たときに上位に来るケースがあります。",
    },
  ];

  return (
    <ArticleLayout
      title="農業産出額が多い市町村の稼ぎ方(畜産型・野菜型・米型)"
      summary={`農業産出額の上位20市町村について、米・野菜・果実・花き・畜産の内訳を比べました。${types.map((x) => `${x.t}${x.n}`).join("、")}。1位の${rows[0].a.city}と2位の${rows[1].a.city}は、稼ぎ方がまったく違います。`}
      heroLabel="農業産出額の上位20のうち畜産型"
      heroValue={`${rows.filter((r) => r.type === "畜産型").length}市町村`}
      rankingLink="/ranking/agri/total"
      path={PATH}
      tags={["industry"]}
      publishedAt={releaseDate(PATH, "2026-10-16")}
      dataNote="農林水産省「市町村別農業産出額(推計)」令和6年(令和8年7月24日公表、同年9月18日訂正)を加工して作成。内訳の割合は、各部門の産出額を農業産出額(総合)で割った値。"
      top3={rows.slice(0, 3).map((r, i) => ({ rank: i + 1, name: `${r.a.pref} ${r.a.city}`, value: `${oku(r.a.total as number)}億円` }))}
    >
      <div style={box}>
        <h2>上位20市町村の内訳</h2>
        <p>
          「〇〇型」は、最も大きい部門が農業産出額の4割以上を占める場合につけた名前で、どの部門も4割に届かなければ複合型としました。
          各部門の合計は、その他の作物や加工農産物などがあるため100%にならないことがあります。数値が非公表の部門は「―」です。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={th}>順位</th>
                <th style={{ ...th, textAlign: "left" }}>市町村</th>
                <th style={thR}>産出額(億円)</th>
                {PARTS.map((p) => (
                  <th key={p.key} style={thR}>
                    {p.label}
                  </th>
                ))}
                <th style={th}>型</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.code}>
                  <td style={td}>{r.a.totalRn}</td>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {r.a.city}
                    <span style={{ color: "#6b7280", fontSize: 12 }}>({r.a.pref})</span>
                  </td>
                  <td style={tdR}>{oku(r.a.total as number)}</td>
                  {r.shares.map((s) => (
                    <td key={s.key} style={tdR}>
                      {s.share == null ? "―" : `${s.share.toFixed(0)}%`}
                    </td>
                  ))}
                  <td style={td}>{r.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={box}>
        <h2>型ごとの特徴</h2>
        <p>{types.map((x) => `${x.t}は${x.n}市町村`).join("、")}です。</p>
        {types.map((x) => (
          <p key={x.t}>
            <strong>{x.t}:</strong>
            {rows
              .filter((r) => r.type === x.t)
              .map((r) => `${r.a.city}(${r.a.pref}・${r.a.totalRn}位)`)
              .join("、")}
          </p>
        ))}
      </div>

      <div style={box}>
        <h2>上位3市町村の強い品目</h2>
        {rows.slice(0, 3).map((r) => (
          <p key={r.code}>
            <strong>
              {r.a.city}({r.a.pref}):
            </strong>
            {r.a.strengths.length > 0
              ? r.a.strengths.map((s) => `${s.item}が全国${s.rn}位${s.v != null ? `(${oku(s.v)}億円)` : "(金額は非公表)"}`).join("、")
              : "品目別で全国30位以内に入るものはありません"}
            。
          </p>
        ))}
        <p style={{ fontSize: 13, color: "#6b7280" }}>
          推計は都道府県の産出額を面積や頭数で市町村に割り振ったもので、販売額そのものではありません。品目別の順位は
          <Link prefetch={false} href="/ranking/agri" style={link}>
            農業産出額 市町村ランキング
          </Link>
          で見られます。出典: 農林水産省(
          <a href={AGRI_META.url} rel="noopener noreferrer" target="_blank" style={link}>
            {AGRI_META.url}
          </a>
          )。
        </p>
      </div>

      <div style={box}>
        <h2>「稼ぎ方」から見えること</h2>
        <p>
          上位20市町村の合計は約{oku(top20Total)}億円で、全国の市町村の合計
          (約{oku(nationalTotal)}億円)の<strong>約{top20Share.toFixed(1)}%</strong>です。
          つまり農業産出額は、ごく一部の町に集中しているわけではなく、全国の産地に
          広く分散しています。それでも上位の顔ぶれにははっきりした型があります。
        </p>
        <p>
          <strong>畜産型が多い理由</strong>は、規模と単価です。肉用牛や豚、鶏卵・生乳は、
          1経営体あたりの飼養規模が大きく、年間の出荷額も大きくなります。飼料畑を含めた
          広い土地が必要なため、北海道や南九州など、平地の広い地域が上位に並びます。
        </p>
        <p>
          <strong>野菜型・花き型</strong>は、面積あたりの産出額の高さが武器です。
          ハウスなどの施設園芸は初期投資が大きい代わりに、単価の高い品目を年に複数回
          出荷できます。大消費地に近い産地や、日照条件のよい産地が強みを発揮します。
        </p>
        <p>
          <strong>米型が上位に少ない理由</strong>は、米が面積あたりの産出額では
          施設野菜や畜産に及ばないことが多いためです。ただし米どころは、
          人口あたりの産出額で見ると上位に来ることがあります。見方を変えた順位は
          <Link prefetch={false} href="/articles/agri-output-per-capita" style={link}>
            人口あたりの農業産出額が多い市町村
          </Link>
          で紹介しています。
        </p>
      </div>

      <div style={box}>
        <h2>特産品・返礼品選びへの活かし方</h2>
        <p>
          その町の「型」を知ると、ふるさと納税の返礼品や旅行先での特産品選びが
          具体的になります。畜産型の町なら肉や乳製品、野菜型の町なら旬の野菜の
          定期便といった具合に、その土地が本業として力を入れている品目を選ぶのが
          基本です。県ごとの主力市町村は
          <Link prefetch={false} href="/articles/agri-prefecture-top" style={link}>
            農業産出額が最も多い市町村、47都道府県の一覧
          </Link>
          で確認できます。
        </p>
        <p>
          一方で、産出額は「推計」であり、その町のすべての農家の売り上げを
          足したものではありません。返礼品の品質や生産者の取り組みは自治体・
          事業者ごとに異なるため、最終的には個別の商品説明を確認してください。
        </p>
      </div>

      <div style={box}>
        <h2>Q&amp;A</h2>
        {faq.map((f) => (
          <p key={f.q}>
            <strong>Q. {f.q}</strong>
            <br />
            A. {f.a}
          </p>
        ))}
      </div>

      {/* 特産品・返礼品への活かし方を読んだ人向けに、実商品への導線を置く(APIキー未設定なら非表示) */}
      <RakutenGifts
        keyword="特産品 お取り寄せ グルメ"
        heading="楽天市場で全国の特産品を見る"
        hits={3}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </ArticleLayout>
  );
}

const box: React.CSSProperties = { background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 20, lineHeight: 1.9 };
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thR: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdR: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
