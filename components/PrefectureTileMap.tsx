/**
 * 都道府県タイルマップ(模式図)。
 *
 * 地図ライブラリやタイル画像を使わず、47都道府県を同じ大きさの
 * 四角で日本列島の形に並べたSVGをサーバー側で描く。外部データも
 * クライアント側のJavaScriptも不要で、ページの重さは数KB増えるだけ。
 * 形の正確さより「地域の偏りがひと目で分かること」を優先した模式図で、
 * 各タイルに都道府県名を入れて誤読を防いでいる。
 */

const LAYOUT: { name: string; short: string; x: number; y: number }[] = [
  { name: "北海道", short: "北海道", x: 9, y: 0 },
  { name: "青森県", short: "青森", x: 9, y: 1 },
  { name: "秋田県", short: "秋田", x: 8, y: 2 },
  { name: "岩手県", short: "岩手", x: 9, y: 2 },
  { name: "富山県", short: "富山", x: 6, y: 2 },
  { name: "石川県", short: "石川", x: 5, y: 2 },
  { name: "山形県", short: "山形", x: 8, y: 3 },
  { name: "宮城県", short: "宮城", x: 9, y: 3 },
  { name: "新潟県", short: "新潟", x: 7, y: 3 },
  { name: "福井県", short: "福井", x: 5, y: 3 },
  { name: "島根県", short: "島根", x: 3, y: 4 },
  { name: "鳥取県", short: "鳥取", x: 4, y: 4 },
  { name: "福島県", short: "福島", x: 9, y: 4 },
  { name: "長野県", short: "長野", x: 7, y: 4 },
  { name: "岐阜県", short: "岐阜", x: 6, y: 4 },
  { name: "山口県", short: "山口", x: 1, y: 5 },
  { name: "広島県", short: "広島", x: 2, y: 5 },
  { name: "岡山県", short: "岡山", x: 3, y: 5 },
  { name: "兵庫県", short: "兵庫", x: 4, y: 5 },
  { name: "京都府", short: "京都", x: 5, y: 5 },
  { name: "滋賀県", short: "滋賀", x: 6, y: 5 },
  { name: "群馬県", short: "群馬", x: 8, y: 5 },
  { name: "栃木県", short: "栃木", x: 9, y: 5 },
  { name: "茨城県", short: "茨城", x: 10, y: 5 },
  { name: "佐賀県", short: "佐賀", x: 0, y: 6 },
  { name: "福岡県", short: "福岡", x: 1, y: 6 },
  { name: "大分県", short: "大分", x: 2, y: 6 },
  { name: "愛媛県", short: "愛媛", x: 3, y: 6 },
  { name: "香川県", short: "香川", x: 4, y: 6 },
  { name: "大阪府", short: "大阪", x: 5, y: 6 },
  { name: "愛知県", short: "愛知", x: 7, y: 6 },
  { name: "山梨県", short: "山梨", x: 8, y: 6 },
  { name: "埼玉県", short: "埼玉", x: 9, y: 6 },
  { name: "千葉県", short: "千葉", x: 10, y: 6 },
  { name: "長崎県", short: "長崎", x: 0, y: 7 },
  { name: "熊本県", short: "熊本", x: 1, y: 7 },
  { name: "宮崎県", short: "宮崎", x: 2, y: 7 },
  { name: "高知県", short: "高知", x: 3, y: 7 },
  { name: "徳島県", short: "徳島", x: 4, y: 7 },
  { name: "奈良県", short: "奈良", x: 6, y: 7 },
  { name: "三重県", short: "三重", x: 7, y: 7 },
  { name: "静岡県", short: "静岡", x: 8, y: 7 },
  { name: "東京都", short: "東京", x: 9, y: 7 },
  { name: "鹿児島県", short: "鹿児島", x: 1, y: 8 },
  { name: "和歌山県", short: "和歌山", x: 6, y: 8 },
  { name: "神奈川県", short: "神奈川", x: 9, y: 8 },
  { name: "沖縄県", short: "沖縄", x: 0, y: 9 },
];

export { LAYOUT as PREFECTURE_TILE_LAYOUT };

const COLORS = ["#dbeafe", "#93c5fd", "#60a5fa", "#2563eb", "#1e3a8a"];
const CELL = 40;
const GAP = 3;

export default function PrefectureTileMap({
  title,
  values,
  format,
}: {
  title: string;
  /** 都道府県名(正式名称)→値 */
  values: Record<string, number>;
  format: (v: number) => string;
}) {
  const vals = LAYOUT.map((t) => values[t.name]).filter((v) => v != null).sort((a, b) => a - b);
  if (vals.length === 0) return null;
  const q = (p: number) => vals[Math.min(vals.length - 1, Math.floor(p * vals.length))];
  const thresholds = [q(0.2), q(0.4), q(0.6), q(0.8)];
  const bucket = (v: number) => thresholds.filter((t) => v >= t).length;

  const W = 11 * CELL;
  const H = 10 * CELL;

  return (
    <figure style={{ margin: "8px 0 4px" }}>
      <figcaption style={{ fontSize: 14, fontWeight: 700, color: "#6b7280", marginBottom: 10 }}>
        {title}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}
        role="img"
        aria-label={title}
      >
        {LAYOUT.map((t) => {
          const v = values[t.name];
          if (v == null) return null;
          const b = bucket(v);
          const dark = b >= 3;
          return (
            <g key={t.name}>
              <rect
                x={t.x * CELL + GAP / 2}
                y={t.y * CELL + GAP / 2}
                width={CELL - GAP}
                height={CELL - GAP}
                rx={6}
                fill={COLORS[b]}
              >
                <title>{`${t.name}: ${format(v)}`}</title>
              </rect>
              <text
                x={t.x * CELL + CELL / 2}
                y={t.y * CELL + CELL / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={t.short.length >= 3 ? 10 : 12}
                fontWeight={600}
                fill={dark ? "#fff" : "#1e3a5f"}
                style={{ pointerEvents: "none" }}
              >
                {t.short}
              </text>
            </g>
          );
        })}
      </svg>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
          fontSize: 12,
          color: "#6b7280",
          marginTop: 8,
        }}
      >
        <span>少ない</span>
        {COLORS.map((c, i) => (
          <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: c, display: "inline-block" }} />
            {i === 0
              ? `${format(vals[0])}〜`
              : i === COLORS.length - 1
                ? `${format(thresholds[3])}〜`
                : ""}
          </span>
        ))}
        <span>多い</span>
        <span style={{ marginLeft: 8 }}>※面積ではなく模式図(タイルマップ)です</span>
      </div>
    </figure>
  );
}
