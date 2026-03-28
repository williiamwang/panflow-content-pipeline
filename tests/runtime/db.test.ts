import { describe, expect, it } from 'vitest'
import { createRuntimeDb, getBySourceLink, saveItem } from '../../src/runtime/db'

describe('runtime db', () => {
  it('persists and reads items from sqlite', async () => {
    const db = await createRuntimeDb(':memory:')

    saveItem(db, {
      source_link: 'https://pan.quark.cn/s/abc',
      new_share_link: 'https://pan.quark.cn/s/new',
    })

    const found = getBySourceLink(db, 'https://pan.quark.cn/s/abc')
    expect(found?.new_share_link).toBe('https://pan.quark.cn/s/new')
  })
})
