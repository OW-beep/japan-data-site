import Link from "next/link";

export default function SearchSection() {
  return (
    <section
      style={{
        background: "#eff6ff",
        borderRadius: 20,
        padding: 26,
        marginBottom: 46,
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: 34,
          marginBottom: 14,
        }}
      >
        🔍 自治体を検索
      </h2>

      <p
        style={{
          color: "#555",
          lineHeight: 1.8,
          marginBottom: 20,
        }}
      >
        全国1747自治体を検索できます。
        <br />
        人口・面積・人口密度などを比較してみましょう。
      </p>

      <Link
        href="/search"
        style={{
          display: "inline-block",
          padding: "16px 32px",
          background: "#2563eb",
          color: "#fff",
          textDecoration: "none",
          borderRadius: 12,
          fontWeight: 700,
        }}
      >
        自治体検索はこちら →
      </Link>
    </section>
  );
}