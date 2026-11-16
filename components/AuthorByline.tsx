import Link from "next/link";

import OperatorMark from "@/components/OperatorMark";

/**
 * 記事の信頼性(E-E-A-T)を補強するための共通署名欄。
 * 運営者の経歴(Aboutページの記述と一致させている)と、詳細ページへの
 * 導線を、アイコンつきのプロフィール欄として出す。
 */
export default function AuthorByline() {
  return (
    <div style={wrap}>
      <OperatorMark size={46} />
      <div>
        <div style={name}>
          全国自治体データランキング 運営者
          <span style={role}>元自治体職員・現データコンサルタント</span>
        </div>
        <p style={text}>
          行政・民間で10年以上、統計データの分析と可視化に携わっています。
          この記事は、公的統計をもとに運営者が計算・執筆しました。
        </p>
        <div>
          <Link prefetch={false} href="/about" style={link}>
            運営者情報を見る →
          </Link>
          <Link prefetch={false} href="/editorial-policy" style={link}>
            編集方針 →
          </Link>
          <Link prefetch={false} href="/contact" style={link}>
            お問い合わせ →
          </Link>
        </div>
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = {
  display: "flex",
  gap: 14,
  alignItems: "flex-start",
  marginTop: 32,
  marginBottom: 8,
  padding: "16px 18px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
};

const name: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 15,
  color: "#111827",
  marginBottom: 4,
};

const role: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 12,
  color: "#1d4ed8",
  marginLeft: 8,
};

const text: React.CSSProperties = {
  margin: "0 0 6px",
  fontSize: 13,
  lineHeight: 1.9,
  color: "#4b5563",
};

const link: React.CSSProperties = {
  marginRight: 12,
  fontSize: 13,
  color: "#2563eb",
  textDecoration: "underline",
};
