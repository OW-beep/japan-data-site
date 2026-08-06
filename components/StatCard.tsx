type Props = {
  number: string;
  title: string;
  subtitle: string;
};

export default function StatCard({
  number,
  title,
  subtitle,
}: Props) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        border: "1px solid #e5e7eb",
        padding: 28,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 42,
          color: "#2563eb",
          fontWeight: 800,
        }}
      >
        {number}
      </div>

      <div
        style={{
          marginTop: 8,
          fontWeight: 700,
          fontSize: 20,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 6,
          color: "#666",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}