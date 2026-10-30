import { notFound } from "next/navigation";

// このページは「名前の文字数」という分析的価値のない指標を
// 使ったジョークページだったため廃止しました。
// 同種の「人口密度が低い自治体」という有用な切り口は
// /ranking/density(低い順の下位50を掲載)に統合しています。
export default function Page(): never {
  notFound();
}
