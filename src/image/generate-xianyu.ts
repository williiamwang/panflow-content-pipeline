export function generateXianyuImage(title: string): { platform: 'xianyu'; width: 1242; height: 1660; filename: string; title: string } {
  return {
    platform: 'xianyu',
    width: 1242,
    height: 1660,
    filename: 'xianyu-cover.png',
    title,
  }
}
