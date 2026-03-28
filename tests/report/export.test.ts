import { describe, expect, it } from 'vitest'
import { buildReport, buildReportArtifacts } from '../../src/report/report'

describe('report exports', () => {
  it('exports json csv markdown artifacts', () => {
    const report = buildReport([
      { source_link: 'a', status: 'done', retries: 0, errors: [] },
      { source_link: 'b', status: 'partial', retries: 1, errors: ['FAILED_FILL'] },
    ])

    const artifacts = buildReportArtifacts(report)

    expect(artifacts.json).toContain('"done": 1')
    expect(artifacts.csv).toContain('source_link,status,retries,errors')
    expect(artifacts.markdown).toContain('| source_link | status | retries | errors |')
  })

  it('escapes csv values containing comma and quote', () => {
    const report = buildReport([
      {
        source_link: 'https://pan.quark.cn/s/a,b',
        status: 'partial',
        retries: 1,
        errors: ['bad "quote"', 'a,b'],
      },
    ])

    const artifacts = buildReportArtifacts(report)

    expect(artifacts.csv).toContain('"https://pan.quark.cn/s/a,b"')
    expect(artifacts.csv).toContain('"bad ""quote""|a,b"')
  })

  it('escapes markdown table separator in values', () => {
    const report = buildReport([
      {
        source_link: 'https://pan.quark.cn/s/a|b',
        status: 'partial',
        retries: 1,
        errors: ['bad|err'],
      },
    ])

    const artifacts = buildReportArtifacts(report)

    expect(artifacts.markdown).toContain('https://pan.quark.cn/s/a\\|b')
    expect(artifacts.markdown).toContain('bad\\|err')
  })

  it('replaces markdown newlines with html break', () => {
    const report = buildReport([
      {
        source_link: 'https://pan.quark.cn/s/a\nhttps://pan.baidu.com/s/b',
        status: 'partial',
        retries: 1,
        errors: ['line1\nline2'],
      },
    ])

    const artifacts = buildReportArtifacts(report)

    expect(artifacts.markdown).toContain('https://pan.quark.cn/s/a<br/>https://pan.baidu.com/s/b')
    expect(artifacts.markdown).toContain('line1<br/>line2')
  })

  it('normalizes CRLF markdown newlines with html break', () => {
    const report = buildReport([
      {
        source_link: 'https://pan.quark.cn/s/a\r\nhttps://pan.baidu.com/s/b',
        status: 'partial',
        retries: 1,
        errors: ['line1\r\nline2'],
      },
    ])

    const artifacts = buildReportArtifacts(report)

    expect(artifacts.markdown).toContain('https://pan.quark.cn/s/a<br/>https://pan.baidu.com/s/b')
    expect(artifacts.markdown).toContain('line1<br/>line2')
  })

  it('normalizes CRLF in csv export values', () => {
    const report = buildReport([
      {
        source_link: 'https://pan.quark.cn/s/a\r\nhttps://pan.baidu.com/s/b',
        status: 'partial',
        retries: 1,
        errors: ['line1\r\nline2'],
      },
    ])

    const artifacts = buildReportArtifacts(report)

    expect(artifacts.csv).toContain('"https://pan.quark.cn/s/a\nhttps://pan.baidu.com/s/b"')
    expect(artifacts.csv).toContain('"line1\nline2"')
    expect(artifacts.csv.includes('\r')).toBe(false)
  })
})
