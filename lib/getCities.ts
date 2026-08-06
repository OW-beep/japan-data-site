import cities from "@/data/cities.json";
import type { City } from "@/lib/City";

export function getCities(): City[] {
  return cities as City[];
}