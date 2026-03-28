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
})
