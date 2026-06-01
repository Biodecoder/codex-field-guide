export type ChapterId = 'start' | 'interface' | 'settings' | 'tools' | 'prompts' | 'ship' | 'level-up'
export type EffortId = 'low' | 'medium' | 'high' | 'extra-high'
export type PromptCategory = 'all' | 'websites' | 'apps' | 'games' | 'research' | 'operations'

export const chapters: Array<{ id: ChapterId; label: string; eyebrow: string }> = [
  { id: 'start', label: 'Start here', eyebrow: 'Setup & first prompt' },
  { id: 'interface', label: 'Interface tour', eyebrow: 'Projects, threads, modes' },
  { id: 'settings', label: 'Settings studio', eyebrow: 'Tune your workspace' },
  { id: 'tools', label: 'Tools & skills', eyebrow: 'Choose the right surface' },
  { id: 'prompts', label: 'Prompt library', eyebrow: 'Try something real' },
  { id: 'ship', label: 'Repos & publish', eyebrow: 'Commit and share' },
  { id: 'level-up', label: 'Level up', eyebrow: 'Models and advanced work' },
]

export const setupSteps = [
  {
    id: 'install',
    title: 'Install the Codex app',
    short: 'Download and open the desktop app.',
    body: 'Start with the official Codex desktop app for macOS or Windows. Install it like any other application, then open it from your applications folder.',
    note: 'You can return to this guide after installation. Your progress here is saved in this browser.',
    image: '/images/generated/setup-path-infographic.png',
    imageAlt: 'Illustrated five-stage Codex setup path from download through first prompt',
    source: 'Generated setup illustration',
    docs: 'https://developers.openai.com/codex/app/',
    action: 'Open install guide',
  },
  {
    id: 'signin',
    title: 'Sign in securely',
    short: 'Use your ChatGPT account or an API key.',
    body: 'When Codex opens, sign in with your ChatGPT account or your OpenAI API key. For most beginners, the ChatGPT account path is the most straightforward.',
    note: 'API-key login can limit some cloud-thread features. Local work remains a comfortable place to begin.',
    image: '/images/generated/setup-path-infographic.png',
    imageAlt: 'Illustrated five-stage Codex setup path including secure sign-in',
    source: 'Generated setup illustration',
    docs: 'https://developers.openai.com/codex/app/',
    action: 'Read sign-in guide',
  },
  {
    id: 'project',
    title: 'Add a project folder',
    short: 'Give Codex a safe place to work.',
    body: 'Choose Add new project near the Threads heading, or use Command-O. Pick an existing repo or a fresh folder created for your experiment.',
    note: 'A project is the folder Codex can inspect. A thread is one conversation and task inside that project.',
    image: '/images/official/multitask-light.webp',
    imageAlt: 'Official Codex app screenshot showing multiple projects and threads',
    source: 'Official Codex screenshot',
    docs: 'https://developers.openai.com/codex/app/features',
    action: 'See project docs',
  },
  {
    id: 'local',
    title: 'Choose Local mode',
    short: 'Keep your first task on your computer.',
    body: 'Local mode lets Codex read and edit the selected folder on your machine. It is the clearest place to learn because the files and results stay close at hand.',
    note: 'Worktrees and cloud tasks are useful later. You do not need them for your first hour.',
    image: '/images/official/modes-light.webp',
    imageAlt: 'Official Codex app screenshot showing Local, Worktree, and Cloud modes',
    source: 'Official Codex screenshot',
    docs: 'https://developers.openai.com/codex/app/features',
    action: 'Compare modes',
  },
  {
    id: 'prompt',
    title: 'Send your first prompt',
    short: 'Begin with a small, visible task.',
    body: 'Ask Codex to explain your folder before changing anything. Then request one small improvement with a clear finish line.',
    note: 'A good first run ends with evidence: a build, a screenshot, a test, or a clear review of the changed files.',
    image: '/images/official/multitask-light.webp',
    imageAlt: 'Official Codex app screenshot showing active tasks in project threads',
    source: 'Official Codex screenshot',
    docs: 'https://developers.openai.com/codex/learn/best-practices',
    action: 'Read best practices',
    prompt:
      'Read this folder without editing anything yet. Explain what it contains in beginner language, tell me how to run it, and suggest one small, safe first improvement.',
  },
]

