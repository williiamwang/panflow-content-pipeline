import { rewriteTemplates, type RewriteInput } from './templates'

export function rewriteForPlatforms(input: RewriteInput): {
  xiaohongshu: string
  wechat: string
  xianyu: string
} {
  return {
    xiaohongshu: rewriteTemplates.xiaohongshu(input),
    wechat: rewriteTemplates.wechat(input),
    xianyu: rewriteTemplates.xianyu(input),
  }
}
