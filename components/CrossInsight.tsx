import Link from "next/link";
import CrossScatter from "@/components/CrossScatter";
import { ARTICLE_CROSS } from "@/lib/articleCross";
import { analyzeCross, fullName, type Surprise } from "@/lib/crossAnalysis";
import { METRICS, formatMetric, type MetricKey } from "@/lib/metrics";

/**
 * 記事の「掛け合わせで見る意外な発見」ブロック。
 *
 * 2つのオープンデータを重ねた図と、傾向から大きく外れた自治体を、全自治体のデータから計算して表示する。
 * 設定は lib/articleCross.ts。設定のない記事には何も表示しない。
 * 「なぜ外れているか」はデータからは分からないため、理由は断定しない。
 */
export default function CrossInsight({ slug }: { slug: string }) {
  const cfg = ARTICLE_CROSS[slug];
  if (!cfg) return null;
  const res = analyzeCross(cfg.x, cfg.y);
  if (!res) return null;

  const weak = Math.abs(res.r) < WEAK_R;
  const xm = METRICS[cfg.x] as { label: string };
  const ym = METRICS[cfg.y] as { label: string };

  return (
    <section aria-labelledby={`cross-${slug}`} style={wrap}>
      <h2 id={`cross-${slug}`} style={h2}>
        掛け合わせで見る意外な発見
      </h2>
      <p style={question}>{cfg.question}</p>

      <p style={p}>
        {xm.label}と{ym.label}を、全国{res.n.toLocaleString()}自治体(人口3,000人以上)で重ねました。
        相関係数は{res.r.toFixed(2)}で、{describe(res.r, xm.label, ym.label, res.logX || res.logY)}。
      </p>

      <CrossScatter
        xKey={cfg.x}
        yKey={cfg.y}
        showHighlights={!weak}
        weakCaption={cfg.weakNote ? "直線の関係は弱く見えます。点の広がり方を、見てください。" : undefined}
      />

      {weak && (
        <div style={{ marginTop: 14 }}>
          <h3 style={h3}>{cfg.weakNote ? "直線の関係は見られませんでした" : "「関係がない」という発見"}</h3>
          <p style={p}>
            {cfg.weakNote ??
              `${xm.label}が高いか低いかで、${ym.label}を予想することはできませんでした。「${xm.label}が高い街だから、${ym.label}も高い(低い)だろう」という見立ては、この結果からは成り立ちません。気になる街は、1つずつ確認する必要があります。`}
          </p>
        </div>
      )}

      {!weak && (res.above.length > 0 || res.below.length > 0) && (
        <div style={{ marginTop: 14 }}>
          <h3 style={h3}>傾向から大きく外れた自治体</h3>
          <p style={p}>
            全体の傾向から予想される{ym.label}と、実際の値の差が大きい自治体です。
          </p>
          <ul style={ul}>
            {res.above.length > 0 && (
              <li>
                <strong style={{ color: "#dc2626" }}>予想を大きく上回る</strong>:
                <SurpriseList items={res.above} yKey={cfg.y} xKey={cfg.x} />
              </li>
            )}
            {res.below.length > 0 && (
              <li>
                <strong style={{ color: "#ea580c" }}>予想を大きく下回る</strong>:
                <SurpriseList items={res.below} yKey={cfg.y} xKey={cfg.x} />
              </li>
            )}
          </ul>
        </div>
      )}

      <p style={how}>
        <strong>この図の使い方</strong>:{cfg.how}
      </p>
      <p style={note}>
        {weak
          ? "相関係数は、2つの値が一緒に動く傾向の強さを表します。関係が見られないことは、片方がもう片方に影響しないことを証明するものではありません。"
          : "予想から外れている理由は、このデータだけでは分かりません。産業、立地、地形、制度などが影響している可能性があります。気になった自治体は、自治体ページや、公式サイトで確認してください。"}
      </p>
    </section>
  );
}

function SurpriseList({ items, xKey, yKey }: { items: Surprise[]; xKey: MetricKey; yKey: MetricKey }) {
  return (
    <>
      {items.map((s, i) => (
        <span key={s.code}>
          {i > 0 && "、"}
          <Link prefetch={false} href={`/city/${s.code}`} style={link}>
            {fullName(s.name)}
          </Link>
          (実際{formatMetric(yKey, s.y)}、予想{formatMetric(yKey, s.expectedY)}。{(METRICS[xKey] as { label: string }).label}は
          {formatMetric(xKey, s.x)})
        </span>
      ))}
    </>
  );
}

/** 相関係数がこの値より小さいときは「関係がない」ものとして扱い、傾向から外れた自治体は出さない */
const WEAK_R = 0.2;

function describe(r: number, xl: string, yl: string, log: boolean): string {
  const a = Math.abs(r);
  const lg = log ? "(対数に変換した値での相関です)" : "";
  if (a < 0.2) return `ほとんど関係が見られません${lg}`;
  const dir = r > 0 ? `${xl}が高い自治体ほど、${yl}も高い` : `${xl}が高い自治体ほど、${yl}は低い`;
  if (a < 0.4) return `${dir}傾向がわずかにあります${lg}`;
  if (a < 0.6) return `${dir}傾向がはっきり見られます${lg}`;
  return `${dir}傾向が強く表れています${lg}`;
}

const wrap: React.CSSProperties = {
  margin: "40px 0 24px",
  padding: "24px 22px",
  background: "#fffbeb",
  border: "2px solid #fde68a",
  borderRadius: 16,
};
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 800, margin: "0 0 10px" };
const question: React.CSSProperties = { fontSize: 18, fontWeight: 700, margin: "0 0 14px", color: "#92400e", lineHeight: 1.6 };
const p: React.CSSProperties = { margin: "0 0 10px", lineHeight: 1.9, color: "#374151" };
const h3: React.CSSProperties = { fontSize: 18, fontWeight: 700, margin: "0 0 6px" };
const ul: React.CSSProperties = { margin: "0 0 10px", paddingLeft: 22, lineHeight: 1.9, color: "#374151" };
const how: React.CSSProperties = { margin: "16px 0 8px", lineHeight: 1.9, color: "#78350f" };
const note: React.CSSProperties = { margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.8 };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
