export default function DataNote() {
  return (
    <div
      style={{
        marginTop: 32,
        padding: 14,
        fontSize: 12,
        color: "#555",
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        lineHeight: 1.6,
      }}
    >
      ※本データは e-Stat（政府統計）を元にした単年スナップショットです。<br />
      最新取得可能な時点の値を使用しており、年度ごとの統一ではありません。
    </div>
  );
}