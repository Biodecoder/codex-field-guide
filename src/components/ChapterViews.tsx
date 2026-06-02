import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  ExternalLink,
  Eye,
  GitBranch,
  Hand,
  MonitorCheck,
  MousePointerClick,
  Play,
  Plug,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  WandSparkles,
  Workflow,
  Wrench,
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import {
  efforts,
  learningTracks,
  promptCategories,
  promptLibrary,
  settingsPanels,
  setupSteps,
  shippingSteps,
  sourceLinks,
  toolPanels,
  tourShots,
  type EffortId,
  type PromptCategory,
} from '../content'
import { type GuideLessonId, type GuideRoute } from '../guide'
import { TeachingCanvas, type CanvasHotspot } from './TeachingCanvas'

type ChapterViewsProps = {
  route: GuideRoute
  completedSetup: string[]
  copied: string | null
  onNavigate: (route: GuideRoute) => void
  onToggleSetup: (id: string) => void
  onCopy: (id: string, value: string) => void
  onZoom: (image: { src: string; alt: string }, trigger: HTMLButtonElement) => void
}

const setupHotspots: CanvasHotspot[] = [
  { number: '1', title: 'Install', body: 'Open the desktop app.', position: 'p1' },
  { number: '2', title: 'Sign in', body: 'Use your usual account.', position: 'p2' },
  { number: '3', title: 'Add folder', body: 'Choose a safe workspace.', position: 'p3' },
  { number: '4', title: 'Stay local', body: 'Learn close to your files.', position: 'p4' },
  { number: '5', title: 'Prompt', body: 'Ask for one visible result.', position: 'p5' },
]

const interfaceHotspots: CanvasHotspot[] = [
  { number: '1', title: 'Projects', body: 'Each project points to a folder.', position: 'p1' },
  { number: '2', title: 'Threads', body: 'Keep one task in each conversation.', position: 'p3' },
  { number: '3', title: 'Modes', body: 'Begin with Local mode.', position: 'p5' },
]

const browserHotspots: CanvasHotspot[] = [
  { number: '1', title: 'Open localhost', body: 'See your local site.', position: 'p1' },
  { number: '2', title: 'Inspect', body: 'Click the important path.', position: 'p3' },
  { number: '3', title: 'Verify', body: 'Check phone and desktop.', position: 'p5' },
]

const publishHotspots: CanvasHotspot[] = [
  { number: '1', title: 'Review diff', body: 'Understand every change.', position: 'p1' },
  { number: '2', title: 'Write message', body: 'Describe one coherent result.', position: 'p3' },
  { number: '3', title: 'Commit and push', body: 'Share only after proof.', position: 'p5' },
]

const permissionFlow = [
  {
    id: 'request',
    label: 'Request',
    title: 'Codex asks before an impactful action.',
    body: 'You see the proposed desktop action before it happens, such as opening an app or clicking a control.',
    note: 'Pause whenever the request feels broader than the task you gave.',
    icon: MousePointerClick,
  },
  {
    id: 'review',
    label: 'Review',
    title: 'Read the scope, destination, and likely effect.',
    body: 'Check which app or window is involved and what the action will change.',
    note: 'Close unrelated or sensitive windows before desktop work begins.',
    icon: Eye,
  },
  {
    id: 'choose',
    label: 'Choose',
    title: 'Approve once, allow always, or deny.',
    body: 'Use the smallest permission that fits the moment. Beginners can approve one action at a time.',
    note: 'Deny anything unexpected. You can restate the task more precisely.',
    icon: Hand,
  },
  {
    id: 'act',
    label: 'Act',
    title: 'Codex works inside the approved scope.',
    body: 'Stay nearby while the desktop action runs and stop if the wrong app or window opens.',
    note: 'A visible, bounded task is a good Computer Use task.',
    icon: Play,
  },
  {
    id: 'audit',
    label: 'Audit',
    title: 'Review the visible result before continuing.',
    body: 'Check the screen, changed files, and any follow-up request before calling the run complete.',
    note: 'Treat the result as evidence to inspect, not an automatic success.',
    icon: ClipboardCheck,
  },
]

export function ChapterViews(props: ChapterViewsProps) {
  switch (props.route.chapter) {
    case 'beginner':
      return <BeginnerChapter {...props} />
    case 'workflow':
      return <WorkflowChapter {...props} />
    case 'tools':
      return <ToolsChapter {...props} />
    case 'publish':
      return <PublishChapter {...props} />
    case 'advanced':
      return <AdvancedChapter {...props} />
  }
}

