import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const catalogSource = readFileSync('src/components/MenuCatalog.tsx', 'utf8')
const styles = readFileSync('src/styles.css', 'utf8')

test('the catalog contains every requested category and product', () => {
  const requiredNames = [
    'Crinkle Cookies', 'Matcha', 'Ube', 'Chocolate', 'Black Sesame',
    'Cheesecakes', 'Classic', 'Coffee', 'Biscoff',
    'Chewy & Soft Cookies', 'Chocolate Chip', 'Butterscotch', 'Reese’s', 'Vietnamese Coffee',
    'Crumbles & Bars', 'Blueberry', 'Lemon', 'Pecan Maple', 'Mixed Berry', 'Raspberry & blackberry', 'Peach',
    'Banana Bread', 'Brown Sugar Maple with Walnuts',
    'Tarts', 'Custard', 'Mango', 'Pecan',
    'Cakes', 'Black Forest', 'Mango Peach', 'Custom Cakes',
  ]

  for (const name of requiredNames) assert.ok(catalogSource.includes(name), `Missing ${name}`)
})

test('category tabs and custom cake action expose the expected interactions', () => {
  for (const key of ['ArrowRight', 'ArrowLeft', 'Home', 'End']) {
    assert.ok(catalogSource.includes(key), `Missing ${key} keyboard behavior`)
  }
  assert.match(catalogSource, /role="tablist"/)
  assert.match(catalogSource, /role="tab"/)
  assert.match(catalogSource, /role="tabpanel"/)
  assert.match(catalogSource, /Custom Cake Inquiry/)
  assert.match(catalogSource, /href="#visit-order"/)
  assert.match(catalogSource, /Swipe to explore categories/)
  assert.match(catalogSource, /scrollTabIntoView\(index\)/)
  assert.match(catalogSource, /onScroll=\{handleTabScroll\}/)
  assert.match(catalogSource, /data-overflow=\{hasMoreTabs\}/)
  assert.match(styles, /\.catalog-tabs \{[^}]*overflow-x: auto/)
  assert.match(styles, /\.catalog-tabs-wrap\[data-overflow='true'\]::after \{ opacity: 1; \}/)
  assert.match(styles, /\.catalog-tabs__hint--hidden \{ opacity: 0;/)
})
