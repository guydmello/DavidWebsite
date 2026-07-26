import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

type JournalNotesModalProps = {
  onClose: () => void
}

const journalNotes = [
  {
    number: '01',
    category: 'Ingredient study',
    title: 'Tea, sweetness and the finish',
    note: 'Tea-inspired bakes begin with balance. Matcha brings bitterness and colour; the pastry around it gives that intensity somewhere soft to land. The goal is a finish that still remembers the leaf.',
    annotation: 'Hương vị / flavour: let bitterness remain present.',
  },
  {
    number: '02',
    category: 'Recipe reflection',
    title: 'Translating Vietnamese coffee',
    note: 'The Vietnamese coffee cookie carries the contrast of dark roast and condensed-milk sweetness into a familiar soft cookie. It is less about recreating a drink than preserving the slow, shared feeling around it.',
    annotation: 'Memory cue: coffee at the table, conversation unhurried.',
  },
  {
    number: '03',
    category: 'Food journey',
    title: 'Fruit stalls to the pastry case',
    note: 'Mango enters the archive through texture as much as flavour: ripe fruit against a crisp tart shell, served cool. The entry holds onto the brightness of market fruit while giving it a modern pastry frame.',
    annotation: 'Archive question: what part of the original memory must remain?',
  },
]

export function JournalNotesModal({ onClose }: JournalNotesModalProps) {
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
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
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
      className="entry-modal-backdrop journal-modal-backdrop"
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
        className="journal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="journal-modal-title"
        aria-describedby="journal-modal-intro"
        initial={{ opacity: 0, y: 18, rotate: -0.35 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, y: 10, rotate: 0.2 }}
        transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.76, 0, 0.24, 1] }}
      >
        <button ref={closeButtonRef} className="journal-modal__close" type="button" aria-label="Close journal notes" onClick={onClose}>
          <X aria-hidden="true" />
        </button>

        <header className="journal-modal__header">
          <span>The Recipe Àrchive · Journal folio 001</span>
          <h2 id="journal-modal-title">Notes from the<br /><em>working archive.</em></h2>
          <p id="journal-modal-intro">Ingredient studies, recipe reflections and small decisions behind the collection.</p>
        </header>

        <div className="journal-modal__notes">
          {journalNotes.map((entry) => (
            <article key={entry.number}>
              <span className="journal-modal__number">{entry.number}</span>
              <div>
                <span className="journal-modal__category">{entry.category}</span>
                <h3>{entry.title}</h3>
                <p>{entry.note}</p>
                <small>{entry.annotation}</small>
              </div>
            </article>
          ))}
        </div>

        <footer><span>Collected in the bếp</span><span>Trà · recipes remembered in layers</span></footer>
      </motion.div>
    </motion.div>
  )
}
