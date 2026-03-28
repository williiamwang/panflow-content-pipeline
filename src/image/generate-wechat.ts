export function generateWechatImage(title: string): { platform: 'wechat'; width: 900; height: 500; filename: string; title: string } {
  return {
    platform: 'wechat',
    width: 900,
    height: 500,
    filename: 'wechat-cover.png',
    title,
  }
}
