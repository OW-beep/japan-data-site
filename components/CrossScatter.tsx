import { analyzeCross, shortName, type Surprise } from "@/lib/crossAnalysis";
import { METRICS, type MetricKey } from "@/lib/metrics";

/**
 * 2つの指標を掛け合わせた散布図(サーバー側で描くインラインSVG。外部ライブラリなし)。
 * 1点が1自治体。点線は全体の傾向、赤は傾向を大きく上回る自治体、橙は大きく下回る自治体。
 * 対数目盛の指標(人口・面積・人口密度など)は、軸も対数にする。
 */
export default function CrossScatter({
  xKey,
  yKey,
  showHighlights = true,
  weakCaption,
}: {
  xKey: MetricKey;
  yKey: MetricKey;
  /** 関係が弱いとき(傾向から外れた自治体を出さないとき)は false */
  showHighlights?: boolean;
  /** 関係が弱いときの、図の下の説明(省略時は「はっきりした関係は見られません」) */
  weakCaption?: string;
}) {
  const res = analyzeCross(xKey, yKey);
  if (!res) return null;

  const xm = METRICS[xKey] as { label: string; unit: string; digits: number };
  const ym = METRICS[yKey] as { label: string; unit: string; digits: number };

  const W = 640;
  const H = 456;
  const padL = 66;
  const padR = 18;
  const padT = 30;
  const padB = 58;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const tx = (v: number) => (res.logX ? Math.log10(v) : v);
  const ty = (v: number) => (res.logY ? Math.log10(v) : v);

  const highlights: (Surprise & { kind: "above" | "below" })[] = showHighlights
    ? [
        ...res.above.slice(0, 2).map((s) => ({ ...s, kind: "above" as const })),
        ...res.below.slice(0, 2).map((s) => ({ ...s, kind: "below" as const })),
      ]
    : [];

  // 軸の範囲: 両端0.5%を除き、強調する自治体は必ず含める
  const range = (vals: number[], extra: number[]) => {
    const s = [...vals].sort((a, b) => a - b);
    const q = (p: number) => s[Math.min(s.length - 1, Math.max(0, Math.floor(p * (s.length - 1))))];
    let lo = Math.min(q(0.005), ...extra);
    let hi = Math.max(q(0.995), ...extra);
    const pad = (hi - lo) * 0.04 || 1;
    lo -= pad;
    hi += pad;
    return [lo, hi] as const;
  };
  const [xLo, xHi] = range(res.points.map((p) => tx(p.x)), highlights.map((h) => tx(h.x)));
  const [yLo, yHi] = range(res.points.map((p) => ty(p.y)), highlights.map((h) => ty(h.y)));

  const X = (v: number) => padL + ((tx(v) - xLo) / (xHi - xLo)) * plotW;
  const Y = (v: number) => padT + plotH - ((ty(v) - yLo) / (yHi - yLo)) * plotH;
  const r1 = (v: number) => Math.round(v * 10) / 10;

  const ticks = (lo: number, hi: number, log: boolean): number[] => {
    if (log) {
      const out: number[] = [];
      const base: number[] = hi - lo >= 2 ? [1] : [1, 2, 5];
      for (let k = Math.floor(lo) - 1; k <= Math.ceil(hi); k++) {
        for (const b of base) {
          const t = b * 10 ** k;
          const lt = Math.log10(t);
          if (lt >= lo && lt <= hi) out.push(t);
        }
      }
      return out;
    }
    const span = hi - lo;
    const raw = span / 5;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
    const out: number[] = [];
    for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) out.push(Math.round(t / step) * step);
    return out;
  };
  const fmtTick = (v: number, digits: number) =>
    v.toLocaleString("ja-JP", {
      maximumFractionDigits: Math.abs(v) >= 1000 ? 0 : Math.max(0, Math.min(digits, 2)),
    });

  const xTicks = ticks(xLo, xHi, res.logX);
  const yTicks = ticks(yLo, yHi, res.logY);

  const lineY = (xt: number) => res.intercept + res.slope * xt;
  const lx1 = xLo;
  const lx2 = xHi;
  const ly1 = lineY(lx1);
  const ly2 = lineY(lx2);
  const toPxX = (t: number) => padL + ((t - xLo) / (xHi - xLo)) * plotW;
  const toPxY = (t: number) => padT + plotH - ((t - yLo) / (yHi - yLo)) * plotH;

  const summary = `${xm.label}と${ym.label}の散布図。全国${res.n.toLocaleString()}自治体を1点ずつ表示し、相関係数は${res.r.toFixed(2)}です。`;

  return (
    <figure style={{ margin: "16px 0 8px" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={summary}
        style={{ width: "100%", height: "auto", display: "block", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12 }}
      >
        <title>{summary}</title>
        <defs>
          <clipPath id={`clip-${xKey}-${yKey}`}>
            <rect x={padL} y={padT} width={plotW} height={plotH} />
          </clipPath>
        </defs>

        {/* 目盛線 */}
        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line x1={padL} x2={W - padR} y1={r1(Y(t))} y2={r1(Y(t))} stroke="#f1f5f9" />
            <text x={padL - 8} y={r1(Y(t)) + 4} textAnchor="end" fontSize={11} fill="#64748b">
              {fmtTick(t, ym.digits)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <g key={`x${t}`}>
            <line x1={r1(X(t))} x2={r1(X(t))} y1={padT} y2={padT + plotH} stroke="#f1f5f9" />
            <text x={r1(X(t))} y={padT + plotH + 16} textAnchor="middle" fontSize={11} fill="#64748b">
              {fmtTick(t, xm.digits)}
            </text>
          </g>
        ))}
        <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke="#cbd5e1" />

        <g clipPath={`url(#clip-${xKey}-${yKey})`}>
          <g fill="#3b82f6" fillOpacity={0.32}>
            {res.points.map((p) => (
              <circle key={p.code} cx={r1(X(p.x))} cy={r1(Y(p.y))} r={2.2} />
            ))}
          </g>
          <line
            x1={r1(toPxX(lx1))}
            y1={r1(toPxY(ly1))}
            x2={r1(toPxX(lx2))}
            y2={r1(toPxY(ly2))}
            stroke="#0f172a"
            strokeWidth={1.6}
            strokeDasharray="6 4"
          />
        </g>

        {/* 傾向から大きく外れた自治体 */}
        {highlights.map((h, i) => {
          const cx = r1(X(h.x));
          const cy = r1(Y(h.y));
          const color = h.kind === "above" ? "#dc2626" : "#ea580c";
          const right = cx < padL + plotW * 0.62;
          const dy = (i % 2 === 0 ? -9 : 15) + (h.kind === "below" ? 4 : 0);
          return (
            <g key={h.code}>
              <circle cx={cx} cy={cy} r={5.5} fill={color} stroke="#fff" strokeWidth={1.5} />
              {/* 白い縁取り(下)と、色つきの文字(上)を別々に重ねる。paint-order に頼らず、どの環境でも読める */}
              <text
                x={right ? cx + 9 : cx - 9}
                y={cy + dy}
                textAnchor={right ? "start" : "end"}
                fontSize={12}
                fontWeight={700}
                fill="none"
                stroke="#fff"
                strokeWidth={4}
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {shortName(h.name)}
              </text>
              <text
                x={right ? cx + 9 : cx - 9}
                y={cy + dy}
                textAnchor={right ? "start" : "end"}
                fontSize={12}
                fontWeight={700}
                fill={color}
              >
                {shortName(h.name)}
              </text>
            </g>
          );
        })}

        {/* 軸のタイトル */}
        <text x={padL + plotW / 2} y={H - 10} textAnchor="middle" fontSize={12} fill="#334155" fontWeight={700}>
          {`${xm.label}(${xm.unit || "指数"}${res.logX ? "・対数目盛" : ""})`}
        </text>
        <text
          transform={`translate(14 ${padT + plotH / 2}) rotate(-90)`}
          textAnchor="middle"
          fontSize={12}
          fill="#334155"
          fontWeight={700}
        >
          {`${ym.label}(${ym.unit || "指数"}${res.logY ? "・対数目盛" : ""})`}
        </text>
      </svg>
      <figcaption style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginTop: 6 }}>
        1つの点が1自治体です(人口3,000人以上、{res.n.toLocaleString()}自治体)。点線は全体の傾向で、
        {showHighlights ? (
          <>
            <span style={{ color: "#dc2626", fontWeight: 700 }}>赤</span>は傾向を大きく上回る自治体、
            <span style={{ color: "#ea580c", fontWeight: 700 }}>橙</span>は大きく下回る自治体です。
          </>
        ) : (
          weakCaption ?? "2つの指標に、はっきりした関係は見られません(点が広く散らばっています)。"
        )}
        データの年次は、指標ごとに異なります。
      </figcaption>
    </figure>
  );
}
