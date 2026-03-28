export function generateXhsImage(title: string): { platform: 'xiaohongshu'; width: 1080; height: 1440; filename: string; title: string } {
  return {
    platform: 'xiaohongshu',
    width: 1080,
    height: 1440,
    filename: 'xhs-cover.png',
    title,
  }
}
