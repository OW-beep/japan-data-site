"use client";

import { useState } from "react";
import ShareButtons from "@/components/ShareButtons";
import { SITE_URL } from "@/lib/site";

/**
 * 比較結果のシェア(X / LINE / はてブ + URLをコピー)。
 * 比較する2つの自治体はURL(?a=コード&b=コード)に入っているので、
 * このURLを共有すると、相手にも同じ比較結果が表示される。
 */
export default function CompareShare({
  nameA,
  nameB,
  codeA,
  codeB,
}: {
  nameA: string;
  nameB: string;
  codeA: string;
  codeB: string;
}) {
  const url = `${SITE_URL}/compare?a=${encodeURIComponent(codeA)}&b=${encodeURIComponent(codeB)}`;
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードが使えない環境では、何もしない(URLはアドレスバーからコピーできる)
    }
  }

  return (
    <div
      style={{
        marginTop: 24,
        padding: "14px 16px",
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
        この比較結果をシェア
      </div>
      <p style={{ margin: "0 0 4px", fontSize: 12.5, color: "#6b7280", lineHeight: 1.7 }}>
        リンクを開いた人にも、{nameA}と{nameB}の比較結果が表示されます。
      </p>

      <ShareButtons
        title={`${nameA}と${nameB}を比較してみた(人口・財政・医療など16項目)`}
        label=""
        url={url}
      />

      <button
        type="button"
        onClick={copy}
        style={{
          background: "#fff",
          border: "1px solid #d1d5db",
          borderRadius: 999,
          padding: "6px 14px",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {copied ? "コピーしました" : "URLをコピー"}
      </button>
    </div>
  );
}
