import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

export type ArchiveEntry = {
  entryNumber: string
  name: string
  category: string
  flavourNotes: string[]
  story: string
}

type ArchiveEntryModalProps = {
  entry: ArchiveEntry
  onClose: () => void
}

export function ArchiveEntryModal({ entry, onClose }: ArchiveEntryModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.setProperty('--scrollbar-compensation', `${scrollbarWidth}px`)
    document.documentElement.classList.add('modal-lock')
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus())

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialog) return
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ))
      if (focusable.length === 0) return

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

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(focusFrame)
      document.documentElement.classList.remove('modal-lock')
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <motion.div
      className="entry-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.24 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        ref={dialogRef}
        className="entry-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="entry-modal-title"
        aria-describedby="entry-modal-story"
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.76, 0, 0.24, 1] }}
      >
        <button
          ref={closeButtonRef}
          className="entry-modal__close"
          type="button"
          aria-label={`Close ${entry.name} archive entry`}
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>

        <header className="entry-modal__header">
          <span>Entry No. {entry.entryNumber}</span>
          <p>{entry.category}</p>
          <h2 id="entry-modal-title">{entry.name}</h2>
        </header>

        <div className="entry-modal__rule" aria-hidden="true"><span>Trà</span></div>

        <div className="entry-modal__body">
          <div>
            <span className="entry-modal__label">Hương vị · flavour profile</span>
            <ul>
              {entry.flavourNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </div>
          <div>
            <span className="entry-modal__label">Archive note</span>
            <p id="entry-modal-story">{entry.story}</p>
          </div>
        </div>

        <footer className="entry-modal__footer">
          <span>Bếp · recipe record</span>
          <span>Close to return to the collection</span>
        </footer>
      </motion.div>
    </motion.div>
  )
}
