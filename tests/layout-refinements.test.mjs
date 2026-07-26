import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
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

test('the family placeholder is a keyboard-accessible opening envelope', () => {
  assert.match(appSource, /<FamilyEnvelope \/>/)
  assert.match(envelopeSource, /<button/)
  assert.match(envelopeSource, /aria-expanded=\{isOpen\}/)
  assert.match(envelopeSource, /setIsOpen\(\(open\) => !open\)/)
  assert.match(envelopeSource, /Photograph forthcoming/)
  assert.doesNotMatch(envelopeSource, /onMouseEnter|onMouseOver/)
  assert.match(styles, /\.family-envelope--open \.family-envelope__flap \{[^}]*rotateX\(180deg\)/)
  assert.match(styles, /\.family-envelope--open \.family-envelope__portrait \{[^}]*translateY\(-13%\)/)
  assert.match(styles, /\.family-envelope__button:focus-visible/)
})
