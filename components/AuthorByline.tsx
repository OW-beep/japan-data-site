import Link from "next/link";

/**
 * 記事の信頼性(E-E-A-T)を補強するための共通署名欄。
 * 匿名のまま「書き手の立ち位置」だけを一言添え、詳細はAboutページに誘導する。
 */
export default function AuthorByline() {
  return (
    <div style={wrap}>
      <span style={label}>筆者について：</span>
      元自治体職員・現データコンサルタント。行政・民間で10年以上、
      統計データの分析と可視化に携わっています。
      <Link href="/about" style={link}>
        運営者情報を見る →
      </Link>
    </div>
  );
}

const wrap: React.CSSProperties = {
  marginTop: 32,
  marginBottom: 8,
  padding: "14px 18px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  fontSize: 13,
  lineHeight: 1.9,
  color: "#4b5563",
};

const label: React.CSSProperties = {
  fontWeight: 700,
  color: "#111827",
};

const link: React.CSSProperties = {
  marginLeft: 6,
  color: "#2563eb",
  textDecoration: "underline",
};
