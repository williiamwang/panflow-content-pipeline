import { buildWechatDraft } from './pages/wechat-page'
import { buildXhsDraft } from './pages/xhs-page'
import { buildXianyuDraft } from './pages/xianyu-page'

type DraftInput = {
  title: string
  copy: {
    xiaohongshu: string
    wechat: string
    xianyu: string
  }
  images: {
    xiaohongshu: string[]
    wechat: string[]
    xianyu: string[]
  }
}

export function buildDraftPayload(input: DraftInput): {
  manualPublishRequired: true
  payload: {
    xiaohongshu: { title: string; content: string; images: string[] }
    wechat: { title: string; content: string; images: string[] }
    xianyu: { title: string; content: string; images: string[] }
  }
} {
  return {
    manualPublishRequired: true,
    payload: {
      xiaohongshu: buildXhsDraft({
        title: input.title,
        content: input.copy.xiaohongshu,
        images: input.images.xiaohongshu,
      }),
      wechat: buildWechatDraft({
        title: input.title,
        content: input.copy.wechat,
        images: input.images.wechat,
      }),
      xianyu: buildXianyuDraft({
        title: input.title,
        content: input.copy.xianyu,
        images: input.images.xianyu,
      }),
    },
  }
}