export const tourShots = [
  {
    id: 'projects',
    label: 'Projects & threads',
    title: 'Projects hold the work. Threads hold the conversation.',
    body: 'A project points Codex at one folder. Inside it, create separate threads for separate tasks so the story stays tidy. Use the thread filter or archive old threads when the list gets busy.',
    image: '/images/official/multitask-light.webp',
    imageAlt: 'Official Codex screenshot showing the project and thread list',
    docs: 'https://developers.openai.com/codex/app/features',
  },
  {
    id: 'modes',
    label: 'Local, worktree, cloud',
    title: 'Choose how isolated the work should be.',
    body: 'Use Local while learning. A worktree gives a task a separate checkout for parallel experiments. Cloud runs the task remotely when your environment and workflow suit it.',
    image: '/images/official/modes-light.webp',
    imageAlt: 'Official Codex screenshot showing task-mode choices',
    docs: 'https://developers.openai.com/codex/app/features',
  },
  {
    id: 'review',
    label: 'Review & commit',
    title: 'Look at the diff before the work becomes history.',
    body: 'The review pane lets you inspect changed lines and leave comments. Once the result is verified, create a small, clear commit so you can return to this good state later.',
    image: '/images/official/git-commit-light.webp',
    imageAlt: 'Official Codex screenshot showing a Git commit workflow',
    docs: 'https://developers.openai.com/codex/app/review',
  },
]

export const settingsPanels = [
  {
    id: 'general',
    label: 'General',
    title: 'Begin with a calm, readable workspace.',
    body: 'Open Settings with Command-comma. General, Appearance, and Notifications are good first stops. Make the app comfortable enough that you can focus on the work.',
    bullets: ['Choose a readable theme', 'Tune notifications', 'Review keyboard shortcuts'],
    image: '/images/official/theme-selection-light.webp',
    imageAlt: 'Official Codex screenshot showing appearance theme selection',
    docs: 'https://developers.openai.com/codex/app/settings',
  },
  {
    id: 'git',
    label: 'Git',
    title: 'Let the app help you keep a clean project history.',
    body: 'Git settings standardize branch names and prompts for commit or pull-request descriptions. Beginners can keep the defaults and learn the review loop first.',
    bullets: ['Check the diff before committing', 'Use a short commit message', 'Keep unrelated changes out of the commit'],
    image: '/images/official/git-commit-light.webp',
    imageAlt: 'Official Codex screenshot showing Git commit controls',
    docs: 'https://developers.openai.com/codex/app/settings',
  },
  {
    id: 'plugins',
    label: 'Plugins & MCP',
    title: 'Install integrations only when they unlock a real workflow.',
    body: 'Plugins can bundle skills, apps, and MCP servers. Browse the Plugins directory, install what you need, complete any external sign-in, then start a new thread and type @ to invoke it explicitly.',
    bullets: ['Browse the plugin directory', 'Install and authorize intentionally', 'Start a new thread after installation'],
    image: '/images/official/skill-selector-light.webp',
    imageAlt: 'Official Codex screenshot showing the skill selector',
    docs: 'https://developers.openai.com/codex/plugins',
  },
  {
    id: 'computer-use',
    label: 'Computer Use',
    title: 'Grant desktop permissions with care.',
    body: 'Computer Use can interact with desktop apps when a task depends on visual context. Settings help you review Screen Recording and Accessibility permissions on macOS.',
    bullets: ['Close sensitive windows first', 'Review approvals before continuing', 'Stop the run if the wrong window opens'],
    image: '/images/official/computer-use-approval-light.webp',
    imageAlt: 'Official Codex screenshot showing a Computer Use approval request',
    docs: 'https://developers.openai.com/codex/app/computer-use',
  },
]

