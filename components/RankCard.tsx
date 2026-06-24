export default function RankCard({
  rank,
  name,
  value,
  unit,
}: any) {
  return (
    <div style={card}>
      <div style={rankBox(rank)}>{rank}</div>

      <div style={nameBox}>{name}</div>

      <div style={valueBox}>
        {value?.toLocaleString()}
        <span style={unitStyle}>{unit}</span>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 14px",
  marginBottom: 8,
  background: "#fff",
  borderRadius: 10,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const rankBox = (rank: number): React.CSSProperties => ({
  width: 36,
  height: 36,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  background:
    rank === 1
      ? "#facc15"
      : rank === 2
      ? "#e5e7eb"
      : rank === 3
      ? "#fdba74"
      : "#f3f4f6",
});

const nameBox: React.CSSProperties = {
  flex: 1,
  marginLeft: 12,
  fontWeight: 700,
};

const valueBox: React.CSSProperties = {
  fontWeight: 800,
  minWidth: 100,
  textAlign: "right",
};

const unitStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#666",
  marginLeft: 4,
};