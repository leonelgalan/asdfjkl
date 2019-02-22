/* global describe, it */

import asdfjkl from './lib/asdfjkl'
import assert from 'assert'

describe('asdfjkl', () => {
  const gibberish = 'asdfjkl'
  const properEnglish = 'Hello World!'

  it(`should detect gibberish in "${gibberish}"`, () => {
    assert.strictEqual(
      asdfjkl(gibberish),
      true
    )
  })

  it(`shouldn't detect gibberish in "${properEnglish}"`, () => {
    assert.strictEqual(
      asdfjkl(properEnglish),
      false
    )
  })
})
