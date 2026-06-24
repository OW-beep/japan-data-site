import Link from "next/link";

export default function Footer() {
  return (
    <footer style={wrap}>
      <div style={links}>
        <Link href="/privacy">プライバシーポリシー</Link>
        <Link href="/contact">お問い合わせ</Link>
        <Link href="/sitemap">サイトマップ</Link>
      </div>

      <p style={note}>
        ※本サイトはe-Statデータを利用しています（公的統計）
      </p>
    </footer>
  );
}

const wrap: React.CSSProperties = {
  marginTop: 40,
  padding: 20,
  borderTop: "1px solid #ddd",
  textAlign: "center",
};

const links: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  fontSize: 14,
};

const note: React.CSSProperties = {
  fontSize: 12,
  color: "#666",
  marginTop: 10,
};