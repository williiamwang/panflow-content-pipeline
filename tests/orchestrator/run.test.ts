import { describe, expect, it } from 'vitest'
import { runPipeline } from '../../src/orchestrator/run'

describe('runPipeline', () => {
  it('runs pipeline in order and returns done for a valid item', async () => {
    const out = await runPipeline([
      {
        source_link: 'https://pan.quark.cn/s/old1',
        source_copy: '旧文案',
        source_platform: 'quark',
        tags: [],
        batch_id: 'b1',
      },
    ])

    expect(out[0].status).toBe('done')
    expect(out[0].new_share_link).toContain('new-share-link')
  })

  it('is idempotent for repeated input links', async () => {
    const first = await runPipeline([
      {
        source_link: 'https://pan.quark.cn/s/old2',
        source_copy: null,
        source_platform: 'quark',
        tags: [],
        batch_id: 'b2',
      },
    ])

    const second = await runPipeline([
      {
        source_link: 'https://pan.quark.cn/s/old2',
        source_copy: null,
        source_platform: 'quark',
        tags: [],
        batch_id: 'b2',
      },
    ])

    expect(second[0].new_share_link).toBe(first[0].new_share_link)
  })
})
