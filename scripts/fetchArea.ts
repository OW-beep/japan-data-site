import fs from "fs";

const cities =
JSON.parse(
fs.readFileSync(
"data/cities.json",
"utf-8"
)
);

const areas =
JSON.parse(
fs.readFileSync(
"data/area.json",
"utf-8"
)
);

const merged = cities.map((city) => {
const area = areas.find(
(a) => a.code === city.code
);

return {
...city,


area: area?.area ?? null,

populationDensity:
  area?.area
    ? city.population /
      area.area
    : null,


};
});

fs.writeFileSync(
"data/cities.json",
JSON.stringify(
merged,
null,
2
)
);
