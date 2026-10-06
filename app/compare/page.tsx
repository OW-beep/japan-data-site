import { Suspense } from "react";
import type { Metadata } from "next";
import CompareClient from "@/components/CompareClient";
import AffiliateSlot from "@/components/AffiliateSlot";
import { getCities } from "@/lib/getCities";

const baseMetadata: Metadata = {
  alternates: { canonical: "/compare" },
  title: "自治体比較ツール｜2つの街を比べる",
  description:
    "2つの自治体を選んで、人口・高齢化率・財政力指数・医師数など16項目を横並びで比較できます。全国1741自治体に対応。",
};

/**
 * 共有された比較結果(/compare?a=コード&b=コード)では、タイトルを
 * 「○○と△△を比較」にする(SNSで共有されたときの表示になる)。
 * 組み合わせは無数にあり、中身の薄いページが増えるのを避けるため、
 * 検索エンジンには登録させない(noindex)。canonical は /compare にまとめる。
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}): Promise<Metadata> {
  const { a, b } = await searchParams;
  if (!a || !b) return baseMetadata;

  const cities = getCities();
  const cityA = cities.find((c) => c.code === a);
  const cityB = cities.find((c) => c.code === b);
  if (!cityA || !cityB) return baseMetadata;

  return {
    ...baseMetadata,
    title: `${cityA.name}と${cityB.name}を比較｜人口・財政・医療など16項目`,
    description: `${cityA.name}と${cityB.name}を、人口・高齢化率・財政力指数・医師数など16項目で横並びに比較した結果です。`,
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "28px 24px",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          marginBottom: 12,
        }}
      >
        ⚖️ 自治体比較ツール
      </h1>

      <p
        style={{
          color: "#6b7280",
          marginBottom: 30,
          lineHeight: 1.8,
        }}
      >
        2つの自治体を選ぶと、人口・高齢化率・財政力指数・医師数
        など16項目を横並びで比較できます。数字が優れている方を
        青字で表示します(人口・面積・人口密度などは優劣が
        つけられない指標のため、色分けしていません)。
      </p>

      <Suspense fallback={<p>読み込み中...</p>}>
        <CompareClient />
      </Suspense>

      <AffiliateSlot topic="moving" />
    </main>
  );
}
