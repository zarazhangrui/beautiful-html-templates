# beautiful-html-templates

A library of reusable HTML slide templates designed so that any coding agent can pick the right one and produce a beautiful deck on the user's behalf, automatically.

The library is **visually plural**. Each template ships in its original form: its own DOM structure, its own navigation pattern, its own runtime (or no runtime). Some use a shared `<deck-stage>` web component; others use scroll-snap; others use bespoke inline keyboard handlers. **No standardization is enforced.** The agent uses each template as a design reference, not as a uniform runtime.

## Who reads what

There are two audiences for this repo, and two docs to match:

- **Agents using the library to build a user's deck → read [`AGENTS.md`](./AGENTS.md).** This is your operating manual: how to read `index.json`, match the user's brief to a template, clone it, and adapt the content.
- **The library author adding or editing templates → read [`TEMPLATE_SPEC.md`](./TEMPLATE_SPEC.md).** This is the authoring contract: folder shape, `template.json` schema, typography / palette conventions, the optional `deck-stage` runtime, etc.

End users **do not** add or modify templates. They consume the library through their agent.

## Repo layout

```
beautiful-html-templates/
  AGENTS.md              ← operating manual for agents using the library
  TEMPLATE_SPEC.md       ← authoring contract for the library maintainer
  README.md              ← this file
  index.json             ← auto-generated index — the agent reads this first
  runtime/
    deck-stage.js        ← optional shared web component for templates that want it
  scripts/
    build-index.mjs      ← regenerates index.json from all template.json files
  templates/
    <slug>/
      template.html      ← the deck (5+ slides showing variety)
      template.json      ← metadata used for matching
      styles.css         ← optional, when CSS lives in a separate file
      deck-stage.js      ← bundled if the template uses the runtime
      assets/            ← optional: images, fonts, svg
      preview.png        ← optional thumbnail
```

A template folder is **self-contained**: copying a single folder out of the repo gives a working deck.

## At a glance

- 28 templates spanning many aesthetics: editorial, professional, playful, brutalist / graphic, retro, archival, scholarly.
- Each template is matched to a user's brief by **tone**, not industry. A confident editorial deck can carry a tech talk; a playful pastel deck can carry a finance review. The user's taste wins. (See `AGENTS.md` §4.)
- Total agent context cost per deck = `index.json` (~few KB) + one chosen template's HTML/CSS. Flat, regardless of library size.

Run `cat index.json` for the full machine-readable list.
