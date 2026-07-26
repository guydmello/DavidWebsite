import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const appSource = readFileSync('src/App.tsx', 'utf8')
const catalogSource = readFileSync('src/components/MenuCatalog.tsx', 'utf8')
const navigationSource = readFileSync('src/components/ToolNavigation.tsx', 'utf8')
const helperSource = readFileSync('src/lib/sectionNavigation.ts', 'utf8')
const styles = readFileSync('src/styles.css', 'utf8')

test('every in-page destination has one unique section id', () => {
  const sectionIds = [...appSource.matchAll(/<section[^>]+id="([^"]+)"/g)].map((match) => match[1])
  assert.equal(new Set(sectionIds).size, sectionIds.length)

  const requiredIds = ['our-story', 'new-recipes', 'collection', 'journal', 'visit-order']
  for (const id of requiredIds) {
    assert.equal(sectionIds.filter((value) => value === id).length, 1, `Expected one #${id} section`)
    assert.ok(navigationSource.includes(`id: '${id}'`), `Navigation is missing #${id}`)
  }

  assert.ok(appSource.indexOf('id="our-story"') < appSource.indexOf('id="featured"'))
  assert.ok(appSource.indexOf('id="new-recipes"') < appSource.indexOf('id="collection"'))
  assert.doesNotMatch(appSource, /id="custom-orders"|className="events"/)
  assert.match(appSource, /className="contact-services"/)

  const allIds = [...appSource.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  const linkSources = `${appSource}\n${catalogSource}`
  const staticHashes = [...linkSources.matchAll(/href="#([^"]+)"/g)].map((match) => match[1])
  for (const hash of staticHashes) assert.ok(allIds.includes(hash), `Missing target for #${hash}`)
})

test('shared section navigation supports offsets, history, hashes and reduced motion', () => {
  assert.doesNotMatch(helperSource, /closeNavigation|registerNavigationCloser/)
  assert.match(helperSource, /getBoundingClientRect\(\)\.top \+ window\.scrollY - scrollOffset\(\)/)
  assert.match(helperSource, /prefers-reduced-motion: reduce/)
  assert.match(helperSource, /window\.history\.pushState/)
  assert.match(helperSource, /addEventListener\('popstate'/)
  assert.match(helperSource, /addEventListener\('hashchange'/)
  assert.match(styles, /scroll-padding-top: var\(--nav-offset\)/)
  assert.match(styles, /section\[id\] \{ scroll-margin-top: var\(--nav-offset\)/)
})
