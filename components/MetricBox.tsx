export default function MetricBox({
  title,
  unit,
  definition,
  example,
}: {
  title: string;
  unit: string;
  definition: string;
  example: { name: string; value: number };
}) {
  return (
    <div style={box}>
      <h2 style={{ margin: 0 }}>{title}</h2>

      <p style={p}>{definition}</p>

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
  background: "#f8fafc",
  padding: 14,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 16,
};

const p: React.CSSProperties = {
  color: "#555",
  lineHeight: 1.6,
};

const meta: React.CSSProperties = {
  marginTop: 8,
  fontSize: 13,
  color: "#333",
  display: "flex",
  gap: 20,
  flexWrap: "wrap",
};