import Link from "next/link";

export default function Footer() {
  return (
    <footer style={wrap}>
      <div style={links}>
        <Link href="/privacy">プライバシーポリシー</Link>
        <Link href="/contact">お問い合わせ</Link>
        <Link href="/sitemap.xml">サイトマップ</Link>
      </div>

      <p style={note}>
        ※本サイトはe-Stat（政府統計）などの公開データをもとに作成しています。<br />
        数値は最新公開データに基づく参考値です。
      </p>
    </footer>
  );
}

const wrap: React.CSSProperties = {
  marginTop: 40,
  padding: 24,
  borderTop: "1px solid #e5e7eb",
  textAlign: "center",
  background: "#fafafa",
};

const links: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  fontSize: 14,
  flexWrap: "wrap",
  marginBottom: 10,
};

const note: React.CSSProperties = {
  fontSize: 12,
  color: "#666",
  lineHeight: 1.6,
};