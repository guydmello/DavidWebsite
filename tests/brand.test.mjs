import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const appSource = readFileSync('src/App.tsx', 'utf8')
const navigationSource = readFileSync('src/components/ToolNavigation.tsx', 'utf8')
const brandMarkSource = readFileSync('src/components/BrandMark.tsx', 'utf8')
const metadata = readFileSync('index.html', 'utf8')

test('visible brand copy preserves the accented name and core language', () => {
  for (const copy of [
    'The Recipe Àrchive',
    'Recipes collected. Stories preserved.',
    'A Living Recipe',
    'Trà means tea in Vietnamese',
    'never as a beverage product',
    'Some recipes are written down.',
    'Others are remembered by taste.',
  ]) {
    assert.ok(appSource.includes(copy), `Missing brand copy: ${copy}`)
  }
  assert.doesNotMatch(appSource, /tea shop|tea room/i)
})

test('navigation uses the requested horizontal spatula information architecture', () => {
  for (const label of ['Home', 'About', 'Recipes', 'Menu', 'Contact']) {
    assert.ok(navigationSource.includes(label), `Missing navigation label: ${label}`)
  }
  assert.doesNotMatch(navigationSource, /label: 'Events'/)
})

test('the supplied logo is available in light and reverse contexts', () => {
  assert.ok(existsSync('public/brand/recipe-archive-mark-light.png'))
  assert.ok(existsSync('public/brand/recipe-archive-mark-reverse.png'))
  assert.match(brandMarkSource, /recipe-archive-mark-\$\{variant\}\.png/)
  assert.match(navigationSource, /<BrandMark decorative/)
  assert.match(appSource, /<BrandMark className="tra-note__mark" decorative/)
  assert.match(appSource, /<BrandMark className="footer-mark" variant="reverse" decorative/)
})

test('technical metadata uses the compatibility-safe unaccented name', () => {
  assert.match(metadata, /<title>The Recipe Archive/)
  assert.doesNotMatch(metadata, /<title>The Recipe Àrchive/)
  assert.ok(existsSync('public/recipe-archive-hero.jpg'))
})
