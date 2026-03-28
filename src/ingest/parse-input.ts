import { normalizeItem } from './normalize-item'
import { ItemInput } from '../contracts/item'
import { existsSync, readFileSync } from 'node:fs'

function makeBatchId(): string {
  return `batch-${Date.now()}`
}

function stripListPrefix(line: string): string {
  return line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').replace(/^\d+\)\s+/, '')
}

function parseLinesToItems(text: string, batchId: string): ItemInput[] {
  return text
    .split(/\r\n|\n|\r/)
    .map((line) => line.trim())
    .filter((line) => Boolean(line) && !line.startsWith('#') && !line.startsWith('//') && !line.startsWith(';'))
    .map((line) => stripListPrefix(line))
    .map((line) => normalizeItem(line, batchId))
}

function parseCsvToItems(csvText: string, batchId: string): ItemInput[] {
  const lines = csvText
    .split(/\r\n|\n|\r/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\uFEFF/, ''))

  const firstColumn = (line: string): string => {
    const trimmedLine = line.trim()
    if (trimmedLine.startsWith('"')) {
      const match = trimmedLine.match(/^"((?:[^"]|"")*)"/)
      if (match) {
        return match[1].replaceAll('""', '"').trim()
      }
    }
    return trimmedLine.split(',')[0]?.trim() ?? ''
  }
  const dataLines = firstColumn(lines[0] ?? '').toLowerCase() === 'source_link' ? lines.slice(1) : lines
  const filteredDataLines = dataLines.filter(
    (line) => !line.startsWith('#') && !line.startsWith('//') && !line.startsWith(';'),
  )

  return filteredDataLines.map((line) => normalizeItem(firstColumn(line), batchId))
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

  if (/\r\n|\n|\r/.test(trimmed)) {
    return parseLinesToItems(trimmed, batchId)
  }

  return [normalizeItem(trimmed, batchId)]
}
