import { describe, expect, it } from 'vitest'
import { generateXhsImage } from '../../src/image/generate-xhs'
import { generateWechatImage } from '../../src/image/generate-wechat'
import { generateXianyuImage } from '../../src/image/generate-xianyu'

describe('image generators', () => {
  it('returns xhs image metadata with expected dimensions', () => {
    const out = generateXhsImage('python合集')
    expect(out.width).toBe(1080)
    expect(out.height).toBe(1440)
  })

  it('returns wechat image metadata with expected dimensions', () => {
    const out = generateWechatImage('python合集')
    expect(out.width).toBe(900)
    expect(out.height).toBe(500)
  })

  it('returns xianyu image metadata with expected dimensions', () => {
    const out = generateXianyuImage('python合集')
    expect(out.width).toBe(1242)
    expect(out.height).toBe(1660)
  })
})
