import { useState } from 'react'
import { BrandMark } from './BrandMark'

export function FamilyEnvelope() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <figure className={`family-envelope ${isOpen ? 'family-envelope--open' : ''}`}>
      <button
        className="family-envelope__button"
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close the family portrait envelope' : 'Open the family portrait envelope'}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="family-envelope__stage" aria-hidden="true">
          <span className="family-envelope__back" />
          <span className="family-envelope__portrait">
            <span className="family-envelope__portrait-art">
              <BrandMark decorative />
              <i /><i /><i />
            </span>
            <span className="family-envelope__portrait-caption">
              Family portrait <small>Photograph forthcoming</small>
            </span>
          </span>
          <span className="family-envelope__flap" />
          <span className="family-envelope__front" />
          <span className="family-envelope__seal"><BrandMark decorative /></span>
        </span>
        <span className="family-envelope__hint">
          {isOpen ? 'Close portrait' : 'Open the family envelope'}
        </span>
      </button>
      <figcaption><span>Family record / forthcoming</span> The people behind the Àrchive</figcaption>
    </figure>
  )
}
