---
name: panflow-orchestrator
description: Use when the user provides one or more old pan links and wants the full panflow pipeline executed end-to-end with stable retries and manual final publish.
---

# PanFlow Orchestrator

## Overview
统一编排 panflow 全链路：ingest -> transfer -> rewrite -> image -> fill -> report。

## When to Use
- 用户只想给链接并自动跑完整流程
- 需要批处理（单条/多条/表格）
- 需要失败重试与汇总报告

## Execution Contract
1. 先标准化输入
2. 按链接平台选择 transfer adapter
3. 生成三平台文案与配图
4. 自动填充发布页，停在手动发布前
5. 输出报告与失败清单
