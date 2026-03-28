import { parseInput } from '../ingest/parse-input'
import { runPipeline } from '../orchestrator/run'

export async function runPanflowCli(options: { input: string }) {
  const items = parseInput(options.input)
  return runPipeline(items)
}
