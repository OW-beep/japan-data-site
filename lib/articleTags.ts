export type TagKey =
  | "population"
  | "child"
  | "aging"
  | "finance"
  | "household"
  | "geography"
  | "migration"
  | "composite"
  | "medical"
  | "labor"
  | "industry"
  | "international";

export const TAGS: Record<TagKey, { label: string; bg: string; fg: string }> = {
  population: { label: "人口", bg: "#dbeafe", fg: "#1d4ed8" },
  child: { label: "子ども・出生", bg: "#fce7f3", fg: "#be185d" },
  aging: { label: "高齢化", bg: "#fef3c7", fg: "#b45309" },
  finance: { label: "財政", bg: "#d1fae5", fg: "#047857" },
  household: { label: "世帯", bg: "#ede9fe", fg: "#6d28d9" },
  geography: { label: "地理・面積", bg: "#cffafe", fg: "#0e7490" },
  migration: { label: "社会増減", bg: "#fee2e2", fg: "#b91c1c" },
  composite: { label: "総合", bg: "#e2e8f0", fg: "#334155" },
  medical: { label: "医療", bg: "#dcfce7", fg: "#15803d" },
  labor: { label: "雇用・労働", bg: "#ffedd5", fg: "#c2410c" },
  industry: { label: "産業構造", bg: "#e0e7ff", fg: "#4338ca" },
  international: { label: "国際化", bg: "#fef9c3", fg: "#a16207" },
};
