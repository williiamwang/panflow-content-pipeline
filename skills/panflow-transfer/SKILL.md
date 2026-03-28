---
name: panflow-transfer
description: Use when old pan links must be transferred to new accounts with adapter-based platform routing and bounded retries.
---

# PanFlow Transfer

## Overview
识别网盘平台并执行转存，生成新分享链接。

## When to Use
- 夸克旧链需要迁移到夸克新账号
- 百度旧链需要迁移到百度新账号
- 需要保留后续平台扩展能力

## Rules
- 适配器接口统一
- 失败最多重试 2 次后跳过
- 记录错误码与失败原因
