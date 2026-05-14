#!/usr/bin/env node
/**
 * new-template.mjs — scaffold a new template folder.
 *
 * Creates templates/<slug>/ with:
 *   - previews/                 (used by the 3-cover-variation step)
 *   - deck-stage.js             (copied from /runtime — keeps the template
 *                                self-contained per TEMPLATE_SPEC § 3)
 *
 * Usage:
 *   node scripts/new-template.mjs <slug>
 *
 * The slug must be lowercase, hyphenated, and not already exist.
 */

import { mkdirSync, copyFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/new-template.mjs <slug>");
  console.error("  slug must be lowercase, hyphenated (e.g. neo-grid-bold)");
  process.exit(1);
}

if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(slug)) {
  console.error(`Invalid slug: "${slug}"`);
  console.error("  must be lowercase, hyphenated, start with a letter");
  console.error("  good: neo-grid-bold, paper-grain, pink-on-green");
  console.error("  bad:  Neo-Grid_Bold, template-v2, 2024-pitch");
  process.exit(1);
}

const templateDir = resolve(repoRoot, "templates", slug);
const previewsDir = resolve(templateDir, "previews");
const runtimeSrc = resolve(repoRoot, "runtime", "deck-stage.js");
const runtimeDst = resolve(templateDir, "deck-stage.js");

if (existsSync(templateDir)) {
  console.error(`Template folder already exists: templates/${slug}`);
  console.error("  Pick a different slug, or delete the existing folder first.");
  process.exit(1);
}

if (!existsSync(runtimeSrc)) {
  console.error(`Cannot find runtime source: ${runtimeSrc}`);
  console.error("  Repo state is unexpected — runtime/deck-stage.js should exist.");
  process.exit(1);
}

mkdirSync(templateDir, { recursive: true });
mkdirSync(previewsDir, { recursive: true });
copyFileSync(runtimeSrc, runtimeDst);

console.log(`Scaffolded templates/${slug}/`);
console.log(`  · previews/         (for the 3-cover-variation step)`);
console.log(`  · deck-stage.js     (copied from runtime/)`);
console.log("");
console.log("Next steps:");
console.log(`  1. Build 3 cover variations in templates/${slug}/previews/`);
console.log(`  2. After Zara picks one, write templates/${slug}/template.html`);
console.log(`     (wrap slides in <deck-stage width="1920" height="1080">)`);
console.log(`  3. Write templates/${slug}/template.json per TEMPLATE_SPEC § 5`);
console.log(`  4. Run: bun run .tools/verify.ts templates/${slug}/template.html`);
console.log(`  5. Run: node scripts/build-index.mjs`);
