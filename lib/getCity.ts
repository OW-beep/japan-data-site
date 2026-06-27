import cities from "@/data/cities.json";
import type { City } from "@/lib/City";

export function getCity(code: string): City | undefined {
  return (cities as City[]).find((city) => city.code === code);
}