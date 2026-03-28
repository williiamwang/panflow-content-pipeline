import { describe, expect, it } from 'vitest'
import { runPanflowCli } from '../../src/cli/panflow'
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

describe('panflow cli', () => {
  it('accepts single input and returns one result', async () => {
    const out = await runPanflowCli({ input: 'https://pan.quark.cn/s/old3' })
    expect(out.length).toBe(1)
    expect(out[0].status).toBe('done')
  })

  it('supports dry-run mode and marks fill as skipped', async () => {
    const out = await runPanflowCli({ input: 'https://pan.quark.cn/s/old4', dryRun: true })
    expect(out[0].fill_result.xiaohongshu).toBe('skipped')
    expect(out[0].fill_result.wechat).toBe('skipped')
    expect(out[0].fill_result.xianyu).toBe('skipped')
  })

  it('reads csv from inputFile and writes report artifacts to reportDir', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'panflow-cli-'))
    const inputFile = join(dir, 'input.csv')
    const reportDir = join(dir, 'reports')

    writeFileSync(inputFile, 'source_link\nhttps://pan.quark.cn/s/one\nhttps://pan.baidu.com/s/two\n', 'utf8')

    const out = await runPanflowCli({ input: '', inputFile, reportDir })

    expect(out).toHaveLength(2)
    expect(existsSync(join(reportDir, 'report.json'))).toBe(true)
    expect(existsSync(join(reportDir, 'report.csv'))).toBe(true)
    expect(existsSync(join(reportDir, 'report.md'))).toBe(true)
  })
})
