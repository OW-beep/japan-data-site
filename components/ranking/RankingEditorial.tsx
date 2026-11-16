import type { ReactNode } from "react";

/**
 * ランキングページ冒頭の「読み解き」欄。
 *
 * 表だけのページにしないため、指標の構造や誤読しやすい点を
 * 編集部が文章で補うための共通枠。本文は各ページ側で書く
 * (自動生成文は入れない)。
 */
export default function RankingEditorial({ children }: { children: ReactNode }) {
  return (
    <section
      style={{
        background: "#fffbeb",
        border: "1px solid #fde68a",
        borderRadius: 12,
        padding: "16px 20px 6px",
        marginBottom: 24,
        lineHeight: 1.9,
        color: "#374151",
        fontSize: 15,
      }}
    >
      <h2 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px", color: "#92400e" }}>
        このランキングの見方・読み解き
      </h2>
      {children}
    </section>
  );
}
