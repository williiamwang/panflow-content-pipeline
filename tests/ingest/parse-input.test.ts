import { describe, expect, it } from 'vitest'
import { parseInput } from '../../src/ingest/parse-input'

describe('parseInput', () => {
  it('parses single link as one item', () => {
    const out = parseInput('https://pan.quark.cn/s/abc')
    expect(out).toHaveLength(1)
    expect(out[0].source_link).toContain('pan.quark.cn')
  })

  it('parses multi-line links as multiple items', () => {
    const out = parseInput('https://pan.quark.cn/s/1\nhttps://pan.baidu.com/s/2')
    expect(out).toHaveLength(2)
  })

  it('marks xlsx source platform as other import source', () => {
    const out = parseInput('input/list.xlsx')
    expect(out[0].source_platform).toBe('other')
    expect(out[0].source_link).toBe('input/list.xlsx')
  })

  it('marks csv source platform as other import source', () => {
    const out = parseInput('input/list.csv')
    expect(out[0].source_platform).toBe('other')
    expect(out[0].source_link).toBe('input/list.csv')
  })
})
