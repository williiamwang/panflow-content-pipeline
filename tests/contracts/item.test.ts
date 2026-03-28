import { describe, expect, it } from 'vitest'
import { ItemInputSchema, ItemOutputSchema } from '../../src/contracts/item'
import { SUCCESS_STATES, FAILURE_STATES } from '../../src/contracts/state'

describe('contracts', () => {
  it('validates item input schema', () => {
    const parsed = ItemInputSchema.parse({
      source_link: 'https://pan.quark.cn/s/abc123',
      source_copy: '示例文案',
      source_platform: 'auto',
      tags: ['资源', '教程'],
      batch_id: 'batch-1',
    })

    expect(parsed.source_platform).toBe('auto')
    expect(parsed.tags).toHaveLength(2)
  })

  it('validates item output schema and states', () => {
    const parsed = ItemOutputSchema.parse({
      source_link: 'https://pan.baidu.com/s/xyz',
      new_share_link: null,
      copy: {
        xiaohongshu: null,
        wechat: null,
        xianyu: null,
      },
      images: {
        xiaohongshu: [],
        wechat: [],
        xianyu: [],
      },
      fill_result: {
        xiaohongshu: 'skipped',
        wechat: 'skipped',
        xianyu: 'skipped',
      },
      status: 'partial',
      errors: [],
    })

    expect(parsed.status).toBe('partial')
    expect(SUCCESS_STATES).toContain('DONE')
    expect(FAILURE_STATES).toContain('FAILED_TRANSFER')
  })
})
