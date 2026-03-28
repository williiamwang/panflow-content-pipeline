import { saveItem } from './db'

export function checkpoint(sourceLink: string, newShareLink: string): void {
  saveItem({ source_link: sourceLink, new_share_link: newShareLink })
}
