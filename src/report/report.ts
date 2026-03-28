type ReportRow = {
  source_link: string
  status: 'done' | 'partial' | 'failed'
  retries: number
  errors: string[]
}

export function buildReport(rows: ReportRow[]): {
  summary: { done: number; partial: number; failed: number }
  items: ReportRow[]
} {
  return {
    summary: {
      done: rows.filter((x) => x.status === 'done').length,
      partial: rows.filter((x) => x.status === 'partial').length,
      failed: rows.filter((x) => x.status === 'failed').length,
    },
    items: rows,
  }
}
