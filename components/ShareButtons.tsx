"use client";

import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/site";

/**
 * シェアボタン(X / LINE / はてなブックマーク)。
 * ただのリンクなので外部スクリプトは読み込まない(表示速度・プライバシーに影響しない)。
 */
export default function ShareButtons({
  title,
  label = "この記事をシェア",
  url: urlProp,
}: {
  title: string;
  label?: string;
  /** 指定すると、現在のパスの代わりにこのURLをシェアする(比較結果など、クエリ付きのURL用) */
  url?: string;
}) {
  const pathname = usePathname() ?? "/";
  const url = urlProp ?? `${SITE_URL}${pathname}`;
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const items = [
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
      bg: "#111827",
    },
    {
      name: "LINE",
      href: `https://social-plugins.line.me/lineit/share?url=${u}`,
      bg: "#06c755",
    },
    {
      name: "はてブ",
      href: `https://b.hatena.ne.jp/add?mode=confirm&url=${u}&title=${t}`,
      bg: "#00a4de",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 8,
        margin: "20px 0",
      }}
    >
      <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 700 }}>
        {label}
      </span>
      {items.map((i) => (
        <a
          key={i.name}
          href={i.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: i.bg,
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            padding: "6px 14px",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          {i.name}
        </a>
      ))}
    </div>
  );
}
