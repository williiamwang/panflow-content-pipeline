type FillOptions = {
  platform: 'xiaohongshu' | 'wechat' | 'xianyu'
  title: string
  content: string
  images: string[]
}

export async function fillDraftWithPlaywright(_options: FillOptions): Promise<{ filled: true; manualPublishRequired: true }> {
  return {
    filled: true,
    manualPublishRequired: true,
  }
}

export function shouldStopBeforePublish(): true {
  return true
}
