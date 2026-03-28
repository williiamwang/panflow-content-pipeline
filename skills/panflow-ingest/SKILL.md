---
name: panflow-ingest
description: Use when input arrives as single text, multi-line text, or table file and must be normalized into standard panflow items.
---

# PanFlow Ingest

## Overview
解析输入并转换为标准 item 列表。

## When to Use
- 用户贴 1 条链接
- 用户一次贴多条链接
- 用户提供 CSV/XLSX 批量文件

## Output
- 标准字段：source_link/source_copy/source_platform/tags/batch_id
- 交给 transfer 阶段继续处理
