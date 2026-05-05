#!/usr/bin/env node
/**
 * Builds the library-wide index.json from every templates/<slug>/template.json.
 *
 * The agent reads ONLY this index file when deciding which template to use,
 * then reads the chosen template's HTML. Keeps context cost flat as the
 * library grows: with 100+ templates, the index is still a few KB.
 *
 * Run: node scripts/build-index.mjs
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const TEMPLATES_DIR = join(REPO_ROOT, 'templates');
const OUT_PATH = join(REPO_ROOT, 'index.json');

// Only include the fields the matcher actually uses.
// Keep the index tight so the agent's context stays cheap.
const PROJECTED_FIELDS = [
  'slug',
  'name',
  'tagline',
  'mood',
  'occasion',
  'tone',
  'formality',
  'density',
  'scheme',
  'best_for',
  'avoid_for',
  'slide_count'
];

function pick(obj, keys) {
  const out = {};
  for (const k of keys) if (k in obj) out[k] = obj[k];
  return out;
}

function isDir(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}

const slugs = readdirSync(TEMPLATES_DIR).filter(name => isDir(join(TEMPLATES_DIR, name)));

const entries = [];
const errors = [];

for (const slug of slugs) {
  const metaPath = join(TEMPLATES_DIR, slug, 'template.json');
  try {
    const raw = readFileSync(metaPath, 'utf8');
    const meta = JSON.parse(raw);

    if (meta.slug !== slug) {
      errors.push(`${slug}: template.json slug "${meta.slug}" does not match folder name`);
      continue;
    }

    entries.push(pick(meta, PROJECTED_FIELDS));
  } catch (err) {
    errors.push(`${slug}: ${err.message}`);
  }
}

if (errors.length) {
  console.error('Errors building index:');
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}

entries.sort((a, b) => a.slug.localeCompare(b.slug));

const out = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  template_count: entries.length,
  templates: entries
};

writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(`Wrote ${OUT_PATH} with ${entries.length} templates.`);