export const toolPanels = [
  {
    id: 'browser',
    label: 'In-app Browser',
    verdict: 'Start here for web UI',
    title: 'Use the browser for local sites and visual checks.',
    body: 'Ask Codex to open a localhost page, click through the important path, and inspect the result. It is a natural fit for websites and web apps that do not need your personal browser profile.',
    best: 'Local pages, responsive review, visual QA, forms, and click-through flows.',
    switchWhen: 'Switch to Chrome or another tool when the page depends on your existing cookies, extensions, or logged-in profile.',
    image: '/images/official/in-app-browser-light.webp',
    imageAlt: 'Official Codex screenshot showing the integrated in-app browser',
    docs: 'https://developers.openai.com/codex/app/browser',
  },
  {
    id: 'computer-use',
    label: 'Computer Use',
    verdict: 'For desktop workflows',
    title: 'Use Computer Use when seeing the desktop is part of the task.',
    body: 'Computer Use is appropriate for desktop apps, simulator flows, system settings, and visual bugs that cannot be understood from files alone. Keep the request narrow and stay nearby for approvals.',
    best: 'Desktop apps, native windows, simulators, settings screens, and GUI-only behavior.',
    switchWhen: 'Prefer file inspection, a plugin, or the in-app browser when they can prove the same result more predictably.',
    image: '/images/official/computer-use-approval-light.webp',
    imageAlt: 'Official Codex screenshot showing Computer Use approval',
    docs: 'https://developers.openai.com/codex/app/computer-use',
  },
  {
    id: 'skills',
    label: 'Skills',
    verdict: 'For reusable know-how',
    title: 'Skills turn repeated work into a dependable recipe.',
    body: 'A skill is a folder with instructions and optional scripts or references. Use one when your team repeatedly performs the same kind of work: release checks, accessibility audits, sprite pipelines, or document generation.',
    best: 'Repeatable workflows, domain knowledge, helper scripts, and team conventions.',
    switchWhen: 'Use a simple prompt when the guidance is temporary or only matters once.',
    image: '/images/official/skill-selector-light.webp',
    imageAlt: 'Official Codex screenshot showing a list of available skills',
    docs: 'https://developers.openai.com/codex/skills',
  },
  {
    id: 'plugins',
    label: 'Plugins',
    verdict: 'For packaged capability',
    title: 'Plugins add larger bundles of useful capability.',
    body: 'Plugins may include skills, apps, and MCP servers. Reach for them when Codex needs to work with a service such as GitHub, Figma, Slack, or a deployment host.',
    best: 'External services, installable team workflows, and reusable tool bundles.',
    switchWhen: 'A local skill is simpler when you do not need distribution or external access.',
    image: '/images/official/skill-selector-light.webp',
    imageAlt: 'Official Codex screenshot showing selectable capabilities',
    docs: 'https://developers.openai.com/codex/plugins',
  },
]

export const promptCategories: Array<{ id: PromptCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'websites', label: 'Websites' },
  { id: 'apps', label: 'Apps' },
  { id: 'games', label: 'Games' },
  { id: 'research', label: 'Research' },
  { id: 'operations', label: 'Operations' },
]

