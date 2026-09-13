import raw from "@/data/capital-elevation.json";

export type CapitalElevation = {
  pref: string;
  city: string;
  elevationM: number;
};

const RAW = raw as CapitalElevation[];

/**
 * 都道府県庁所在地の標高データ。
 *
 * 出典: 国土地理院「都道府県の庁舎及び東西南北端点の経緯度(世界測地系)」
 * (約5m四方間隔の航空レーザ測量による数値、誤差0.3m以内)
 * 数値は https://uub.jp/pdr/s/cap.html の集計値と照合済み。
 *
 * 標高は地形の変化がない限りほぼ変動しない情報のため、
 * 都度APIを呼び出す必要がなく、静的データとして保持している。
 */
export function getCapitalElevationRanking(): CapitalElevation[] {
  return [...RAW].sort((a, b) => b.elevationM - a.elevationM);
}
