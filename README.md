# Codex Field Guide

A guided React/Vite learning website for complete beginners using the OpenAI Codex app. The guide starts with installation and a first local project, then opens into short interactive chapters for projects and threads, settings, Computer Use, skills, plugins, prompting, repos, commits, publishing, model effort, review, worktrees, and advanced audit habits.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run check
```

`npm run check` runs ESLint and a production build.

## Publish

This is a static Vite site. Common publishing paths:

- GitHub Pages: build with `npm run build`, publish `dist/`.
- Vercel or Netlify: connect the GitHub repo, use `npm run build`, and set the output directory to `dist`.
- Manual static host: upload the contents of `dist/` after a local build and preview pass.

## Source basis

The Codex product guidance is derived from the current official Codex manual. Product screenshots are downloaded from the official OpenAI Codex documentation and remain visibly labeled in the interface. Relevant documentation links open in a new tab from each lesson and from the page footer.

## Design notes

The site uses one generated concept screenshot stored in `public/concepts/` as a visual reference:

- `codex-field-guide-v2-guided-console.png`

Two generated educational figures live in `public/images/generated/`:

- `setup-path-infographic.png`
- `build-possibilities-infographic.png`

The UI itself is code-native React and CSS, not a static screenshot.

## Fidelity ledger

- Keep: compact top bar, left chapter rail, setup-first workbench, restrained editorial typography, quiet whitespace, hairline dividers, OpenAI-inspired blue tones, a spacious visual learning map, a focused interactive permission flow, and a prompt library with category filters.
- Adapt: use real official Codex screenshots with source captions instead of simulated product screens; use generated figures only for visual explanation.
- Omit: decorative dashboard metrics, invented social proof, noisy card grids, and any element that makes the beginner path feel crowded.
