type StoreItem = {
  source_link: string
  new_share_link: string
}

const store = new Map<string, StoreItem>()

export function getBySourceLink(sourceLink: string): StoreItem | undefined {
  return store.get(sourceLink)
}

export function saveItem(item: StoreItem): void {
  store.set(item.source_link, item)
}
