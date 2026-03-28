import { describe, expect, it } from 'vitest'
import { shouldStopBeforePublish } from '../../src/fill/playwright-fill'

describe('playwright fill safety gate', () => {
  it('enforces manual publish gate', () => {
    expect(shouldStopBeforePublish()).toBe(true)
  })
})
