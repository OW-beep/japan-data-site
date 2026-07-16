import Link from "next/link";
import type { Metadata } from "next";

import { getPrefectures } from "@/lib/getPrefecture";
import { getMunicipalities } from "@/lib/municipalities";

export const metadata: Metadata = {
  title: "都道府県から探す",
  description:
    "全国47都道府県から、自治体データ・ランキングを探せます。",
};

export default function Page() {
  const prefectures = getPrefectures();
  const municipalities = getMunicipalities();

  const countOf = (pref: string) =>
    municipalities.filter((c) => c.name.startsWith(pref + " "))
      .length;

  return (
    <main
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "28px 24px",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        🗾 都道府県から探す
      </h1>

      <p
        style={{
          color: "#4b5563",
          lineHeight: 1.8,
          marginBottom: 30,
        }}
      >
        都道府県を選ぶと、その都道府県内の市区町村データを
        まとめて確認できます。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        {prefectures.map((pref) => (
          <Link
            key={pref}
            href={`/prefecture/${encodeURIComponent(pref)}`}
            style={{
              display: "block",
              padding: "16px 18px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              textDecoration: "none",
              color: "#111827",
            }}
          >
            <div style={{ fontWeight: 700 }}>{pref}</div>

            <div
              style={{
                fontSize: 13,
                color: "#9ca3af",
                marginTop: 4,
              }}
            >
              {countOf(pref)}市区町村
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
