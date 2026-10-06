/**
 * ランキングページの meta description に「1位は○○(値)」を自動で入れる。
 *
 * 1位の自治体と値は、lib/rankingCommentary.ts の rows()(ランキングと同じ式・同じ除外条件)
 * から、ビルド時に計算する。データが更新されれば、説明文も手作業なしで追従する。
 *
 * 使い方(ランキングページ):
 *   const baseMetadata: Metadata = { title: "...", description: "..." };
 *   export function generateMetadata() { return withTop1("population", baseMetadata); }
 */
import type { Metadata } from "next";
import { COMMENTARY } from "./rankingCommentary";

export type Top1 = { name: string; value: string };

export function getTop1(slug: string): Top1 | null {
  const cfg = COMMENTARY[slug];
  if (!cfg) return null;
  const rows = cfg.rows();
  if (rows.length === 0) return null;

  let best = rows[0];
  for (const r of rows) {
    if (cfg.direction === "high" ? r.value > best.value : r.value < best.value) best = r;
  }
  if (!Number.isFinite(best.value)) return null;

  const value = best.value.toLocaleString(undefined, {
    minimumFractionDigits: cfg.digits,
    maximumFractionDigits: cfg.digits,
  });
  return { name: best.name, value: `${value}${cfg.unit}` };
}

/** description の先頭に「1位は○○(値)。」を足す。計算できなければ元のまま返す */
export function withTop1(slug: string, meta: Metadata): Metadata {
  const top = getTop1(slug);
  if (!top) return meta;
  const base = typeof meta.description === "string" ? meta.description : "";
  return { ...meta, description: `1位は${top.name}(${top.value})。${base}` };
}
