import { describe, expect, it } from 'vitest'
import { buildReport } from '../../src/report/report'

describe('buildReport', () => {
  it('builds summary with done partial failed and retry count', () => {
    const report = buildReport([
      { source_link: 'a', status: 'done', retries: 0, errors: [] },
      { source_link: 'b', status: 'partial', retries: 2, errors: ['FAILED_FILL'] },
      { source_link: 'c', status: 'failed', retries: 2, errors: ['FAILED_TRANSFER'] },
    ])

    expect(report.summary.done).toBe(1)
    expect(report.summary.partial).toBe(1)
    expect(report.summary.failed).toBe(1)
    expect(report.items[1].retries).toBe(2)
  })
})
