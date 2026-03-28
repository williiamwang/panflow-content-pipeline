import { parseInput } from '../ingest/parse-input'
import { runPipeline } from '../orchestrator/run'

export async function runPanflowCli(options: { input: string; dryRun?: boolean }) {
  const items = parseInput(options.input)
  const result = await runPipeline(items)

  if (!options.dryRun) {
    return result
  }

  return result.map((item) => ({
    ...item,
    fill_result: {
      xiaohongshu: 'skipped' as const,
      wechat: 'skipped' as const,
      xianyu: 'skipped' as const,
    },
  }))
}
