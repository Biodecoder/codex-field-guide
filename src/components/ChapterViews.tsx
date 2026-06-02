import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  ClipboardCheck,
  ExternalLink,
  Eye,
  GitBranch,
  Hand,
  KeyRound,
  MessageSquare,
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
import { TeachingCanvas } from './TeachingCanvas'

export type CopyFeedback = { id: string; state: 'copied' | 'failed' } | null

type ChapterViewsProps = {
  route: GuideRoute
  completedSetup: string[]
  copyFeedback: CopyFeedback
  onNavigate: (route: GuideRoute) => void
  onToggleSetup: (id: string) => void
  onCopy: (id: string, value: string) => void
  onZoom: (image: { src: string; alt: string }, trigger: HTMLButtonElement) => void
}

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
  copyFeedback,
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
        title="Make your first useful run."
        lede="Set up one safe local project, give Codex a clear task, and inspect the result. Each step below opens exactly where you click."
      />
      <div className="lesson-stage beginner-stage">
        <section className="learning-copy">
          <div className="section-heading">
            <p className="section-label">Your first five steps</p>
            <span>{activeIndex + 1} of {setupSteps.length}</span>
          </div>
          <div className="disclosure-list setup-disclosures">
            {setupSteps.map((item, index) => {
              const isActive = item.id === step.id
              const isDone = completedSetup.includes(item.id)
              return (
                <section className={`disclosure-item ${isActive ? 'is-active' : ''}`} key={item.id}>
                  <button
                    className="disclosure-trigger"
                    type="button"
                    aria-expanded={isActive}
                    onClick={() => onNavigate({ chapter: 'beginner', lesson: 'setup', detail: item.id })}
                  >
                    <span className="disclosure-number">{isDone ? <Check size={18} /> : index + 1}</span>
                    <span className="disclosure-title">
                      <strong>{item.title}</strong>
                      <small>{item.short}</small>
                    </span>
                    <ChevronDown className="disclosure-chevron" size={19} aria-hidden="true" />
                  </button>
                  {isActive && (
                    <div className="disclosure-panel">
                      <p className="reading-copy">{step.body}</p>
                      <aside className="lesson-note"><Sparkles size={20} /><span>{step.note}</span></aside>
                      {step.prompt && (
                        <PromptBox id={`setup-${step.id}`} value={step.prompt} copyFeedback={copyFeedback} onCopy={onCopy} />
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
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </section>
        <aside className="context-visual" key={step.id}>
          <SetupVisual stepId={step.id} onZoom={onZoom} />
        </aside>
      </div>
    </article>
  )
}

function SetupVisual({ stepId, onZoom }: { stepId: string; onZoom: ChapterViewsProps['onZoom'] }) {
  if (stepId === 'signin') {
    return (
      <ConceptCanvas
        icon={<KeyRound size={28} />}
        eyebrow="Secure sign-in"
        title="Begin with your ChatGPT account."
        caption="An API key is available too, but a ChatGPT account is the simplest first path."
        source="https://developers.openai.com/codex/app/"
      >
        <div className="choice-stack">
          <div className="concept-choice is-recommended"><CheckCircle2 size={19} /><span><strong>ChatGPT account</strong><small>Recommended for a complete beginner</small></span></div>
          <div className="concept-choice"><KeyRound size={19} /><span><strong>OpenAI API key</strong><small>Useful when your workflow calls for it</small></span></div>
        </div>
      </ConceptCanvas>
    )
  }

  if (stepId === 'prompt') {
    return (
      <ConceptCanvas
        icon={<MessageSquare size={28} />}
        eyebrow="First prompt"
        title="Ask for a small visible result."
        caption="A beginner-friendly prompt names the folder, the finish line, and the proof you want to inspect."
        source="https://developers.openai.com/codex/learn/best-practices"
      >
        <div className="composer-demo">
          <p>Read this folder first. Explain it simply, then suggest one safe improvement.</p>
          <span><Sparkles size={16} /> Ask for evidence</span>
        </div>
      </ConceptCanvas>
    )
  }

  const visual = stepId === 'project'
    ? {
        image: '/images/official/multitask-light.webp',
        alt: 'Official Codex app screenshot showing projects and threads',
        caption: 'Choose one project folder, then keep each focused task in its own thread.',
        source: 'https://developers.openai.com/codex/app/features',
      }
    : stepId === 'local'
      ? {
          image: '/images/official/modes-light.webp',
          alt: 'Official Codex app screenshot showing Local, Worktree, and Cloud task modes',
          caption: 'Start in Local mode. Worktrees and cloud tasks become useful after the basic loop feels familiar.',
          source: 'https://developers.openai.com/codex/app/features',
        }
      : {
          image: '/images/generated/setup-path-infographic.png',
          alt: 'Illustrated path from installing Codex to sending a first prompt',
          caption: 'Install the desktop app, then return to the guide for a short first run.',
          source: 'https://developers.openai.com/codex/app/',
        }

  return (
    <TeachingCanvas
      image={visual.image}
      alt={visual.alt}
      caption={visual.caption}
      source={visual.source}
      onZoom={(trigger) => onZoom({ src: visual.image, alt: visual.alt }, trigger)}
    />
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
    <div className="lesson-stage">
      <section className="learning-copy">
        <p className="section-label">Three ideas to keep</p>
        <DisclosureSelector
          activeId={tour.id}
          items={tourShots.map((shot) => ({ id: shot.id, label: shot.label, title: shot.title, body: shot.body, source: shot.docs }))}
          onChoose={setActiveTour}
        />
      </section>
      <aside className="context-visual" key={tour.id}>
        <TeachingCanvas
          image={tour.image}
          alt={tour.imageAlt}
          caption="A project is the folder. A thread is one conversation inside it. The mode decides where the task runs."
          source={tour.docs}
          onZoom={(trigger) => onZoom({ src: tour.image, alt: tour.imageAlt }, trigger)}
        />
      </aside>
    </div>
  )
}

function SettingsLesson({ onZoom }: Pick<ChapterViewsProps, 'onZoom'>) {
  const [activeId, setActiveId] = useState(settingsPanels[0].id)
  const setting = settingsPanels.find((panel) => panel.id === activeId) ?? settingsPanels[0]

  return (
    <div className="lesson-stage">
      <section className="learning-copy">
        <p className="section-label">Settings studio</p>
        <DisclosureSelector
          activeId={setting.id}
          items={settingsPanels.map((panel) => ({ id: panel.id, label: panel.label, title: panel.title, body: panel.body, bullets: panel.bullets, source: panel.docs, icon: <Settings2 size={18} /> }))}
          onChoose={setActiveId}
        />
      </section>
      <aside className="context-visual" key={setting.id}>
        <TeachingCanvas
          image={setting.image}
          alt={setting.imageAlt}
          caption="Keep settings simple at first. Readability and careful permissions matter more than extensive customization."
          source={setting.docs}
          onZoom={(trigger) => onZoom({ src: setting.image, alt: setting.imageAlt }, trigger)}
        />
      </aside>
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
    <div className="lesson-stage">
      <section className="learning-copy">
        <p className="section-label">Choose by job</p>
        <DisclosureSelector
          activeId={tool.id}
          items={toolPanels.map((panel) => ({
            id: panel.id,
            label: panel.label,
            title: panel.title,
            body: panel.body,
            aside: <><p className="accent-label">{panel.verdict}</p><p><strong>Best for:</strong> {panel.best}</p></>,
            source: panel.docs,
            icon: <Wrench size={18} />,
          }))}
          onChoose={setActiveId}
        />
      </section>
      <aside className="context-visual" key={tool.id}>
        <TeachingCanvas
          image={tool.image}
          alt={tool.imageAlt}
          caption="Match the surface to the job, then keep the request small enough to inspect."
          source={tool.docs}
          onZoom={(trigger) => onZoom({ src: tool.image, alt: tool.imageAlt }, trigger)}
        />
      </aside>
    </div>
  )
}

function ComputerUseLesson() {
  const [activeId, setActiveId] = useState(permissionFlow[0].id)

  return (
    <div className="single-lesson">
      <section className="lesson-lede-block">
        <ShieldCheck size={28} />
        <div>
          <h2>Computer Use is for visible desktop work.</h2>
          <p>Keep the task bounded, stay nearby for approvals, and inspect the visible result before continuing.</p>
        </div>
      </section>
      <section className="permission-studio">
        <p className="section-label">The five-step approval loop</p>
        <DisclosureSelector
          activeId={activeId}
          items={permissionFlow.map((step) => {
            const Icon = step.icon
            return {
              id: step.id,
              label: step.label,
              title: step.title,
              body: step.body,
              aside: <aside className="lesson-note"><ShieldCheck size={20} /><span>{step.note}</span></aside>,
              icon: <Icon size={20} />,
            }
          })}
          onChoose={setActiveId}
        />
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

function PromptLibraryLesson({ route, copyFeedback, onCopy }: ChapterViewsProps) {
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
              {expanded && <PromptBox id={`library-${prompt.id}`} value={prompt.prompt} copyFeedback={copyFeedback} onCopy={onCopy} />}
            </article>
          )
        })}
      </div>
    </div>
  )
}

function PublishChapter({ copyFeedback, onCopy, onZoom }: ChapterViewsProps) {
  const [activeStep, setActiveStep] = useState(shippingSteps[0].title)

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
        <p className="section-label">Your publishing path</p>
        <DisclosureSelector
          activeId={activeStep}
          items={shippingSteps.map((step) => ({
            id: step.title,
            label: step.title.replace(/^\d+\.\s*/, ''),
            title: step.title.replace(/^\d+\.\s*/, ''),
            body: step.body,
            aside: <PromptBox id={`ship-${step.title}`} value={step.prompt} copyFeedback={copyFeedback} onCopy={onCopy} compact />,
          }))}
          onChoose={setActiveStep}
        />
      </section>
    </article>
  )
}

function AdvancedChapter({ route, onNavigate, copyFeedback, onCopy }: ChapterViewsProps) {
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
      {route.lesson === 'workflows' && <AdvancedWorkflows copyFeedback={copyFeedback} onCopy={onCopy} />}
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

function AdvancedWorkflows({ copyFeedback, onCopy }: Pick<ChapterViewsProps, 'copyFeedback' | 'onCopy'>) {
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
          copyFeedback={copyFeedback}
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

function DisclosureSelector({
  activeId,
  items,
  onChoose,
}: {
  activeId: string
  items: Array<{
    id: string
    label: string
    title: string
    body: string
    bullets?: string[]
    aside?: ReactNode
    source?: string
    icon?: ReactNode
  }>
  onChoose: (id: string) => void
}) {
  return (
    <div className="disclosure-list">
      {items.map((item, index) => {
        const expanded = item.id === activeId
        return (
          <section className={`disclosure-item ${expanded ? 'is-active' : ''}`} key={item.id}>
            <button className="disclosure-trigger" type="button" aria-expanded={expanded} onClick={() => onChoose(item.id)}>
              <span className="disclosure-number">{item.icon ?? index + 1}</span>
              <span className="disclosure-title"><strong>{item.label}</strong></span>
              <ChevronDown className="disclosure-chevron" size={19} aria-hidden="true" />
            </button>
            {expanded && (
              <div className="disclosure-panel">
                <h2>{item.title}</h2>
                <p className="reading-copy">{item.body}</p>
                {item.bullets && <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                {item.aside}
                {item.source && (
                  <a className="text-link disclosure-source" href={item.source} target="_blank" rel="noreferrer">
                    Read official guide <ExternalLink size={16} />
                  </a>
                )}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

function ConceptCanvas({
  icon,
  eyebrow,
  title,
  caption,
  source,
  children,
}: {
  icon: ReactNode
  eyebrow: string
  title: string
  caption: string
  source: string
  children: ReactNode
}) {
  return (
    <figure className="teaching-canvas concept-canvas">
      <div className="concept-stage">
        <span className="concept-icon">{icon}</span>
        <p className="accent-label">{eyebrow}</p>
        <h2>{title}</h2>
        {children}
      </div>
      <figcaption>
        <span>{caption}</span>
        <a href={source} target="_blank" rel="noreferrer">
          Open source <ExternalLink size={16} />
        </a>
      </figcaption>
    </figure>
  )
}

function PromptBox({
  id,
  value,
  copyFeedback,
  onCopy,
  compact = false,
}: {
  id: string
  value: string
  copyFeedback: CopyFeedback
  onCopy: (id: string, value: string) => void
  compact?: boolean
}) {
  const feedback = copyFeedback?.id === id ? copyFeedback.state : null
  return (
    <div className={`prompt-box ${compact ? 'is-compact' : ''}`}>
      <div className="prompt-box-heading">
        <span><TerminalSquare size={18} /> Prompt to try</span>
        <button className={`copy-button ${feedback === 'failed' ? 'is-failed' : ''}`} type="button" onClick={() => onCopy(id, value)} aria-live="polite">
          {feedback === 'copied' ? <Check size={18} /> : <Clipboard size={18} />}
          {feedback === 'copied' ? 'Copied' : feedback === 'failed' ? 'Try again' : 'Copy'}
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
