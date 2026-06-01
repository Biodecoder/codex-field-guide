import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Bot,
  Boxes,
  Check,
  ChevronRight,
  Clipboard,
  Code2,
  Computer,
  GitBranch,
  Globe2,
  Layers3,
  MousePointerClick,
  Play,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Wand2,
} from 'lucide-react'
import './App.css'

type TrackId = 'beginner' | 'intermediate' | 'advanced'
type EffortId = 'low' | 'medium' | 'high' | 'extra-high'
type PromptId = 'learn' | 'build' | 'debug' | 'review' | 'publish'

const sourceLinks = [
  ['Best practices', 'https://developers.openai.com/codex/learn/best-practices'],
  ['Prompting', 'https://developers.openai.com/codex/prompting'],
  ['Codex app features', 'https://developers.openai.com/codex/app/features'],
  ['Computer Use', 'https://developers.openai.com/codex/app/computer-use'],
  ['In-app browser', 'https://developers.openai.com/codex/app/browser'],
  ['Models', 'https://developers.openai.com/codex/models'],
  ['Skills', 'https://developers.openai.com/codex/skills'],
  ['Plugins', 'https://developers.openai.com/codex/plugins'],
  ['MCP', 'https://developers.openai.com/codex/mcp'],
  ['AGENTS.md', 'https://developers.openai.com/codex/guides/agents-md'],
  ['Review pane', 'https://developers.openai.com/codex/app/review'],
  ['Worktrees', 'https://developers.openai.com/codex/app/worktrees'],
]

const navItems = [
  ['Start', 'start'],
  ['First Run', 'first-run'],
  ['Prompt Lab', 'prompt-lab'],
  ['Tools', 'tools'],
  ['Models', 'models'],
  ['Publish', 'publish'],
  ['Advanced', 'advanced'],
]

const tracks: Record<
  TrackId,
  {
    name: string
    title: string
    description: string
    actions: string[]
  }
> = {
  beginner: {
    name: 'Beginner',
    title: 'Make one safe, visible change',
    description:
      'Open a real folder, ask for a tiny improvement, watch Codex inspect the files, then verify the result before you accept it.',
    actions: [
      'Pick a small repo or create a fresh folder.',
      'Ask Codex to explain the app before editing.',
      'Make one change with a clear “done when” condition.',
      'Use the diff pane, run the app, then commit.',
    ],
  },
  intermediate: {
    name: 'Intermediate',
    title: 'Turn good runs into repeatable workflow',
    description:
      'Move recurring preferences into AGENTS.md, install the right plugins, use browser review, and ask for tests or screenshots as proof.',
    actions: [
      'Write repo-specific instructions in AGENTS.md.',
      'Use Browser for local web UI checks.',
      'Install skills/plugins for repeated work.',
      'Ask Codex to audit its own change before handoff.',
    ],
  },
  advanced: {
    name: 'Advanced',
    title: 'Operate Codex like a small engineering system',
    description:
      'Use worktrees, cloud tasks, review policies, MCP, subagents, and automation only when the extra machinery buys safety or speed.',
    actions: [
      'Split parallel work into worktrees or cloud tasks.',
      'Use high reasoning for ambiguous architecture.',
      'Create skills for repeatable project workflows.',
      'Gate risky changes with review, tests, and source evidence.',
    ],
  },
}

const firstRunSteps = [
  {
    title: 'Open a project folder',
    body: 'Start local when you want Codex to read and edit files on your machine. Start a chat without a project for research or planning.',
    prompt: 'Explain what this repository does. Do not edit files yet. List the main folders, how to run it, and what looks risky.',
  },
  {
    title: 'Ask for a small scoped change',
    body: 'A beginner-friendly prompt names the goal, context, constraints, and what proves the task is done.',
    prompt:
      'Add a clear empty state to the dashboard. Keep the existing design system. Done when the page builds, the empty state is visible, and no unrelated files changed.',
  },
  {
    title: 'Watch the evidence',
    body: 'Good Codex runs read files, make targeted edits, run checks, and explain what changed. If it skips verification, ask for it.',
    prompt:
      'Before you finish, run the relevant check, open the rendered page, and summarize exactly what evidence proves the change works.',
  },
  {
    title: 'Review before committing',
    body: 'Use the review pane for staged and unstaged changes. Comment on specific lines when you want a precise fix.',
    prompt:
      'Review the current diff for bugs, visual regressions, and missing tests. Fix only issues you can prove from the diff or local run.',
  },
]

