import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const navigationSource = readFileSync('src/components/ToolNavigation.tsx', 'utf8')
const styles = readFileSync('src/styles.css', 'utf8')

test('the fixed cutting board holds one continuous horizontal baking spatula', () => {
  assert.match(styles, /\.cutting-board-header \{[^}]*position: fixed[^}]*right: 0[^}]*left: 0/)
  assert.match(styles, /\.cutting-board-header \{[^}]*repeating-linear-gradient/)
  assert.match(navigationSource, /<nav className="spatula-nav" aria-label="Primary bakery navigation"/)
  assert.match(navigationSource, /className="spatula-blade"/)
  assert.match(navigationSource, /className="spatula-bolster"/)
  assert.match(navigationSource, /className="spatula-handle"/)
  assert.match(styles, /\.spatula-tool \{[^}]*display: grid[^}]*grid-template-columns: minmax\(0, 1fr\)/)
  assert.match(styles, /\.spatula-blade \{[^}]*border-radius: 34px 3px 4px 34px[^}]*#fffdf7/)
  assert.match(styles, /\.spatula-bolster \{[^}]*border-radius: 4px 7px 7px 4px[^}]*linear-gradient/)
  assert.match(styles, /\.spatula-handle \{[^}]*radial-gradient[^}]*#170b09/)
  assert.doesNotMatch(styles, /\.spatula-bolster \{[^}]*clip-path/)
  assert.match(styles, /body \{[^}]*padding-top: calc\(var\(--board-header-height\)/)
})

test('the logo and five complete link targets live inside the blade', () => {
  assert.match(navigationSource, /className="spatula-logo"[^>]*href="#home"/)
  assert.match(navigationSource, /<BrandMark decorative/)
  for (const label of ['Home', 'About', 'Recipes', 'Menu', 'Contact']) {
    assert.ok(navigationSource.includes(`label: '${label}'`), `Missing ${label} navigation item`)
  }
  assert.doesNotMatch(navigationSource, /label: 'Events'/)
  assert.match(navigationSource, /href=\{`#\$\{id\}`\}/)
  assert.match(navigationSource, /aria-current=\{activeSection === id \? 'location' : undefined\}/)
  assert.match(styles, /\.spatula-links \{[^}]*repeat\(5, minmax\(0, 1fr\)\)/)
  assert.match(styles, /\.spatula-link \{[^}]*min-height: 62px/)
  assert.match(styles, /\.spatula-link::after \{[^}]*background: #b4884b/)
  assert.match(styles, /\.spatula-link:hover svg, \.spatula-link:focus-visible svg \{[^}]*translateY\(-2px\)/)
})

test('active-section tracking stays singular across the new recipe and journal sections', () => {
  assert.match(navigationSource, /featured', activeId: 'new-recipes'/)
  assert.match(navigationSource, /journal', activeId: 'new-recipes'/)
  assert.match(navigationSource, /new IntersectionObserver/)
  assert.match(navigationSource, /setActiveSection\(observed\?\.activeId \?\? visible\.target\.id\)/)
  assert.match(styles, /\.spatula-link--active::after \{ opacity: 1; transform: scaleX\(1\); \}/)
})

test('mobile preserves the spatula and hides only visible labels at narrow widths', () => {
  assert.match(styles, /@media \(max-width: 680px\)[\s\S]*\.spatula-tool \{[^}]*grid-template-columns: minmax\(0, 1fr\) 18px clamp\(82px, 27vw, 104px\)/)
  assert.match(styles, /@media \(max-width: 680px\)[\s\S]*\.spatula-link span \{ display: none; \}/)
  assert.match(navigationSource, /aria-label=\{label\}/)
  assert.match(styles, /\.spatula-link \{[^}]*min-height: 62px/)
})

test('paper, chopping, overlay, menu-state and back-to-top systems are absent', () => {
  assert.doesNotMatch(navigationSource, /paper|chop|NavigationState|setTimeout|useReducedMotion|motion\.|aria-expanded|aria-controls/i)
  assert.doesNotMatch(navigationSource, /ArrowUp|Back to the top|window\.scrollY|document\.addEventListener/)
  assert.doesNotMatch(styles, /\.paper-nav|\.paper-strip|\.recipe-sheet|\.board-knife|\.back-to-top|data-state/)
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/)
})
