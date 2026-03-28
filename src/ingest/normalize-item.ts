import { ItemInput } from '../contracts/item'

export function normalizeItem(sourceLink: string, batchId: string): ItemInput {
  const link = sourceLink.trim()

  return {
    source_link: link,
    source_copy: null,
    source_platform: 'auto',
    tags: [],
    batch_id: batchId,
  }
}
