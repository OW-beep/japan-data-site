import fs from "fs";
import path from "path";
import https from "https";

// 財政力指数CSV（後で正式URLに差し替え）
const url =
  "https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.csv";

const rawDir = path.join(process.cwd(), "raw");

const output = path.join(
  rawDir,
  "financial.csv"
);

// rawフォルダ作成
fs.mkdirSync(rawDir, {
  recursive: true,
});

https
  .get(url, (res) => {
    if (res.statusCode !== 200) {
      console.error(
        `CSV取得失敗 (${res.statusCode})`
      );
      return;
    }

    const file = fs.createWriteStream(output);

    res.pipe(file);

    file.on("finish", () => {
      file.close();

      console.log(
        "財政力指数CSV取得完了"
      );
      console.log(output);
    });
  })
  .on("error", (err) => {
    console.error(err);
  });