export const promptLibrary = [
  {
    id: 'portfolio',
    category: 'websites',
    level: 'Beginner',
    title: 'Personal portfolio website',
    summary: 'A friendly first website with a visible result.',
    prompt:
      'Create a polished personal portfolio website in a new folder. Include a clear header, projects section, short about section, and contact area. Make it responsive for phone and desktop. Use a restrained visual style, run it locally, open it in the browser, and fix any obvious layout issues before finishing.',
  },
  {
    id: 'restaurant',
    category: 'websites',
    level: 'Beginner',
    title: 'Restaurant menu website',
    summary: 'Practice hierarchy, mobile layout, and visual polish.',
    prompt:
      'Build a responsive one-page restaurant menu website in a new folder. Include a compact navigation bar, featured dishes, menu categories, hours, and contact details. Use appetizing placeholder photography from a public source, verify the mobile layout, and tell me how to open the finished site.',
  },
  {
    id: 'habit',
    category: 'apps',
    level: 'Beginner',
    title: 'Local habit tracker',
    summary: 'A simple app with forms, states, and persistence.',
    prompt:
      'Create a small browser-based habit tracker in a new folder. Let me add habits, mark today complete, filter active habits, and keep data after refresh using local storage. Include an empty state and a clear mobile layout. Run it, test the main flow in the browser, and fix any issues you see.',
  },
  {
    id: 'notes',
    category: 'apps',
    level: 'Intermediate',
    title: 'Searchable notes app',
    summary: 'A useful app with a little more interaction depth.',
    prompt:
      'Build a polished local notes app in a new folder. Include create, edit, delete, pin, and search. Store notes in local storage. Keep the interface quiet and work-focused. Test the main workflows, check the mobile layout, and summarize what you verified.',
  },
  {
    id: 'platformer',
    category: 'games',
    level: 'Beginner',
    title: 'Tiny platformer prototype',
    summary: 'A playful first game with a small complete loop.',
    prompt:
      'Create a small browser platformer game in a new folder using a proven web game library. Include one short level, left and right movement, jump, one collectible, a finish point, restart, and a simple score. Use generated or openly licensed art assets, make the controls visible, playtest the full loop, and fix anything that blocks completion.',
  },
  {
    id: 'puzzle',
    category: 'games',
    level: 'Intermediate',
    title: 'Color-matching puzzle',
    summary: 'Practice state, feedback, and a satisfying reset loop.',
    prompt:
      'Build a compact browser puzzle game in a new folder. The player should match colored tiles to clear a board, see score and move count, restart easily, and get a clear win state. Use a suitable game library if it helps. Add simple polished visual feedback, playtest it, and explain the rules in the interface.',
  },
  {
    id: 'dataset',
    category: 'research',
    level: 'Intermediate',
    title: 'Dataset explorer',
    summary: 'Turn a CSV into an understandable interactive report.',
    prompt:
      'Inspect the CSV files in this folder without changing the source data. Build a local interactive report that explains the columns, shows data-quality gaps, and provides a few useful filters and charts. Cite the source filenames in the interface, run the report locally, and verify the charts render correctly.',
  },
  {
    id: 'report',
    category: 'research',
    level: 'Beginner',
    title: 'Source-backed reading brief',
    summary: 'Use Codex to organize evidence without overclaiming.',
    prompt:
      'Read the documents in this folder and create a concise HTML reading brief. Separate confirmed facts, open questions, and your inferences. Link each important point back to its source file. Keep the layout readable, open the HTML result, and check that every source link works.',
  },
  {
    id: 'repo-audit',
    category: 'operations',
    level: 'Intermediate',
    title: 'Repository health check',
    summary: 'Understand a codebase before making a big move.',
    prompt:
      'Audit this repository without editing files first. Explain the architecture, how to run it, the current Git state, the most important risks, and the three highest-value next improvements. Separate what you verified from what you inferred. Then suggest a small first task.',
  },
  {
    id: 'publish',
    category: 'operations',
    level: 'Intermediate',
    title: 'Publish a static site',
    summary: 'Move from local proof to a shareable URL.',
    prompt:
      'Prepare this static website for publication. Run the production build, preview it locally, inspect desktop and mobile layouts, and check git status. Explain the simplest publishing route for this repo, then give me a short checklist for the live URL, rollback, and final verification.',
  },
]

export const efforts: Record<
  EffortId,
  { label: string; temperature: string; best: string; examples: string[]; note: string }
