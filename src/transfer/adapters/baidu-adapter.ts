import { TransferAdapter } from '../adapter'

export const baiduAdapter: TransferAdapter = {
  detect(link: string) {
    return link.includes('pan.baidu.com')
  },
  async fetchMeta() {
    return { title: 'baidu-resource' }
  },
  async saveToNewAccount() {
    return { resourceId: 'baidu-resource-id' }
  },
  async createShareLink() {
    return 'https://pan.baidu.com/s/new-share-link'
  },
}
