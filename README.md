# beautiful-html-templates

A library of reusable HTML slide templates designed so that any coding agent can pick the right one and produce a beautiful deck on the user's behalf, automatically.

Agents using the library should read [`AGENTS.md`](./AGENTS.md). It's the operating manual: how to read `index.json`, match the user's brief to a template, clone it, and adapt the content.

## Repo layout

```
beautiful-html-templates/
  AGENTS.md              ← operating manual for agents using the library
  README.md              ← this file
  index.json             ← aggregate index — the agent reads this first
  runtime/
    deck-stage.js        ← shared web component used by some templates
  templates/
    <slug>/
      template.html      ← the deck (multiple slides demonstrating the system)
      template.json      ← metadata: mood, tone, palette, typography, etc.
      styles.css         ← optional, when CSS lives separately
      deck-stage.js      ← bundled if the template uses the runtime
      assets/            ← optional: images, fonts, svg
```

A template folder is **self-contained**: copying a single folder out of the repo gives a working deck.

## At a glance

- 28 templates spanning many aesthetics: editorial, professional, playful, brutalist / graphic, retro, archival, scholarly.
- Each template is matched to a user's brief by **tone**, not industry. A confident editorial deck can carry a tech talk; a playful pastel deck can carry a finance review. The user's taste wins. (See `AGENTS.md` §4.)
- Total agent context cost per deck = `index.json` (~few KB) + one chosen template's HTML/CSS. Flat, regardless of library size.

Run `cat index.json` for the full machine-readable list.

## License

[MIT](./LICENSE) — free to use, modify, and distribute.
