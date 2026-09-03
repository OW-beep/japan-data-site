import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import AdSense from "../../../components/AdSense";
import DataAsOf from "../../../components/DataAsOf";
import { getLivingInfrastructureScores } from "../../../lib/compositeScores";

export const metadata: Metadata = {
  alternates: { canonical: "/ranking/living-infrastructure-index" },
  title: "生活基盤充実度指数 ランキング｜商業集積・公民館・空き家率を統合",
  description:
    "人口あたりの商業集積(小売・飲食店)、公民館数、空き家率を統合した「生活基盤充実度指数」の全自治体ランキングです。",
};

export default function LivingInfrastructureRankingPage() {
  const ranking = getLivingInfrastructureScores().slice(0, 100);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🏘️ 生活基盤充実度指数 ランキング
      </h1>

      <DataAsOf />

      <a
        href="/articles/living-infrastructure-index"
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
        📖 生活基盤充実度指数の解説記事を読む →
      </a>

      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.8 }}>
        人口あたりの商業集積・公民館数・空き家率(逆指標)をZスコア化して合算した、
        本サイト独自の複合指数です。空き家率は別荘地などで高く出やすい点にご注意ください。
      </p>

      <AdSense />

      <div style={{ marginTop: 20 }}>
        {ranking.map((city, index) => (
          <RankCard
            key={city.code}
            rank={index + 1}
            name={city.name}
            value={city.score.toFixed(2)}
            unit=""
          />
        ))}
      </div>
    </main>
  );
}
