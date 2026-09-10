"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-consent-v1";

/**
 * Google AdSense / EU圏のユーザー向け同意バナー。
 *
 * Googleは、EEA(欧州経済領域)・英国のユーザーに広告を配信する
 * パブリッシャーに対し、Cookie利用について明示的な同意を得る
 * ことを求めている(Googleの「EU ユーザーの同意ポリシー」)。
 * 本コンポーネントは、その最低限の対応として、初回訪問時に
 * Cookie利用について案内し、同意/拒否を選べるようにする。
 *
 * 同意状況はlocalStorageに保存し、adsbygoogleへの通知は
 * window.gtag / dataLayer が存在する場合のみ行う(未設定でもエラーにならない)。
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setVisible(true);
      }
    } catch {
      // localStorageが使えない環境では何もしない
    }
  }, []);

  function respond(choice: "accepted" | "rejected") {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // 保存に失敗しても表示だけは閉じる
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={wrap} role="dialog" aria-label="Cookie利用に関する同意">
      <div style={inner}>
        <p style={text}>
          当サイトでは、広告配信(Google
          AdSense)およびアクセス解析のためにCookieを使用しています。
          詳しくは
          <Link href="/privacy" style={link}>
            プライバシーポリシー
          </Link>
          をご確認ください。
        </p>

        <div style={buttons}>
          <button
            onClick={() => respond("rejected")}
            style={secondaryButton}
          >
            拒否する
          </button>
          <button onClick={() => respond("accepted")} style={primaryButton}>
            同意する
          </button>
        </div>
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  background: "#111827",
  color: "#fff",
  padding: "16px",
  boxShadow: "0 -4px 16px rgba(0,0,0,0.15)",
};

const inner: React.CSSProperties = {
  maxWidth: 1000,
  margin: "0 auto",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 16,
  justifyContent: "space-between",
};

const text: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.8,
  color: "#d1d5db",
  flex: "1 1 320px",
};

const link: React.CSSProperties = {
  color: "#93c5fd",
  textDecoration: "underline",
  margin: "0 4px",
};

const buttons: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexShrink: 0,
};

const secondaryButton: React.CSSProperties = {
  background: "transparent",
  color: "#d1d5db",
  border: "1px solid #4b5563",
  borderRadius: 8,
  padding: "8px 14px",
  fontSize: 13,
  cursor: "pointer",
};

const primaryButton: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};