function BeginnerChapter({
  route,
  completedSetup,
  copied,
  onNavigate,
  onToggleSetup,
  onCopy,
  onZoom,
}: ChapterViewsProps) {
  const activeId = route.detail ?? setupSteps[0].id
  const activeIndex = Math.max(0, setupSteps.findIndex((step) => step.id === activeId))
  const step = setupSteps[activeIndex]
  const completed = completedSetup.includes(step.id)

  return (
    <article className="chapter-view">
      <ChapterIntro
        eyebrow="Beginner · setup path"
        title="Start small. See it work."
        lede="You do not need to learn everything at once. Set up one safe local project, give Codex one clear task, and inspect the result."
      />
      <div className="beginner-layout">
        <section className="setup-panel">
          <p className="section-label">Your first five steps</p>
          <div className="setup-step-list">
            {setupSteps.map((item, index) => {
              const isActive = item.id === step.id
              const isDone = completedSetup.includes(item.id)
              return (
                <button
                  className={`setup-step ${isActive ? 'is-active' : ''}`}
                  type="button"
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => onNavigate({ chapter: 'beginner', lesson: 'setup', detail: item.id })}
                  key={item.id}
                >
                  <span className="setup-number">{isDone ? <Check size={18} /> : index + 1}</span>
                  <span><strong>{item.title}</strong><small>{item.short}</small></span>
                </button>
              )
            })}
          </div>
        </section>
        <div className="chapter-primary">
          <TeachingCanvas
            image="/images/generated/setup-path-infographic.png"
            alt="Illustrated five-step path for getting started with Codex"
            caption="Your first hour is a short path: install, sign in, choose a folder, stay local, then ask for one visible result."
            hotspots={setupHotspots}
            onZoom={(trigger) => onZoom({ src: step.image, alt: step.imageAlt }, trigger)}
          />
          <section className="lesson-detail">
            <p className="lesson-count">Step {activeIndex + 1} of {setupSteps.length}</p>
            <h2>{step.title}</h2>
            <p className="reading-copy">{step.body}</p>
            <aside className="lesson-note"><Sparkles size={20} /><span>{step.note}</span></aside>
            {step.prompt && (
              <PromptBox id={`setup-${step.id}`} value={step.prompt} copied={copied} onCopy={onCopy} />
            )}
            <div className="lesson-actions">
              <button className={`primary-button ${completed ? 'is-complete' : ''}`} type="button" onClick={() => onToggleSetup(step.id)}>
                {completed ? <CheckCircle2 size={20} /> : <Check size={20} />}
                {completed ? 'Marked complete' : 'Mark step complete'}
              </button>
              <a className="text-link" href={step.docs} target="_blank" rel="noreferrer">
                {step.action} <ExternalLink size={16} />
              </a>
            </div>
          </section>
        </div>
      </div>
    </article>
  )
}

function WorkflowChapter({ route, onNavigate, onZoom }: ChapterViewsProps) {
  return (
    <article className="chapter-view">
      <ChapterIntro
        eyebrow="Workflow · workspace"
        title="Know where your work lives."
        lede="Codex feels much simpler once you can tell a project, a thread, and a mode apart. Begin with the small interface ideas that help every task."
      />
      <LessonSubnav
        active={route.lesson}
        items={[
          ['interface', 'Interface tour'],
          ['settings', 'Settings that matter'],
        ]}
        onChoose={(lesson) => onNavigate({ chapter: 'workflow', lesson })}
      />
      {route.lesson === 'settings'
        ? <SettingsLesson onZoom={onZoom} />
        : <InterfaceLesson onZoom={onZoom} />}
    </article>
  )
}

