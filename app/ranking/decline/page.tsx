import { notFound } from "next/navigation";
import type { Metadata } from "next";

import RankCard from "../../../components/RankCard";
import MetricBox from "../../../components/MetricBox";
import { getMunicipalities } from "../../../lib/municipalities";

// ⚠️ 一時的に非公開にしています。
// 以前はこのページの指標が実際の人口減少率ではなく、
// 「子ども人口＋高齢者人口の割合」で代用した仮の数値でした。
//
// 再公開する手順:
// 1. scripts/buildDeclineRate.ts を実行して data/declineRate.json を作成
//    (中のRATE_CATEGORY_CODEは --list-categories の結果を見て要確認)
// 2. declineRate を cities.json にマージ(lib/City.ts に既にフィールドあり)
// 3. 下の `export default function Page(): never` を削除し、
//    `_UnpublishedOriginalPage` を `Page` にリネームして
//    metadata もこのファイル内に追加する
export default function Page(): never {
  notFound();
}

export const _metadata: Metadata = {
  title: "全国自治体 人口減少率ランキング",
  description:
    "総務省の住民基本台帳データに基づく、実際の人口増減率で比較する自治体ランキングです。",
};

function _UnpublishedOriginalPage() {
  const ranking = getMunicipalities()
    .filter((c) => c.declineRate != null)
    .sort((a, b) => (a.declineRate ?? 0) - (b.declineRate ?? 0))
    .slice(0, 50);

  return (
    <div>
      <h1>人口減少率ランキング</h1>

      <MetricBox
        title="指標定義"
        unit="%"
        definition="住民基本台帳に基づく前年からの人口増減率"
        formula="人口増減率 = (今年の人口 − 前年の人口) ÷ 前年の人口 × 100"
        example={{
          name: `例：${ranking[0]?.name ?? ""}`,
          value: ranking[0]?.declineRate ?? 0,
        }}
      />

      <div style={{ marginTop: 12 }}>
        {ranking.map((c, i) => (
          <RankCard
            key={c.code}
            rank={i + 1}
            name={c.name}
            value={(c.declineRate ?? 0).toFixed(2)}
            unit="%"
          />
        ))}
      </div>
    </div>
  );
}