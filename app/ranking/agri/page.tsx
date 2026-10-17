import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isReleased } from "@/lib/release";

import AdSense from "@/components/AdSense";
import Breadcrumbs from "@/components/Breadcrumbs";
import DataAsOf from "@/components/DataAsOf";
import { AGRI_GROUPS, AGRI_META, getAgriItem, oku, topPublished } from "@/lib/agriOutput";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/agri" },
  title: "農業産出額 市町村ランキング【令和6年】米・果実・畜産の品目別",
  description:
    "農林水産省「市町村別農業産出額(推計)」令和6年をもとに、米・みかん・りんご・いちご・肉用牛・豚・鶏卵など、品目別に産出額が多い市町村を全国順位で一覧。推計の読み方と、数値が非公表の市町村の扱いも解説します。",
};

export default function AgriHubPage() {
  // 予約公開(lib/release.ts)。日付が来るまでは 404
  if (!isReleased("/ranking/agri")) notFound();
  const total = getAgriItem("total");
  const t1 = total?.top[0];
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px" }}>
      <Breadcrumbs items={[{ name: "ランキング", href: "/ranking" }, { name: "農業産出額" }]} />
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>🌾 農業産出額 市町村ランキング(品目別)</h1>

      <DataAsOf text="農林水産省「市町村別農業産出額(推計)」令和6年(2026年9月訂正反映)" />

      <p style={{ lineHeight: 1.9, color: "#374151" }}>
        農林水産省が公表している市町村別農業産出額(推計)から、品目別に産出額が多い市町村を並べました。{t1 && (
          <>
            令和6年の農業産出額の総合1位は
            <strong>
              {t1.city}({t1.pref})
              {t1.v != null ? `の${oku(t1.v)}億円` : ""}
            </strong>
            です。
          </>
        )}
        ただし、これは都道府県の産出額を作付面積や飼養頭数などで市町村に割り振った<strong>推計</strong>で、市町村ごとの価格や
        単収の違いは反映されません。実際の販売額や収穫量とは一致しない点に注意してください。
      </p>

      <AdSense />

      {AGRI_GROUPS.map((g) => ({ ...g, slugs: g.slugs.filter((s) => getAgriItem(s)) }))
        .filter((g) => g.slugs.length > 0)
        .map((g) => (
        <section key={g.title} style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 22, marginBottom: 10 }}>{g.title}</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
            {g.slugs.map((s) => {
              const it = getAgriItem(s)!;
              const first = it.top[0];
              const pub = topPublished(it)!;
              return (
                <li key={s} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff" }}>
                  <Link prefetch={false} href={`/ranking/agri/${s}`} style={{ fontWeight: 700, color: "#1d4ed8" }}>
                    {s === "total" ? "農業産出額(総合)" : `${it.label}の産出額ランキング`}
                  </Link>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                    1位 {first.city}({first.pref})
                    {first.v == null ? "・非公表" : ` ${oku(first.v)}億円`}
                    {first.v == null && <> ／ 公表値の最多 {pub.city} {oku(pub.v!)}億円</>}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p style={{ marginTop: 32, fontSize: 12, color: "#6b7280", lineHeight: 1.7 }}>
        出典: 農林水産省「市町村別農業産出額(推計)」令和6年(令和8年7月24日公表、同年9月18日訂正)(
        <a href={AGRI_META.url} rel="noopener noreferrer" target="_blank" style={{ color: "#2563eb" }}>
          {AGRI_META.url}
        </a>
        )を加工して作成。
      </p>
    </main>
  );
}
