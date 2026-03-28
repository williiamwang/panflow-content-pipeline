import type { ItemInput, ItemOutput } from '../contracts/item'
import { quarkAdapter } from '../transfer/adapters/quark-adapter'
import { baiduAdapter } from '../transfer/adapters/baidu-adapter'
import { withRetry } from '../transfer/retry'
import { rewriteForPlatforms } from '../rewrite/rewrite'
import { generateXhsImage } from '../image/generate-xhs'
import { generateWechatImage } from '../image/generate-wechat'
import { generateXianyuImage } from '../image/generate-xianyu'
import { buildDraftPayload } from '../fill/fill'
import { getBySourceLink, getRuntimeDb } from '../runtime/db'
import { checkpoint } from '../runtime/checkpoint'

function pickAdapter(link: string) {
  if (quarkAdapter.detect(link)) return quarkAdapter
  if (baiduAdapter.detect(link)) return baiduAdapter
  return quarkAdapter
}

export async function runPipeline(items: ItemInput[]): Promise<ItemOutput[]> {
  const out: ItemOutput[] = []
  const runtimeDb = await getRuntimeDb(':memory:')

  for (const item of items) {
    const cached = getBySourceLink(runtimeDb, item.source_link)

    let newShareLink = cached?.new_share_link

    if (!newShareLink) {
      const adapter = pickAdapter(item.source_link)
      const meta = await adapter.fetchMeta(item.source_link)
      const saved = await withRetry(
        async () => adapter.saveToNewAccount({ link: item.source_link, title: meta.title }),
        2,
      )
      newShareLink = await adapter.createShareLink({ resourceId: saved.resourceId })
      checkpoint(runtimeDb, item.source_link, newShareLink)
    }

    const title = item.source_copy ?? '资源合集'

    const rewritten = rewriteForPlatforms({
      title,
      oldCopy: item.source_copy ?? '自动整理内容',
      newLink: newShareLink,
    })

    const images = {
      xiaohongshu: [generateXhsImage(title).filename],
      wechat: [generateWechatImage(title).filename],
      xianyu: [generateXianyuImage(title).filename],
    }

    buildDraftPayload({
      title,
      copy: rewritten,
      images,
    })

    out.push({
      source_link: item.source_link,
      new_share_link: newShareLink,
      copy: rewritten,
      images,
      fill_result: {
        xiaohongshu: 'ok',
        wechat: 'ok',
        xianyu: 'ok',
      },
      status: 'done',
      errors: [],
    })
  }

  return out
}
