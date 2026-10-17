/**
 * 市町村ごとの農業産出額と「強み」。data/agri-city-r6.json(scripts/build_agri_city.py で作る)。
 * 強み = 品目別の全国順位が30位以内の品目(順位が付く市町村が40以上ある品目に限る)。
 * 按分による推計で、実際の販売額ではない。値が null のものは数値非公表(順位は公表)。
 */
import raw from "@/data/agri-city-r6.json";

export type Strength = { item: string; product: string; rn: number; v: number | null };
export type AgriCity = {
  pref: string;
  city: string;
  total: number | null;
  totalRn: number | null;
  totalRp: number | null;
  parts: { rice: number | null; veg: number | null; fruit: number | null; flower: number | null; livestock: number | null };
  strengths: Strength[];
};

const data = raw as unknown as Record<string, AgriCity>;

export function getAgriCity(code: string): AgriCity | null {
  return data[code] ?? null;
}

export function allAgriCities(): [string, AgriCity][] {
  return Object.entries(data);
}
