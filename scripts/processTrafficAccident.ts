import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// ------------------------------------------------------------------
// 警察庁「交通事故統計情報のオープンデータ」の本票(honhyo_YYYY.csv)を
// ローカルで処理し、市区町村単位で人身事故の件数などを集計して
// data/traffic-accident-municipal.json に保存する。
//
// 入手先:
//   https://www.npa.go.jp/publications/statistics/koutsuu/opendata/2025/opendata_2025.html
//   「本票_01-12月(csv形式)」をダウンロードし、
//   data-raw/koutsu/honhyo_2025.csv として置く(文字コードは Shift_JIS/CP932)。
//
// 実行:
//   npm run process:traffic
//   npm run process:traffic -- path/to/honhyo_2025.csv
//
// 集計のルール(コードブック・ファイル定義書に基づく):
//   - 本票の1行 = 人身事故1件。物損事故は含まれない。
//   - 都道府県コードは警察庁独自のコード(北海道は5方面)なので、
//     JISの都道府県コード2桁に変換し、市区町村コード3桁(標準地域コード)と
//     つなげて全国地方公共団体コード5桁にする。
//   - 政令指定都市の区(例: 14101 横浜市鶴見区、14131 川崎市川崎区)は、親の市に合算する。
//     親の市のコードは「…100」とは限らない(川崎14130・相模原14150・浜松22130・
//     堺27140・福岡40130など)ので、20市のコードを一覧にして、区のコードより小さい
//     最大の親コードに合算する。東京23区は区のまま集計する(サイトでも区が個別の自治体のため)。
//   - 事故のない自治体の行は存在しないので、読む側で0件として補うこと。
//   - ファイルに含まれる行は、警察庁の令和7年中の統計(287,023件)と一致する。
//     発生日時が前年12月のものも一部含まれるが、そのまま全件を使う。
// ------------------------------------------------------------------

// 警察庁の都道府県コード -> JIS都道府県コード(コードブック「都道府県」シートの名称から作成)
const NPA_TO_JIS: Record<string, string> = {
  "10": "01", "11": "01", "12": "01", "13": "01", "14": "01", // 北海道(5方面)
  "20": "02", "21": "03", "22": "04", "23": "05", "24": "06", "25": "07",
  "30": "13",
  "40": "08", "41": "09", "42": "10", "43": "11", "44": "12", "45": "14",
  "46": "15", "47": "19", "48": "20", "49": "22",
  "50": "16", "51": "17", "52": "18", "53": "21", "54": "23", "55": "24",
  "60": "25", "61": "26", "62": "27", "63": "28", "64": "29", "65": "30",
  "70": "31", "71": "32", "72": "33", "73": "34", "74": "35",
  "80": "36", "81": "37", "82": "38", "83": "39",
  "90": "40", "91": "41", "92": "42", "93": "43", "94": "44", "95": "45",
  "96": "46", "97": "47",
};

// 本票の列の位置(ファイル定義書の項目番号 - 1)
const COL = {
  prefecture: 1,
  accidentKind: 4, // 1=死亡事故, 2=負傷事故
  deaths: 5,
  injuries: 6,
  city: 9,
  month: 11, // 発生日時 月
  roadSurface: 22, // 1=乾燥, 2=湿潤, 3=凍結, 4=積雪, 5=非舗装
  accidentType: 35, // 01=人対車両
  ageA: 36, // 75=75歳以上
  partyTypeA: 38,
  partyTypeB: 39,
} as const;

// 当事者種別: 原付以上の車両(乗用・貨物・特殊・二輪)
const MOTOR_VEHICLE = new Set([
  "01", "02", "03", "04", "05", "07",
  "11", "12", "13", "14", "17",
  "21", "22", "23", "24",
  "31", "32", "33", "34", "35", "36",
]);
// 51=軽車両-自転車, 52=軽車両-駆動補助機付自転車
const BICYCLE = new Set(["51", "52"]);

type Agg = {
  accidents: number;
  fatalAccidents: number;
  deaths: number;
  injuries: number;
  elderlyDriverAccidents: number; // 第1当事者が75歳以上の原付以上の運転者
  bicycleAccidents: number; // いずれかの当事者が自転車
  pedestrianAccidents: number; // 人対車両
  icySnowAccidents: number; // 路面が凍結または積雪
};

// 政令指定都市20市の「市全体」の地域コード(面積調のコード表と照合済み)
const DESIGNATED_PARENTS = [
  "01100", "04100", "11100", "12100", "14100", "14130", "14150", "15100", "22100", "22130",
  "23100", "26100", "27100", "27140", "28100", "33100", "34100", "40100", "40130", "43100",
];
const PARENT_SET = new Set(DESIGNATED_PARENTS);

