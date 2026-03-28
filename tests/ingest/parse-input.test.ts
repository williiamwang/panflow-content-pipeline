import { describe, expect, it } from 'vitest'
import { parseInput } from '../../src/ingest/parse-input'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

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

  it('parses csv file content into multiple items', () => {
    const dir = mkdtempSync(join(tmpdir(), 'panflow-parse-'))
    const csvPath = join(dir, 'list.csv')
    writeFileSync(csvPath, 'source_link\nhttps://pan.quark.cn/s/a\nhttps://pan.baidu.com/s/b\n', 'utf8')

    const out = parseInput(csvPath)

    expect(out).toHaveLength(2)
    expect(out[0].source_link).toBe('https://pan.quark.cn/s/a')
    expect(out[1].source_link).toBe('https://pan.baidu.com/s/b')
  })

  it('parses txt file content into multiple items', () => {
    const dir = mkdtempSync(join(tmpdir(), 'panflow-parse-'))
    const txtPath = join(dir, 'list.txt')
    writeFileSync(txtPath, 'https://pan.quark.cn/s/t1\nhttps://pan.baidu.com/s/t2\n', 'utf8')

    const out = parseInput(txtPath)

    expect(out).toHaveLength(2)
    expect(out[0].source_link).toBe('https://pan.quark.cn/s/t1')
    expect(out[1].source_link).toBe('https://pan.baidu.com/s/t2')
  })

  it('parses txt file with CR-only newlines into multiple items', () => {
    const dir = mkdtempSync(join(tmpdir(), 'panflow-parse-'))
    const txtPath = join(dir, 'list-cr.txt')
    writeFileSync(txtPath, 'https://pan.quark.cn/s/r1\rhttps://pan.baidu.com/s/r2\r', 'utf8')

    const out = parseInput(txtPath)

    expect(out).toHaveLength(2)
    expect(out[0].source_link).toBe('https://pan.quark.cn/s/r1')
    expect(out[1].source_link).toBe('https://pan.baidu.com/s/r2')
  })

  it('ignores blank lines and comment lines in txt file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'panflow-parse-'))
    const txtPath = join(dir, 'list.txt')
    writeFileSync(txtPath, '# comment\n\nhttps://pan.quark.cn/s/t1\n   \n# another\nhttps://pan.baidu.com/s/t2\n', 'utf8')

    const out = parseInput(txtPath)

    expect(out).toHaveLength(2)
    expect(out[0].source_link).toBe('https://pan.quark.cn/s/t1')
    expect(out[1].source_link).toBe('https://pan.baidu.com/s/t2')
  })

  it('ignores slash comment lines in txt file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'panflow-parse-'))
    const txtPath = join(dir, 'list.txt')
    writeFileSync(txtPath, '// comment\nhttps://pan.quark.cn/s/s1\n// another\nhttps://pan.baidu.com/s/s2\n', 'utf8')

    const out = parseInput(txtPath)

    expect(out).toHaveLength(2)
    expect(out[0].source_link).toBe('https://pan.quark.cn/s/s1')
    expect(out[1].source_link).toBe('https://pan.baidu.com/s/s2')
  })

  it('ignores semicolon comment lines in txt file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'panflow-parse-'))
    const txtPath = join(dir, 'list.txt')
    writeFileSync(txtPath, '; comment\nhttps://pan.quark.cn/s/c1\n; another\nhttps://pan.baidu.com/s/c2\n', 'utf8')

    const out = parseInput(txtPath)

    expect(out).toHaveLength(2)
    expect(out[0].source_link).toBe('https://pan.quark.cn/s/c1')
    expect(out[1].source_link).toBe('https://pan.baidu.com/s/c2')
  })

  it('strips markdown list prefixes from txt links', () => {
    const dir = mkdtempSync(join(tmpdir(), 'panflow-parse-'))
    const txtPath = join(dir, 'list.txt')
    writeFileSync(txtPath, '- https://pan.quark.cn/s/m1\n* https://pan.baidu.com/s/m2\n1. https://pan.quark.cn/s/m3\n', 'utf8')

    const out = parseInput(txtPath)

    expect(out).toHaveLength(3)
    expect(out[0].source_link).toBe('https://pan.quark.cn/s/m1')
    expect(out[1].source_link).toBe('https://pan.baidu.com/s/m2')
    expect(out[2].source_link).toBe('https://pan.quark.cn/s/m3')
  })

  it('strips parenthesized numeric list prefixes from txt links', () => {
    const dir = mkdtempSync(join(tmpdir(), 'panflow-parse-'))
    const txtPath = join(dir, 'list-parenthesized.txt')
    writeFileSync(txtPath, '1) https://pan.quark.cn/s/p1\n2) https://pan.baidu.com/s/p2\n', 'utf8')

    const out = parseInput(txtPath)

    expect(out).toHaveLength(2)
    expect(out[0].source_link).toBe('https://pan.quark.cn/s/p1')
    expect(out[1].source_link).toBe('https://pan.baidu.com/s/p2')
  })

  it('parses csv with UTF-8 BOM header into data rows', () => {
    const dir = mkdtempSync(join(tmpdir(), 'panflow-parse-'))
    const csvPath = join(dir, 'bom-list.csv')
    writeFileSync(csvPath, '\ufeffsource_link\nhttps://pan.quark.cn/s/b1\nhttps://pan.baidu.com/s/b2\n', 'utf8')

    const out = parseInput(csvPath)

    expect(out).toHaveLength(2)
    expect(out[0].source_link).toBe('https://pan.quark.cn/s/b1')
    expect(out[1].source_link).toBe('https://pan.baidu.com/s/b2')
  })

  it('parses first column as source_link in multi-column csv', () => {
    const dir = mkdtempSync(join(tmpdir(), 'panflow-parse-'))
    const csvPath = join(dir, 'multi-col.csv')
    writeFileSync(csvPath, 'source_link,note\nhttps://pan.quark.cn/s/c1,first\nhttps://pan.baidu.com/s/c2,second\n', 'utf8')

    const out = parseInput(csvPath)

    expect(out).toHaveLength(2)
    expect(out[0].source_link).toBe('https://pan.quark.cn/s/c1')
    expect(out[1].source_link).toBe('https://pan.baidu.com/s/c2')
  })
})