> = {
  low: {
    label: 'Low',
    temperature: 'Quick lane',
    best: 'Tiny, obvious tasks with a narrow finish line.',
    examples: ['Rename labels', 'Summarize a short file', 'Format a document', 'Make a small copy edit'],
    note: 'Move up when the task requires investigation or judgment.',
  },
  medium: {
    label: 'Medium',
    temperature: 'Everyday default',
    best: 'Most explanations, contained features, and ordinary fixes.',
    examples: ['Add a component', 'Write a few tests', 'Explain a repo', 'Fix a known UI bug'],
    note: 'Start here when you are unsure. It balances speed with enough care for daily work.',
  },
  high: {
    label: 'High',
    temperature: 'Deeper pass',
    best: 'Ambiguous bugs, multi-file work, design matching, and careful review.',
    examples: ['Trace a regression', 'Refactor shared state', 'Audit accessibility', 'Polish a complex UI'],
    note: 'Ask for verification so the added depth turns into visible evidence.',
  },
  'extra-high': {
    label: 'Extra high',
    temperature: 'Long-form focus',
    best: 'Large, open-ended jobs that need planning, building, testing, and audit loops.',
    examples: ['Build a complete app', 'Migrate a stack', 'Run a deep repo audit', 'Coordinate several tools'],
    note: 'Give it a crisp goal and checkpoints. Exact model choices can change, so use the app recommendation as your baseline.',
  },
}

export const shippingSteps = [
  {
    title: '1. Keep a local folder',
    body: 'A project can begin as a normal folder on your computer. Let Codex build and verify the first useful version there.',
    prompt: 'Inspect this folder, run the app locally, and tell me what evidence proves it works before we publish anything.',
  },
  {
    title: '2. Create clean commits',
    body: 'Git records good states you can return to. Review the diff, keep the commit focused, and use a plain-language message.',
    prompt: 'Review the current diff, point out unrelated changes, run the relevant check, and suggest one concise commit message for the verified work.',
  },
  {
    title: '3. Push to GitHub when useful',
    body: 'GitHub is optional for local experiments and useful for backup, collaboration, and connecting deployment services.',
    prompt: 'Explain the safest way to initialize this as a Git repo, create the first commit, and push it to a new GitHub repository. Pause before any account action.',
  },
  {
    title: '4. Publish and compare',
    body: 'Vercel, Netlify, GitHub Pages, and similar hosts can publish static sites. Always compare the live URL with the local build.',
    prompt: 'Prepare this site for a static host. Run the production build, preview it, then give me the exact host settings and a final live-URL verification checklist.',
  },
]

export const learningTracks = [
  {
    label: 'Beginner',
    title: 'Make one safe, visible change.',
    body: 'Learn folders, threads, Local mode, small prompts, browser proof, and focused commits.',
  },
  {
    label: 'Intermediate',
    title: 'Make good runs repeatable.',
    body: 'Add AGENTS.md guidance, use skills and plugins, review diffs, publish previews, and ask Codex to audit itself.',
  },
  {
    label: 'Advanced',
    title: 'Use isolation and automation with purpose.',
    body: 'Reach for worktrees, cloud tasks, MCP, goal mode, and deeper reasoning when the added machinery genuinely helps.',
  },
]

export const sourceLinks = [
  ['Get started', 'https://developers.openai.com/codex/app/'],
  ['App features', 'https://developers.openai.com/codex/app/features'],
  ['Settings', 'https://developers.openai.com/codex/app/settings'],
  ['Computer Use', 'https://developers.openai.com/codex/app/computer-use'],
  ['In-app browser', 'https://developers.openai.com/codex/app/browser'],
  ['Skills', 'https://developers.openai.com/codex/skills'],
  ['Plugins', 'https://developers.openai.com/codex/plugins'],
  ['MCP', 'https://developers.openai.com/codex/mcp'],
  ['Models', 'https://developers.openai.com/codex/models'],
  ['AGENTS.md', 'https://developers.openai.com/codex/guides/agents-md'],
  ['Review pane', 'https://developers.openai.com/codex/app/review'],
  ['Worktrees', 'https://developers.openai.com/codex/app/worktrees'],
]
