export default function RankCard({
  rank,
  name,
  value,
  unit,
}: {
  rank: number;
  name: string;
  value: string | number;
  unit: string;
}) {
  return (
    <div style={card}>
      <div style={left}>
        <div style={rankStyle}>
          #{rank}
        </div>

        <div style={nameStyle}>
          {name}
        </div>
      </div>

      <div style={valueStyle}>
        {typeof value === "number"
          ? value.toLocaleString()
          : value}

        <span style={unitStyle}>
          {unit}
        </span>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e5e7eb",

  padding: 18,
  marginBottom: 12,

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  boxShadow:
    "0 1px 3px rgba(0,0,0,0.05)",
};

const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const rankStyle: React.CSSProperties = {
  minWidth: 50,

  fontSize: 18,
  fontWeight: 800,

  color: "#2563eb",
};

const nameStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 600,
};

const valueStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,

  color: "#111827",
};

const unitStyle: React.CSSProperties = {
  fontSize: 14,
  marginLeft: 4,

  color: "#6b7280",
};