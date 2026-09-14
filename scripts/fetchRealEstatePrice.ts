import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ------------------------------------------------------------------
// 不動産情報ライブラリ(国土交通省)の XIT001 API から、
// 都道府県ごとの不動産取引価格情報を取得し、市区町村単位で
// 「宅地(土地)の平均坪単価」「中古マンション等の平均平米単価」
// を集計して data/real-estate-price.json に保存する。
//
// 【対象API】
//   XIT001: 不動産価格(取引価格・成約価格)情報取得API
//   https://www.reinfolib.mlit.go.jp/help/apiManual/xit001/
//
// 【認証】
//   ヘッダー "Ocp-Apim-Subscription-Key" にAPIキーを付与する。
//   .env.local に REINFOLIB_API_KEY=xxxx を設定しておくこと。
//
// 【重要 - 必ず確認してから本番実行してください】
//   api.e-stat.go.jp 系と同様、reinfolib.mlit.go.jp も
//   Claude の実行環境(サンドボックス)からは到達できないため、
//   このスクリプトは実際のレスポンスで動作確認ができていません。
//   下記の「レスポンス項目名の想定」は公開されている類似システム
//   (土地総合情報システム)の一般的なスキーマを参考にしたもので、
//   reinfolib で完全に同一とは限りません。
//
//   実行前に、まず1回だけ小さい範囲(例: 1都道府県・1年分)で
//   fetchPrefecture() の生レスポンスを console.log で確認し、
//   TYPE_LAND / TYPE_CONDO の判定文字列や、価格・面積の
//   フィールド名が実際のレスポンスと一致しているか確認してください。
//   ズレていた場合は、この下の定数・parseRecord() を実データに
//   合わせて調整してください。
// ------------------------------------------------------------------

const API_KEY = process.env.REINFOLIB_API_KEY;
const BASE_URL = "https://www.reinfolib.mlit.go.jp/ex-api/external/XIT001";

// 取得対象年(直近の完結した1年をデフォルトにしている)
const YEAR = Number(process.argv[2]) || new Date().getFullYear() - 1;

// 全国47都道府県コード(01〜47)
const PREFECTURE_CODES = Array.from({ length: 47 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

// 取引の種類の想定文字列(実データで要確認)
const TYPE_LAND = "宅地(土地)";
const TYPE_CONDO = "中古マンション等";

type RawRecord = {
  Type?: string;
  Municipality?: string;
  MunicipalityCode?: string;
  TradePrice?: string | number;
  Area?: string | number;
  UnitPrice?: string | number; // 平米単価(マンション等で提供される場合がある)
  [key: string]: unknown;
};

type MuniAgg = {
  code: string;
  name: string;
  landUnitPriceSum: number;
  landCount: number;
  condoUnitPriceSum: number;
  condoCount: number;
};

async function fetchPrefecture(areaCode: string): Promise<RawRecord[]> {
  const url = `${BASE_URL}?year=${YEAR}&area=${areaCode}`;

  const res = await fetch(url, {
    headers: {
      "Ocp-Apim-Subscription-Key": API_KEY as string,
    },
  });

  if (!res.ok) {
    console.error(`  [area=${areaCode}] HTTPエラー: ${res.status}`);
    return [];
  }

  const json = await res.json();

  // レスポンスの構造は要確認。よくあるパターン(data配列直下)を想定。
  const records: RawRecord[] = Array.isArray(json)
    ? json
    : json?.data ?? json?.Data ?? [];

  return records;
}

function unitPriceOf(record: RawRecord): number | null {
  // マンション等はUnitPrice(平米単価)が提供されることがある。
  if (record.UnitPrice) {
    const v = Number(record.UnitPrice);
    return Number.isFinite(v) && v > 0 ? v : null;
  }
  // 土地はTradePrice(総額)÷Area(面積)で平米単価を算出する。
  const price = Number(record.TradePrice);
  const area = Number(record.Area);
  if (Number.isFinite(price) && Number.isFinite(area) && area > 0) {
    return price / area;
  }
  return null;
}

async function main() {
  if (!API_KEY) {
    console.error(
      "REINFOLIB_API_KEY が未設定です。.env.local に REINFOLIB_API_KEY=xxxx を追加してください。"
    );
    process.exit(1);
  }

  console.log(`対象年: ${YEAR}年`);

  const aggByCode = new Map<string, MuniAgg>();

  for (const areaCode of PREFECTURE_CODES) {
    console.log(`都道府県コード ${areaCode} を取得中...`);

    const records = await fetchPrefecture(areaCode);
    console.log(`  ${records.length} 件取得`);

    for (const record of records) {
      const code = record.MunicipalityCode;
      const name = record.Municipality;
      if (!code || !name) continue;

      const unitPrice = unitPriceOf(record);
      if (unitPrice == null) continue;

      if (!aggByCode.has(code)) {
        aggByCode.set(code, {
          code,
          name,
          landUnitPriceSum: 0,
          landCount: 0,
          condoUnitPriceSum: 0,
          condoCount: 0,
        });
      }
      const agg = aggByCode.get(code)!;

      if (record.Type === TYPE_LAND) {
        agg.landUnitPriceSum += unitPrice;
        agg.landCount += 1;
      } else if (record.Type === TYPE_CONDO) {
        agg.condoUnitPriceSum += unitPrice;
        agg.condoCount += 1;
      }
    }

    // APIへの負荷を避けるため、リクエスト間に間隔を空ける。
    await new Promise((r) => setTimeout(r, 500));
  }

  const result = Array.from(aggByCode.values())
    .filter((a) => a.landCount > 0 || a.condoCount > 0)
    .map((a) => ({
      code: a.code,
      name: a.name,
      landPricePerSqm:
        a.landCount > 0 ? Math.round(a.landUnitPriceSum / a.landCount) : null,
      landSampleSize: a.landCount,
      condoPricePerSqm:
        a.condoCount > 0
          ? Math.round(a.condoUnitPriceSum / a.condoCount)
          : null,
      condoSampleSize: a.condoCount,
    }));

  console.log(`\n${result.length} 自治体分のデータを集計しました。`);
  console.log("サンプル:", result.slice(0, 3));

  fs.writeFileSync(
    "data/real-estate-price.json",
    JSON.stringify(result, null, 2),
    "utf8"
  );

  console.log("data/real-estate-price.json に保存しました。");
  console.log(
    `年を変えて実行する場合は: npm run fetch:real-estate -- ${YEAR - 1}`
  );
}

main();