const promptExamples: Record<
  PromptId,
  {
    label: string
    icon: typeof BookOpen
    summary: string
    prompt: string
  }
> = {
  learn: {
    label: 'Understand',
    icon: BookOpen,
    summary: 'Use when you are new to a codebase.',
    prompt:
      'Read this repo without editing it. Explain the architecture in beginner language, list the most important files, and tell me the safest first change to make.',
  },
  build: {
    label: 'Build',
    icon: Wand2,
    summary: 'Use when you know the outcome.',
    prompt:
      'Create a polished settings screen for this app. Match the existing UI patterns, include loading/error/empty states, run the build, and open the result in the browser before finishing.',
  },
  debug: {
    label: 'Debug',
    icon: Search,
    summary: 'Use when something breaks.',
    prompt:
      'Reproduce this bug first, then identify the smallest code path that causes it. Add or update a test that fails before the fix and passes after it.',
  },
  review: {
    label: 'Review',
    icon: ShieldCheck,
    summary: 'Use before accepting changes.',
    prompt:
      'Review the uncommitted changes like a senior engineer. Lead with bugs, regressions, and missing tests. If you find issues, fix them and rerun the relevant checks.',
  },
  publish: {
    label: 'Publish',
    icon: Rocket,
    summary: 'Use when the app is ready to share.',
    prompt:
      'Prepare this site for publication. Check the production build, explain the deployment options, and create a short release checklist covering env vars, preview URL, and rollback.',
  },
}

const tools = [
  {
    name: 'In-app Browser',
    icon: Globe2,
    bestFor: 'Local web pages, visual QA, comments on a rendered UI',
    useWhen:
      'The app runs on localhost or a public page does not need sign-in. Ask Codex to open the route, click through the flow, and fix visible issues.',
    avoidWhen: 'The page needs your logged-in browser profile, cookies, extensions, or an existing Chrome tab.',
  },
  {
    name: 'Computer Use',
    icon: Computer,
    bestFor: 'Desktop apps, simulators, settings screens, GUI-only bugs',
    useWhen:
      'The task depends on seeing and operating a macOS or Windows app. Keep the prompt narrow and stay present for sensitive actions.',
    avoidWhen: 'A plugin, MCP server, file inspection, or the in-app browser can do the job more repeatably.',
  },
  {
    name: 'Skills',
    icon: Sparkles,
    bestFor: 'Reusable task workflows with instructions and helper scripts',
    useWhen:
      'You repeat the same kind of task, such as accessibility audits, release checks, sprite pipelines, or document generation.',
    avoidWhen: 'You only need one sentence of temporary guidance for the current run.',
  },
  {
    name: 'Plugins',
    icon: Boxes,
    bestFor: 'Installable bundles of skills, apps, and MCP servers',
    useWhen:
      'You want Codex to work with GitHub, Slack, Gmail, Figma, Vercel, Netlify-style deploys, security scans, or a packaged team workflow.',
    avoidWhen: 'A local skill is enough and you do not need distribution or external app access.',
  },
  {
    name: 'MCP Servers',
    icon: Layers3,
    bestFor: 'Structured tools and current external context',
    useWhen:
      'Codex needs current docs, database tools, browser automation, Figma designs, Sentry logs, or GitHub actions beyond raw files.',
    avoidWhen: 'Plain repo files already contain the source of truth.',
  },
]

const efforts: Record<
  EffortId,
  {
    label: string
    speed: string
    useFor: string
    examples: string[]
    caution: string
  }
> = {
  low: {
    label: 'Low',
    speed: 'Fastest, least expensive attention',
    useFor: 'Small, well-scoped edits where the path is obvious.',
    examples: ['Rename a label', 'Format a file', 'Summarize a short README', 'Add a simple copy tweak'],
    caution: 'Do not use it for fuzzy debugging or architecture decisions.',
  },
  medium: {
    label: 'Medium',
    speed: 'Balanced default',
    useFor: 'Most everyday coding, explanations, and contained UI improvements.',
    examples: ['Add a component', 'Write tests', 'Explain a module', 'Fix a known issue'],
    caution: 'If Codex starts guessing, raise the effort or switch to Plan mode.',
  },
  high: {
    label: 'High',
    speed: 'Slower, deeper checks',
    useFor: 'Complex debugging, cross-file refactors, security-sensitive reviews, and tricky frontend polish.',
    examples: ['Trace a regression', 'Refactor shared state', 'Review a PR', 'Match a design screenshot'],
    caution: 'Ask for verification so the extra reasoning turns into evidence.',
  },
  'extra-high': {
    label: 'Extra High',
    speed: 'Slowest, best for long agentic work',
    useFor: 'Ambiguous, multi-step projects that need planning, implementation, testing, and audit loops.',
    examples: ['Build a full app', 'Migrate a stack', 'Run a deep repo audit', 'Coordinate tools and artifacts'],
    caution: 'Use a crisp goal and check-ins so the run stays aligned.',
  },
}

