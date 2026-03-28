export type ItemInput = {
  source_link: string
  source_copy: string | null
  source_platform: 'auto' | 'quark' | 'baidu' | 'other'
  tags: string[]
  batch_id: string
}

export type ItemOutput = {
  source_link: string
  new_share_link: string | null
  copy: {
    xiaohongshu: string | null
    wechat: string | null
    xianyu: string | null
  }
  images: {
    xiaohongshu: string[]
    wechat: string[]
    xianyu: string[]
  }
  fill_result: {
    xiaohongshu: 'ok' | 'failed' | 'skipped'
    wechat: 'ok' | 'failed' | 'skipped'
    xianyu: 'ok' | 'failed' | 'skipped'
  }
  status: 'done' | 'partial' | 'failed'
  errors: string[]
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message)
}

export const ItemInputSchema = {
  parse(value: ItemInput): ItemInput {
    assert(typeof value.source_link === 'string' && value.source_link.length > 0, 'source_link invalid')
    assert(value.source_copy === null || typeof value.source_copy === 'string', 'source_copy invalid')
    assert(['auto', 'quark', 'baidu', 'other'].includes(value.source_platform), 'source_platform invalid')
    assert(Array.isArray(value.tags), 'tags invalid')
    assert(typeof value.batch_id === 'string' && value.batch_id.length > 0, 'batch_id invalid')
    return value
  },
}

export const ItemOutputSchema = {
  parse(value: ItemOutput): ItemOutput {
    assert(typeof value.source_link === 'string' && value.source_link.length > 0, 'source_link invalid')
    assert(value.new_share_link === null || typeof value.new_share_link === 'string', 'new_share_link invalid')
    assert(['done', 'partial', 'failed'].includes(value.status), 'status invalid')
    assert(Array.isArray(value.errors), 'errors invalid')
    return value
  },
}
