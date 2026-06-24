export default function RankCard({
  rank,
  name,
  value,
  unit,
}: any) {
  return (
    <div style={card}>
      {/* 左：順位 */}
      <div style={rankBox}>
        {rank}
      </div>

      {/* 中央：自治体名 */}
      <div style={nameBox}>
        {name}
      </div>

      {/* 右：数値（重要KPI） */}
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
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const rankBox: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  background: "#e5e7eb",
  flexShrink: 0,
};

const nameBox: React.CSSProperties = {
  flex: 1,
  marginLeft: 12,
  fontWeight: 700,
};

const valueBox: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 14,
  textAlign: "right",
  minWidth: 90,
};

const unitStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#666",
  marginLeft: 4,
};