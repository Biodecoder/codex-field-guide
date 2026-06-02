import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

type OverlayFocusOptions = {
  open: boolean
  onClose: () => void
  initialFocusRef?: RefObject<HTMLElement | null>
  returnFocusRef?: RefObject<HTMLElement | null>
}

export function useOverlayFocus<T extends HTMLElement>({
  open,
  onClose,
  initialFocusRef,
  returnFocusRef,
}: OverlayFocusOptions) {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    if (!open) return
    const container = containerRef.current
    if (!container) return
    const dialog = container

    const previousOverflow = document.body.style.overflow
    const returnFocusTarget = returnFocusRef?.current
    document.body.style.overflow = 'hidden'
    const focusInitial = window.requestAnimationFrame(() => {
      const firstFocusable = dialog.querySelector<HTMLElement>(FOCUSABLE)
      ;(initialFocusRef?.current ?? firstFocusable ?? dialog).focus()
    })

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!focusable.length) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      window.cancelAnimationFrame(focusInitial)
      returnFocusTarget?.focus()
    }
  }, [initialFocusRef, onClose, open, returnFocusRef])

  return containerRef
}
