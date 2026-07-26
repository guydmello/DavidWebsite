import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { ArchiveEntryModal, type ArchiveEntry } from './ArchiveEntryModal'

type MenuCategory = {
  id: string
  label: string
  products: string[]
}

const menuCategories: MenuCategory[] = [
  {
    id: 'crinkle-cookies',
    label: 'Crinkle Cookies',
    products: ['Matcha', 'Ube', 'Chocolate', 'Black Sesame'],
  },
  {
    id: 'cheesecakes',
    label: 'Cheesecakes',
    products: ['Classic', 'Coffee', 'Black Sesame', 'Matcha', 'Biscoff'],
  },
  {
    id: 'chewy-soft-cookies',
    label: 'Chewy & Soft Cookies',
    products: ['Chocolate Chip', 'Butterscotch', 'Reese’s', 'Vietnamese Coffee'],
  },
  {
    id: 'crumbles-bars',
    label: 'Crumbles & Bars',
    products: ['Blueberry', 'Lemon', 'Pecan Maple', 'Mixed Berry', 'Peach'],
  },
  {
    id: 'banana-bread',
    label: 'Banana Bread',
    products: ['Brown Sugar Maple with Walnuts', 'Pecan Maple'],
  },
  {
    id: 'tarts',
    label: 'Tarts',
    products: ['Blueberry', 'Custard', 'Mango', 'Pecan'],
  },
  {
    id: 'cakes',
    label: 'Cakes',
    products: ['Black Forest', 'Mango Peach', 'Custom Cakes'],
  },
]

function ingredientTags(categoryId: string, product: string) {
  if (product === 'Vietnamese Coffee') return ['Vietnamese coffee', 'Condensed milk']
  if (product === 'Black Sesame') return ['Black sesame']
  if (product === 'Matcha') return ['Matcha']
  if (product === 'Ube') return ['Ube']
  if (product === 'Mango' || product === 'Mango Peach') return ['Mango']
  if (categoryId === 'banana-bread') return ['Banana']
  return []
}

const flavourProfiles: Record<string, string[]> = {
  Matcha: ['Earthy tea', 'Gentle bitterness', 'Measured sweetness'],
  Ube: ['Mellow sweetness', 'Vanilla-like warmth', 'Softly nutty'],
  Chocolate: ['Deep cocoa', 'Rounded sweetness', 'Roasted finish'],
  'Black Sesame': ['Deeply toasted', 'Nutty', 'Bittersweet'],
  Classic: ['Creamy', 'Gently tangy', 'Rich finish'],
  Coffee: ['Roasted coffee', 'Caramel warmth', 'Creamy finish'],
  Biscoff: ['Caramelised spice', 'Toasty biscuit', 'Creamy'],
  'Chocolate Chip': ['Buttery', 'Dark chocolate', 'Soft-centred'],
  Butterscotch: ['Caramelised sugar', 'Buttery', 'Warm finish'],
  'Reese’s': ['Chocolate', 'Peanut', 'Sweet-salty'],
  'Vietnamese Coffee': ['Dark roasted coffee', 'Condensed-milk sweetness', 'Soft-centred'],
  Blueberry: ['Bright berry', 'Gently tart', 'Jammy'],
  Lemon: ['Citrus-bright', 'Tart', 'Buttery'],
  'Pecan Maple': ['Toasted pecan', 'Maple warmth', 'Caramel'],
  'Mixed Berry': ['Raspberry', 'Blackberry', 'Bright acidity'],
  Peach: ['Soft stone fruit', 'Gentle sweetness', 'Warm finish'],
  'Brown Sugar Maple with Walnuts': ['Ripe banana', 'Brown sugar', 'Maple and walnut'],
  Custard: ['Silky', 'Vanilla-led', 'Delicately rich'],
  Mango: ['Ripe fruit', 'Bright sweetness', 'Clean finish'],
  Pecan: ['Toasted nut', 'Caramel warmth', 'Buttery'],
  'Black Forest': ['Dark chocolate', 'Cherry', 'Rich finish'],
  'Mango Peach': ['Mango', 'Peach', 'Bright fruit'],
  'Custom Cakes': ['Made to order', 'Flavour-led', 'Celebratory'],
}

function archiveStory(categoryId: string, product: string) {
  if (product === 'Ube') {
    return 'A soft, crackled cookie inspired by the ube sweets shared across Southeast Asian family tables.'
  }
  if (product === 'Vietnamese Coffee') {
    return 'A soft coffee cookie inspired by condensed-milk coffees enjoyed slowly around the family table.'
  }
  if (product === 'Black Sesame') {
    return categoryId === 'cheesecakes'
      ? 'Deeply toasted black sesame folded into cheesecake for a nutty, bittersweet finish.'
      : 'Toasted black sesame brings a familiar nuttiness and quiet bitterness to a soft, crackled cookie.'
  }
  if (product === 'Matcha') {
    return categoryId === 'cheesecakes'
      ? 'Earthy matcha layered into a familiar cheesecake, balancing bitterness, sweetness and cream.'
      : 'Earthy matcha gives this crackled cookie a measured bitterness and a softly sweet finish.'
  }
  if (product === 'Mango') {
    return 'Ripe mango arranged over a crisp shell, recalling humid summers, fruit stalls and desserts served cold.'
  }
  if (product === 'Brown Sugar Maple with Walnuts') {
    return 'A familiar banana loaf layered with brown sugar, maple and walnuts—kept in the archive as everyday comfort.'
  }
  if (product === 'Custom Cakes') {
    return 'A made-to-order entry shaped around the flavours, format and feeling of your celebration.'
  }
  return 'Part of the archive’s broader modern pastry collection, this entry keeps a familiar flavour close while giving it a contemporary place at the table.'
}

