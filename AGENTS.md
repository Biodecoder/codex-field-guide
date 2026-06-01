# AGENTS.md

## Project expectations

- Keep the site beginner-friendly first, but preserve intermediate and advanced sections.
- Treat OpenAI Codex product facts as source-backed content. Refresh official docs before changing current model, Computer Use, skills, plugins, or app behavior guidance.
- Keep UI text code-native and accessible; do not replace educational sections with static screenshots.
- Maintain the editorial workbench design system in `src/App.css`: true-white base, graphite text, green/blue/coral accents, hairline dividers, and radius values of 8px or less.
- Avoid generic purple-gradient SaaS styling, decorative orbs, nested cards, and placeholder content.

## Verification

- Run `npm run check` after code changes.
- For visual changes, run the local site and inspect desktop and mobile widths.
- Verify copy buttons, tabs, checklist toggles, and section navigation still work.
- Before handoff, check `git status --short` and explain any remaining uncommitted files.

## Content contract

- Required topics: beginner workflow, example prompts, Computer Use, in-app browser, skills, plugins, MCP, repos, commits, publishing, model effort, AGENTS.md, review pane, worktrees, and advanced audit loops.
- Keep source links visible in the rendered site.
- If a product term is not documented in official sources, describe it as local/current-session behavior rather than public fact.
