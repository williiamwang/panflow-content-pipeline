export type ReportRow = {
  source_link: string
  status: 'done' | 'partial' | 'failed'
  retries: number
  errors: string[]
}

export type ReportData = {
  summary: { done: number; partial: number; failed: number }
  items: ReportRow[]
}

export function buildReport(rows: ReportRow[]): ReportData {
  return {
    summary: {
      done: rows.filter((x) => x.status === 'done').length,
      partial: rows.filter((x) => x.status === 'partial').length,
      failed: rows.filter((x) => x.status === 'failed').length,
    },
    items: rows,
  }
}

function csvEscape(value: string | number): string {
  const text = String(value)
  const escaped = text.replaceAll('"', '""')
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped
}

export function buildReportArtifacts(report: ReportData): {
  json: string
  csv: string
  markdown: string
} {
  const json = JSON.stringify(report, null, 2)

  const csvHeader = 'source_link,status,retries,errors'
  const csvRows = report.items.map((item) => {
    const errors = item.errors.join('|')
    return [item.source_link, item.status, item.retries, errors].map(csvEscape).join(',')
  })
  const csv = [csvHeader, ...csvRows].join('\n')

  const markdownHeader = '| source_link | status | retries | errors |'
  const markdownSep = '| --- | --- | --- | --- |'
  const markdownRows = report.items.map(
    (item) => `| ${item.source_link} | ${item.status} | ${item.retries} | ${item.errors.join(',')} |`,
  )
  const markdown = [markdownHeader, markdownSep, ...markdownRows].join('\n')

  return { json, csv, markdown }
}
