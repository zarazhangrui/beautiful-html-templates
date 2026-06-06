# HANDOFF — Self-Documenting Design System Pages

> Paste this whole file (or tell the next agent: **"Read `design-system/HANDOFF.md` and continue"**) into a fresh Claude Code session in this repo to continue the work.

Repo root: `/Users/bytedance/beautiful-html-templates`

---

## 1. Mission

Build an HTML **Design System index** for this template library. Phase 1: for **each of the 34 slide templates** under `templates/<slug>/`, produce **one self-contained HTML page** that documents that template's design system — and renders **in that template's own visual language** (its real fonts, palette, components, decorations). The page should "eat its own dogfood": a reader should recognise the template at a glance. An `index.html` hub links to all of them.

User's exact ask (Chinese): 建立 HTML 的 Design System 索引；把每个模板提取出 Design System，形成单个 HTML，充分反映每个 slide 的设计风格；在索引里跳转查看每个模板的 design system。

## 2. Decisions already locked (do NOT relitigate)

- **Fully bespoke per template** (user chose 完全定制式 over "reskin one shared layout"). Each page must look unmistakably like its template — not a recoloured copy of a shared template. Different fonts, colours, real components, real decorations each time.
- **Pilot-first, then batch-all** (already approved). Pilot = `bold-poster.html`. User reviewed 4 pages and approved the paradigm across the style spectrum.
- **Output structure**: `design-system/index.html` (hub) + `design-system/<slug>.html` (one per template). Each `<slug>.html` is a single self-contained file (inline `<style>`, Google-Fonts `<link>`, small inline `<script>`). No build step, no shared CSS/JS imports between pages.
- **These are vertically-scrolling documents, NOT slide decks.** Do not import the template's `deck-stage.js` or its horizontal slide navigation. Reuse the scrolling-doc scaffold from existing pages.

## 3. What's DONE (reference these — don't duplicate)

Completed bespoke pages (study them as the canonical pattern):
- `design-system/bold-poster.html` — **cleanest reference**; white editorial poster, Shrikhand, single red. Read this first.
- `design-system/8-bit-orbit.html` — dark/atmospheric; neon, scanlines/grain/CRT overlays, pixel components, IntersectionObserver bar-chart animation.
- `design-system/monochrome.html` — ultra-minimal; cream paper, ultra-light Jost, 1px hairlines, no chroma.
- `design-system/daisy-days.html` — playful; pastel surfaces, hand-drawn inline-SVG ornaments (daisies/stars/rainbows/sun), chunky offset shadows.

Infrastructure (done, working):
- `design-system/index.html` — hub. Renders one card per template; card colours are auto-derived **in JS** from each template's real palette (luminance/saturation math). Live cards show "OPEN →", others "SOON". Loads `index-data.js` via a cache-busting dynamic `<script>` with an `onerror` fallback to plain src (so `file://` works too).
- `design-system/index-data.js` — **auto-generated**, do not hand-edit.
- `scripts/build-ds-index.mjs` — generator. Reads `index.json` + each `templates/<slug>/template.json`, detects which `design-system/<slug>.html` exist, writes `index-data.js`. **Run `node scripts/build-ds-index.mjs` after creating each new page** to light it up in the index.

