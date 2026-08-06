import fs from "fs";
import path from "path";

const file = path.join(
  process.cwd(),
  "raw",
  "financial.csv"
);

const csv = fs.readFileSync(file, "utf8");

console.log(csv.slice(0,300));