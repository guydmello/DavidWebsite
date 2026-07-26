import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const catalogSource = readFileSync('src/components/MenuCatalog.tsx', 'utf8')
const modalSource = readFileSync('src/components/ArchiveEntryModal.tsx', 'utf8')
const styles = readFileSync('src/styles.css', 'utf8')

test('collection entries open archive stories instead of linking straight to the inquiry', () => {
  assert.match(catalogSource, /aria-haspopup="dialog"/)
  assert.match(catalogSource, /setSelectedEntry\(entry\)/)
  assert.match(catalogSource, /View archive entry/)
  assert.doesNotMatch(catalogSource, /product-card__content[\s\S]{0,500}<a href="#visit-order">Order inquiry/)
})

test('archive dialog supplies flavour, story, dismissal and focus management', () => {
  assert.match(modalSource, /role="dialog"/)
  assert.match(modalSource, /aria-modal="true"/)
  assert.match(modalSource, /Hương vị · flavour profile/)
  assert.match(modalSource, /event\.key === 'Escape'/)
  assert.match(modalSource, /previouslyFocused\?\.focus\(\)/)
  assert.match(modalSource, /event\.key !== 'Tab'/)
  assert.match(styles, /\.entry-modal-backdrop \{[^}]*backdrop-filter: blur/)
  assert.match(styles, /\.entry-modal__close \{[^}]*width: 44px/)
  assert.doesNotMatch(modalSource, /Start an order inquiry/)
})
