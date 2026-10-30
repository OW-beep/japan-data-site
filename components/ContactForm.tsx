"use client";

import { useState } from "react";
import { CONTACT_EMAIL, FORMSPREE_FORM_ID } from "@/lib/site";

const TYPES = [
  "掲載データ・数値の誤りの指摘",
  "記事・ランキングの内容へのご意見・ご要望",
  "取材・広告掲載のご相談",
  "自治体財政健全度レポートのご依頼",
  "その他",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // フォームIDが未設定の間は、メールでの案内のみ表示する
  if (!FORMSPREE_FORM_ID) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div style={sentBox} role="status">
        送信しました。内容を確認のうえ、順次ご返信いたします。
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <label htmlFor="cf-name" style={label}>お名前(ハンドルネーム可)</label>
      <input id="cf-name" name="name" type="text" required style={field} />

      <label htmlFor="cf-email" style={label}>メールアドレス</label>
      <input id="cf-email" name="email" type="email" required style={field} />

      <label htmlFor="cf-type" style={label}>お問い合わせ種別</label>
      <select id="cf-type" name="inquiryType" required defaultValue="" style={field}>
        <option value="" disabled>選択してください</option>
        {TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <label htmlFor="cf-url" style={label}>対象のページURL(分かる場合)</label>
      <input id="cf-url" name="pageUrl" type="url" placeholder="https://" style={field} />

      <label htmlFor="cf-message" style={label}>お問い合わせ内容</label>
      <textarea id="cf-message" name="message" required rows={6} style={field} />

      {/* スパム対策(人間には見えない欄) */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />

      <button type="submit" disabled={status === "sending"} style={button}>
        {status === "sending" ? "送信中..." : "送信する"}
      </button>

      {status === "error" && (
        <p style={{ color: "#b91c1c", fontSize: 14, marginTop: 10 }}>
          送信に失敗しました。お手数ですが、{CONTACT_EMAIL} までメールでご連絡ください。
        </p>
      )}
    </form>
  );
}

const label: React.CSSProperties = { display: "block", fontSize: 14, fontWeight: 700, margin: "16px 0 6px" };
const field: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 16,
  fontFamily: "inherit",
};
const button: React.CSSProperties = {
  marginTop: 20,
  padding: "12px 28px",
  background: "#1d4ed8",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};
const sentBox: React.CSSProperties = {
  marginTop: 16,
  padding: 20,
  background: "#ecfdf5",
  border: "1px solid #a7f3d0",
  borderRadius: 10,
  lineHeight: 1.8,
};