function InterfaceLesson({ onZoom }: Pick<ChapterViewsProps, 'onZoom'>) {
  const [activeTour, setActiveTour] = useState(tourShots[0].id)
  const tour = tourShots.find((shot) => shot.id === activeTour) ?? tourShots[0]

  return (
    <div className="lesson-grid">
      <TeachingCanvas
        image={tour.image}
        alt={tour.imageAlt}
        caption="A project is the folder. A thread is one conversation inside it. The mode decides where the task runs."
        source={tour.docs}
        hotspots={interfaceHotspots}
        onZoom={(trigger) => onZoom({ src: tour.image, alt: tour.imageAlt }, trigger)}
      />
      <section className="open-panel lesson-selector">
        <p className="section-label">Three ideas to keep</p>
        {tourShots.map((shot, index) => (
          <button
            className={`selector-row ${shot.id === tour.id ? 'is-active' : ''}`}
            type="button"
            aria-pressed={shot.id === tour.id}
            onClick={() => setActiveTour(shot.id)}
            key={shot.id}
          >
            <span>{index + 1}</span>
            <strong>{shot.label}</strong>
          </button>
        ))}
        <div className="selector-explanation">
          <h2>{tour.title}</h2>
          <p>{tour.body}</p>
        </div>
      </section>
    </div>
  )
}

