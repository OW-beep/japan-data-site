export default function RankCard({
  rank,
  name,
  value,
  unit,
}: any) {
  return (
    <div style={card}>
      <div style={rankBox}>
        {rank}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>{name}</div>
        <div style={valueText}>
          {value?.toLocaleString()} {unit}
        </div>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: 12,
  marginBottom: 8,
  background: "#fff",
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const rankBox: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  marginRight: 10,
  background: "#e5e7eb",
};

const valueText: React.CSSProperties = {
  fontSize: 13,
  color: "#666",
};