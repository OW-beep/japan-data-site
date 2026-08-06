import fs from "fs";
import iconv from "iconv-lite";

// ------------------------------------------------------------------
// SSDSE-市区町村（SSDSE-A）を使って cities.json を拡張するスクリプト
//
// なぜこの方法か:
// buildCities.ts は e-Stat API を「カテゴリごと」に叩いているが、
// 婚姻件数(A9101)・離婚件数(A9201)は取得できているのに対し、
// 医師数(I6100)・病院数(I510120)・就業者数(F1102)・産業別就業者数
// (F2201/F2211/F2221)・小中学校数(E2101/E3101)・図書館数(G1401)などは
// 「このテーブル(0000020201)には含まれていない」という理由で
// buildCities.ts 側では取得を諦めている(コード内コメント参照)。
//
// これは e-Stat 側が A(人口・世帯)～J(福祉)の分野ごとに別の
// statsDataId を割り当てているためで、分野の数だけ調査・実装が
// 必要になり非常に手間がかかる。
//
// 一方、統計センター(総務省統計局の外郭団体)が公開している
// 「SSDSE-市区町村（SSDSE-A）」は、まさにこの A～J 全分野を
// あらかじめ 1741 市区町村 × 125 項目に統合済みの CSV として
// 無料公開している。API キー不要、単一ファイルの直接ダウンロード
// だけで済むため、buildCities.ts のカテゴリ別アプローチより
// はるかに効率的にデータを拡張できる。
//
// 出典: 独立行政法人 統計センター SSDSE-市区町村（SSDSE-A）
//   https://www.nstac.go.jp/use/literacy/ssdse/
//   https://www.nstac.go.jp/files/SSDSE-A-2026.csv
//
// 【注意】このスクリプトは e-stat.go.jp / nstac.go.jp への
// ネットワークアクセスが必要です。Claude の実行環境(サンドボックス)
// からはこのドメインに到達できないため、このスクリプトは未実行・
// 未検証です。ローカル環境または CI で実行して動作確認してください。
// ------------------------------------------------------------------

const SSDSE_URL =
  "https://www.nstac.go.jp/files/SSDSE-A-2026.csv";

// SSDSE-A-2026 の実際の列順（2026年6月30日公開版、統計センター
// 公式解説PDFで確認済み）。1列目=地域コード、2列目=都道府県、
// 3列目=市区町村、4列目以降が下記の項目コード順。
const COLUMNS = [
  "A1101", "A110101", "A110102", "A1102", "A110201", "A110202",
  "A1301", "A130101", "A130102", "A1302", "A130201", "A130202",
  "A1303", "A130301", "A130302", "A1419", "A141901", "A141902",
  "A1700", "A4101", "A4200", "A5101", "A5102", "A7101", "A710101",
  "A710201", "A810102", "A810105", "A811102", "A8201", "A8301",
  "A9101", "A9201", "B1101", "B1103",
  "C2108", "C210832", "C210833", "C210835", "C210836", "C210837",
  "C210838", "C210839", "C210840", "C210841", "C210844", "C210845",
  "C210846", "C210847", "C210848", "C210849", "C210850", "C210851",
  "C210852", "C2208", "C220832", "C220833", "C220835", "C220836",
  "C220837", "C220838", "C220839", "C220840", "C220841", "C220844",
  "C220845", "C220846", "C220847", "C220848", "C220849", "C220850",
  "C220851", "C220852", "C310201", "C310202",
  "D1202", "D2203", "D2211", "D3201", "D320101", "D3203", "D320303",
  "D320308", "D320310", "D320311",
  "E1101", "E1501", "E2101", "E2401", "E2501", "E3101", "E3401",
  "E3501", "E3901", "E3904", "E3905", "E3906", "E4101", "E4501",
  "F1102", "F110201", "F110202", "F1107", "F110701", "F110702",
  "F1108", "F110801", "F110802", "F2201", "F2211", "F2221",
  "G1201", "G1401",
  "H5507", "H550701", "H6130", "H6131", "H6132",
  "I510120", "I5102", "I5103", "I6100", "I6200", "I6300",
  "J250302",
] as const;

