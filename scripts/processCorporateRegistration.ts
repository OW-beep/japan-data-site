import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// ------------------------------------------------------------------
// 国税庁「法人番号公表サイト」の「全件データダウンロード」で取得した
// CSVファイルをローカルで処理し、市区町村単位で
// 「新設法人数」「閉鎖法人数」「純増数」を集計して
// data/corporate-registration.json に保存する。
//
// APIを都度呼び出す必要はなく、ネットワーク接続も不要。
// ローカルのファイルを読むだけなので、このスクリプトはロジックを
// テスト済み(下記の動作確認手順を参照)。
//
// 【全件を一度に置けない場合(容量が大きい場合)】
//   このスクリプトは実行のたびに data/corporate-registration.json を
//   上書きするのではなく、既存の内容に「積み上げて」保存する。
//   そのため、以下のように都道府県を数件ずつ処理しては削除する、
//   という進め方が可能。
//
//     1. 数県分だけ data-raw/houjin/ に置く
//     2. npm run process:corporate を実行
//     3. 処理が終わったら、その数件分のCSVを削除してよい
//        (data/corporate-registration.json 側に結果が積み上がっている)
//     4. 次の数県分を data-raw/houjin/ に置いて、また実行する
//     5. 47都道府県ぶん繰り返す
//
//   注意: 同じ都道府県のデータを2回に分けて別々の回で処理すると、
//   「同一法人番号の履歴行を1件にまとめる」重複排除が回をまたいで
//   正しく働かない可能性があるため、1つの都道府県のファイル
//   (分割されている場合はその分割ファイルすべて)は、必ず同じ回で
//   まとめて処理すること。
//
// 【事前準備 - お手元で行う作業】
//   1. 以下のページを開く
//      https://www.houjin-bangou.nta.go.jp/download/zenken/index.html
//   2. 「CSV形式・Unicode」から、都道府県を選んでダウンロード
//      (登録不要・無料)
//   3. ダウンロードしたzipを解凍する
//   4. 解凍してできたCSVファイルを、このプロジェクトの
//      data-raw/houjin/ フォルダに置く
//   5. npm run process:corporate を実行する
//   6. (任意)処理済みのCSVを削除し、次の都道府県分を置いて繰り返す
//
// 【出力】
//   data/corporate-registration.json
//   { code: "全国地方公共団体コード5桁", newCount, closeCount, netGrowth }[]
//
// 【集計方法】
//   ・同じ法人番号の行が複数ある場合(商号変更等の履歴)は、
//     「最新履歴」列が "1" の行を優先し、なければ更新年月日が
//     最も新しい行を採用する(1法人1件として重複カウントを防ぐ)。
//   ・新設: 法人番号指定年月日が対象期間内 → 新設1件として計上。
//   ・閉鎖: 登記記録の閉鎖等年月日が対象期間内 → 閉鎖1件として計上。
//   ・法人種別が301(設立登記法人)のみを対象とする
//     (国の機関・地方公共団体・外国法人等は除外)。
// ------------------------------------------------------------------

const INPUT_DIR = process.argv[2] || "data-raw/houjin";
const MONTHS = Number(process.argv[3]) || 12;

// 国税庁の公式データ定義に基づく列順(0始まりインデックス)
const COL = {
  corporateNumber: 1,
  processType: 2,
  updateDate: 4,
  kind: 8,
  prefectureCode: 13,
  cityCode: 14,
  closeDate: 18,
  assignmentDate: 22,
  latest: 23,
} as const;

const TARGET_KIND = "301"; // 設立登記法人のみ

type CorpRow = {
  corporateNumber: string;
  updateDate: string;
  kind: string;
  prefectureCode: string;
  cityCode: string;
  closeDate: string;
  assignmentDate: string;
  latest: string;
};

function parseRow(cols: string[]): CorpRow | null {
  if (cols.length <= COL.assignmentDate) return null;
  return {
    corporateNumber: cols[COL.corporateNumber],
    updateDate: cols[COL.updateDate],
    kind: cols[COL.kind],
    prefectureCode: cols[COL.prefectureCode],
    cityCode: cols[COL.cityCode],
    closeDate: cols[COL.closeDate],
    assignmentDate: cols[COL.assignmentDate],
    latest: cols[COL.latest],
  };
}

function isNewer(a: CorpRow, b: CorpRow): boolean {
  // bの方がaより「最新の状態」として優先されるべきならtrue
  if (b.latest === "1" && a.latest !== "1") return true;
  if (a.latest === "1" && b.latest !== "1") return false;
  return b.updateDate > a.updateDate;
}

function listCsvFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    console.error(`入力フォルダが見つかりません: ${dir}`);
    console.error(
      "先に全件データCSVをダウンロード・解凍して、このフォルダに置いてください。"
    );
    process.exit(1);
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".csv"))
    .map((f) => path.join(dir, f));
}

function main() {
  const files = listCsvFiles(INPUT_DIR);
  if (files.length === 0) {
    console.error(`${INPUT_DIR} 内にCSVファイルが見つかりませんでした。`);
    process.exit(1);
  }

  console.log(`${files.length}個のCSVファイルを処理します...`);

  const today = new Date();
  const windowStart = new Date();
  windowStart.setMonth(windowStart.getMonth() - MONTHS);
  const from = windowStart.toISOString().slice(0, 10);
  const to = today.toISOString().slice(0, 10);
  console.log(`集計対象期間: ${from} 〜 ${to}`);

  // 法人番号ごとに「最新の状態」の行だけを保持する
  const latestByCorpNumber = new Map<string, CorpRow>();

  for (const file of files) {
    console.log(`読み込み中: ${file}`);
    const content = fs.readFileSync(file, "utf8");

    const records: string[][] = parse(content, {
      relax_column_count: true,
      skip_empty_lines: true,
    });

    let count = 0;
    for (const cols of records) {
      const row = parseRow(cols);
      if (!row) continue;
      if (row.kind !== TARGET_KIND) continue;

      const existing = latestByCorpNumber.get(row.corporateNumber);
      if (!existing || isNewer(existing, row)) {
        latestByCorpNumber.set(row.corporateNumber, row);
      }
      count++;
    }
    console.log(`  ${count}行処理(対象法人種別のみ)`);
  }

  console.log(`\nユニーク法人数: ${latestByCorpNumber.size}`);

  const aggByCode = new Map<
    string,
    { newCount: number; closeCount: number }
  >();

  for (const row of latestByCorpNumber.values()) {
    if (!row.prefectureCode || !row.cityCode) continue;
    const code5 = `${row.prefectureCode.padStart(
      2,
      "0"
    )}${row.cityCode.padStart(3, "0")}`;

    if (!aggByCode.has(code5)) {
      aggByCode.set(code5, { newCount: 0, closeCount: 0 });
    }
    const agg = aggByCode.get(code5)!;

    if (
      row.assignmentDate &&
      row.assignmentDate >= from &&
      row.assignmentDate <= to
    ) {
      agg.newCount += 1;
    }
    if (row.closeDate && row.closeDate >= from && row.closeDate <= to) {
      agg.closeCount += 1;
    }
  }

  const result = Array.from(aggByCode.entries())
    .filter(([, v]) => v.newCount > 0 || v.closeCount > 0)
    .map(([code, v]) => ({
      code,
      newCount: v.newCount,
      closeCount: v.closeCount,
    }));

  const OUTPUT_PATH = "data/corporate-registration.json";

  // 既存の出力があれば読み込み、今回の集計結果を「積み上げる」。
  // これにより、都道府県を数件ずつ処理してはCSVを削除する、
  // という進め方でも、これまでの分が消えずに済む。
  type OutputRow = { code: string; newCount: number; closeCount: number };
  let merged = new Map<string, OutputRow>();

  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      const existing: OutputRow[] = JSON.parse(
        fs.readFileSync(OUTPUT_PATH, "utf8")
      );
      merged = new Map(existing.map((r) => [r.code, r]));
      console.log(
        `\n既存の data/corporate-registration.json (${existing.length}自治体分)に積み上げます。`
      );
    } catch {
      console.warn(
        "既存の data/corporate-registration.json の読み込みに失敗したため、新規作成します。"
      );
    }
  }

  for (const row of result) {
    const prev = merged.get(row.code);
    if (prev) {
      // 同じ自治体コードが既にある場合は加算する
      // (通常は起きないはずだが、同じ都道府県を誤って2回処理した場合の保険)
      prev.newCount += row.newCount;
      prev.closeCount += row.closeCount;
    } else {
      merged.set(row.code, row);
    }
  }

  const finalResult = Array.from(merged.values())
    .sort((a, b) => a.code.localeCompare(b.code))
    .map((r) => ({
      code: r.code,
      newCount: r.newCount,
      closeCount: r.closeCount,
      netGrowth: r.newCount - r.closeCount,
    }));

  console.log(
    `\n今回の処理分: ${result.length}自治体 / 累計: ${finalResult.length}自治体`
  );
  console.log("サンプル:", finalResult.slice(0, 3));

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalResult, null, 2), "utf8");

  console.log(`${OUTPUT_PATH} に保存しました(累計${finalResult.length}自治体)。`);
  console.log(
    "処理済みのCSVは削除して構いません。次の都道府県分を data-raw/houjin/ に置いて、また実行してください。"
  );
}

main();
