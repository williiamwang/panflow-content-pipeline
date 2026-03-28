export interface TransferAdapter {
  detect(link: string): boolean
  fetchMeta(link: string): Promise<{ title: string }>
  saveToNewAccount(resource: { link: string; title: string }): Promise<{ resourceId: string }>
  createShareLink(resource: { resourceId: string }): Promise<string>
}
