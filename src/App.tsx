import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  ExternalLink,
  GitBranch,
  Maximize2,
  Menu,
  MousePointerClick,
  PanelLeft,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react'
import {
  chapters,
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
  type ChapterId,
  type EffortId,
  type PromptCategory,
} from './content'
import './App.css'

type ModalImage = { src: string; alt: string } | null

function App() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('start')
  const [activeSetup, setActiveSetup] = useState(setupSteps[0].id)
  const [completedSetup, setCompletedSetup] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('codex-guide-setup') ?? '[]') as string[]
    } catch {
      return []
    }
  })
  const [activeTour, setActiveTour] = useState(tourShots[0].id)
  const [activeSettings, setActiveSettings] = useState(settingsPanels[0].id)
  const [activeTool, setActiveTool] = useState(toolPanels[0].id)
  const [promptCategory, setPromptCategory] = useState<PromptCategory>('all')
  const [promptSearch, setPromptSearch] = useState('')
  const [expandedPrompt, setExpandedPrompt] = useState(promptLibrary[0].id)
  const [activeEffort, setActiveEffort] = useState<EffortId>('medium')
  const [activeTrack, setActiveTrack] = useState(learningTracks[0].label)
  const [copied, setCopied] = useState<string | null>(null)
  const [mobileRailOpen, setMobileRailOpen] = useState(false)
  const [modalImage, setModalImage] = useState<ModalImage>(null)

  const setup = setupSteps.find((step) => step.id === activeSetup) ?? setupSteps[0]
  const tour = tourShots.find((shot) => shot.id === activeTour) ?? tourShots[0]
  const settings = settingsPanels.find((panel) => panel.id === activeSettings) ?? settingsPanels[0]
  const tool = toolPanels.find((panel) => panel.id === activeTool) ?? toolPanels[0]
  const track = learningTracks.find((item) => item.label === activeTrack) ?? learningTracks[0]
  const progress = Math.round((completedSetup.length / setupSteps.length) * 100)

  const visiblePrompts = useMemo(() => {
    const query = promptSearch.trim().toLowerCase()
    return promptLibrary.filter((prompt) => {
      const matchesCategory = promptCategory === 'all' || prompt.category === promptCategory
      const matchesSearch =
        !query ||
        `${prompt.title} ${prompt.summary} ${prompt.category} ${prompt.level}`.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [promptCategory, promptSearch])

  useEffect(() => {
    localStorage.setItem('codex-guide-setup', JSON.stringify(completedSetup))
  }, [completedSetup])

  useEffect(() => {
    const sections = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))
    const observer = new IntersectionObserver(
      (entries) => {
        const nearest = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (nearest) setActiveChapter(nearest.target.id as ChapterId)
      },
      { rootMargin: '-16% 0px -66% 0px', threshold: [0, 0.2, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.08 },
    )
    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function closeModal(event: KeyboardEvent) {
      if (event.key === 'Escape') setModalImage(null)
    }
    window.addEventListener('keydown', closeModal)
    return () => window.removeEventListener('keydown', closeModal)
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

  function toggleSetup(id: string) {
    setCompletedSetup((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function scrollToChapter(id: ChapterId) {
    setActiveChapter(id)
    setMobileRailOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function jumpToPrompts() {
    setPromptCategory('all')
    scrollToChapter('prompts')
  }

  return (
    <div className="guide-shell">
      <header className="topbar">
        <button className="mobile-menu" type="button" onClick={() => setMobileRailOpen((open) => !open)}>
          <Menu aria-hidden="true" />
          <span className="sr-only">Open chapter navigation</span>
        </button>
        <button className="top-brand" type="button" onClick={() => scrollToChapter('start')}>
          <BookOpen aria-hidden="true" />
          <span>
            <strong>Codex Field Guide</strong>
            <small>Learn by doing. Ship with confidence.</small>
          </span>
        </button>
        <button className="top-search" type="button" onClick={jumpToPrompts}>
          <Search aria-hidden="true" />
          <span>Search prompts and ideas</span>
          <kbd>⌘ K</kbd>
        </button>
        <div className="top-progress" aria-label={`${progress}% setup progress`}>
          <span>Your setup</span>
          <div>
            <i style={{ width: `${progress}%` }} />
          </div>
          <strong>{progress}%</strong>
        </div>
        <button className="primary-button compact" type="button" onClick={() => scrollToChapter('start')}>
          Start setup <ArrowRight aria-hidden="true" />
        </button>
      </header>

      <aside className={`chapter-rail ${mobileRailOpen ? 'is-open' : ''}`} aria-label="Learning chapters">
        <div className="rail-heading">
          <span>Chapters</span>
          <button type="button" onClick={() => setMobileRailOpen(false)}>
            <X aria-hidden="true" />
            <span className="sr-only">Close chapter navigation</span>
          </button>
        </div>
        <nav>
          {chapters.map((chapter, index) => (
            <button
              className={activeChapter === chapter.id ? 'is-active' : ''}
              type="button"
              key={chapter.id}
              onClick={() => scrollToChapter(chapter.id)}
            >
              <span className="chapter-index">{index + 1}</span>
              <span>
                <strong>{chapter.label}</strong>
                <small>{chapter.eyebrow}</small>
              </span>
              {index === 0 && completedSetup.length === setupSteps.length ? (
                <CheckCircle2 className="chapter-check" aria-hidden="true" />
              ) : null}
            </button>
          ))}
        </nav>
        <div className="rail-help">
          <Sparkles aria-hidden="true" />
          <strong>One calm hour</strong>
          <p>Begin with setup. Open the deeper chapters only when they become useful.</p>
        </div>
      </aside>

      <main className="guide-main">
        <section className="chapter-section start-section" id="start">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">Beginner path · about one hour</p>
            <h1>Start with one calm hour.</h1>
            <p className="hero-lede">
              Set up the Codex app, create your first project, and send one safe prompt. The rest of the guide will
              wait until you need it.
            </p>
            <div className="hero-meta">
              <span><CheckCircle2 aria-hidden="true" /> No coding-agent experience needed</span>
              <span><ShieldCheck aria-hidden="true" /> Source-backed guidance</span>
            </div>
          </div>

          <div className="setup-workbench" data-reveal>
            <div className="setup-stepper">
              <div className="workbench-heading">
                <span>Setup path</span>
                <strong>{completedSetup.length} of {setupSteps.length} complete</strong>
              </div>
              {setupSteps.map((step, index) => {
                const isDone = completedSetup.includes(step.id)
                return (
                  <button
                    className={`setup-step ${activeSetup === step.id ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
                    type="button"
                    key={step.id}
                    onClick={() => setActiveSetup(step.id)}
                  >
                    <span className="step-number">{isDone ? <Check aria-hidden="true" /> : index + 1}</span>
                    <span>
                      <strong>{step.title}</strong>
                      <small>{step.short}</small>
                    </span>
                  </button>
                )
              })}
            </div>
            <article className="setup-lesson">
              <div className="lesson-copy">
                <p className="eyebrow">Step {setupSteps.findIndex((step) => step.id === setup.id) + 1}</p>
                <h2>{setup.title}</h2>
                <p>{setup.body}</p>
                <aside><Sparkles aria-hidden="true" /> {setup.note}</aside>
                {setup.prompt ? (
                  <div className="inline-prompt">
                    <code>{setup.prompt}</code>
                    <button type="button" onClick={() => copyText('first-prompt', setup.prompt ?? '')}>
                      <Clipboard aria-hidden="true" />
                      {copied === 'first-prompt' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ) : null}
                <div className="lesson-actions">
                  <button className="primary-button" type="button" onClick={() => toggleSetup(setup.id)}>
                    {completedSetup.includes(setup.id) ? <Check aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
                    {completedSetup.includes(setup.id) ? 'Marked complete' : 'Mark this complete'}
                  </button>
                  <a className="text-link" href={setup.docs} target="_blank" rel="noreferrer">
                    {setup.action} <ExternalLink aria-hidden="true" />
                  </a>
                </div>
              </div>
              <ScreenshotFigure
                src={setup.image}
                alt={setup.imageAlt}
                caption={setup.source}
                docs={setup.docs}
                onZoom={() => setModalImage({ src: setup.image, alt: setup.imageAlt })}
              />
            </article>
          </div>

          <div className="lesson-strip" data-reveal>
            {[
              ['Interface tour', 'Know where everything lives', 'interface', PanelLeft],
              ['Settings studio', 'Tune modes and permissions', 'settings', Settings2],
              ['Tool chooser', 'Use the smallest capable surface', 'tools', WandSparkles],
              ['Prompt library', 'Try an idea that feels fun', 'prompts', BookOpen],
            ].map(([label, body, id, Icon]) => (
              <button type="button" key={id as string} onClick={() => scrollToChapter(id as ChapterId)}>
                <Icon aria-hidden="true" />
                <span><strong>{label as string}</strong><small>{body as string}</small></span>
                <ArrowRight aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        <section className="chapter-section" id="interface">
          <SectionHeading
            eyebrow="Chapter 2 · Interface tour"
            title="Projects, threads, and modes without the mystery."
            body="You only need a few ideas to feel at home. Explore one screenshot at a time, then move on when the workspace makes sense."
          />
          <div className="media-lesson" data-reveal>
            <div className="vertical-tabs" role="tablist" aria-label="Codex interface topics">
              {tourShots.map((shot) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTour === shot.id}
                  className={activeTour === shot.id ? 'is-selected' : ''}
                  key={shot.id}
                  onClick={() => setActiveTour(shot.id)}
                >
                  <span>{shot.label}</span>
                  <ChevronRight aria-hidden="true" />
                </button>
              ))}
            </div>
            <article className="lesson-detail">
              <p className="eyebrow">{tour.label}</p>
              <h3>{tour.title}</h3>
              <p>{tour.body}</p>
              <a className="text-link" href={tour.docs} target="_blank" rel="noreferrer">
                Open official docs <ExternalLink aria-hidden="true" />
              </a>
            </article>
            <ScreenshotFigure
              src={tour.image}
              alt={tour.imageAlt}
              caption="Official Codex screenshot"
              docs={tour.docs}
              onZoom={() => setModalImage({ src: tour.image, alt: tour.imageAlt })}
            />
          </div>
        </section>

        <section className="chapter-section soft-section" id="settings">
          <SectionHeading
            eyebrow="Chapter 3 · Settings studio"
            title="Configure the app in small, useful passes."
            body="Open Settings with Command-comma. Beginners can leave most defaults alone; the important part is knowing where permissions and integrations live."
          />
          <div className="horizontal-tabs" role="tablist" aria-label="Settings topics">
            {settingsPanels.map((panel) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeSettings === panel.id}
                className={activeSettings === panel.id ? 'is-selected' : ''}
                key={panel.id}
                onClick={() => setActiveSettings(panel.id)}
              >
                {panel.label}
              </button>
            ))}
          </div>
          <div className="settings-grid" data-reveal>
            <article className="lesson-detail settings-copy">
              <p className="eyebrow">{settings.label}</p>
              <h3>{settings.title}</h3>
              <p>{settings.body}</p>
              <ul className="check-list">
                {settings.bullets.map((bullet) => <li key={bullet}><Check aria-hidden="true" /> {bullet}</li>)}
              </ul>
              <a className="text-link" href={settings.docs} target="_blank" rel="noreferrer">
                Open official docs <ExternalLink aria-hidden="true" />
              </a>
            </article>
            <ScreenshotFigure
              src={settings.image}
              alt={settings.imageAlt}
              caption="Official Codex screenshot"
              docs={settings.docs}
              onZoom={() => setModalImage({ src: settings.image, alt: settings.imageAlt })}
            />
          </div>
        </section>

        <section className="chapter-section" id="tools">
          <SectionHeading
            eyebrow="Chapter 4 · Tools and skills"
            title="Pick the smallest capable surface."
            body="Codex can read files, run commands, browse local pages, operate desktop apps, and connect to external services. The useful habit is choosing the tool that proves the result with the least fuss."
          />
          <div className="tool-layout" data-reveal>
            <div className="tool-chooser">
              {toolPanels.map((panel) => (
                <button
                  className={activeTool === panel.id ? 'is-selected' : ''}
                  type="button"
                  key={panel.id}
                  onClick={() => setActiveTool(panel.id)}
                >
                  <span>{panel.label}</span>
                  <small>{panel.verdict}</small>
                  <ChevronRight aria-hidden="true" />
                </button>
              ))}
            </div>
            <article className="tool-detail">
              <p className="eyebrow">{tool.verdict}</p>
              <h3>{tool.title}</h3>
              <p>{tool.body}</p>
              <dl>
                <div><dt>Best for</dt><dd>{tool.best}</dd></div>
                <div><dt>Switch when</dt><dd>{tool.switchWhen}</dd></div>
              </dl>
              <a className="text-link" href={tool.docs} target="_blank" rel="noreferrer">
                Read official guide <ExternalLink aria-hidden="true" />
              </a>
            </article>
            <ScreenshotFigure
              src={tool.image}
              alt={tool.imageAlt}
              caption="Official Codex screenshot"
              docs={tool.docs}
              onZoom={() => setModalImage({ src: tool.image, alt: tool.imageAlt })}
            />
          </div>
          <div className="safety-band" data-reveal>
            <MousePointerClick aria-hidden="true" />
            <div>
              <h3>Computer Use safety recipe</h3>
              <p>Close sensitive windows, name one app or flow, read approvals, and stop immediately if the task wanders.</p>
            </div>
            <a href="https://developers.openai.com/codex/app/computer-use" target="_blank" rel="noreferrer">
              Review permissions <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="chapter-section prompt-section soft-section" id="prompts">
          <SectionHeading
            eyebrow="Chapter 5 · Prompt library"
            title="Start from an idea that feels worth making."
            body="These prompts are intentionally concrete. Copy one, personalize it, and let Codex show you the steps as it works."
          />
          <div className="illustration-frame" data-reveal>
            <img src="/images/generated/build-possibilities-infographic.png" alt="Illustrated examples of a website, mobile app, platform game, data dashboard, and research brief" />
            <div>
              <strong>What can Codex help you build?</strong>
              <span>Websites, apps, games, reports, dashboards, and the workflows around them.</span>
            </div>
          </div>
          <div className="prompt-controls" data-reveal>
            <div className="prompt-filter" role="tablist" aria-label="Prompt categories">
              {promptCategories.map((category) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={promptCategory === category.id}
                  className={promptCategory === category.id ? 'is-selected' : ''}
                  onClick={() => setPromptCategory(category.id)}
                  key={category.id}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <label className="prompt-search">
              <Search aria-hidden="true" />
              <input value={promptSearch} onChange={(event) => setPromptSearch(event.target.value)} placeholder="Search prompt ideas" />
            </label>
          </div>
          <div className="prompt-list">
            {visiblePrompts.map((prompt) => (
              <article className={`prompt-item ${expandedPrompt === prompt.id ? 'is-open' : ''}`} key={prompt.id}>
                <button className="prompt-item-heading" type="button" onClick={() => setExpandedPrompt(prompt.id)}>
                  <span className="prompt-kind">{prompt.category}</span>
                  <span>
                    <strong>{prompt.title}</strong>
                    <small>{prompt.summary}</small>
                  </span>
                  <em>{prompt.level}</em>
                  <ChevronRight aria-hidden="true" />
                </button>
                {expandedPrompt === prompt.id ? (
                  <div className="prompt-item-body">
                    <pre>{prompt.prompt}</pre>
                    <button type="button" onClick={() => copyText(prompt.id, prompt.prompt)}>
                      <Clipboard aria-hidden="true" /> {copied === prompt.id ? 'Copied' : 'Copy prompt'}
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
            {visiblePrompts.length === 0 ? <p className="empty-message">No prompt ideas match that search yet.</p> : null}
          </div>
        </section>

        <section className="chapter-section" id="ship">
          <SectionHeading
            eyebrow="Chapter 6 · Repos, commits, and publishing"
            title="Move from a local folder to a shareable URL."
            body="Git and GitHub are useful, but they are not a toll gate. Learn the local loop first, make clean commits, then publish when sharing or backup becomes valuable."
          />
          <div className="shipping-layout" data-reveal>
            <div className="shipping-steps">
              {shippingSteps.map((step) => (
                <article key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <button type="button" onClick={() => copyText(step.title, step.prompt)}>
                    <Clipboard aria-hidden="true" /> {copied === step.title ? 'Copied' : 'Copy helper prompt'}
                  </button>
                </article>
              ))}
            </div>
            <div className="ship-aside">
              <ScreenshotFigure
                src="/images/official/git-commit-light.webp"
                alt="Official Codex screenshot showing Git commit creation"
                caption="Official Codex screenshot"
                docs="https://developers.openai.com/codex/app/review"
                onZoom={() => setModalImage({ src: '/images/official/git-commit-light.webp', alt: 'Official Codex screenshot showing Git commit creation' })}
              />
              <div className="ship-note">
                <GitBranch aria-hidden="true" />
                <h3>The plain-English Git loop</h3>
                <ol>
                  <li>Check what changed.</li>
                  <li>Run the app or the relevant test.</li>
                  <li>Commit one coherent result.</li>
                  <li>Push when you want backup or collaboration.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="chapter-section level-section soft-section" id="level-up">
          <SectionHeading
            eyebrow="Chapter 7 · Level up"
            title="Use more intelligence when the work earns it."
            body="Model lists evolve. This practical effort guide focuses on the stable decision: how much thinking does the task deserve?"
          />
          <div className="effort-grid" data-reveal>
            <div className="effort-tabs" role="tablist" aria-label="Reasoning effort">
              {(Object.keys(efforts) as EffortId[]).map((id) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeEffort === id}
                  className={activeEffort === id ? 'is-selected' : ''}
                  key={id}
                  onClick={() => setActiveEffort(id)}
                >
                  {efforts[id].label}
                </button>
              ))}
            </div>
            <article className="effort-detail">
              <Bot aria-hidden="true" />
              <p className="eyebrow">{efforts[activeEffort].temperature}</p>
              <h3>{efforts[activeEffort].best}</h3>
              <ul>
                {efforts[activeEffort].examples.map((example) => <li key={example}>{example}</li>)}
              </ul>
              <p>{efforts[activeEffort].note}</p>
              <a className="text-link" href="https://developers.openai.com/codex/models" target="_blank" rel="noreferrer">
                See current model docs <ExternalLink aria-hidden="true" />
              </a>
            </article>
          </div>
          <div className="track-panel" data-reveal>
            <div className="track-tabs" role="tablist" aria-label="Learning tracks">
              {learningTracks.map((item) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTrack === item.label}
                  className={activeTrack === item.label ? 'is-selected' : ''}
                  onClick={() => setActiveTrack(item.label)}
                  key={item.label}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <article>
              <p className="eyebrow">{track.label} path</p>
              <h3>{track.title}</h3>
              <p>{track.body}</p>
            </article>
            <div className="advanced-links">
              {[
                ['AGENTS.md', 'Durable repo instructions', 'https://developers.openai.com/codex/guides/agents-md'],
                ['Worktrees', 'Parallel isolated attempts', 'https://developers.openai.com/codex/app/worktrees'],
                ['MCP', 'Structured external tools', 'https://developers.openai.com/codex/mcp'],
                ['Review pane', 'Line-level feedback', 'https://developers.openai.com/codex/app/review'],
              ].map(([label, body, href]) => (
                <a href={href} target="_blank" rel="noreferrer" key={label}>
                  <strong>{label}</strong><small>{body}</small><ExternalLink aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <footer className="source-footer">
          <div>
            <p className="eyebrow">Official sources</p>
            <h2>Keep learning from the live Codex docs.</h2>
            <p>Product details can change. These links open the current official OpenAI documentation in a new tab.</p>
          </div>
          <div className="source-links">
            {sourceLinks.map(([label, href]) => (
              <a href={href} target="_blank" rel="noreferrer" key={href}>{label}<ExternalLink aria-hidden="true" /></a>
            ))}
          </div>
        </footer>
      </main>

      {modalImage ? (
        <div className="image-modal" role="dialog" aria-modal="true" aria-label="Expanded guide image">
          <button type="button" onClick={() => setModalImage(null)}>
            <X aria-hidden="true" />
            <span className="sr-only">Close expanded image</span>
          </button>
          <img src={modalImage.src} alt={modalImage.alt} />
        </div>
      ) : null}
    </div>
  )
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="section-heading" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  )
}

function ScreenshotFigure({
  src,
  alt,
  caption,
  docs,
  onZoom,
}: {
  src: string
  alt: string
  caption: string
  docs: string
  onZoom: () => void
}) {
  return (
    <figure className="screenshot-figure">
      <button className="screenshot-button" type="button" onClick={onZoom} aria-label={`Expand image: ${alt}`}>
        <img src={src} alt={alt} />
        <span><Maximize2 aria-hidden="true" /> Expand</span>
      </button>
      <figcaption>
        <span>{caption}</span>
        <a href={docs} target="_blank" rel="noreferrer">Open source <ExternalLink aria-hidden="true" /></a>
      </figcaption>
    </figure>
  )
}

export default App
