import { describe, expect, it } from 'vitest'
import { withRetry } from '../../src/transfer/retry'

describe('withRetry', () => {
  it('succeeds before max retry', async () => {
    let n = 0
    const res = await withRetry(async () => {
      n += 1
      if (n < 2) throw new Error('fail once')
      return 'ok'
    }, 2)

    expect(res).toBe('ok')
    expect(n).toBe(2)
  })

  it('throws after max retry reached', async () => {
    let n = 0
    await expect(
      withRetry(async () => {
        n += 1
        throw new Error('always fail')
      }, 2),
    ).rejects.toThrow('always fail')

    expect(n).toBe(3)
  })
})
