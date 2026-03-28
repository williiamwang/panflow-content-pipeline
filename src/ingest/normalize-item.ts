import { ItemInput } from '../contracts/item'

export function normalizeItem(sourceLink: string, batchId: string): ItemInput {
  const link = sourceLink.trim()
  const isTableImport = link.endsWith('.csv') || link.endsWith('.xlsx')

  return {
    source_link: link,
    source_copy: null,
    source_platform: isTableImport ? 'other' : 'auto',
    tags: [],
    batch_id: batchId,
  }
}
