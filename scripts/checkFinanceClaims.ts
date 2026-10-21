// ------------------------------------------------------------------
// 財政力指数などのデータを更新したあとに、記事の見出し・本文に「固定で書いた数字」が
// 実際のデータと合っているかを確認する。
//
//   npm run check:claims
//
// 相関係数は、各記事と同じ定義で data/cities.json から計算し、記事のソースに
// その数字(小数第2位)が書かれているかを調べる。ずれていたら一覧で教えて、終了コード 1 にする。
// 財政力指数・高齢化率・人口などを更新したあとに実行すること。
// ------------------------------------------------------------------
import fs from "fs";
import { getMunicipalities } from "../lib/municipalities";

type C = ReturnType<typeof getMunicipalities>[number];

function corr(xs: number[], ys: number[]): number {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  return sxy / Math.sqrt(sxx * syy);
}

const all = getMunicipalities();
const fin = (c: C) => c.financeIndex as number;

const checks: { slug: string; label: string; value: number; mustAppear: string[] }[] = [];
const pushCheck = (slug: string, label: string, value: number, extra: string[] = []) =>
  checks.push({ slug, label, value, mustAppear: [value.toFixed(2), ...extra] });

{
  const b = all.filter((c) => c.elderlyPopulation != null && c.population > 0 && c.financeIndex != null);
  pushCheck("aging-finance", "高齢化率×財政力指数", corr(b.map((c) => (c.elderlyPopulation / c.population) * 100), b.map(fin)));
}
{
  const b = all.filter((c) => c.childPopulation != null && c.population > 0 && c.financeIndex != null);
  pushCheck("child-finance", "子ども人口割合×財政力指数", corr(b.map((c) => (c.childPopulation / c.population) * 100), b.map(fin)));
}
{
  const b = all.filter((c) => c.populationDensity != null && c.financeIndex != null);
  pushCheck("density-finance", "人口密度(対数)×財政力指数", corr(b.map((c) => Math.log10((c.populationDensity ?? 0) + 1)), b.map(fin)));
}
{
  const b = all.filter((c) => c.financeIndex != null && c.population > 0);
  pushCheck("population-finance", "人口(対数)×財政力指数", corr(b.map((c) => Math.log10(c.population)), b.map(fin)));
}

let bad = 0;
for (const c of checks) {
  const src = fs.readFileSync(`app/articles/${c.slug}/page.tsx`, "utf-8");
  // 相関係数の符号はソース上は「-0.72」と書かれるため、絶対値の文字列が現れるかで見る
  const missing = c.mustAppear.map((m) => m.replace("-", "")).filter((m) => !src.includes(m));
  const ok = missing.length === 0;
  if (!ok) bad++;
  console.log(`${ok ? "OK " : "NG "} ${c.slug.padEnd(34)} ${c.label} = ${c.value.toFixed(3)}${ok ? "" : `   ← 記事に「${missing.join("・")}」が見つかりません`}`);
}
if (bad > 0) {
  console.error(`\n${bad} 件の記事で、固定の数字が計算値とずれています。記事の見出し・本文を直してください。`);
  process.exitCode = 1;
}
