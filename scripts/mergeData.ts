import fs from "fs";

function normalize(s: string) {
return s
.replace(/\s+/g, "")
.replace(/ヶ/g, "ケ")
.replace(/ヵ/g, "ケ");
}

const cities = JSON.parse(
fs.readFileSync(
"data/cities.json",
"utf8"
)
);

const areas = JSON.parse(
fs.readFileSync(
"data/area.json",
"utf8"
)
);

const areaMap = new Map(
areas.map((a: any) => [
normalize(a.name),
a.area,
])
);

const merged = cities.map(
(city: any) => {
const area =
areaMap.get(
normalize(city.name)
) ?? null;


return {
  ...city,

  area,

  populationDensity:
    area && area > 0
      ? Math.round(
          city.population /
            area
        )
      : null,
};
```

}
);

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
"cities.json updated"
);
