import { TransferAdapter } from '../adapter'

export const quarkAdapter: TransferAdapter = {
  detect(link: string) {
    return link.includes('pan.quark.cn')
  },
  async fetchMeta() {
    return { title: 'quark-resource' }
  },
  async saveToNewAccount() {
    return { resourceId: 'quark-resource-id' }
  },
  async createShareLink() {
    return 'https://pan.quark.cn/s/new-share-link'
  },
}
