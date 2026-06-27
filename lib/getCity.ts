import cities from "@/data/cities.json";
import { City } from "@/types/City";

export function getCity(code: string): City | undefined {
  return (cities as City[]).find((c) => c.code === code);
}