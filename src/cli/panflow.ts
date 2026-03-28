import { parseInput } from '../ingest/parse-input'
import { runPipeline } from '../orchestrator/run'
import { buildReport, buildReportArtifacts } from '../report/report'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export async function runPanflowCli(options: {
  input: string
  inputFile?: string
  reportDir?: string
  dryRun?: boolean
}) {
  const rawInput = options.inputFile ?? options.input
  const items = parseInput(rawInput)
  const result = await runPipeline(items)

  const finalResult = options.dryRun
    ? result.map((item) => ({
        ...item,
        fill_result: {
          xiaohongshu: 'skipped' as const,
          wechat: 'skipped' as const,
          xianyu: 'skipped' as const,
        },
      }))
    : result

  if (options.reportDir) {
    const rows = finalResult.map((item) => ({
      source_link: item.source_link,
      status: item.status,
      retries: 0,
      errors: item.errors,
    }))
    const report = buildReport(rows)
    const artifacts = buildReportArtifacts(report)

    mkdirSync(options.reportDir, { recursive: true })
    writeFileSync(join(options.reportDir, 'report.json'), artifacts.json, 'utf8')
    writeFileSync(join(options.reportDir, 'report.csv'), artifacts.csv, 'utf8')
    writeFileSync(join(options.reportDir, 'report.md'), artifacts.markdown, 'utf8')
  }

  return finalResult
}
