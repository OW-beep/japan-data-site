import fs from "fs";
import iconv from "iconv-lite";

const buffer = fs.readFileSync(
"R8_01_mencho.csv"
);

const csv = iconv.decode(
buffer,
"cp932"
);

const lines = csv.split(/\r?\n/);

const result = [];

for (let i = 5; i < lines.length; i++) {
const cols = lines[i]
.split(",")
.map((x) =>
x.replace(/"/g, "").trim()
);

const code = cols[0];
const prefecture = cols[1];
const city = cols[3];
const area = cols[4];

if (!code) continue;

if (!/^\d{5}$/.test(code))
continue;

if (!city) continue;

if (city.startsWith("("))
continue;

if (isNaN(Number(area)))
continue;

result.push({
code,
name: `${prefecture} ${city}`,
area: Number(area),
});
}

fs.writeFileSync(
"data/area.json",
JSON.stringify(result, null, 2),
"utf8"
);

console.log(
`created ${result.length} records`
);

console.log(
result.slice(0, 10)
);
