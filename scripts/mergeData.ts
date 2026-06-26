import fs from "fs";

function normalize(str: string) {
  return str
    .replace(/\s/g, "")
    .replace(/ヶ/g, "ケ")
    .replace(/ヵ/g, "ケ")
    .replace(/之/g, "ノ");
}

const cities = JSON.parse(
  fs.readFileSync("data/cities.json", "utf8")
);

const areas = JSON.parse(
  fs.readFileSync("data/area.json", "utf8")
);

const areaMap = new Map(
  areas.map((a: any) => [
    normalize(a.name),
    a.area,
  ])
);

const merged = cities.map((city: any) => {
  let area =
    areaMap.get(
      normalize(city.name)
    ) ?? null;

  // 東京都特別区部のみ補完
  if (city.name === "東京都 特別区部") {
    area = 627.53;
  }

  return {
    ...city,

    area,

    populationDensity:
      area && area > 0
        ? Math.round(
            city.population / area
          )
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

console.log("cities updated");