import { describe, expect, it } from 'vitest'
import { rewriteForPlatforms } from '../../src/rewrite/rewrite'

describe('rewriteForPlatforms', () => {
  it('generates three platform copies while preserving core facts', () => {
    const out = rewriteForPlatforms({
      title: 'Python自动化教程合集',
      oldCopy: '包含入门、实战、案例',
      newLink: 'https://pan.quark.cn/s/new123',
    })

    expect(out.xiaohongshu).toContain('Python自动化教程合集')
    expect(out.wechat).toContain('https://pan.quark.cn/s/new123')
    expect(out.xianyu).toContain('Python自动化教程合集')
  })
})
