export type WechatDraft = {
  title: string
  content: string
  images: string[]
}

export function buildWechatDraft(input: WechatDraft): WechatDraft {
  return input
}
