export default function PublishedDate({ date }: { date: string }) {
  const d = new Date(date);
  const formatted = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

  return (
    <p
      style={{
        fontSize: 13,
        color: "#9ca3af",
        marginTop: -6,
        marginBottom: 8,
      }}
    >
      公開日：{formatted}
    </p>
  );
}
