export default function RankCard({
  rank,
  name,
  value,
  unit,
}: {
  rank: number;
  name: string;
  value: number;
  unit: string;
}) {
  return (
    <div style={card}>
      <div style={left}>
        <span style={rankBox}>{rank}</span>
        <span style={{ fontWeight: 600 }}>{name}</span>
      </div>

      <div style={valueStyle}>
        {value.toLocaleString()} {unit}
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: 14,
  background: "#fff",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 8,
};

const left: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
};

const rankBox: React.CSSProperties = {
  width: 28,
  height: 28,
  background: "#111827",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 6,
};

const valueStyle: React.CSSProperties = {
  fontWeight: 700,
};