const publishPaths = [
  {
    name: 'Local first',
    icon: TerminalSquare,
    steps: ['Run the app locally', 'Build production assets', 'Open the generated output', 'Fix visible gaps'],
    prompt:
      'Run the production build, preview it locally, and inspect the rendered page on desktop and mobile before calling it ready.',
  },
  {
    name: 'GitHub route',
    icon: GitBranch,
    steps: ['Initialize Git', 'Commit a clean state', 'Push to GitHub', 'Connect the repo to a host'],
    prompt:
      'Prepare this repo for GitHub. Create a concise README, verify git status, suggest a commit message, and explain the safest push flow.',
  },
  {
    name: 'Hosted preview',
    icon: Rocket,
    steps: ['Choose Vercel, Netlify, GitHub Pages, or your host', 'Set build command', 'Check preview URL', 'Record rollback steps'],
    prompt:
      'Deploy this static site to the configured host. Confirm the live URL renders the current build and compare it with the local preview.',
  },
]

const advancedMoves = [
  {
    title: 'AGENTS.md as project memory',
    body: 'Put durable repo rules where Codex automatically reads them: commands, conventions, constraints, review expectations, and what “done” means.',
  },
  {
    title: 'Worktrees for parallel attempts',
    body: 'Use a worktree when Codex should try an idea without touching your foreground checkout, or when two threads should work side by side.',
  },
  {
    title: 'Goal mode for long tasks',
    body: 'Use /goal when the objective will take many turns and needs persistent completion criteria. Use /plan first if the goal is fuzzy.',
  },
  {
    title: 'Audit loops',
    body: 'After a run, ask Codex to audit the result against the original request, rendered output, tests, and repo cleanliness.',
  },
]

