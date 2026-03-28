export type RewriteInput = {
  title: string
  oldCopy: string
  newLink: string
}

export const rewriteTemplates = {
  xiaohongshu: (input: RewriteInput) =>
    `【${input.title}】\n${input.oldCopy}\n新链接：${input.newLink}\n#学习资料 #效率提升`,
  wechat: (input: RewriteInput) =>
    `${input.title}\n\n内容简介：${input.oldCopy}\n\n下载链接：${input.newLink}`,
  xianyu: (input: RewriteInput) =>
    `${input.title}｜资料整理版\n亮点：${input.oldCopy}\n取用链接：${input.newLink}`,
}