function municipalCode(npaPref: string, city: string): string | null {
  const jis = NPA_TO_JIS[npaPref];
  if (!jis) return null;
  const c = city.padStart(3, "0");
  const code = `${jis}${c}`;
  const n = Number(c);
  // 政令指定都市の区(下3桁が101〜199)は親の市へ。市全体のコード自体は動かさない。
  // 東京都(13)は区が自治体なので除く。
  if (jis !== "13" && n > 100 && n < 200 && !PARENT_SET.has(code)) {
    const parent = DESIGNATED_PARENTS.filter((p) => p.startsWith(jis) && p < code).pop();
    if (parent) return parent;
  }
  return code;
}

function main() {
  const input =
    process.argv[2] ?? path.join("data-raw", "koutsu", "honhyo_2025.csv");
  const output = path.join("data", "traffic-accident-municipal.json");

  if (!fs.existsSync(input)) {
    throw new Error(
      `${input} がありません。警察庁のオープンデータから本票CSVをダウンロードして置いてください。`
    );
  }

  console.log(`読み込み中: ${input}`);
  // 約60MB。1つの文字列としても上限(約5億文字)を大きく下回る。
  const text = new TextDecoder("shift_jis").decode(fs.readFileSync(input));
  const rows: string[][] = parse(text, {
    from_line: 2,
    relax_column_count: true,
    skip_empty_lines: true,
  });

  const header = text.slice(0, text.indexOf("\n"));
  if (!header.includes("都道府県コード") || !header.includes("市区町村コード")) {
    throw new Error("ヘッダー行が想定と違います(本票のCSVか確認してください)。");
  }

  const agg = new Map<string, Agg>();
  let unmapped = 0;

  // 全国の集計(路面状態別・月別)
  const surfaceKeys = ["1", "2", "3", "4", "5"] as const;
  const bySurface: Record<string, { accidents: number; fatalAccidents: number }> =
    Object.fromEntries(
      surfaceKeys.map((k) => [k, { accidents: 0, fatalAccidents: 0 }])
    );
  const accidentsByMonth: number[] = Array(12).fill(0);
  const icySnowByMonth: number[] = Array(12).fill(0);

  for (const r of rows) {
    const code = municipalCode(r[COL.prefecture], r[COL.city]);
    if (!code) {
      unmapped++;
      continue;
    }
    let a = agg.get(code);
    if (!a) {
      a = {
        accidents: 0,
        fatalAccidents: 0,
        deaths: 0,
        injuries: 0,
        elderlyDriverAccidents: 0,
        bicycleAccidents: 0,
        pedestrianAccidents: 0,
        icySnowAccidents: 0,
      };
      agg.set(code, a);
    }
    a.accidents++;
    const isFatal = r[COL.accidentKind] === "1";
    const surface = r[COL.roadSurface];
    const monthIdx = Number(r[COL.month]) - 1;
    if (bySurface[surface]) {
      bySurface[surface].accidents++;
      if (isFatal) bySurface[surface].fatalAccidents++;
    }
    if (monthIdx >= 0 && monthIdx < 12) {
      accidentsByMonth[monthIdx]++;
      if (surface === "3" || surface === "4") icySnowByMonth[monthIdx]++;
    }
    if (isFatal) a.fatalAccidents++;
    a.deaths += Number(r[COL.deaths]) || 0;
    a.injuries += Number(r[COL.injuries]) || 0;
    if (r[COL.ageA] === "75" && MOTOR_VEHICLE.has(r[COL.partyTypeA])) {
      a.elderlyDriverAccidents++;
    }
    if (BICYCLE.has(r[COL.partyTypeA]) || BICYCLE.has(r[COL.partyTypeB])) {
      a.bicycleAccidents++;
    }
    if (r[COL.accidentType] === "01") a.pedestrianAccidents++;
    if (r[COL.roadSurface] === "3" || r[COL.roadSurface] === "4") {
      a.icySnowAccidents++;
    }
  }

  const result = [...agg.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([code, v]) => ({ code, ...v }));

  const totalAcc = result.reduce((s, r) => s + r.accidents, 0);
  const totalDeaths = result.reduce((s, r) => s + r.deaths, 0);

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(result));

  const nationalOutput = path.join("data", "traffic-accident-national.json");
  fs.writeFileSync(
    nationalOutput,
    JSON.stringify({
      totalAccidents: totalAcc,
      totalDeaths,
      bySurface: {
        dry: bySurface["1"],
        wet: bySurface["2"],
        icy: bySurface["3"],
        snow: bySurface["4"],
        unpaved: bySurface["5"],
      },
      accidentsByMonth,
      icySnowByMonth,
    })
  );

  console.log(`読み込んだ行数: ${rows.length.toLocaleString()}`);
  console.log(`集計した自治体数: ${result.length.toLocaleString()}`);
  console.log(`人身事故件数の合計: ${totalAcc.toLocaleString()}`);
  console.log(`死者数の合計: ${totalDeaths.toLocaleString()}`);
  if (unmapped > 0) {
    console.warn(`警告: 都道府県コードを変換できなかった行が ${unmapped} 件あります`);
  }
  console.log("警察庁の令和7年中の公表値: 人身事故287,023件・死者2,547人");
  console.log(`保存しました: ${output}, ${nationalOutput}`);
}

main();
