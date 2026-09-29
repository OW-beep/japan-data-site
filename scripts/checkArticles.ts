/**
 * 記事の登録漏れ・日付ずれを検出するスクリプト。
 *
 *   npm run check:articles            … 警告だけ表示(終了コード0)
 *   npm run check:articles -- --strict … 問題があれば終了コード1
 *
 * app/articles/<slug>/page.tsx が lib/articles.ts に載っているか、
 * 記事の publishedAt と登録日が一致しているかを確認する。
 * 新着セクション・記事一覧・sitemap は lib/articles.ts から作られるので、
 * ここに載っていない記事は「新着に出ない・一覧に出ない」ことになる。
 */
import fs from "node:fs";
import path from "node:path";
import { articleEntries } from "../lib/articles";

const strict = process.argv.includes("--strict");
const articlesDir = path.join(process.cwd(), "app", "articles");

const problems: string[] = [];

const registry = new Map(articleEntries.map((a) => [a.slug, a]));

const slugs = fs
  .readdirSync(articlesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .filter((d) => fs.existsSync(path.join(articlesDir, d.name, "page.tsx")))
  .map((d) => d.name);

for (const slug of slugs) {
  const entry = registry.get(slug);
  if (!entry) {
    problems.push(`未登録: ${slug} が lib/articles.ts にありません`);
    continue;
  }
  const src = fs.readFileSync(
    path.join(articlesDir, slug, "page.tsx"),
    "utf-8"
  );
  const m = src.match(/publishedAt="(\d{4}-\d{2}-\d{2})"/);
  if (m && m[1] !== entry.date) {
    problems.push(
      `日付不一致: ${slug} (記事 ${m[1]} / 登録 ${entry.date})`
    );
  }
}

for (const a of articleEntries) {
  if (!slugs.includes(a.slug)) {
    problems.push(`ページなし: ${a.slug} は登録されていますが app/articles にありません`);
  }
}

if (problems.length === 0) {
  console.log(`記事チェックOK(${slugs.length}本)`);
} else {
  console.warn(`記事チェック: ${problems.length}件の問題があります`);
  for (const p of problems) console.warn(" - " + p);
  if (strict) process.exit(1);
}
