import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const appSource = readFileSync('src/App.tsx', 'utf8')
const collectionSource = readFileSync('src/components/FavouriteCollection.tsx', 'utf8')
const favouriteSource = readFileSync('src/components/HouseFavouriteCard.tsx', 'utf8')
const journalSource = readFileSync('src/components/JournalNotesModal.tsx', 'utf8')
const styles = readFileSync('src/styles.css', 'utf8')

test('house favourites flip between food records and cultural stories without navigation', () => {
  assert.match(appSource, /House favourites/)
  assert.match(favouriteSource, /data-flipped=\{isFlipped\}/)
  assert.match(favouriteSource, /onClick=\{\(\) => setIsFlipped\(\(current\) => !current\)\}/)
  assert.doesNotMatch(favouriteSource, /onMouseEnter|onMouseLeave|:hover/)
  assert.match(favouriteSource, /aria-pressed=\{isFlipped\}/)
  assert.match(favouriteSource, /Click or tap to view/)
  assert.match(favouriteSource, /Culture &amp; memory/)
  assert.doesNotMatch(favouriteSource, /href=/)
  assert.match(styles, /\.house-favourite\[data-flipped='true'\] \.house-favourite__inner \{ transform: rotateY\(180deg\)/)
  assert.match(styles, /backface-visibility: hidden/)
  assert.match(styles, /transition: transform \.64s cubic-bezier/)
})

test('mobile favourites start with three cards and expose an accessible expansion control', () => {
  assert.match(appSource, /<FavouriteCollection products=\{archiveFeatures\} \/>/)
  assert.match(collectionSource, /products\.slice\(0, 3\)/)
  assert.match(collectionSource, /aria-expanded=\{isExpanded\}/)
  assert.match(collectionSource, /View all favourites/)
  assert.match(collectionSource, /Show fewer favourites/)
  assert.match(collectionSource, /max-width: 767px/)
  assert.match(styles, /@media \(max-width: 767px\) \{[^}]*\.featured-toggle \{ display: flex;/s)
})

test('journal button opens accessible editorial notes about the creation process', () => {
  assert.match(appSource, /setJournalIsOpen\(true\)/)
  assert.match(appSource, /Read the journal notes/)
  assert.match(journalSource, /role="dialog"/)
  assert.match(journalSource, /Ingredient study/)
  assert.match(journalSource, /Recipe reflection/)
  assert.match(journalSource, /Food journey/)
  assert.match(journalSource, /event\.key === 'Escape'/)
  assert.match(journalSource, /previouslyFocused\?\.focus\(\)/)
  assert.match(styles, /\.journal-modal \{[^}]*repeating-linear-gradient/)
})
