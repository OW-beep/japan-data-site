import prefectureStatsRaw from "@/data/prefectureStats.json";

export type PrefectureStats = {
  income?: number | null;
  lifeExpectancyMale?: number | null;
  lifeExpectancyFemale?: number | null;
};

const stats = prefectureStatsRaw as Record<string, PrefectureStats>;

/**
 * 都道府県単位でしか公表されていない統計(平均年収・平均寿命など)を
 * 取得する。scripts/fetchPrefectureIncome.ts や
 * scripts/fetchLifeExpectancy.ts を実行して
 * data/prefectureStats.json を埋めるまでは、全項目 null を返す。
 */
export function getPrefectureStats(): { pref: string; stats: PrefectureStats }[] {
  return Object.entries(stats).map(([pref, s]) => ({ pref, stats: s }));
}

export function hasPrefectureStatsData(): boolean {
  return Object.keys(stats).length > 0;
}