export function MenuCatalog() {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedEntry, setSelectedEntry] = useState<ArchiveEntry | null>(null)
  const [hasMoreTabs, setHasMoreTabs] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  const tabsContainerRef = useRef<HTMLDivElement | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeCategory = menuCategories[activeIndex]
  const closeEntry = useCallback(() => setSelectedEntry(null), [])

  const updateOverflowCue = useCallback(() => {
    const tabs = tabsContainerRef.current
    if (!tabs) return
    setHasMoreTabs(tabs.scrollLeft + tabs.clientWidth < tabs.scrollWidth - 2)
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateOverflowCue)
    window.addEventListener('resize', updateOverflowCue)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updateOverflowCue)
    }
  }, [updateOverflowCue])

  const scrollTabIntoView = (index: number) => {
    const tabs = tabsContainerRef.current
    const tab = tabRefs.current[index]
    if (!tabs || !tab) return

    const padding = 14
    const tabLeft = tab.offsetLeft
    const tabRight = tabLeft + tab.offsetWidth
    const visibleLeft = tabs.scrollLeft + padding
    const visibleRight = tabs.scrollLeft + tabs.clientWidth - padding

    if (tabLeft < visibleLeft || tabRight > visibleRight) {
      const nextLeft = tabLeft < visibleLeft
        ? tabLeft - padding
        : tabRight - tabs.clientWidth + padding
      tabs.scrollTo({ left: Math.max(0, nextLeft), behavior: reduceMotion ? 'auto' : 'smooth' })
    }
  }

  const selectCategory = (index: number) => {
    if (index !== activeIndex) setShowSwipeHint(false)
    setActiveIndex(index)
    tabRefs.current[index]?.focus({ preventScroll: true })
    scrollTabIntoView(index)
  }

  const handleTabScroll = () => {
    const tabs = tabsContainerRef.current
    if (tabs && tabs.scrollLeft > 2) setShowSwipeHint(false)
    updateOverflowCue()
  }

  const handleTabKeyDown = (event: KeyboardEvent, index: number) => {
    let nextIndex = index

    if (event.key === 'ArrowRight') nextIndex = (index + 1) % menuCategories.length
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + menuCategories.length) % menuCategories.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = menuCategories.length - 1
    else return

    event.preventDefault()
    selectCategory(nextIndex)
  }

  return (
    <div className="catalog">
      <div className="catalog-tabs-wrap" data-overflow={hasMoreTabs}>
        <div
          className="catalog-tabs"
          ref={tabsContainerRef}
          role="tablist"
          aria-label="Menu categories"
          onScroll={handleTabScroll}
        >
          {menuCategories.map((category, index) => (
            <button
              key={category.id}
              data-category={category.id}
              ref={(node) => { tabRefs.current[index] = node }}
              id={`tab-${category.id}`}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={`panel-${category.id}`}
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => selectCategory(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span>0{index + 1}</span>
              {category.label}
            </button>
          ))}
        </div>
        <span className="catalog-tabs__cue" aria-hidden="true"><ChevronRight /></span>
      </div>
      <p className={`catalog-tabs__hint ${showSwipeHint ? '' : 'catalog-tabs__hint--hidden'}`}>
        Swipe to explore categories
      </p>

      <div
        className="catalog-panel"
        id={`panel-${activeCategory.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeCategory.id}`}
        tabIndex={0}
      >
        <header className="catalog-panel__header">
          <p>{activeCategory.label}</p>
          <span>{activeCategory.products.length} archive entries</span>
        </header>
        <div className="product-grid">
          {activeCategory.products.map((product, index) => {
            const entryNumber = String(activeIndex * 10 + index + 1).padStart(3, '0')
            const tags = ingredientTags(activeCategory.id, product)
            const entry: ArchiveEntry = {
              entryNumber,
              name: product,
              category: activeCategory.label,
              flavourNotes: flavourProfiles[product] ?? ['Balanced', 'Familiar', 'Modern finish'],
              story: archiveStory(activeCategory.id, product),
            }

            return (
              <article className={`product-card product-card--${activeCategory.id}`} key={product}>
                <button
                  className="product-card__open"
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={`View the flavour profile and story for ${product}`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <span className="product-card__index">Entry No. {entryNumber}</span>
                  <span className="product-card__mark" aria-hidden="true">
                    <span>À</span>
                  </span>
                  <span className="product-card__content">
                    <span className="product-card__category">{activeCategory.label}</span>
                    <span className="product-card__name">{product}</span>
                    {product === 'Mixed Berry' && <small>Raspberry & blackberry</small>}
                    {tags.length > 0 && (
                      <span className="ingredient-tags" aria-label="Flavour notes">
                        {tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </span>
                    )}
                    <span className="product-card__action">View archive entry <ArrowRight aria-hidden="true" /></span>
                  </span>
                </button>
              </article>
            )
          })}
        </div>

        {activeCategory.id === 'cakes' && (
          <div className="custom-cake-callout">
            <div>
              <span>Custom archive entry</span>
              <h3>A cake shaped around your story.</h3>
            </div>
            <a className="button button--primary" href="#visit-order">
              Custom Cake Inquiry <ArrowRight />
            </a>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedEntry && (
          <ArchiveEntryModal
            key={`${selectedEntry.category}-${selectedEntry.name}`}
            entry={selectedEntry}
            onClose={closeEntry}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
