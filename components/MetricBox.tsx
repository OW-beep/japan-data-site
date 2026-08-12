type ExampleValue = string | number;

export default function MetricBox({
  title,
  unit,
  definition,
  formula,
  example,
  source,
}: {
  title: string;
  unit: string;
  definition: string;
  formula?: string;
  example: {
    name: string;
    value: ExampleValue;
  };
  /** データの出所・年度・対象範囲などを統一フォーマットで表示する。
   *  全ランキングページ共通の「データについて」欄。 */
  source?: {
    sourceName: string; // 元データの統計名(例:「令和2年国勢調査」)
    dataYear: string; // データの年度(例:「2020年」)
    scope?: string; // 対象範囲(例:「全国1,741市区町村」)
    excluded?: string; // 除外条件(例:「人口3,000人未満の自治体を除く」)
    notes?: string; // 読み解く際の注意点
  };
}) {
  return (
    <div style={box}>
      <h2 style={titleStyle}>
        📖 {title}
      </h2>

      <p style={definitionStyle}>
        {definition}
      </p>

      {formula && (
        <div style={formulaStyle}>
          {formula}
        </div>
      )}

      <div style={exampleBox}>
        <div>
          <strong>単位</strong>
          <br />
          {unit || "-"}
        </div>

        <div>
          <strong>例</strong>
          <br />
          {example.name}
        </div>

        <div>
          <strong>値</strong>
          <br />
          {typeof example.value === "number"
            ? `${example.value.toLocaleString()}${unit}`
            : example.value}
        </div>
      </div>

      {source && (
        <div style={sourceBox}>
          <div style={sourceTitle}>データについて</div>
          <dl style={sourceGrid}>
            <dt style={dt}>出典</dt>
            <dd style={dd}>{source.sourceName}</dd>

            <dt style={dt}>データ年度</dt>
            <dd style={dd}>{source.dataYear}</dd>

            {source.scope && (
              <>
                <dt style={dt}>対象範囲</dt>
                <dd style={dd}>{source.scope}</dd>
              </>
            )}

            {source.excluded && (
              <>
                <dt style={dt}>除外条件</dt>
                <dd style={dd}>{source.excluded}</dd>
              </>
            )}
          </dl>

          {source.notes && (
            <p style={sourceNotes}>⚠️ {source.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}

const box: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  padding: 20,
  marginBottom: 24,
};

const titleStyle: React.CSSProperties = {
  marginBottom: 10,
};

const definitionStyle: React.CSSProperties = {
  color: "#4b5563",
  lineHeight: 1.8,
};

const formulaStyle: React.CSSProperties = {
  marginTop: 12,
  background: "#eff6ff",
  padding: 12,
  borderRadius: 8,
  fontWeight: 600,
};

const exampleBox: React.CSSProperties = {
  marginTop: 16,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
  gap: 12,
};

const sourceBox: React.CSSProperties = {
  marginTop: 20,
  paddingTop: 16,
  borderTop: "1px dashed #e5e7eb",
};

const sourceTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#6b7280",
  marginBottom: 10,
};

const sourceGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  columnGap: 12,
  rowGap: 6,
  margin: 0,
  fontSize: 13,
};

const dt: React.CSSProperties = {
  color: "#9ca3af",
  whiteSpace: "nowrap",
};

const dd: React.CSSProperties = {
  margin: 0,
  color: "#374151",
};

const sourceNotes: React.CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  fontSize: 13,
  color: "#92400e",
  background: "#fffbeb",
  padding: "8px 12px",
  borderRadius: 8,
};