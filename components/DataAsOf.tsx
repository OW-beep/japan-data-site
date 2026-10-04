import meta from "@/data/meta.json";

export default function DataAsOf({
  style,
  text,
}: {
  style?: React.CSSProperties;
  /** 指定すると、e-Stat の更新日の代わりにこの文を表示する(e-Stat以外のデータのページ用) */
  text?: string;
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
      {text ? `データ：${text}` : `データ更新日：${formatted}（e-Stat 公開データに基づき自動更新）`}
    </p>
  );
}
