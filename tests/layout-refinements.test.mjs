import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const appSource = readFileSync('src/App.tsx', 'utf8')
const envelopeSource = readFileSync('src/components/FamilyEnvelope.tsx', 'utf8')
const styles = readFileSync('src/styles.css', 'utf8')

test('the hero title has intentional separation between both lines', () => {
  assert.match(styles, /\.hero h1 span, \.hero h1 em \{ display: block; \}/)
  assert.match(styles, /\.hero h1 em \{ margin-top: \.12em; \}/)
})

test('New Recipes uses compact spacing and still precedes the menu', () => {
  assert.ok(appSource.indexOf('id="new-recipes"') < appSource.indexOf('id="collection"'))
  assert.match(styles, /\.section-block\.new-recipes \{ padding-top: 86px; padding-bottom: 72px/)
  assert.match(styles, /\.new-recipes \.section-heading \{ margin-bottom: 38px/)
})

test('the family envelope extracts a responsive documentary photograph', () => {
  assert.match(appSource, /<FamilyEnvelope \/>/)
  assert.doesNotMatch(appSource + envelopeSource, /Photograph forthcoming|reserved for portraits|placeholder/i)
  assert.match(envelopeSource, /type EnvelopeState = 'closed' \| 'opening' \| 'open' \| 'closing'/)
  assert.match(envelopeSource, /aria-expanded=\{isExpanded\}/)
  assert.match(envelopeSource, /disabled=\{isAnimating\}/)
  assert.match(envelopeSource, /Family bakers shaping pastries together at a kitchen table\./)
  assert.match(envelopeSource, /srcSet="\/family-bakers-640\.webp 640w, \/family-bakers-1200\.webp 1200w"/)
  assert.match(envelopeSource, /loading="lazy"/)
  assert.ok(existsSync('public/family-bakers-640.webp'))
  assert.ok(existsSync('public/family-bakers-1200.webp'))
  assert.match(styles, /\.family-envelope__portrait-clip \{[^}]*z-index: 2;[^}]*clip-path: inset\(-100% 0 0 0\)/)
  assert.match(styles, /\.family-envelope__front \{[^}]*z-index: 4;/)
  assert.match(styles, /\.family-envelope--flap-open \.family-envelope__flap \{[^}]*rotateX\(180deg\)/)
  assert.match(styles, /\.family-envelope--portrait-raised \.family-envelope__portrait \{[^}]*translateY\(-20%\)/)
})
