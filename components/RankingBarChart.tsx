type BarItem = {
  name: string;
  value: number;
  displayValue: string;
};

export default function RankingBarChart({
  items,
  title,
  barColor = "#1d4ed8",
}: {
  items: BarItem[];
  title?: string;
  barColor?: string;
}) {
  if (items.length === 0) return null;

  const max = Math.max(...items.map((i) => i.value));

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: "20px 22px 8px",
      }}
    >
      {title && (
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#6b7280",
            marginBottom: 16,
          }}
        >
          {title}
        </div>
      )}

      {items.map((item, i) => {
        const widthPct = Math.max(
          (item.value / max) * 100,
          3
        );

        return (
          <div
            key={item.name + i}
            style={{
              display: "grid",
              gridTemplateColumns: "104px 1fr 96px",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#374151",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={item.name}
            >
              {i + 1}. {item.name}
            </div>

            <div
              style={{
                background: "#f1f5f9",
                borderRadius: 6,
                height: 16,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${widthPct}%`,
                  height: "100%",
                  background:
                    i === 0
                      ? barColor
                      : "#93c5fd",
                  borderRadius: 6,
                }}
              />
            </div>

            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#111827",
                textAlign: "right",
              }}
            >
              {item.displayValue}
            </div>
          </div>
        );
      })}
    </div>
  );
}
