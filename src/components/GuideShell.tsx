import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Command,
  Menu,
  Rocket,
  Search,
  Sprout,
  Upload,
  Workflow,
  Wrench,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import {
  chapters,
  firstRouteForChapter,
  type ChapterItem,
  type GuideRoute,
} from '../guide'
import { useOverlayFocus } from './useOverlayFocus'

const chapterIcons = {
  sprout: Sprout,
  workflow: Workflow,
  wrench: Wrench,
  publish: Upload,
  rocket: Rocket,
}

type GuideShellProps = {
  route: GuideRoute
  progress: number
  mobileRailOpen: boolean
  searchTriggerRef: RefObject<HTMLButtonElement | null>
  menuTriggerRef: RefObject<HTMLButtonElement | null>
  previous?: GuideRoute
  next?: GuideRoute
  onNavigate: (route: GuideRoute) => void
  onOpenSearch: () => void
  onToggleRail: () => void
  onCloseRail: () => void
  children: ReactNode
}

export function GuideShell({
  route,
  progress,
  mobileRailOpen,
  searchTriggerRef,
  menuTriggerRef,
  previous,
  next,
  onNavigate,
  onOpenSearch,
  onToggleRail,
  onCloseRail,
  children,
}: GuideShellProps) {
  return (
    <div className="guide-shell">
      <a
        className="skip-link"
        href="#main-workspace"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('main-workspace')?.focus()
        }}
      >
        Skip to main content
      </a>
      <header className="topbar">
        <button
          ref={menuTriggerRef}
          className="mobile-menu icon-button"
          type="button"
          aria-label="Open chapter menu"
          aria-expanded={mobileRailOpen}
          aria-controls="chapter-drawer"
          onClick={onToggleRail}
        >
          <Menu size={24} />
        </button>
        <button className="brand" type="button" onClick={() => onNavigate(firstRouteForChapter('beginner'))}>
          <span className="brand-icon"><BookOpen size={27} /></span>
          <span>
            <strong>Codex Field Guide</strong>
            <small>Learn by doing. Ship with confidence.</small>
          </span>
        </button>
        <button ref={searchTriggerRef} className="header-search" type="button" aria-label="Search the guide" onClick={onOpenSearch}>
          <Search size={21} />
          <span>Search the guide</span>
          <kbd><Command size={14} /> K</kbd>
        </button>
        <div className="setup-status" aria-label={`Setup progress: ${progress}%`}>
          <span>Your setup</span>
          <span className="status-track"><i style={{ width: `${progress}%` }} /></span>
          <strong>{progress}%</strong>
        </div>
        <button className="topbar-action" type="button" onClick={() => onNavigate(firstRouteForChapter('beginner'))}>
          {progress === 100 ? 'Review setup' : 'Start setup'} <ArrowRight size={20} />
        </button>
      </header>
      <ChapterRail
        route={route}
        progress={progress}
        mobileRailOpen={mobileRailOpen}
        menuTriggerRef={menuTriggerRef}
        onNavigate={onNavigate}
        onCloseRail={onCloseRail}
      />
      <main id="main-workspace" className="workspace" tabIndex={-1}>
        <div className="workspace-inner">{children}</div>
        <LessonFooter previous={previous} next={next} onNavigate={onNavigate} />
      </main>
    </div>
  )
}

function ChapterRail({
  route,
  progress,
  mobileRailOpen,
  menuTriggerRef,
  onNavigate,
  onCloseRail,
}: {
  route: GuideRoute
  progress: number
  mobileRailOpen: boolean
  menuTriggerRef: RefObject<HTMLButtonElement | null>
  onNavigate: (route: GuideRoute) => void
  onCloseRail: () => void
}) {
  const isMobileRail = useMobileRail()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const closeRail = useCallback(() => onCloseRail(), [onCloseRail])
  const drawerRef = useOverlayFocus<HTMLElement>({
    open: mobileRailOpen,
    onClose: closeRail,
    initialFocusRef: closeButtonRef,
    returnFocusRef: menuTriggerRef,
  })

  return (
    <>
      <button
        className={`rail-backdrop ${mobileRailOpen ? 'is-open' : ''}`}
        type="button"
        aria-label="Close chapter menu"
        tabIndex={mobileRailOpen ? 0 : -1}
        onClick={onCloseRail}
      />
      <aside
        ref={drawerRef}
        id="chapter-drawer"
        className={`chapter-rail ${mobileRailOpen ? 'is-open' : ''}`}
        aria-label="Learning chapters"
        aria-hidden={isMobileRail && !mobileRailOpen ? true : undefined}
        inert={isMobileRail && !mobileRailOpen ? true : undefined}
        tabIndex={-1}
      >
        <div className="rail-mobile-header">
          <span>Chapters</span>
          <button ref={closeButtonRef} className="icon-button" type="button" aria-label="Close chapter menu" onClick={onCloseRail}>
            <X size={22} />
          </button>
        </div>
        <div className="rail-heading">
          <p className="eyebrow">Learning map</p>
          <strong>5 chapters</strong>
        </div>
        <nav className="rail-nav">
          {chapters.map((chapter) => (
            <RailChapter
              chapter={chapter}
              active={route.chapter === chapter.id}
              onClick={() => {
                onNavigate(firstRouteForChapter(chapter.id))
                onCloseRail()
              }}
              key={chapter.id}
            />
          ))}
        </nav>
        <section className="rail-note">
          <CheckCircle2 size={23} />
          <h2>{progress === 100 ? 'Setup complete' : 'One calm hour'}</h2>
          <p>
            {progress === 100
              ? 'Your setup path is checked off. Revisit any step when you need a refresher.'
              : 'Begin with setup. Open the deeper chapters only when they become useful.'}
          </p>
        </section>
      </aside>
    </>
  )
}

function useMobileRail() {
  const [matches, setMatches] = useState(() => window.matchMedia('(max-width: 980px)').matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 980px)')
    const update = () => setMatches(mediaQuery.matches)
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return matches
}

function RailChapter({ chapter, active, onClick }: { chapter: ChapterItem; active: boolean; onClick: () => void }) {
  const Icon = chapterIcons[chapter.icon]
  return (
    <button
      className={`rail-item ${active ? 'is-active' : ''}`}
      type="button"
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      <span className="rail-icon"><Icon size={22} /></span>
      <span>
        <strong>{chapter.title}</strong>
        <small>{chapter.subtitle}</small>
      </span>
    </button>
  )
}

function LessonFooter({
  previous,
  next,
  onNavigate,
}: {
  previous?: GuideRoute
  next?: GuideRoute
  onNavigate: (route: GuideRoute) => void
}) {
  return (
    <footer className="lesson-footer">
      {previous ? (
        <button className="lesson-nav-button previous" type="button" onClick={() => onNavigate(previous)}>
          <ArrowLeft size={21} />
          <span><small>Previous lesson</small><strong>{readableRoute(previous)}</strong></span>
        </button>
      ) : <span />}
      {next ? (
        <button className="lesson-nav-button next" type="button" onClick={() => onNavigate(next)}>
          <span><small>Next lesson</small><strong>{readableRoute(next)}</strong></span>
          <ArrowRight size={21} />
        </button>
      ) : <span />}
    </footer>
  )
}

function readableRoute(route: GuideRoute) {
  const chapter = chapters.find((item) => item.id === route.chapter)
  if (route.detail && route.chapter === 'beginner') {
    return `${chapter?.title}: ${route.detail.replace('-', ' ')}`
  }
  return `${chapter?.title}: ${route.lesson.replace('-', ' ')}`
}