function App() {
  const [activeTrack, setActiveTrack] = useState<TrackId>('beginner')
  const [activePrompt, setActivePrompt] = useState<PromptId>('learn')
  const [activeEffort, setActiveEffort] = useState<EffortId>('medium')
  const [copied, setCopied] = useState<string | null>(null)
  const [checkedSteps, setCheckedSteps] = useState(() => new Set<number>())

  const prompt = promptExamples[activePrompt]
  const EffortIcon = activeEffort === 'extra-high' ? Bot : activeEffort === 'high' ? ShieldCheck : activeEffort === 'medium' ? Code2 : Play

  const generatedPrompt = useMemo(() => {
    return [
      'Goal: Build the smallest useful change first.',
      'Context: Read the relevant files before editing; ask if the repo structure is unclear.',
      'Constraints: Keep existing design patterns, avoid unrelated refactors, and preserve user changes.',
      'Done when: The app builds, the result is visibly checked, the diff is reviewed, and the repo is ready to commit.',
    ].join('\n')
  }, [])

  async function copyText(id: string, value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(id)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      setCopied(null)
    }
  }

  function toggleStep(index: number) {
    setCheckedSteps((current) => {
      const next = new Set(current)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <main className="app-shell">
      <aside className="side-rail" aria-label="Guide sections">
        <a className="brand-mark" href="#start" aria-label="Codex Field Guide home">
          <span>CF</span>
        </a>
        <nav>
          {navItems.map(([label, id]) => (
            <a href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
        <a className="rail-source" href="https://developers.openai.com/codex/codex-manual.md" target="_blank" rel="noreferrer">
          Sources
        </a>
      </aside>

      <section className="hero-section" id="start">
        <div className="hero-copy">
          <h1>Codex Field Guide</h1>
          <p className="hero-lede">
            Learn the OpenAI Codex app by shipping one careful step at a time: prompts, Computer Use, skills, plugins,
            repos, commits, publishing, model effort, and the small habits that make agentic coding feel calm.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#first-run">
              Start the first run <ArrowRight aria-hidden="true" />
            </a>
            <button type="button" className="quiet-action" onClick={() => copyText('builder', generatedPrompt)}>
              <Clipboard aria-hidden="true" /> {copied === 'builder' ? 'Copied' : 'Copy starter frame'}
            </button>
          </div>
        </div>

        <div className="learning-map" aria-label="Codex learning map">
          <div className="map-header">
            <span>Learning map</span>
            <div className="map-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="map-grid">
            {Object.entries(tracks).map(([id, track], index) => (
              <button
                key={id}
                type="button"
                className={`map-card ${activeTrack === id ? 'is-active' : ''}`}
                onClick={() => setActiveTrack(id as TrackId)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{track.name}</strong>
                <small>{track.title}</small>
              </button>
            ))}
          </div>
          <div className="track-panel">
            <div>
              <p>{tracks[activeTrack].name} track</p>
              <h2>{tracks[activeTrack].title}</h2>
              <span>{tracks[activeTrack].description}</span>
            </div>
            <ul>
              {tracks[activeTrack].actions.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="What this guide covers">
        {[
          ['Beginner safe', 'No assumed coding-agent experience'],
          ['Source-backed', 'Based on current Codex docs'],
          ['Hands-on', 'Prompts, checklists, and workflows'],
          ['Scalable', 'Intermediate and advanced sections included'],
        ].map(([label, value]) => (
          <div key={label}>
            <strong>{label}</strong>
            <span>{value}</span>
          </div>
        ))}
      </section>

      <section className="section-block first-run" id="first-run">
        <div className="section-heading">
          <p className="plain-label">First Run</p>
          <h2>Your first useful Codex loop</h2>
          <span>
            The beginner loop is not “ask for magic.” It is context, one scoped change, visible proof, review, then
            commit.
          </span>
        </div>
        <div className="run-layout">
          <div className="checklist-panel">
            {firstRunSteps.map((step, index) => (
              <button
                type="button"
                className={`check-row ${checkedSteps.has(index) ? 'is-done' : ''}`}
                key={step.title}
                onClick={() => toggleStep(index)}
              >
                <span className="check-index">{checkedSteps.has(index) ? <Check aria-hidden="true" /> : index + 1}</span>
                <span>
                  <strong>{step.title}</strong>
                  <small>{step.body}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="prompt-stack">
            {firstRunSteps.map((step, index) => (
              <article className="mini-prompt" key={step.prompt}>
                <span>Prompt {index + 1}</span>
                <p>{step.prompt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block prompt-lab" id="prompt-lab">
        <div className="section-heading">
          <p className="plain-label">Prompt Lab</p>
          <h2>Prompts that tell Codex what good looks like</h2>
          <span>
            Strong prompts give Codex context and a verification target. Use these as starting points, then add your
            repo-specific details.
          </span>
        </div>
        <div className="prompt-lab-grid">
          <div className="prompt-tabs" role="tablist" aria-label="Prompt examples">
            {Object.entries(promptExamples).map(([id, item]) => {
              const Icon = item.icon
              return (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activePrompt === id}
                  className={activePrompt === id ? 'is-selected' : ''}
                  onClick={() => setActivePrompt(id as PromptId)}
                  key={id}
                >
                  <Icon aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
          <article className="large-prompt-card">
            <div>
              <p>{prompt.summary}</p>
              <h3>{prompt.label} prompt</h3>
            </div>
            <pre>{prompt.prompt}</pre>
            <button type="button" onClick={() => copyText(activePrompt, prompt.prompt)}>
              <Clipboard aria-hidden="true" /> {copied === activePrompt ? 'Copied' : 'Copy prompt'}
            </button>
          </article>
          <article className="prompt-builder">
            <h3>Starter prompt frame</h3>
            <p>Use this four-part shape when you are unsure how to ask.</p>
            <pre>{generatedPrompt}</pre>
          </article>
        </div>
      </section>

      <section className="section-block tools-section" id="tools">
        <div className="section-heading">
          <p className="plain-label">Tools</p>
          <h2>Pick the smallest capable surface</h2>
          <span>
            Codex can read files, run commands, use browsers, operate desktop apps, and connect to external services.
            The trick is choosing the narrowest tool that proves the result.
          </span>
        </div>
        <div className="tool-grid">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <article className="tool-card" key={tool.name}>
                <div className="tool-title">
                  <Icon aria-hidden="true" />
                  <h3>{tool.name}</h3>
                </div>
                <dl>
                  <div>
                    <dt>Best for</dt>
                    <dd>{tool.bestFor}</dd>
                  </div>
                  <div>
                    <dt>Use when</dt>
                    <dd>{tool.useWhen}</dd>
                  </div>
                  <div>
                    <dt>Avoid when</dt>
                    <dd>{tool.avoidWhen}</dd>
                  </div>
                </dl>
              </article>
            )
          })}
        </div>
        <div className="computer-use-band">
          <div>
            <MousePointerClick aria-hidden="true" />
            <h3>Computer Use safety recipe</h3>
          </div>
          <ol>
            <li>Name one app or flow.</li>
            <li>Keep sensitive windows closed unless required.</li>
            <li>Review permission prompts before allowing access.</li>
            <li>Cancel immediately if Codex moves to the wrong window.</li>
          </ol>
        </div>
      </section>

      <section className="section-block model-section" id="models">
        <div className="section-heading">
          <p className="plain-label">Models</p>
          <h2>When to use Low, Medium, High, and Extra High</h2>
          <span>
            Effort is a trade-off between speed and depth. Start balanced, then raise effort when the task gets more
            ambiguous, multi-step, or risky.
          </span>
        </div>
        <div className="effort-layout">
          <div className="effort-selector" role="tablist" aria-label="Reasoning effort">
            {(Object.keys(efforts) as EffortId[]).map((id) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeEffort === id}
                className={activeEffort === id ? 'is-selected' : ''}
                onClick={() => setActiveEffort(id)}
                key={id}
              >
                {efforts[id].label}
              </button>
            ))}
          </div>
          <article className="effort-card">
            <EffortIcon aria-hidden="true" />
            <div>
              <span>{efforts[activeEffort].speed}</span>
              <h3>{efforts[activeEffort].useFor}</h3>
              <ul>
                {efforts[activeEffort].examples.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>{efforts[activeEffort].caution}</p>
            </div>
          </article>
          <div className="model-note">
            <strong>Practical default:</strong> use the recommended Codex model for most work, choose mini or faster
            models for lightweight scans, and save the deepest effort for long agentic tasks that need planning,
            implementation, verification, and audit.
          </div>
        </div>
      </section>

      <section className="section-block publish-section" id="publish">
        <div className="section-heading">
          <p className="plain-label">Publish</p>
          <h2>From local folder to shareable URL</h2>
          <span>
            Publishing is mostly a proof chain: build locally, commit a clean state, push or connect the repo, then
            compare the deployed site with the build you verified.
          </span>
        </div>
        <div className="publish-grid">
          {publishPaths.map((path) => {
            const Icon = path.icon
            return (
              <article className="publish-card" key={path.name}>
                <Icon aria-hidden="true" />
                <h3>{path.name}</h3>
                <ul>
                  {path.steps.map((step) => (
                    <li key={step}>
                      <ChevronRight aria-hidden="true" />
                      {step}
                    </li>
                  ))}
                </ul>
                <pre>{path.prompt}</pre>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section-block advanced-section" id="advanced">
        <div className="section-heading">
          <p className="plain-label">Advanced</p>
          <h2>The operating system around Codex</h2>
          <span>
            Advanced Codex use is less about clever prompts and more about durable instructions, isolated branches,
            specialized skills, connected tools, and honest completion audits.
          </span>
        </div>
        <div className="advanced-grid">
          {advancedMoves.map((move, index) => (
            <article className="advanced-card" key={move.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{move.title}</h3>
              <p>{move.body}</p>
            </article>
          ))}
        </div>
        <div className="cheat-sheet">
          <div>
            <h3>One prompt to end every serious run</h3>
            <p>
              Ask Codex to audit the result against the original request, source docs, tests, rendered behavior, and
              repo cleanliness before it says done.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              copyText(
                'audit',
                'Audit this run against the original request. Verify each requirement with current evidence: files changed, tests or build output, rendered UI behavior, source docs used, git status, and any remaining gaps. Fix what you can before final handoff.',
              )
            }
          >
            <Clipboard aria-hidden="true" /> {copied === 'audit' ? 'Copied' : 'Copy audit prompt'}
          </button>
        </div>
      </section>

      <section className="source-section" aria-label="Official sources">
        <div>
          <p className="plain-label">Sources</p>
          <h2>Built from the current Codex manual</h2>
          <p>
            Product details change, so this guide links back to official OpenAI Codex documentation for the facts that
            should stay current.
          </p>
        </div>
        <div className="source-links">
          {sourceLinks.map(([label, href]) => (
            <a href={href} target="_blank" rel="noreferrer" key={href}>
              {label}
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
