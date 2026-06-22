const fs = require("fs");
const csv = require("csv-parser");

const results = [];

fs.createReadStream("cities.csv")
  .pipe(csv())
  .on("data", (data) => {
    results.push({
      code: data.code,
      name: data.name,
      prefecture: data.prefecture,
      population: Number(data.population),
    });
  })
  .on("end", () => {
    fs.writeFileSync(
      "data/cities.json",
      JSON.stringify(results, null, 2)
    );

    console.log("completed");
  });