Task list (in the session task tracker): 6 batch tasks. Batch 1 (#1) is in progress: 8-bit-orbit ✅ monochrome ✅ daisy-days ✅ — remaining **retro-windows, studio, vellum**.

## 4. What's LEFT — 30 templates

Done (4): `bold-poster`, `8-bit-orbit`, `monochrome`, `daisy-days`.

Remaining (30): `retro-windows`, `studio`, `vellum`, `capsule`, `block-frame`, `raw-grid`, `neo-grid-bold`, `scatterbrain`, `playful`, `coral`, `pink-script`, `signal`, `mat`, `grove`, `cartesian`, `biennale-yellow`, `blue-professional`, `broadside`, `cobalt-grid`, `creative-mode`, `editorial-forest`, `editorial-tri-tone`, `emerald-editorial`, `soft-editorial`, `long-table`, `peoples-platform`, `pin-and-paper`, `sakura-chroma`, `stencil-tablet`, `retro-zine`.

(Suggested batches exist as tasks #1–#6, but order doesn't matter. Front-load stylistically diverse ones.)

## 5. The recipe — how to build ONE bespoke page

For a template `<slug>`:

**A. Extract its design language (context-frugal — don't read the whole template.html; it can be 2600 lines):**
```bash
# fonts + colours + component CSS + decoration class names
sed -n '1,/<\/style>/p' templates/<slug>/template.html \
  | grep -nE "fonts.googleapis|:root|--[a-z]|font-family|background|border-radius|box-shadow|class=" | head -80
# decoration / signature element class names (SVGs, overlays, doodles)
grep -oE 'class="[^"]*(deco|star|grain|scan|corner|doodle|sticker|glitch|pixel|tab|window)[^"]*"' templates/<slug>/template.html | sort -u
# authoritative prose: Overview, Do/Don't, CJK pairing
awk '
/^## Overview/{f="ov"} /^## Colors/{if(f=="ov")f=""}
/^## Do.s and Don.ts/{f="dd"} /^## Responsive/{if(f=="dd")f=""}
/^### Recommended Chinese Pairing/{f="cjk"} /^### Mixed-Content/{if(f=="cjk")f=""}
f!=""{print}' templates/<slug>/design.md | head -130
```
Also note metadata from `index.json` (mood/tone/formality/density/scheme/best_for) and `templates/<slug>/template.json` (palette, typography.display). The template's **`<head>` Google-Fonts `<link>` and `:root` variables can be copied verbatim.**

**B. Build `design-system/<slug>.html`** — a vertically-scrolling, self-contained page using the template's real fonts/colours/components/decorations, with this fixed section architecture (same as all 4 done pages, so the hub feels consistent):
1. **Hero** — full-viewport, the template's signature cover treatment. Includes: a mono/eyebrow kicker "Design System Specification", the template name rendered in its display face, a one-line premise (from design.md description/tagline), and a **contents nav** (anchor links to the sections below).
2. **§01 Overview** — eyebrow + section header + lead (from design.md Overview) + a 4-tile meta strip (Formality / Density / Scheme / Best-for or Accent), built from the template's own card/grid component.
3. **§02 Colours** — the real palette as swatches (hex + role), using the template's swatch/card idiom.
4. **§03 Typography** — the type faces as specimens (each rendered in that face) + a **type scale ladder** where each token renders at its real size/weight/colour/treatment.
5. **§04 Components** — **live** components rendered with the template's *actual CSS* (ported verbatim from its `<style>`): its signature card, chart, quote, list/bullets, stat tiles, panels, buttons, etc. Label this "rendered with the template's actual CSS — not a mockup".
6. **§05 Depth & Shape** — the template's depth language (shadows or lack thereof, border ladder, tilt, radius discipline) shown as small demos.
7. **§06 Do & Don't** — two columns from design.md Do/Don't, styled in the template's idiom.
8. **§07 中文 / CJK** — load the template's recommended CJK fonts (from design.md) and show a real Chinese specimen + a pairing table. (e.g. Noto Serif/Sans SC, etc.)
9. **Close** — the template's closing/CTA treatment + links: `index.html` (← All Systems), `../templates/<slug>/template.html` (Open Live Deck), optionally `../templates/<slug>/design.md`.

**Reusable scaffold (copy from `bold-poster.html`, restyle per template):**
- Fixed **progress** bar (scroll %), **counter** (NN / NN by section), **back-link** to `index.html` — all styled in the template's chrome voice.
- The inline `<script>` at the bottom: scroll→progress/counter + an IntersectionObserver to animate any chart on view. (Copy from any done page.)
- `html { scroll-behavior:smooth }`, sections have `id`s matching the contents nav.

**C. Light it up + verify:**
```bash
node scripts/build-ds-index.mjs        # regenerates index-data.js, marks <slug> available
```
Then screenshot-verify (see §6).

## 6. Verification (preview)

A preview server config exists at `.claude/launch.json` (static `python3 -m http.server` on port 8137). Use the Claude_Preview MCP tools:
- `preview_start` (name `static`) → get `serverId`.
- Navigate: `preview_eval(serverId, "location.href='http://localhost:8137/design-system/<slug>.html'; 'go'")`.
- `preview_screenshot(serverId)`.

**Gotchas learned:**
- The hero is `min-height:100vh`; a fresh navigation + screenshot reliably shows it. **Programmatic scroll + screenshot is flaky** (often returns a blank/top frame). Workaround that worked: resize viewport taller and temporarily shrink the hero via eval (`document.querySelector('.hero').style.minHeight='560px'`), set `document.documentElement.style.scrollBehavior='auto'`, then screenshot — sections stack into one tall shot. Or just verify the hero per page and trust the ported component CSS.
- `preview_screenshot` occasionally errors `UnknownVizError` transiently — just retry once.
- Opening for the user: `open design-system/index.html` (file://). Pages are self-contained; the index has a file://-safe data loader.

## 7. Fidelity rules (the whole point — "充分反映设计风格")

- **Use the template's real fonts** (copy its Google-Fonts `<link>`). Never substitute. Add CJK fonts only for §07.
- **Use its real palette** (`:root` vars copied verbatim).
- **Port its real component CSS** for §04 so components are genuinely live, not redrawn.
- **Recreate its signature decorations** (scanlines/grain overlays, corner brackets, SVG doodles, paper grain, glitch blocks, window chrome, etc.). For `daisy-days` these were hand-built inline SVGs — do the same when a template's ornaments are SVG/illustration.
- **Match its discipline**: border radius (square vs rounded), shadow style (hard-offset vs none vs glow), tilt, case/tracking on labels, bullet markers. The design.md "Do/Don't" and "Signature Treatments" sections are authoritative.
- Keep each page **single-file & self-contained**.

## 8. Known issues / notes

- **Source-data discrepancy**: some `template.json` `density` values disagree with the `design.md` Overview prose (e.g. bold-poster `template.json` says `low`, design.md argues `high/populist`). Prefer the design.md prose; for bold-poster the meta tile was set to "Polar" to honour both. Just be aware; not blocking.
- Do not commit/push unless the user asks. No secrets involved.
- `index.json` per-entry fields: slug, name, tagline, mood, occasion, tone, formality, density, scheme, best_for, avoid_for, slide_count. Palette/typography live in each `templates/<slug>/template.json` (palette keys differ per template — don't assume `bg/dark/red`).

## 9. Suggested skills for the next agent

- **`frontend-design`** (or `frontend-design:frontend-design`) — for producing distinctive, production-grade single-file HTML; aligns with the bespoke-per-template goal.
- **`figma-create-new-file` / Figma skills** — NOT needed here (no Figma).
- Use the built-in **preview** MCP tools (Claude_Preview) for screenshot verification, as in §6.
- The repo's own **`AGENTS.md`** explains the template library's philosophy ("the typography IS the design system"; preserve fonts/palette/decoration) — worth a skim; it's the source of the fidelity rules.

## 10. First action for the next session

1. `Read design-system/bold-poster.html` (the reference pattern) and skim `8-bit-orbit.html`, `monochrome.html`, `daisy-days.html` to internalise the 4 idioms.
2. Pick the next template (suggest `retro-windows` — Win95 chrome, very distinct — then `studio`, `vellum`).
3. Run the §5 extraction commands, build `design-system/<slug>.html`, run the generator, screenshot-verify.
4. Repeat. Tell the user progress per few pages; the index auto-updates.
