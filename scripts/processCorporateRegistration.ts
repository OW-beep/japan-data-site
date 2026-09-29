import fs from "fs";
import path from "path";
import { parse } from "csv-parse";

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
//   ・法人種別は301〜305・399(設立登記法人の全種別)を対象とする
//     (国の機関・地方公共団体・外国法人等は除外)。合同会社(305)を
//     含めないと新設法人数が大きく過小集計されるため要注意。
// ------------------------------------------------------------------

const INPUT_DIR = process.argv[2] || "data-raw/houjin";
const MONTHS = Number(process.argv[3]) || 12;

// 明示的な集計期間の指定(暦年で正確に比較したい場合に使う)。
// 例: npx tsx scripts/processCorporateRegistration.ts data-raw/houjin --from=2025-01-01 --to=2025-12-31
// 指定が無い場合は、従来通り「実行日から遡ってMONTHSか月」を使う。
function getArgDate(flag: string): string | null {
  const arg = process.argv.find((a) => a.startsWith(`--${flag}=`));
  return arg ? arg.split("=")[1] : null;
}
const EXPLICIT_FROM = getArgDate("from");
const EXPLICIT_TO = getArgDate("to");

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

// 【重要】法人種別コードについて(過去にここで実データ集計ミスが
// 発生したため特記する)
//   301 は「株式会社」のみを指すコードであり、「設立登記法人」
//   全体ではない。合同会社(305、新設法人全体の約3割を占める)を
//   含む設立登記法人は以下の6種別に分かれる:
//     301: 株式会社   302: 合資会社   303: 合名会社
//     304: 特例有限会社   305: 合同会社   399: その他の設立登記法人
//   301のみを対象にすると、全国の新設法人数が実際の6〜7割程度に
//   過小集計される(2025年実績で本来15.2〜15.7万社のところ、
//   301のみでは8.9万件程度になる)。必ず下記6種別すべてを対象に
//   すること。
const TARGET_KINDS = ["301", "302", "303", "304", "305", "399"]; // 設立登記法人(全種別)

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

async function main() {
  const files = listCsvFiles(INPUT_DIR);
  if (files.length === 0) {
    console.error(`${INPUT_DIR} 内にCSVファイルが見つかりませんでした。`);
    process.exit(1);
  }

  console.log(`${files.length}個のCSVファイルを処理します...`);
  if (EXPLICIT_FROM || EXPLICIT_TO) {
    console.log(`集計対象期間(明示指定): ${EXPLICIT_FROM ?? "?"} 〜 ${EXPLICIT_TO ?? "?"}`);
  } else {
    console.log(
      "集計対象期間: データ内の最新日付を検出してから決定します(全ファイル読み込み後に表示)"
    );
  }

  // 法人番号ごとに「最新の状態」の行だけを保持する
  const latestByCorpNumber = new Map<string, CorpRow>();

  // ファイル内で実際に観測された最も新しい日付(updateDate)。
  // これを「このCSVが実際にカバーしている最新日」とみなし、
  // 集計期間の終点のデフォルト値として使う。
  // 【重要】--from / --to を明示指定しない場合、従来は
  // new Date()(スクリプトを実行した"今日")を基準にしていたが、
  // これだとCSVの実際のデータ範囲より先の期間まで対象に含めて
  // しまい(例: CSVは8/31時点なのに実行日が9/26だと、9月分の
  // データが存在しないのに対象期間には含まれる)、実態より
  // 少なく集計されてしまう。CSV自身が持つ最新日付を基準にする
  // ことで、実行するタイミングに関係なく正しい期間になる。
  let maxUpdateDate = "";

  for (const file of files) {
    console.log(`読み込み中: ${file}`);

    // 【重要】1GB前後の全国版CSVは fs.readFileSync で一括読み込み
    // すると、V8の文字列長上限(約536,870,888文字)を超えて
    // "Cannot create a string longer than 0x1fffffe8 characters"
    // というエラーで落ちる。ファイル全体を1つの文字列/配列に
    // 保持せず、ストリームで1行ずつ読みながら処理すること。
    const parser = fs
      .createReadStream(file, { encoding: "utf8" })
      .pipe(parse({ relax_column_count: true, skip_empty_lines: true }));

    let count = 0;
    let lineNo = 0;
    for await (const cols of parser as AsyncIterable<string[]>) {
      lineNo++;
      const row = parseRow(cols);
      if (!row) continue;
      if (row.updateDate && row.updateDate > maxUpdateDate) {
        maxUpdateDate = row.updateDate;
      }
      if (!TARGET_KINDS.includes(row.kind)) continue;

      const existing = latestByCorpNumber.get(row.corporateNumber);
      if (!existing || isNewer(existing, row)) {
        latestByCorpNumber.set(row.corporateNumber, row);
      }
      count++;

      if (lineNo % 500000 === 0) {
        console.log(`  ...${lineNo.toLocaleString()}行読み込み済み(処理中)`);
      }
    }
    console.log(`  ${count}行処理(対象法人種別のみ) / 全${lineNo.toLocaleString()}行`);
  }

  console.log(`\nユニーク法人数: ${latestByCorpNumber.size}`);
  if (maxUpdateDate) {
    console.log(`CSV内で検出された最新の更新日: ${maxUpdateDate}`);
  }

  const snapshotDate = maxUpdateDate ? new Date(maxUpdateDate) : new Date();
  const windowStart = new Date(snapshotDate);
  windowStart.setMonth(windowStart.getMonth() - MONTHS);
  const from = EXPLICIT_FROM ?? windowStart.toISOString().slice(0, 10);
  const to = EXPLICIT_TO ?? snapshotDate.toISOString().slice(0, 10);
  console.log(`集計対象期間(確定): ${from} 〜 ${to}`);

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
    // 同じ自治体コードが既にある場合は、新しい結果で上書きする。
    // (以前は加算していたが、全国版CSVを1回で処理する運用に
    // 変えたことで、既存データとほぼ完全に重複するようになった。
    // 加算のままだと同じ実行を2回すると値が倍になってしまうため、
    // 上書きに変更した。都道府県ごとに分割処理する場合でも、
    // 同じ都道府県のCSVを重複して置いたまま実行しない限り、
    // 上書きで問題ない)
    merged.set(row.code, row);
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
