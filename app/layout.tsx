import "./globals.css";
import Script from "next/script";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4630812027939211"
          crossOrigin="anonymous"
        />
      </head>

      <body style={body}>
        <header style={header}>
          🇯🇵 日本自治体データランキング
        </header>

        <div style={adBox}>広告枠（上）</div>

        <main style={main}>{children}</main>

        <div style={adBox}>広告枠（中）</div>
        <div style={adBox}>広告枠（下）</div>
      </body>
    </html>
  );
}

const body: React.CSSProperties = {
  margin: 0,
  fontFamily: "system-ui",
  background: "#f5f7ff",
  color: "#111",
};

const header: React.CSSProperties = {
  padding: 14,
  background: "white",
  borderBottom: "1px solid #eee",
  fontWeight: 800,
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const main: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 20,
};

const adBox: React.CSSProperties = {
  maxWidth: 900,
  margin: "16px auto",
  padding: 20,
  background: "white",
  borderRadius: 12,
  border: "1px dashed #ccc",
  textAlign: "center",
  color: "#888",
};