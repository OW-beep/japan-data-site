import Link from "next/link";
import { getSolution, type SolutionLink } from "@/lib/articleSolutions";

/**
 * 記事の結論ブロック「この結果を、あなたの困りごとにどう使うか」。
 *
 * 記事を「雑学を知って終わり」にせず、読者が自分の判断・行動に使えるようにする。
 * 設定は lib/articleSolutions.ts(+ articleSolutionsData*.ts)。slug に設定がなければ何も表示しない。
 */
export default function ReaderSolution({ slug }: { slug: string }) {
  const sol = getSolution(slug);
  if (!sol) return null;

  return (
    <section aria-labelledby={`solution-${slug}`} style={wrap}>
      <h2 id={`solution-${slug}`} style={h2}>
        結論:この結果を、あなたの困りごとにどう使うか
      </h2>

      <p style={problem}>
        <strong>こんなときに</strong>:{sol.problem}
      </p>

      <ol style={ol}>
        {sol.steps.map((s, i) => (
          <li key={s.title} style={li}>
            <div style={stepTitle}>
              <span style={num}>{i + 1}</span>
              {s.title}
            </div>
            <p style={stepText}>{s.text}</p>
            {s.links && s.links.length > 0 && (
              <div style={linkRow}>
                {s.links.map((l) => (
                  <SolutionAnchor key={l.href} link={l} />
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>

      <h3 style={h3}>自分の場合の確認チェック</h3>
      <ul style={checks}>
        {sol.checks.map((c) => (
          <li key={c} style={checkItem}>
            <span aria-hidden="true" style={box}>
              ☐
            </span>
            {c}
          </li>
        ))}
      </ul>

      <p style={note}>
        {"ここに書いた手順は、一般的な目安です。制度や条件は変わることがあるので、最新の情報は、各自治体・公的機関の公式サイトで確認してください。"}
      </p>
    </section>
  );
}

function SolutionAnchor({ link }: { link: SolutionLink }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" style={btnExternal}>
        {link.label}(外部サイト)
      </a>
    );
  }
  return (
    <Link prefetch={false} href={link.href} style={btn}>
      {link.label} →
    </Link>
  );
}

const wrap: React.CSSProperties = {
  margin: "40px 0 24px",
  padding: "24px 22px",
  background: "#f0f9ff",
  border: "2px solid #bae6fd",
  borderRadius: 16,
};
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 800, margin: "0 0 14px", lineHeight: 1.5 };
const problem: React.CSSProperties = { margin: "0 0 18px", lineHeight: 1.9, color: "#0c4a6e" };
const ol: React.CSSProperties = { listStyle: "none", margin: 0, padding: 0 };
const li: React.CSSProperties = { marginBottom: 18 };
const stepTitle: React.CSSProperties = { fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", gap: 10 };
const num: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 26,
  height: 26,
  borderRadius: "50%",
  background: "#0369a1",
  color: "#fff",
  fontSize: 14,
  flexShrink: 0,
};
const stepText: React.CSSProperties = { margin: "6px 0 0 36px", lineHeight: 1.9, color: "#374151" };
const linkRow: React.CSSProperties = { margin: "10px 0 0 36px", display: "flex", flexWrap: "wrap", gap: 10 };
const btn: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 14px",
  background: "#0369a1",
  color: "#fff",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700,
  textDecoration: "none",
};
const btnExternal: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 14px",
  background: "#fff",
  color: "#0369a1",
  border: "1px solid #0369a1",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700,
  textDecoration: "none",
};
const h3: React.CSSProperties = { fontSize: 18, fontWeight: 700, margin: "24px 0 10px" };
const checks: React.CSSProperties = { listStyle: "none", margin: 0, padding: 0 };
const checkItem: React.CSSProperties = { display: "flex", gap: 10, lineHeight: 1.9, color: "#374151", marginBottom: 6 };
const box: React.CSSProperties = { color: "#0369a1", flexShrink: 0 };
const note: React.CSSProperties = { margin: "18px 0 0", fontSize: 13, color: "#6b7280", lineHeight: 1.8 };
