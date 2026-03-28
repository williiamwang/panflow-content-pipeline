import { normalizeItem } from './normalize-item'
import { ItemInput } from '../contracts/item'
import { existsSync, readFileSync } from 'node:fs'

function makeBatchId(): string {
  return `batch-${Date.now()}`
}

function parseLinesToItems(text: string, batchId: string): ItemInput[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => normalizeItem(line, batchId))
}

function parseCsvToItems(csvText: string, batchId: string): ItemInput[] {
  const lines = csvText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const dataLines = lines[0]?.toLowerCase() === 'source_link' ? lines.slice(1) : lines

  return dataLines.map((line) => normalizeItem(line, batchId))
}

export function parseInput(input: string): ItemInput[] {
  const trimmed = input.trim()
  const batchId = makeBatchId()

  if (trimmed.endsWith('.csv') && existsSync(trimmed)) {
    const csvText = readFileSync(trimmed, 'utf8')
    return parseCsvToItems(csvText, batchId)
  }

  if (trimmed.endsWith('.txt') && existsSync(trimmed)) {
    const text = readFileSync(trimmed, 'utf8')
    return parseLinesToItems(text, batchId)
  }

  if (trimmed.includes('\n')) {
    return parseLinesToItems(trimmed, batchId)
  }

  return [normalizeItem(trimmed, batchId)]
}
