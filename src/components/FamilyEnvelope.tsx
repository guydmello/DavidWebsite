import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { BrandMark } from './BrandMark'

type EnvelopeState = 'closed' | 'opening' | 'open' | 'closing'

export function FamilyEnvelope() {
  const reduceMotion = useReducedMotion()
  const [state, setState] = useState<EnvelopeState>('closed')
  const [flapIsOpen, setFlapIsOpen] = useState(false)
  const [flapIsBehind, setFlapIsBehind] = useState(false)
  const [portraitIsRaised, setPortraitIsRaised] = useState(false)
  const timers = useRef<number[]>([])

  const clearTimeline = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }

  const schedule = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay))
  }

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }, [])

  const openEnvelope = () => {
    clearTimeline()
    if (reduceMotion) {
      setFlapIsOpen(true)
      setFlapIsBehind(true)
      setPortraitIsRaised(true)
      setState('open')
      return
    }

    setState('opening')
    setFlapIsOpen(true)
    schedule(() => setFlapIsBehind(true), 420)
    schedule(() => setPortraitIsRaised(true), 450)
    schedule(() => setState('open'), 1120)
  }

  const closeEnvelope = () => {
    clearTimeline()
    if (reduceMotion) {
      setPortraitIsRaised(false)
      setFlapIsBehind(false)
      setFlapIsOpen(false)
      setState('closed')
      return
    }

    setState('closing')
    setPortraitIsRaised(false)
    schedule(() => setFlapIsBehind(false), 680)
    schedule(() => setFlapIsOpen(false), 710)
    schedule(() => setState('closed'), 1150)
  }

  const isAnimating = state === 'opening' || state === 'closing'
  const isExpanded = state === 'opening' || state === 'open'
  const classNames = [
    'family-envelope',
    `family-envelope--${state}`,
    flapIsOpen && 'family-envelope--flap-open',
    flapIsBehind && 'family-envelope--flap-behind',
    portraitIsRaised && 'family-envelope--portrait-raised',
  ].filter(Boolean).join(' ')

  return (
    <figure className={classNames} data-state={state}>
      <button
        className="family-envelope__button"
        type="button"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Close the family photograph envelope' : 'Open the family photograph envelope'}
        disabled={isAnimating}
        onClick={state === 'open' ? closeEnvelope : openEnvelope}
      >
        <span className="family-envelope__stage">
          <span className="family-envelope__back" aria-hidden="true" />
          <span className="family-envelope__portrait-clip">
            <span className="family-envelope__portrait">
              <img
                src={`${import.meta.env.BASE_URL}family-bakers-1200.webp`}
                srcSet={`${import.meta.env.BASE_URL}family-bakers-640.webp 640w, ${import.meta.env.BASE_URL}family-bakers-1200.webp 1200w`}
                sizes="(max-width: 680px) calc(82vw - 50px), (max-width: 900px) 68vw, 40vw"
                alt="Family bakers shaping pastries together at a kitchen table."
                width="1200"
                height="900"
                loading="lazy"
                decoding="async"
              />
              <span className="family-envelope__portrait-caption" aria-hidden="true">
                Family kitchen <small>Bếp · gia đình</small>
              </span>
            </span>
          </span>
          <span className="family-envelope__pocket-shadow" aria-hidden="true" />
          <span className="family-envelope__front" aria-hidden="true" />
          <span className="family-envelope__flap" aria-hidden="true" />
          <span className="family-envelope__seal" aria-hidden="true"><BrandMark decorative /></span>
        </span>
        <span className="family-envelope__hint" aria-hidden="true">
          {state === 'open' && 'Close family record'}
          {state === 'closed' && 'Open the family envelope'}
          {state === 'opening' && 'Opening family record…'}
          {state === 'closing' && 'Closing family record…'}
        </span>
      </button>
      <figcaption><span>Family record / gia đình</span> The people behind the Àrchive</figcaption>
    </figure>
  )
}
