/**
 * 予約公開の仕組み(現在は使っていない)。
 *
 * 日付(日本時間 0:00)を書いたページは、その日までページ本体が404になり、サイトマップ・一覧・関連リンクにも出ない。
 * 反映には毎日のビルドが必要になるため、公開できなくなる事故を避ける目的で、現在は空にしている。
 * すべてのページは、デプロイした時点で公開される。
 * 必要になったら、ここに "/articles/xxx": "YYYY-MM-DD" の形で書き、毎日のデプロイ(Deploy Hook)を設定する。
 */
export const RELEASE_AT: Record<string, string> = {};

export function releaseTime(path: string): number | null {
  const d = RELEASE_AT[path];
  return d ? Date.parse(`${d}T00:00:00+09:00`) : null;
}

/** 公開済みか(予約日が来ている、または予約していない) */
export function isReleased(path: string, now: number = Date.now()): boolean {
  if (process.env.RELEASE_PREVIEW === "1") return true;
  const t = releaseTime(path);
  return t == null || now >= t;
}

/** 表示する公開日(YYYY-MM-DD)。予約があればその日、なければ fallback */
export function releaseDate(path: string, fallback: string): string {
  return RELEASE_AT[path] ?? fallback;
}
