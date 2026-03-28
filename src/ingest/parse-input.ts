import { normalizeItem } from './normalize-item'
import { ItemInput } from '../contracts/item'

function makeBatchId(): string {
  return `batch-${Date.now()}`
}

export function parseInput(input: string): ItemInput[] {
  const trimmed = input.trim()
  const batchId = makeBatchId()

  if (trimmed.includes('\n')) {
    return trimmed
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => normalizeItem(line, batchId))
  }

  return [normalizeItem(trimmed, batchId)]
}
