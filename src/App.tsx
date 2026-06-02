import { X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { ChapterViews, type CopyFeedback } from './components/ChapterViews'
import { GuideShell } from './components/GuideShell'
import { useOverlayFocus } from './components/useOverlayFocus'
import { SearchPalette } from './components/SearchPalette'
import { setupSteps } from './content'
import {
  getNeighborRoutes,
  parseHash,
  routeToHash,
  type GuideRoute,
} from './guide'

type ModalImage = { src: string; alt: string } | null

function App() {
  const [route, setRoute] = useState<GuideRoute>(() => parseHash(window.location.hash))
  const [completedSetup, setCompletedSetup] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('codex-guide-setup') ?? '[]') as string[]
    } catch {
      return []
    }
  })
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>(null)
  const [mobileRailOpen, setMobileRailOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [modalImage, setModalImage] = useState<ModalImage>(null)
  const searchTriggerRef = useRef<HTMLButtonElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const imageTriggerRef = useRef<HTMLButtonElement>(null)
  const progress = Math.round((completedSetup.length / setupSteps.length) * 100)
  const { previous, next } = useMemo(() => getNeighborRoutes(route), [route])

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', routeToHash(route))
    }

    function syncHash() {
      setRoute(parseHash(window.location.hash))
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [route])

  useEffect(() => {
    localStorage.setItem('codex-guide-setup', JSON.stringify(completedSetup))
  }, [completedSetup])

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  const navigate = useCallback((nextRoute: GuideRoute) => {
    const nextHash = routeToHash(nextRoute)
    if (window.location.hash === nextHash) {
      setRoute(nextRoute)
      window.scrollTo({ top: 0, behavior: 'auto' })
    } else {
      window.location.hash = nextHash
    }
    setMobileRailOpen(false)
  }, [])

  const closeRail = useCallback(() => setMobileRailOpen(false), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const closeModal = useCallback(() => setModalImage(null), [])

  function toggleSetup(id: string) {
    setCompletedSetup((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  async function copyText(id: string, value: string) {
    let didCopy = false

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
        didCopy = true
      }
    } catch {
      didCopy = false
    }

    if (!didCopy) {
      const fallback = document.createElement('textarea')
      fallback.value = value
      fallback.setAttribute('readonly', '')
      fallback.style.position = 'fixed'
      fallback.style.top = '-1000px'
      fallback.style.opacity = '0'
      document.body.appendChild(fallback)
      fallback.select()
      fallback.setSelectionRange(0, value.length)
      didCopy = document.execCommand('copy')
      fallback.remove()
    }

    setCopyFeedback({ id, state: didCopy ? 'copied' : 'failed' })
    window.setTimeout(() => {
      setCopyFeedback((current) => current?.id === id ? null : current)
    }, 2200)
  }

  function openImage(image: Exclude<ModalImage, null>, trigger: HTMLButtonElement) {
    imageTriggerRef.current = trigger
    setModalImage(image)
  }

  return (
    <>
      <GuideShell
        route={route}
        progress={progress}
        previous={previous}
        next={next}
        mobileRailOpen={mobileRailOpen}
        searchTriggerRef={searchTriggerRef}
        menuTriggerRef={menuTriggerRef}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
        onToggleRail={() => setMobileRailOpen((open) => !open)}
        onCloseRail={closeRail}
      >
        <ChapterViews
          key={routeToHash(route)}
          route={route}
          completedSetup={completedSetup}
          copyFeedback={copyFeedback}
          onNavigate={navigate}
          onToggleSetup={toggleSetup}
          onCopy={copyText}
          onZoom={openImage}
        />
      </GuideShell>
      <SearchPalette
        open={searchOpen}
        onClose={closeSearch}
        onNavigate={navigate}
        returnFocusRef={searchTriggerRef}
      />
      <ImageModal image={modalImage} onClose={closeModal} returnFocusRef={imageTriggerRef} />
    </>
  )
}

function ImageModal({
  image,
  onClose,
  returnFocusRef,
}: {
  image: ModalImage
  onClose: () => void
  returnFocusRef: React.RefObject<HTMLButtonElement | null>
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useOverlayFocus<HTMLDivElement>({
    open: Boolean(image),
    onClose,
    initialFocusRef: closeButtonRef,
    returnFocusRef,
  })

  if (!image) return null

  return (
    <div className="overlay-root image-overlay" role="presentation" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className="image-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Enlarged guide image"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeButtonRef} className="modal-close icon-button" type="button" aria-label="Close enlarged image" onClick={onClose}>
          <X size={22} />
        </button>
        <img src={image.src} alt={image.alt} />
      </div>
    </div>
  )
}

export default App
