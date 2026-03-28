import { z } from 'zod'

export const ItemInputSchema = z.object({
  source_link: z.string().min(1),
  source_copy: z.string().nullable(),
  source_platform: z.enum(['auto', 'quark', 'baidu', 'other']),
  tags: z.array(z.string()),
  batch_id: z.string().min(1),
})

export const ItemOutputSchema = z.object({
  source_link: z.string().min(1),
  new_share_link: z.string().nullable(),
  copy: z.object({
    xiaohongshu: z.string().nullable(),
    wechat: z.string().nullable(),
    xianyu: z.string().nullable(),
  }),
  images: z.object({
    xiaohongshu: z.array(z.string()),
    wechat: z.array(z.string()),
    xianyu: z.array(z.string()),
  }),
  fill_result: z.object({
    xiaohongshu: z.enum(['ok', 'failed', 'skipped']),
    wechat: z.enum(['ok', 'failed', 'skipped']),
    xianyu: z.enum(['ok', 'failed', 'skipped']),
  }),
  status: z.enum(['done', 'partial', 'failed']),
  errors: z.array(z.string()),
})

export type ItemInput = z.infer<typeof ItemInputSchema>
export type ItemOutput = z.infer<typeof ItemOutputSchema>
