export type RankCardProps = {
  rank: number;
  name: string;
  value: number;
  unit?: string;
};

export default function RankCard({
  rank,
  name,
  value,
  unit = "",
}: RankCardProps) {
  const bg =
    rank === 1
      ? "#FFD700"
      : rank === 2
      ? "#C0C0C0"
      : rank === 3
      ? "#CD7F32"
      : "#ffffff";

  return (
    <div style={{ ...card, background: bg }}>
      <div style={left}>
        <span style={rankBox}>#{rank}</span>
        <span>{name}</span>
      </div>

      <div style={valueStyle}>
        {value.toLocaleString()}
        {unit && <span style={unitStyle}>{unit}</span>}
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: 14,
  marginBottom: 10,
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

const left: React.CSSProperties = {
  display: "flex",
  gap: 10,
  fontWeight: 600,
};

const rankBox: React.CSSProperties = {
  width: 28,
  textAlign: "center",
  fontWeight: 700,
};

const valueStyle: React.CSSProperties = {
  fontWeight: 700,
};

const unitStyle: React.CSSProperties = {
  marginLeft: 4,
  fontSize: 12,
  opacity: 0.7,
};