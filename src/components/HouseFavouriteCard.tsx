import { useState } from 'react'
import { RotateCw } from 'lucide-react'

export type HouseFavourite = {
  entry: string
  name: string
  note: string
  story: string
  heritage: string
  tone: string
}

type HouseFavouriteCardProps = {
  product: HouseFavourite
}

export function HouseFavouriteCard({ product }: HouseFavouriteCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <article className="house-favourite" data-flipped={isFlipped}>
      <button
        className="house-favourite__button"
        type="button"
        aria-pressed={isFlipped}
        aria-label={`${isFlipped ? 'Hide details and show the food record for' : 'Show the story and cultural details for'} ${product.name}`}
        onClick={() => setIsFlipped((current) => !current)}
      >
        <span className="house-favourite__inner">
          <span className="house-favourite__face house-favourite__front" aria-hidden={isFlipped}>
            <span className={`featured-card__art featured-card__art--${product.tone}`} aria-hidden="true">
              <span /><i /><i />
            </span>
            <span className="house-favourite__copy">
              <span>House favourite · Entry No. {product.entry}</span>
              <strong>{product.name}</strong>
              <small>{product.note}</small>
              <em><RotateCw aria-hidden="true" /> Click or tap to view</em>
            </span>
          </span>

          <span className="house-favourite__face house-favourite__back" aria-hidden={!isFlipped}>
            <span className="house-favourite__folio">Recipe record / {product.entry}</span>
            <strong>{product.name}</strong>
            <span className="house-favourite__rule" aria-hidden="true">Trà</span>
            <span className="house-favourite__label">Story preserved</span>
            <span className="house-favourite__story">{product.story}</span>
            <span className="house-favourite__label">Culture &amp; memory</span>
            <span className="house-favourite__heritage">{product.heritage}</span>
            <em><RotateCw aria-hidden="true" /> Click or tap to return</em>
          </span>
        </span>
      </button>
    </article>
  )
}