function SettingsLesson({ onZoom }: Pick<ChapterViewsProps, 'onZoom'>) {
  const [activeId, setActiveId] = useState(settingsPanels[0].id)
  const setting = settingsPanels.find((panel) => panel.id === activeId) ?? settingsPanels[0]

  return (
    <div className="lesson-grid">
      <TeachingCanvas
        image={setting.image}
        alt={setting.imageAlt}
        caption="Keep settings simple at first. A readable workspace and careful permissions matter more than extensive customization."
        source={setting.docs}
        hotspots={[
          { number: '1', title: 'Readability', body: 'Choose a comfortable theme.', position: 'p1' },
          { number: '2', title: 'Permissions', body: 'Grant only what the task needs.', position: 'p3' },
          { number: '3', title: 'Defaults', body: 'Tune more when useful.', position: 'p5' },
        ]}
        onZoom={(trigger) => onZoom({ src: setting.image, alt: setting.imageAlt }, trigger)}
      />
      <section className="open-panel lesson-selector">
        <p className="section-label">Settings studio</p>
        {settingsPanels.map((panel) => (
          <button
            className={`selector-row ${panel.id === setting.id ? 'is-active' : ''}`}
            type="button"
            aria-pressed={panel.id === setting.id}
            onClick={() => setActiveId(panel.id)}
            key={panel.id}
          >
            <Settings2 size={18} />
            <strong>{panel.label}</strong>
          </button>
        ))}
        <div className="selector-explanation">
          <h2>{setting.title}</h2>
          <p>{setting.body}</p>
          <ul>{setting.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
        </div>
      </section>
    </div>
  )
}

function ToolsChapter({ route, onNavigate, ...props }: ChapterViewsProps) {
  return (
    <article className="chapter-view">
      <ChapterIntro
        eyebrow="Tools · choose what helps"
        title="Use the smallest useful tool."
        lede="Codex has several ways to help. Reach for the surface that matches the task, then keep the request narrow enough to inspect."
      />
      <LessonSubnav
        active={route.lesson}
        items={[
          ['chooser', 'Tool chooser'],
          ['computer-use', 'Computer Use'],
          ['skills-plugins', 'Skills & plugins'],
          ['prompts', 'Prompt examples'],
        ]}
        onChoose={(lesson) => onNavigate({ chapter: 'tools', lesson })}
      />
      {route.lesson === 'computer-use' && <ComputerUseLesson />}
      {route.lesson === 'skills-plugins' && <SkillsPluginsLesson onZoom={props.onZoom} />}
      {route.lesson === 'prompts' && <PromptLibraryLesson {...props} route={route} onNavigate={onNavigate} />}
      {route.lesson === 'chooser' && <ToolChooserLesson onZoom={props.onZoom} />}
    </article>
  )
}

function ToolChooserLesson({ onZoom }: Pick<ChapterViewsProps, 'onZoom'>) {
  const [activeId, setActiveId] = useState(toolPanels[0].id)
  const tool = toolPanels.find((panel) => panel.id === activeId) ?? toolPanels[0]

  return (
    <div className="lesson-grid">
      <TeachingCanvas
        image={tool.image}
        alt={tool.imageAlt}
        caption="For local websites, the in-app Browser is a natural first stop: open, inspect, verify."
        source={tool.docs}
        hotspots={browserHotspots}
        onZoom={(trigger) => onZoom({ src: tool.image, alt: tool.imageAlt }, trigger)}
      />
      <section className="open-panel lesson-selector">
        <p className="section-label">Choose by job</p>
        {toolPanels.map((panel) => (
          <button
            className={`selector-row ${panel.id === tool.id ? 'is-active' : ''}`}
            type="button"
            aria-pressed={panel.id === tool.id}
            onClick={() => setActiveId(panel.id)}
            key={panel.id}
          >
            <Wrench size={18} />
            <strong>{panel.label}</strong>
          </button>
        ))}
        <div className="selector-explanation">
          <p className="accent-label">{tool.verdict}</p>
          <h2>{tool.title}</h2>
          <p>{tool.body}</p>
          <p><strong>Best for:</strong> {tool.best}</p>
        </div>
      </section>
    </div>
  )
}

function ComputerUseLesson() {
  const [activeId, setActiveId] = useState(permissionFlow[0].id)
  const permission = permissionFlow.find((step) => step.id === activeId) ?? permissionFlow[0]

  return (
    <div className="single-lesson">
      <section className="lesson-lede-block">
        <ShieldCheck size={28} />
        <div>
          <h2>Computer Use is for visible desktop work.</h2>
          <p>Keep the task bounded, stay nearby for approvals, and inspect the visible result before continuing.</p>
        </div>
      </section>
      <div className="permission-flow" aria-label="Computer Use approval flow">
        {permissionFlow.map((step, index) => {
          const Icon = step.icon
          return (
            <button
              className={`permission-step ${step.id === permission.id ? 'is-active' : ''}`}
              type="button"
              aria-pressed={step.id === permission.id}
              onClick={() => setActiveId(step.id)}
              key={step.id}
            >
              <span>{index + 1}</span>
              <Icon size={22} />
              <strong>{step.label}</strong>
            </button>
          )
        })}
      </div>
      <section className="lesson-detail computer-use-detail">
        <h2>{permission.title}</h2>
        <p className="reading-copy">{permission.body}</p>
        <aside className="lesson-note"><ShieldCheck size={20} /><span>{permission.note}</span></aside>
      </section>
      <div className="plain-columns">
        <InfoColumn title="Good first uses" icon={<MonitorCheck size={22} />} items={['Open a desktop app and inspect one screen', 'Reproduce a visual bug in a simulator', 'Check whether a native window matches a design']} />
        <InfoColumn title="Pause before approval" icon={<ShieldCheck size={22} />} items={['Close private documents and unrelated apps', 'Read the requested action slowly', 'Deny anything broader than expected']} />
      </div>
    </div>
  )
}

function SkillsPluginsLesson({ onZoom }: Pick<ChapterViewsProps, 'onZoom'>) {
  return (
    <div className="lesson-grid">
      <TeachingCanvas
        image="/images/official/skill-selector-light.webp"
        alt="Official Codex screenshot showing available skills"
        caption="Skills capture repeatable know-how. Plugins bundle larger capabilities and service connections."
        source="https://developers.openai.com/codex/plugins"
        hotspots={[
          { number: '1', title: 'Skill', body: 'Reusable instructions.', position: 'p1' },
          { number: '2', title: 'Plugin', body: 'Installable capability.', position: 'p3' },
          { number: '3', title: 'Connector', body: 'External data and tools.', position: 'p5' },
        ]}
        onZoom={(trigger) => onZoom({ src: '/images/official/skill-selector-light.webp', alt: 'Official Codex screenshot showing available skills' }, trigger)}
      />
      <section className="extension-list">
        <ExtensionCard icon={<WandSparkles size={24} />} title="Skill" body="A folder of instructions, scripts, and reference material for work you repeat." example="Use a frontend audit skill before releasing a site." />
        <ExtensionCard icon={<Plug size={24} />} title="Plugin" body="A packaged bundle of skills, apps, or tool servers that adds a larger capability." example="Install a Vercel plugin when a project needs deployment help." />
        <ExtensionCard icon={<Workflow size={24} />} title="MCP connector" body="A controlled connection to external tools or data when files alone are not enough." example="Use a GitHub connector to inspect issues or pull requests." />
      </section>
    </div>
  )
}

function PromptLibraryLesson({ route, copied, onCopy }: ChapterViewsProps) {
  const [category, setCategory] = useState<PromptCategory>('all')
  const [query, setQuery] = useState('')
  const [expandedPrompt, setExpandedPrompt] = useState(route.detail ?? promptLibrary[0].id)

  const visiblePrompts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return promptLibrary.filter((prompt) => {
      const matchesCategory = category === 'all' || prompt.category === category
      const matchesQuery = !normalizedQuery || `${prompt.title} ${prompt.summary} ${prompt.category} ${prompt.level}`.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  return (
    <div className="single-lesson prompt-library">
      <div className="prompt-toolbar">
        <label className="prompt-filter">
          <Search size={20} aria-hidden="true" />
          <span className="sr-only">Filter prompt examples</span>
          <input aria-label="Filter prompt examples" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter prompt examples" />
        </label>
        <div className="filter-buttons" aria-label="Prompt categories">
          {promptCategories.map((item) => (
            <button className={item.id === category ? 'is-active' : ''} type="button" aria-pressed={item.id === category} onClick={() => setCategory(item.id)} key={item.id}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="prompt-list">
        {visiblePrompts.map((prompt) => {
          const expanded = prompt.id === expandedPrompt
          return (
            <article className={`prompt-card ${expanded ? 'is-expanded' : ''}`} key={prompt.id}>
              <button className="prompt-card-heading" type="button" aria-expanded={expanded} onClick={() => setExpandedPrompt(prompt.id)}>
                <span>
                  <small>{prompt.level} · {prompt.category}</small>
                  <strong>{prompt.title}</strong>
                  <span>{prompt.summary}</span>
                </span>
                <ArrowRight size={20} />
              </button>
              {expanded && <PromptBox id={`library-${prompt.id}`} value={prompt.prompt} copied={copied} onCopy={onCopy} />}
            </article>
          )
        })}
      </div>
    </div>
  )
}

function PublishChapter({ copied, onCopy, onZoom }: ChapterViewsProps) {
  return (
    <article className="chapter-view">
      <ChapterIntro
        eyebrow="Publish · Git loop"
        title="Ship a shareable version."
        lede="Git and GitHub are useful, but they are not a toll gate. Learn the local loop first, create clean commits, then publish when sharing becomes valuable."
      />
      <div className="lesson-grid publish-grid">
        <TeachingCanvas
          image="/images/official/git-commit-light.webp"
          alt="Official Codex screenshot showing the Git commit interface"
          caption="A clean commit records one understandable result after you have inspected and verified it."
          source="https://developers.openai.com/codex/app/review"
          hotspots={publishHotspots}
          onZoom={(trigger) => onZoom({ src: '/images/official/git-commit-light.webp', alt: 'Official Codex screenshot showing the Git commit interface' }, trigger)}
        />
        <aside className="git-loop-card">
          <GitBranch size={27} />
          <h2>The plain-English Git loop</h2>
          <ol>
            <li>Check what changed.</li>
            <li>Run the app or relevant test.</li>
            <li>Commit one coherent result.</li>
            <li>Push when you want backup or collaboration.</li>
          </ol>
        </aside>
      </div>
      <section className="shipping-list">
        {shippingSteps.map((step) => (
          <article className="shipping-step" key={step.title}>
            <div>
              <h2>{step.title}</h2>
              <p>{step.body}</p>
            </div>
            <PromptBox id={`ship-${step.title}`} value={step.prompt} copied={copied} onCopy={onCopy} compact />
          </article>
        ))}
      </section>
    </article>
  )
}

function AdvancedChapter({ route, onNavigate, copied, onCopy }: ChapterViewsProps) {
  return (
    <article className="chapter-view">
      <ChapterIntro
        eyebrow="Advanced · grow deliberately"
        title="Add depth when it earns its place."
        lede="Larger jobs benefit from more reasoning, clearer checkpoints, and source-backed guidance. Keep the machinery proportional to the task."
      />
      <LessonSubnav
        active={route.lesson}
        items={[
          ['model-effort', 'Model effort'],
          ['workflows', 'Workflows'],
          ['sources', 'Official sources'],
        ]}
        onChoose={(lesson) => onNavigate({ chapter: 'advanced', lesson })}
      />
      {route.lesson === 'workflows' && <AdvancedWorkflows copied={copied} onCopy={onCopy} />}
      {route.lesson === 'sources' && <SourcesLesson />}
      {route.lesson === 'model-effort' && <ModelEffortLesson />}
    </article>
  )
}

function ModelEffortLesson() {
  const [activeEffort, setActiveEffort] = useState<EffortId>('medium')
  const effort = efforts[activeEffort]

  return (
    <div className="single-lesson">
      <section className="effort-ladder" aria-label="Model effort ladder">
        {(Object.keys(efforts) as EffortId[]).map((id, index) => {
          const item = efforts[id]
          return (
            <button className={`effort-step ${id === activeEffort ? 'is-active' : ''}`} type="button" aria-pressed={id === activeEffort} onClick={() => setActiveEffort(id)} key={id}>
              <span>0{index + 1}</span>
              <strong>{item.label}</strong>
              <small>{item.temperature}</small>
            </button>
          )
        })}
      </section>
      <section className="lesson-detail effort-detail">
        <p className="accent-label">{effort.temperature}</p>
        <h2>{effort.label} effort</h2>
        <p className="reading-copy">{effort.best}</p>
        <div className="effort-examples">
          {effort.examples.map((example) => <span key={example}>{example}</span>)}
        </div>
        <aside className="lesson-note"><Bot size={20} /><span>{effort.note}</span></aside>
      </section>
    </div>
  )
}

function AdvancedWorkflows({ copied, onCopy }: Pick<ChapterViewsProps, 'copied' | 'onCopy'>) {
  return (
    <div className="single-lesson">
      <section className="workflow-cards">
        {learningTracks.map((track, index) => (
          <article className="workflow-card" key={track.label}>
            <span>0{index + 1}</span>
            <p className="accent-label">{track.label}</p>
            <h2>{track.title}</h2>
            <p>{track.body}</p>
          </article>
        ))}
      </section>
      <section className="lesson-detail">
        <h2>A useful advanced prompt still has checkpoints.</h2>
        <p className="reading-copy">Tell Codex how to verify the work, when to compare the live artifact, and where to pause before an external account action.</p>
        <PromptBox
          id="advanced-checkpoints"
          value="Audit this project, propose a short implementation plan, then work through it end to end. Verify the local result in the browser at desktop and mobile sizes. Pause before any external account action. After implementation, audit the result again and fix the gaps you find."
          copied={copied}
          onCopy={onCopy}
        />
      </section>
    </div>
  )
}

function SourcesLesson() {
  return (
    <div className="single-lesson">
      <section className="lesson-lede-block">
        <ShieldCheck size={28} />
        <div>
          <h2>Prefer source-backed guidance when details may change.</h2>
          <p>Codex capabilities evolve. Use official documentation for setup, permissions, models, and extension details.</p>
        </div>
      </section>
      <div className="source-grid">
        {sourceLinks.map(([label, href]) => (
          <a href={href} target="_blank" rel="noreferrer" key={href}>
            <span>{label}</span><ExternalLink size={18} />
          </a>
        ))}
      </div>
    </div>
  )
}

function ChapterIntro({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <header className="chapter-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="chapter-lede">{lede}</p>
    </header>
  )
}

function LessonSubnav({
  active,
  items,
  onChoose,
}: {
  active: GuideLessonId
  items: Array<[GuideLessonId, string]>
  onChoose: (lesson: GuideLessonId) => void
}) {
  return (
    <nav className="lesson-subnav" aria-label="Chapter lessons">
      {items.map(([lesson, label]) => (
        <button className={active === lesson ? 'is-active' : ''} type="button" aria-current={active === lesson ? 'page' : undefined} onClick={() => onChoose(lesson)} key={lesson}>
          {label}
        </button>
      ))}
    </nav>
  )
}

function PromptBox({
  id,
  value,
  copied,
  onCopy,
  compact = false,
}: {
  id: string
  value: string
  copied: string | null
  onCopy: (id: string, value: string) => void
  compact?: boolean
}) {
  const isCopied = copied === id
  return (
    <div className={`prompt-box ${compact ? 'is-compact' : ''}`}>
      <div className="prompt-box-heading">
        <span><TerminalSquare size={18} /> Prompt to try</span>
        <button className="copy-button" type="button" onClick={() => onCopy(id, value)}>
          {isCopied ? <Check size={18} /> : <Clipboard size={18} />}
          {isCopied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p>{value}</p>
    </div>
  )
}

function InfoColumn({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) {
  return (
    <section className="info-column">
      <div>{icon}<h2>{title}</h2></div>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  )
}

function ExtensionCard({ icon, title, body, example }: { icon: ReactNode; title: string; body: string; example: string }) {
  return (
    <article className="extension-card">
      <span>{icon}</span>
      <h2>{title}</h2>
      <p>{body}</p>
      <small>{example}</small>
    </article>
  )
}
