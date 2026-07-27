import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const appSource = readFileSync('src/App.tsx', 'utf8')

test('the inquiry form posts real submissions to Formspree', () => {
  assert.match(appSource, /action="https:\/\/formspree\.io\/f\/xpqvkdvv"/)
  assert.match(appSource, /method="POST"/)
  assert.match(appSource, /fetch\(form\.action/)
  assert.match(appSource, /body: new FormData\(form\)/)
  assert.match(appSource, /Accept: 'application\/json'/)
})

test('the inquiry form exposes accessible delivery states and prevents duplicates', () => {
  assert.match(appSource, /aria-busy=\{inquiryStatus === 'submitting'\}/)
  assert.match(appSource, /disabled=\{inquiryStatus === 'submitting'\}/)
  assert.match(appSource, /Sending inquiry…/)
  assert.match(appSource, /Your inquiry has been sent to The Recipe Àrchive\./)
  assert.doesNotMatch(appSource, /Ordering delivery can now be connected/)
})
