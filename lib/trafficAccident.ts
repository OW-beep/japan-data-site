/**
 * 警察庁「交通事故統計情報のオープンデータ」(本票・令和7年)を
 * 市区町村単位で集計したデータの読み込み。
 *
 * データの作り方: scripts/processTrafficAccident.ts(npm run process:traffic)
 *   - data/traffic-accident-municipal.json … 市区町村別の件数
 *   - data/traffic-accident-national.json  … 全国の路面状態別・月別の集計
 *
 * 事故のない自治体は JSON に行がないため、読む側で 0 件として扱う。
 */
import municipalRaw from "@/data/traffic-accident-municipal.json";
import nationalRaw from "@/data/traffic-accident-national.json";

export type TrafficAccidentMunicipal = {
  code: string;
  accidents: number; // 人身事故件数
  fatalAccidents: number; // 死亡事故件数
  deaths: number; // 死者数(24時間以内)
  injuries: number;
  elderlyDriverAccidents: number; // 第1当事者が75歳以上の運転者
  bicycleAccidents: number; // 自転車が関与した事故
  pedestrianAccidents: number; // 人対車両の事故
  icySnowAccidents: number; // 路面が凍結または積雪
};

export const ACCIDENT_YEAR_LABEL = "令和7年(2025年)";

export const SOURCE_NOTE =
  "出典:警察庁「交通事故統計情報のオープンデータ」(令和7年本票)を加工して作成";

const rows = municipalRaw as TrafficAccidentMunicipal[];
const byCode = new Map(rows.map((r) => [r.code, r]));

const ZERO = (code: string): TrafficAccidentMunicipal => ({
  code,
  accidents: 0,
  fatalAccidents: 0,
  deaths: 0,
  injuries: 0,
  elderlyDriverAccidents: 0,
  bicycleAccidents: 0,
  pedestrianAccidents: 0,
  icySnowAccidents: 0,
});

/** 事故のなかった自治体は 0 件の行を返す */
export function getAccidentByCode(code: string): TrafficAccidentMunicipal {
  return byCode.get(code) ?? ZERO(code);
}

export function getAllAccidentRows(): TrafficAccidentMunicipal[] {
  return rows;
}

/**
 * 市区町村コードの照合が正常か(サイト側の自治体コードと食い違っていないか)。
 * 事故データに載っている自治体のうち、サイト側に存在する割合が 9 割以上なら正常。
 * 食い違っているときはランキングを公開しない(誤った 0 件が並ぶのを防ぐ)。
 */
export function isAccidentJoinHealthy(siteCodes: Iterable<string>): boolean {
  const set = new Set(siteCodes);
  if (rows.length === 0) return false;
  const matched = rows.filter((r) => set.has(r.code)).length;
  return matched / rows.length >= 0.9;
}

export type NationalAccidentSummary = {
  totalAccidents: number;
  totalDeaths: number;
  bySurface: Record<
    "dry" | "wet" | "icy" | "snow" | "unpaved",
    { accidents: number; fatalAccidents: number }
  >;
  accidentsByMonth: number[];
  icySnowByMonth: number[];
};

export const national = nationalRaw as NationalAccidentSummary;

/** 都道府県コード(JIS 2桁) -> 名称 */
export const PREF_NAMES: Record<string, string> = {
  "01": "北海道", "02": "青森県", "03": "岩手県", "04": "宮城県", "05": "秋田県",
  "06": "山形県", "07": "福島県", "08": "茨城県", "09": "栃木県", "10": "群馬県",
  "11": "埼玉県", "12": "千葉県", "13": "東京都", "14": "神奈川県", "15": "新潟県",
  "16": "富山県", "17": "石川県", "18": "福井県", "19": "山梨県", "20": "長野県",
  "21": "岐阜県", "22": "静岡県", "23": "愛知県", "24": "三重県", "25": "滋賀県",
  "26": "京都府", "27": "大阪府", "28": "兵庫県", "29": "奈良県", "30": "和歌山県",
  "31": "鳥取県", "32": "島根県", "33": "岡山県", "34": "広島県", "35": "山口県",
  "36": "徳島県", "37": "香川県", "38": "愛媛県", "39": "高知県", "40": "福岡県",
  "41": "佐賀県", "42": "長崎県", "43": "熊本県", "44": "大分県", "45": "宮崎県",
  "46": "鹿児島県", "47": "沖縄県",
};

/** 都道府県ごとの集計(自治体コードの先頭2桁で合算) */
export function aggregateByPrefecture() {
  const map = new Map<
    string,
    { code: string; name: string; accidents: number; icySnowAccidents: number }
  >();
  for (const r of rows) {
    const p = r.code.slice(0, 2);
    const cur = map.get(p) ?? {
      code: p,
      name: PREF_NAMES[p] ?? p,
      accidents: 0,
      icySnowAccidents: 0,
    };
    cur.accidents += r.accidents;
    cur.icySnowAccidents += r.icySnowAccidents;
    map.set(p, cur);
  }
  return [...map.values()];
}
