import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        日本自治体データ
      </h1>

      <p style={{ color: "#aaa" }}>
        全国1,900+自治体の人口・ランキングをリアルタイム可視化
      </p>

      <div style={{ marginTop: 30, display: "grid", gap: 12 }}>
        <LinkCard href="/ranking/population" title="人口ランキング" />
        <LinkCard href="/search" title="自治体検索" />
      </div>
    </main>
  );
}

function LinkCard({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      style={{
        padding: 16,
        borderRadius: 12,
        background: "#121a2a",
        border: "1px solid #24324d",
        display: "block",
        textDecoration: "none",
        color: "white",
      }}
    >
      {title}
    </Link>
  );
}