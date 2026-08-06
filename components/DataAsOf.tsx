import meta from "@/data/meta.json";

export default function DataAsOf({
  style,
}: {
  style?: React.CSSProperties;
}) {
  const date = new Date(meta.updatedAt);

  const formatted = `${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日`;

  return (
    <p
      style={{
        fontSize: 13,
        color: "#9ca3af",
        marginTop: 8,
        marginBottom: 24,
        ...style,
      }}
    >
      データ更新日：{formatted}（e-Stat 公開データに基づき自動更新）
    </p>
  );
}
