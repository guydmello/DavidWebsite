import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { HouseFavouriteCard, type HouseFavourite } from './HouseFavouriteCard'

type FavouriteCollectionProps = {
  products: HouseFavourite[]
}

const mobileQuery = '(max-width: 767px)'

export function FavouriteCollection({ products }: FavouriteCollectionProps) {
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia(mobileQuery).matches
  ))
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(mobileQuery)
    const updateViewport = () => setIsMobile(query.matches)

    updateViewport()
    query.addEventListener('change', updateViewport)
    return () => query.removeEventListener('change', updateViewport)
  }, [])

  const visibleProducts = isMobile && !isExpanded ? products.slice(0, 3) : products

  return (
    <>
      <div className="featured-grid" id="favourites-grid">
        <AnimatePresence initial={false}>
          {visibleProducts.map((product) => (
            <motion.div
              className="featured-grid__item"
              key={product.entry}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.76, 0, 0.24, 1] }}
            >
              <HouseFavouriteCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isMobile && (
        <button
          className="featured-toggle"
          type="button"
          aria-expanded={isExpanded}
          aria-controls="favourites-grid"
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          {isExpanded ? 'Show fewer favourites' : 'View all favourites'}
          {isExpanded ? <ArrowUp aria-hidden="true" /> : <ArrowDown aria-hidden="true" />}
        </button>
      )}
    </>
  )
}
