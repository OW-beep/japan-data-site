import { getCities } from "./getCities";

export function getPrefectures() {
  const cities = getCities();

  const prefs = Array.from(
    new Set(
      cities.map((c) => c.name.split(" ")[0])
    )
  );

  return prefs.sort();
}