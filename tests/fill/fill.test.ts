import { describe, expect, it } from 'vitest'
import { buildDraftPayload } from '../../src/fill/fill'

describe('buildDraftPayload', () => {
  it('builds fill payload and enforces manual final publish gate', () => {
    const out = buildDraftPayload({
      title: 'Python自动化教程合集',
      copy: {
        xiaohongshu: 'xhs 文案',
        wechat: 'wechat 文案',
        xianyu: 'xianyu 文案',
      },
      images: {
        xiaohongshu: ['xhs-1.png'],
        wechat: ['wechat-1.png'],
        xianyu: ['xianyu-1.png'],
      },
    })

    expect(out.manualPublishRequired).toBe(true)
    expect(out.payload.wechat.content).toContain('wechat 文案')
  })
})
