import type { RuntimeDb } from './db'
import { saveItem } from './db'

export function checkpoint(runtimeDb: RuntimeDb, sourceLink: string, newShareLink: string): void {
  saveItem(runtimeDb, {
    source_link: sourceLink,
    new_share_link: newShareLink,
  })
}