// このスクリプトで cities.json に取り込む項目だけを抜粋。
// (125項目すべてではなく、ランキング・記事化して有用性が高い
// と判断したものに絞っている。増やしたい場合は COLUMNS の
// インデックスを調べて追加すればよい。)
const FIELD_MAP: Record<string, string> = {
  A9101: "marriages", // 婚姻件数
  A9201: "divorces", // 離婚件数
  F1102: "laborForceCount", // 就業者数
  F1107: "unemployedCount", // 完全失業者数
  F2201: "primaryIndustryWorkers", // 第1次産業就業者数
  F2211: "secondaryIndustryWorkers", // 第2次産業就業者数
  F2221: "tertiaryIndustryWorkers", // 第3次産業就業者数
  I6100: "doctorsCount", // 医師数
  I510120: "hospitalCount", // 一般病院数
  I5102: "clinicCount", // 一般診療所数
  G1401: "libraryCount", // 図書館数
  E2101: "elementarySchoolCount", // 小学校数
  E3101: "juniorHighSchoolCount", // 中学校数
  H6130: "retailStoreCount", // 小売店数
  D3201: "totalRevenue", // 歳入決算総額(千円)
  D320101: "localTax", // 地方税(千円)
  D320310: "educationExpense", // 教育費(千円)
  D320303: "welfareExpense", // 民生費(千円)

  // ここから追加(2026-08 第2弾)
  B1103: "habitableArea", // 可住地面積(ha) — 総面積(area)と異なり山地等を除いた「住める土地」の面積
  A1700: "foreignPopulation", // 外国人人口
  A4101: "births", // 出生数(実数。birthRateは率、こちらは人数)
  A4200: "deaths", // 死亡数 — 自然増減率(A4101-A4200)を算出できる
  D2203: "ordinaryBalanceRatio", // 経常収支比率(%) — 財政の硬直度
  D2211: "realDebtServiceRatio", // 実質公債費比率(%) — 借金返済負担の重さ
  I6200: "dentistsCount", // 歯科医師数
  I6300: "pharmacistsCount", // 薬剤師数
  I5103: "dentalClinicCount", // 歯科診療所数
  H6131: "restaurantCount", // 飲食店数
  H6132: "largeRetailStoreCount", // 大型小売店数
  C210847: "accommodationFoodEstablishments", // 事業所数(宿泊業、飲食サービス業) — 観光経済の proxy
  J250302: "daycareCount", // 保育所等数
};

function parseCsvLine(line: string): string[] {
  // SSDSE-A の値はクォート/カンマを含まない単純な数値・地域名の
  // ため、単純な split で十分（他スクリプトの convertAreaCsv.ts
  // も同様の単純split方針）。
  return line.split(",");
}

async function main() {
  console.log("SSDSE-A-2026 をダウンロード中...");

  const res = await fetch(SSDSE_URL);

  if (!res.ok) {
    throw new Error(
      `SSDSE ダウンロード失敗: HTTP ${res.status}`
    );
  }

  const buffer = Buffer.from(
    await res.arrayBuffer()
  );

  // SSDSE の CSV は Shift-JIS で配布されているため、
  // iconv-lite で UTF-8 に変換する（これをやらないと
  // 市区町村名・項目名が文字化けする）。
  const text = iconv.decode(buffer, "Shift_JIS");

  const lines = text
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);

  // 1〜3行目はヘッダー（項目コード行・年次行・項目名行）
  // なので読み飛ばし、4行目以降が実データ。
  const dataLines = lines.slice(3);

  const records = new Map<string, Record<string, number | null>>();

  for (const line of dataLines) {
    const cols = parseCsvLine(line);

    const regionCode = cols[0]; // 例: "R01100"
    if (!regionCode || !regionCode.startsWith("R")) continue;

    // 既存 cities.json の code は "01100" のような
    // 5桁ゼロ埋めコード。先頭の "R" を外すだけで一致する。
    const code = regionCode.slice(1);

    const values = cols.slice(3);

    const rec: Record<string, number | null> = {};

    for (const [itemCode, fieldName] of Object.entries(
      FIELD_MAP
    )) {
      const idx = COLUMNS.indexOf(itemCode as any);
      if (idx === -1) continue;

      const raw = values[idx];
      const num = raw === "" || raw == null ? null : Number(raw);

      rec[fieldName] = Number.isFinite(num as number)
        ? (num as number)
        : null;
    }

    records.set(code, rec);
  }

  console.log(
    `SSDSE-A から ${records.size} 自治体分のデータを取得`
  );

  const cities: any[] = JSON.parse(
    fs.readFileSync("data/cities.json", "utf8")
  );

  let matched = 0;

  const merged = cities.map((city) => {
    const rec = records.get(city.code);

    if (rec) matched++;

    return {
      ...city,
      ...(rec ?? {}),
    };
  });

  fs.writeFileSync(
    "data/cities.json",
    JSON.stringify(merged, null, 2),
    "utf8"
  );

  console.log(
    `cities.json 更新完了: ${matched}/${cities.length} 自治体でSSDSEデータをマージ`
  );

  const meta = JSON.parse(
    fs.readFileSync("data/meta.json", "utf8")
  );

  fs.writeFileSync(
    "data/meta.json",
    JSON.stringify(
      {
        ...meta,
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("meta.json 更新完了");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
