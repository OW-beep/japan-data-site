export default function PersonalNote({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 20,
        padding: "18px 20px",
        background: "#fffbeb",
        border: "1px solid #fde68a",
        borderLeft: "4px solid #d97706",
        borderRadius: 10,
        fontSize: 14,
        lineHeight: 1.9,
        color: "#374151",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#b45309",
          marginBottom: 6,
          letterSpacing: 0.5,
        }}
      >
        💬 運営者のひとこと
      </div>
      {children}
    </div>
  );
}
