export default function RankCard({
  rank,
  name,
  value,
  unit,
  highlight,
}: {
  rank: number;
  name: string;
  value: number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div style={card(highlight)}>
      <div style={badge(rank)}>
        {rank}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800 }}>{name}</div>
        <div style={{ fontSize: 13, color: "#555" }}>
          {value?.toLocaleString()} {unit}
        </div>
      </div>

      {rank <= 3 && (
        <div style={topTag(rank)}>
          TOP
        </div>
      )}
    </div>
  );
}

const card = (h?: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  padding: 14,
  marginBottom: 10,
  borderRadius: 14,
  background: h ? "#fff7d6" : "white",
  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
});

const badge = (rank: number): React.CSSProperties => ({
  width: 38,
  height: 38,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  marginRight: 12,
  background:
    rank === 1
      ? "#facc15"
      : rank === 2
      ? "#cbd5e1"
      : rank === 3
      ? "#fb923c"
      : "#e2e8f0",
});

const topTag = (rank: number): React.CSSProperties => ({
  fontSize: 11,
  fontWeight: 700,
  color: rank === 1 ? "#b45309" : "#334155",
  background: "#fff",
  padding: "4px 8px",
  borderRadius: 999,
});