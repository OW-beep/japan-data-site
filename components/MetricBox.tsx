export default function MetricBox({
  title,
  unit,
  definition,
  formula,
  example,
}: {
  title: string;
  unit: string;
  definition: string;
  formula?: string;
  example: { name: string; value: number };
}) {
  return (
    <div style={box}>
      <h2 style={titleStyle}>{title}</h2>

      <p style={p}>{definition}</p>

      {formula && <div style={formulaStyle}>{formula}</div>}

      <div style={meta}>
        <div>単位：{unit}</div>
        <div>
          例：{example.name} →{" "}
          {example.value.toLocaleString()} {unit}
        </div>
      </div>
    </div>
  );
}

const box: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  padding: 14,
  borderRadius: 12,
  marginBottom: 16,
};

const titleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  marginBottom: 8,
};

const p: React.CSSProperties = {
  color: "#555",
  lineHeight: 1.6,
};

const formulaStyle: React.CSSProperties = {
  marginTop: 8,
  fontSize: 13,
  color: "#111",
  background: "#f8fafc",
  padding: 8,
  borderRadius: 6,
};

const meta: React.CSSProperties = {
  marginTop: 10,
  fontSize: 13,
  display: "flex",
  gap: 20,
  flexWrap: "wrap",
  color: "#333",
};