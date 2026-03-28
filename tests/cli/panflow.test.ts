import { describe, expect, it } from 'vitest'
import { runPanflowCli } from '../../src/cli/panflow'

describe('panflow cli', () => {
  it('accepts single input and returns one result', async () => {
    const out = await runPanflowCli({ input: 'https://pan.quark.cn/s/old3' })
    expect(out.length).toBe(1)
    expect(out[0].status).toBe('done')
  })
})
