# Codex Field Guide

A polished React/Vite educational website for complete beginners learning the OpenAI Codex app. The guide teaches practical workflows for prompting, Computer Use, skills, plugins, repos, commits, publishing, model effort, review, worktrees, and advanced audit habits.

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

The Codex product guidance is derived from the current official Codex manual and links to the relevant OpenAI documentation in the page footer.

## Design notes

The site uses two generated concept screenshots stored in `public/concepts/` as visual references:

- `codex-field-guide-top.png`
- `codex-field-guide-deep-sections.png`

The UI itself is code-native React and CSS, not a static screenshot.
