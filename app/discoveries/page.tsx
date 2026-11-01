import type { Metadata } from "next";
import Link from "next/link";
import { articleEntries } from "@/lib/articles";
import { ARTICLE_CROSS } from "@/lib/articleCross";
import { ARTICLE_SOLUTIONS, type ClusterKey } from "@/lib/articleSolutions";
import { analyzeCross, fullName } from "@/lib/crossAnalysis";
import { METRICS, formatMetric } from "@/lib/metrics";

export const metadata: Metadata = {
  alternates: { canonical: "/discoveries" },
  title: "意外な発見 — オープンデータの掛け合わせ",
  description:
    "全国の市区町村の公的データを2つずつ重ねて、「傾向から大きく外れた自治体」を探します。高齢化×医師数、子ども×保育施設、人口密度×財政力など、暮らしの悩みに近い組み合わせの発見をまとめました。",
};

const GROUPS: { title: string; clusters: ClusterKey[] }[] = [
  { title: "医療・介護・高齢化", clusters: ["medical", "aging"] },
  { title: "子育て・教育", clusters: ["childcare"] },
  { title: "日々の暮らし・住まい", clusters: ["daily", "housing", "space"] },
  { title: "自治体の財政", clusters: ["finance"] },
  { title: "仕事・産業", clusters: ["work"] },
  { title: "人口の動き・住む街選び", clusters: ["move"] },
];

export default function Page() {
  const titleOf = (slug: string) => articleEntries.find((a) => a.slug === slug)?.title ?? slug;

  const featured = Object.entries(ARTICLE_CROSS).filter(([, c]) => c.featured);

  return (
    <main style={wrap}>
      <h1 style={h1}>意外な発見 — オープンデータの掛け合わせ</h1>
      <p style={p}>
        1つのデータだけでは見えないことも、2つを重ねると見えてきます。ここでは、全国の市区町村(人口3,000人以上)の
        公的データを2つずつ重ねて、全体の傾向から大きく外れた自治体を探しました。
        「高齢化が進んでいるのに、医師が多い街」「人口が少ないのに、財政に余裕のある街」など、
        暮らしの悩みに近い組み合わせです。
      </p>
      <p style={p}>
        外れている理由は、データだけでは分かりません。ここで挙げた自治体は、調べるきっかけです。
        自治体ページや公式サイトで、背景を確認してください。
      </p>

      <h2 style={h2}>注目の発見</h2>
      {featured.map(([slug, cfg]) => {
        const res = analyzeCross(cfg.x, cfg.y);
        if (!res || Math.abs(res.r) < 0.2) return null;
        const xm = METRICS[cfg.x] as { label: string };
        const ym = METRICS[cfg.y] as { label: string };
        return (
          <section key={slug} style={card}>
            <h3 style={h3}>{cfg.question}</h3>
            <p style={small}>
              {xm.label} × {ym.label}(相関係数 {res.r.toFixed(2)}、{res.n.toLocaleString()}自治体)
            </p>
            <ul style={ul}>
              {res.above.slice(0, 2).map((s) => (
                <li key={s.code}>
                  <span style={{ color: "#dc2626", fontWeight: 700 }}>予想を上回る</span>:
                  <Link prefetch={false} href={`/city/${s.code}`} style={link}>
                    {fullName(s.name)}
                  </Link>
                  (実際{formatMetric(cfg.y, s.y)}、予想{formatMetric(cfg.y, s.expectedY)})
                </li>
              ))}
              {res.below.slice(0, 2).map((s) => (
                <li key={s.code}>
                  <span style={{ color: "#ea580c", fontWeight: 700 }}>予想を下回る</span>:
                  <Link prefetch={false} href={`/city/${s.code}`} style={link}>
                    {fullName(s.name)}
                  </Link>
                  (実際{formatMetric(cfg.y, s.y)}、予想{formatMetric(cfg.y, s.expectedY)})
                </li>
              ))}
            </ul>
            <p style={small}>
              <Link prefetch={false} href={`/articles/${slug}`} style={link}>
                図と使い方を見る:{titleOf(slug)} →
              </Link>
            </p>
          </section>
        );
      })}

      <h2 style={h2}>悩みから探す</h2>
      {GROUPS.map((g) => {
        const items = Object.entries(ARTICLE_CROSS).filter(([slug]) =>
          g.clusters.includes(ARTICLE_SOLUTIONS[slug]?.cluster as ClusterKey)
        );
        if (items.length === 0) return null;
        return (
          <section key={g.title} style={{ marginBottom: 20 }}>
            <h3 style={h3}>{g.title}</h3>
            <ul style={ul}>
              {items.map(([slug, cfg]) => (
                <li key={slug}>
                  <Link prefetch={false} href={`/articles/${slug}`} style={link}>
                    {cfg.question}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <h2 style={h2}>この分析の方法</h2>
      <ul style={ul}>
        <li>2つの指標について、全国の市区町村(人口3,000人以上)の値を取り出します。</li>
        <li>
          直線の傾向(回帰)を求め、「Xの値から予想されるY」を計算します。人口や面積のように値の幅が大きい指標は、
          対数に変換して計算します。
        </li>
        <li>実際のYが予想から大きく外れた(標準偏差の2倍以上)自治体を、「意外な自治体」として挙げます。</li>
        <li>
          相関は、2つの値が一緒に動く傾向の強さで、原因と結果を示すものではありません。
          詳しくは、
          <Link prefetch={false} href="/editorial-policy" style={link}>
            編集方針
          </Link>
          をご覧ください。
        </li>
      </ul>
    </main>
  );
}

const wrap: React.CSSProperties = { maxWidth: 860, margin: "0 auto", padding: "28px 24px", lineHeight: 1.9 };
const h1: React.CSSProperties = { fontSize: 30, fontWeight: 800, marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 24, fontWeight: 800, marginTop: 40, marginBottom: 12 };
const h3: React.CSSProperties = { fontSize: 18, fontWeight: 700, margin: "0 0 6px" };
const p: React.CSSProperties = { color: "#374151" };
const small: React.CSSProperties = { color: "#6b7280", fontSize: 14, margin: "4px 0" };
const ul: React.CSSProperties = { color: "#374151", paddingLeft: 22, margin: "6px 0" };
const card: React.CSSProperties = { padding: "16px 18px", border: "1px solid #e5e7eb", borderRadius: 12, marginBottom: 14, background: "#fff" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
