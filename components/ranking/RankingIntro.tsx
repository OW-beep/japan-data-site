type Props = {
  title: string;
  description: string;
  source: string;
};

export default function RankingIntro({
  title,
  description,
  source,
}: Props) {
  return (
    <section
      style={{
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        padding: 28,
        marginBottom: 36,
      }}
    >
      <h2
        style={{
          fontSize: 30,
          fontWeight: 800,
          marginBottom: 18,
        }}
      >
        {title}とは？
      </h2>

      <p
        style={{
          lineHeight: 1.9,
          color: "#374151",
          marginBottom: 20,
        }}
      >
        {description}
      </p>

      <div
        style={{
          background: "#fff",
          border: "1px solid #d1d5db",
          borderRadius: 12,
          padding: 18,
        }}
      >
        <strong>データ出典</strong>

        <p
          style={{
            marginTop: 10,
            lineHeight: 1.8,
            color: "#6b7280",
          }}
        >
          {source}
        </p>
      </div>
    </section>
  );
}