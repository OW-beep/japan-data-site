import fs from "fs";

function normalize(str: string) {
  return str
    .replace(/\s/g, "")
    .replace(/ヶ/g, "ケ")
    .replace(/ヵ/g, "ケ")
    .replace(/之/g, "ノ");
}

const cities: any[] = JSON.parse(
  fs.readFileSync("data/cities.json", "utf8")
);

const areas: any[] = JSON.parse(
  fs.readFileSync("data/area.json", "utf8")
);

const areaMap = new Map<string, number>(
  areas.map((a: any) => [
    normalize(a.name),
    Number(a.area),
  ])
);

const notFound: string[] = [];

const merged = cities.map((city: any) => {

  let area =
    areaMap.get(normalize(city.name)) ?? null;

  // 東京都特別区部のみ補完
  if (city.name === "東京都 特別区部") {
    area = 627.53;
  }

  if (area == null) {
    notFound.push(city.name);
  }

  return {

    ...city,

    area,

    populationDensity:
      area != null && area > 0
        ? Math.round(city.population / area)
        : null,

  };

});

fs.writeFileSync(
  "data/cities.json",
  JSON.stringify(
    merged,
    null,
    2
  ),
  "utf8"
);

console.log(
  `面積取得成功: ${
    merged.length - notFound.length
  }自治体`
);

console.log(
  `面積取得失敗: ${notFound.length}自治体`
);

if (notFound.length) {

  console.log("取得できなかった自治体");

  console.log(notFound);

}

console.log("cities updated");