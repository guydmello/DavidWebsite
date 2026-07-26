import { useEffect, useState } from 'react'
import {
  BookOpenText,
  Heart,
  Home,
  Mail,
  UtensilsCrossed,
  Wheat,
} from 'lucide-react'
import { BrandMark } from './BrandMark'

const links = [
  { label: 'Home', id: 'home', icon: Home },
  { label: 'About', id: 'our-story', icon: Heart },
  { label: 'Recipes', id: 'new-recipes', icon: BookOpenText },
  { label: 'Menu', id: 'collection', icon: UtensilsCrossed },
  { label: 'Contact', id: 'visit-order', icon: Mail },
]

const observedSections = [
  ...links.map(({ id }) => ({ id, activeId: id })),
  { id: 'featured', activeId: 'new-recipes' },
  { id: 'journal', activeId: 'new-recipes' },
]

export function ToolNavigation() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const sections = observedSections
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const observed = observedSections.find(({ id }) => id === visible.target.id)
          setActiveSection(observed?.activeId ?? visible.target.id)
        }
      },
      { rootMargin: '-20% 0px -68% 0px', threshold: [0, 0.08, 0.25] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="cutting-board-header">
      <nav className="spatula-nav" aria-label="Primary bakery navigation" data-site-navigation>
        <div className="spatula-tool">
          <div className="spatula-blade">
            <a className="spatula-logo" href="#home" aria-label="The Recipe Àrchive home">
              <BrandMark decorative />
            </a>

            <div className="spatula-links">
              {links.map(({ label, id, icon: Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`spatula-link ${activeSection === id ? 'spatula-link--active' : ''}`}
                  aria-label={label}
                  aria-current={activeSection === id ? 'location' : undefined}
                >
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </a>
              ))}
            </div>

            <span className="spatula-glint" aria-hidden="true" />
          </div>

          <span className="spatula-bolster" aria-hidden="true" />

          <span className="spatula-handle" aria-hidden="true">
            <i className="spatula-handle__grain" />
            <i className="spatula-handle__emblem"><Wheat /></i>
          </span>
        </div>
      </nav>
    </header>
  )
}
