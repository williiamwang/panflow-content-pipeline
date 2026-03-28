---
name: panflow-report
description: Use when execution outcomes must be summarized with per-item status retry history and error reasons for batch operations.
---

# PanFlow Report

## Overview
输出执行报告，便于复盘与补跑。

## When to Use
- 批处理中有成功/失败混合结果
- 需要失败清单与重试记录

## Output
- done/partial/failed 统计
- 每条资源状态与错误原因
- 可用于断点续跑
