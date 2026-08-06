import Link from "next/link";
import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getMunicipalities } from "../../../lib/municipalities";

export const metadata: Metadata = {
  title: "全国自治体 社会増減率ランキング(転入超過・転出超過)",
  description:
    "総務省「住民基本台帳人口移動報告」の転入者数・転出者数から算出した、社会増減率(人口移動による増減)のランキングです。",
};

export default function Page() {
  const ranking = getMunicipalities()
    .filter(
      (c) =>
        c.inMigrants != null &&
        c.outMigrants != null &&
        c.population > 0
    )
    .map((c) => ({
      ...c,
      rate:
        (((c.inMigrants ?? 0) - (c.outMigrants ?? 0)) /
          c.population) *
        100,
    }))
    .sort((a, b) => b.rate - a.rate);

  const top50 = ranking.slice(0, 50);
  const bottom50 = ranking.slice(-50).reverse();

  const average =
    ranking.reduce((s, c) => s + c.rate, 0) / ranking.length;

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
          fontSize: 34,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        全国自治体 社会増減率ランキング
      </h1>

      <DataAsOf />

      <p
        style={{
          color: "#4b5563",
          lineHeight: 1.8,
          marginBottom: 12,
        }}
      >
        総務省「住民基本台帳人口移動報告」の転入者数・転出者数をもとに、
        人口移動による増減(社会増減率)を算出したランキングです。
        プラスが大きいほど転入が転出を上回る「転入超過」、マイナスが大きいほど
        「転出超過」を意味します。
      </p>

      <p
        style={{
          fontSize: 13,
          color: "#9ca3af",
          marginBottom: 20,
        }}
      >
        ※この指標は転入・転出による人口の増減(社会増減)のみを示すもので、
        出生・死亡による自然増減は含みません。実際の総人口の増減率とは
        異なりますので、あわせて人口ランキングもご確認ください。
      </p>

      <a
        href="/articles/decline"
        style={{
          display: "inline-block",
          marginBottom: 20,
          padding: "10px 16px",
          background: "#eff6ff",
          color: "#1d4ed8",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        📖 震災復興地域と都心再開発、転入超過の背景を読む →
      </a>

      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginTop: 30,
          marginBottom: 10,
        }}
      >
        転入超過TOP50
      </h2>

      <div>
        {top50.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.rate.toFixed(2)}
            unit="%"
          />
        ))}
      </div>

      <AdSense />

      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginTop: 40,
          marginBottom: 10,
        }}
      >
        転出超過TOP50
      </h2>

      <div>
        {bottom50.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={c.rate.toFixed(2)}
            unit="%"
          />
        ))}
      </div>

      <p
        style={{
          marginTop: 30,
          fontSize: 14,
          color: "#6b7280",
        }}
      >
        全国平均：{average.toFixed(2)}%(対象自治体
        {ranking.length.toLocaleString()})
      </p>

      <div style={{ marginTop: 30 }}>
        <Link href="/ranking" style={{ color: "#2563eb" }}>
          ← ランキング一覧に戻る
        </Link>
      </div>
    </main>
  );
}
