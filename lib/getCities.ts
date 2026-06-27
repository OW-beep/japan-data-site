import cities from "@/data/cities.json";
import { City } from "@/types/City";

export function getCities(): City[] {
  return cities as City[];
}