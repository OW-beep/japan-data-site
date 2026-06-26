import citiesJson from "../data/cities.json";
import type { City } from "../types/city";

export function getCities(): City[] {
  return citiesJson as City[];
}