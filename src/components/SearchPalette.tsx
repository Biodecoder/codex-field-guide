import { ArrowRight, BookOpen, Command, Search, TerminalSquare, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { searchEntries, type GuideRoute, type SearchEntry } from '../guide'
import { useOverlayFocus } from './useOverlayFocus'

type SearchPaletteProps = {
  open: boolean
  onClose: () => void
  onNavigate: (route: GuideRoute) => void
  returnFocusRef: React.RefObject<HTMLButtonElement | null>
}

function resultMatches(entry: SearchEntry, query: string) {
  const haystack = `${entry.title} ${entry.summary} ${entry.meta}`.toLowerCase()
  return haystack.includes(query.trim().toLowerCase())
}

export function SearchPalette({ open, onClose, onNavigate, returnFocusRef }: SearchPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useOverlayFocus<HTMLDivElement>({
    open,
    onClose,
    initialFocusRef: inputRef,
    returnFocusRef,
  })

  const visibleResults = useMemo(() => {
    const matchingEntries = query.trim()
      ? searchEntries.filter((entry) => resultMatches(entry, query))
      : searchEntries.filter((entry) => entry.kind === 'lesson')

    return matchingEntries.slice(0, 5)
  }, [query])

  const lessonResults = visibleResults.filter((entry) => entry.kind === 'lesson')
  const promptResults = visibleResults.filter((entry) => entry.kind === 'prompt')

  function choose(entry: SearchEntry) {
    onNavigate(entry.route)
    onClose()
    setQuery('')
    setActiveIndex(0)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!visibleResults.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % visibleResults.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + visibleResults.length) % visibleResults.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      choose(visibleResults[activeIndex] ?? visibleResults[0])
    }
  }

  if (!open) return null

  return (
    <div className="overlay-root palette-overlay" role="presentation" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className="search-palette"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-search-title"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="palette-header">
          <div>
            <p className="eyebrow">Guide search</p>
            <h2 id="guide-search-title">Find the next useful thing.</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close search" onClick={onClose}>
            <X size={22} />
          </button>
        </header>
        <label className="palette-input">
          <Search size={22} aria-hidden="true" />
          <span className="sr-only">Search lessons and prompt examples</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder="Search lessons and prompt examples"
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleKeyDown}
          />
          <span className="shortcut">
            <Command size={15} /> K
          </span>
        </label>
        <div className="palette-results">
          {!visibleResults.length && (
            <div className="empty-state">
              <Search size={22} />
              <p>No matching lesson yet. Try a simpler word such as “publish” or “prompt”.</p>
            </div>
          )}
          {!!lessonResults.length && (
            <SearchGroup
              title="Lessons"
              entries={lessonResults}
              allEntries={visibleResults}
              activeIndex={activeIndex}
              onActivate={setActiveIndex}
              onChoose={choose}
            />
          )}
          {!!promptResults.length && (
            <SearchGroup
              title="Prompt examples"
              entries={promptResults}
              allEntries={visibleResults}
              activeIndex={activeIndex}
              onActivate={setActiveIndex}
              onChoose={choose}
            />
          )}
        </div>
        <footer className="palette-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>Enter</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </footer>
      </section>
    </div>
  )
}

function SearchGroup({
  title,
  entries,
  allEntries,
  activeIndex,
  onActivate,
  onChoose,
}: {
  title: string
  entries: SearchEntry[]
  allEntries: SearchEntry[]
  activeIndex: number
  onActivate: (index: number) => void
  onChoose: (entry: SearchEntry) => void
}) {
  return (
    <div className="search-group">
      <p className="search-group-title">{title}</p>
      {entries.map((entry) => {
        const index = allEntries.findIndex((item) => item.id === entry.id)
        const Icon = entry.kind === 'lesson' ? BookOpen : TerminalSquare
        return (
          <button
            className={`search-result ${index === activeIndex ? 'is-active' : ''}`}
            type="button"
            key={entry.id}
            onMouseEnter={() => onActivate(index)}
            onClick={() => onChoose(entry)}
          >
            <span className="result-icon"><Icon size={20} /></span>
            <span className="result-copy">
              <strong>{entry.title}</strong>
              <span>{entry.summary}</span>
              <small>{entry.meta}</small>
            </span>
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
