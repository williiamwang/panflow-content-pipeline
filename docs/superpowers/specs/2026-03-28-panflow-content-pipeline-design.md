---
title: PanFlow 内容分发自动化设计
date: 2026-03-28
status: draft-for-review
---

# PanFlow 内容分发自动化设计（开源优先）

## 1. 背景与目标
用户是自媒体从业者，核心平台为小红书、公众号、闲鱼。目标是将历史网盘资源（旧链接+旧文案）迁移到新网盘账号，并自动产出适配三平台的文案与配图，最终自动填充发布页，由用户手动点击发布。

## 2. 已确认约束
- 网盘迁移：
  - 夸克旧链接 → 夸克新账号
  - 百度旧链接 → 百度新账号
  - 需预留其他网盘扩展接口
- 输入方式：单条粘贴 / 多条粘贴 / Excel/CSV 批量导入
- 输出方式：方案 B（自动填充发布页，用户手动点发布）
- 配图策略：按平台分化
  - 小红书：重视觉
  - 公众号：信息图
  - 闲鱼：商品感
- 批处理规模：50–200 条
- 登录策略：混合
  - 网盘账号：持久化登录态
  - 发布平台：运行时登录
- 错误策略：失败自动重试 2 次后跳过
- 技术路线：开源优先
- 稳定性优先于“单文件/单技能”形式

## 3. 架构决策
采用“编排型总 skill + 同前缀子 skills”方案。

### 3.1 技能列表
- `panflow-orchestrator`：总入口，接收用户输入并串联全流程
- `panflow-ingest`：输入解析与标准化（单条/多条/表格）
- `panflow-transfer`：网盘识别、转存、生成新分享链接
- `panflow-rewrite`：三平台原创化改写（合规表达）
- `panflow-image`：三平台配图生成
- `panflow-fill`：发布页自动填充（不自动点击最终发布）
- `panflow-report`：结果汇总、失败清单、重试记录

### 3.2 命名规范
所有技能统一前缀：`panflow-`，便于检索、维护与版本演进。

## 4. 端到端流程
1. 用户仅提供链接（也可附带旧文案）
2. `panflow-orchestrator` 启动并调用 `panflow-ingest`
3. `panflow-ingest` 产出标准任务列表（标准 schema）
4. `panflow-transfer` 按平台适配器执行迁移并回写新链接
5. `panflow-rewrite` 生成三平台文案版本
6. `panflow-image` 生成三平台配图资产
7. `panflow-fill` 自动填充到各平台发布页面草稿
8. `panflow-report` 产出执行报告与发布清单

## 5. 关键设计

### 5.1 平台适配层（Adapter）
为每类网盘提供统一接口：
- `detect(link)`
- `fetchMeta(link)`
- `saveToNewAccount(resource)`
- `createShareLink(resource)`

初始实现：`quarkAdapter`、`baiduAdapter`。后续网盘新增仅需扩展 adapter，不影响上层流程。

### 5.2 状态机与可恢复执行
每条任务维护状态：
`INGESTED -> TRANSFERRED -> REWRITTEN -> IMAGED -> FILLED -> DONE`

失败状态：`FAILED_TRANSFER / FAILED_REWRITE / FAILED_IMAGE / FAILED_FILL`

能力要求：
- 支持断点续跑
- 已完成步骤不重复执行（幂等）
- 支持按失败节点局部重跑

### 5.3 幂等与去重
幂等键建议：`hash(source_link + normalized_title)`
- 防止重复转存
- 防止重复生成图文资产

### 5.4 错误处理与重试
- 默认重试策略：每失败步骤重试 2 次
- 超过重试上限：标记失败并继续下一条
- 统一错误码：
  - `LINK_INVALID`
  - `LOGIN_EXPIRED`
  - `PERMISSION_DENIED`
  - `PLATFORM_CHANGED`
  - `UNKNOWN`

### 5.5 文案策略（合规）
目标是“原创化改写与平台适配”，不是规避平台规则：
- 保留资源核心信息
- 重构标题、段落结构、表达方式
- 平台语气分化（小红书/公众号/闲鱼）
- 输出可追溯字段：改写模板ID、版本号

### 5.6 配图策略
- 小红书：封面视觉优先（强对比、核心卖点短句）
- 公众号：信息图优先（目录/要点结构）
- 闲鱼：商品感优先（资源清单+价值点）

## 6. 输入输出协议（草案）

### 6.1 标准输入 Item
```json
{
  "source_link": "string",
  "source_copy": "string|null",
  "source_platform": "auto|quark|baidu|other",
  "tags": ["string"],
  "batch_id": "string"
}
```

### 6.2 标准输出 Item
```json
{
  "source_link": "string",
  "new_share_link": "string|null",
  "copy": {
    "xiaohongshu": "string|null",
    "wechat": "string|null",
    "xianyu": "string|null"
  },
  "images": {
    "xiaohongshu": ["path"],
    "wechat": ["path"],
    "xianyu": ["path"]
  },
  "fill_result": {
    "xiaohongshu": "ok|failed|skipped",
    "wechat": "ok|failed|skipped",
    "xianyu": "ok|failed|skipped"
  },
  "status": "done|partial|failed",
  "errors": ["string"]
}
```

## 7. 目录结构
在 `E:/VibeCoding/Skills/panflow-content-pipeline/` 下：

```text
panflow-content-pipeline/
  docs/
    superpowers/
      specs/
        2026-03-28-panflow-content-pipeline-design.md
  skills/
    panflow-orchestrator/
      SKILL.md
    panflow-ingest/
      SKILL.md
    panflow-transfer/
      SKILL.md
    panflow-rewrite/
      SKILL.md
    panflow-image/
      SKILL.md
    panflow-fill/
      SKILL.md
    panflow-report/
      SKILL.md
  templates/
    copy/
    image/
  adapters/
    quark/
    baidu/
    _shared/
  runtime/
    state/
    logs/
    reports/
```

## 8. 开源借鉴方向（含可落地项目）

### 8.1 公众号排版与多平台分发（优先纳入）
1. `doocs/md`（GitHub）
   - 定位：微信 Markdown 编辑器（高星、成熟）
   - 用法：作为 `panflow-rewrite` 输出到公众号样式的主渲染器（Markdown -> 公众号可用 HTML）
   - 价值：降低手工排版成本，统一品牌样式

2. `Wechatsync/Wechatsync`（GitHub）
   - 定位：公众号内容同步到多平台的开源方案（含小红书等平台）
   - 用法：作为 `panflow-fill` 的流程参考（草稿优先、逐平台适配）
   - 价值：可复用其“多平台发布抽象”和“平台插件化”思想

3. `lyricat/wechat-format`（GitHub，已停止维护）
   - 定位：早期公众号 Markdown 排版工具
   - 用法：仅做样式策略参考，不作为核心依赖
   - 价值：可对比其样式转换规则，提炼兼容性测试用例

### 8.2 小红书与闲鱼方向（工程化借鉴）
1. 小红书
   - 优先采用“通用浏览器自动化 + 平台页面适配层”路线（Playwright/Puppeteer）
   - 结合 Wechatsync 的多平台发布抽象，避免把平台逻辑写死在编排层

2. 闲鱼
   - 当前公开生态里“稳定、长期维护”的专用发布开源项目较少
   - 采用 `panflow-fill` 的页面对象模型（POM）与选择器版本化机制，保障可维护性
   - 通过模板化商品图与结构化卖点卡片，优先提升“可填充质量”而非依赖单一第三方脚本

### 8.3 资源处理与运行时基础设施
- 浏览器自动化：Playwright / Puppeteer
- 表格处理：xlsx / csv-parse
- 图像处理：Sharp / ImageMagick
- 模板引擎：Handlebars / Nunjucks
- 轻量状态存储：JSONL + SQLite

### 8.4 与现有技能生态的结合（宝玉系可复用能力）
在本项目中可作为“可替换子能力”接入：
- `baoyu-markdown-to-html`：Markdown 转样式化 HTML（可用于公众号草稿渲染）
- `baoyu-format-markdown`：文案标准化与结构整理
- `baoyu-infographic` / `baoyu-xhs-images` / `baoyu-cover-image`：平台差异化配图
- `baoyu-post-to-wechat` / `baoyu-post-to-x`：发布动作模式参考（本项目仍保持“自动填充 + 手动发布”）

说明：借鉴工程模式与可复用组件，不引入不明来源或不合规自动化脚本；对“停止维护”项目仅做规则与测试样本参考，不作为核心依赖。

## 9. 验收标准（V1）
- 输入三种形态均可导入
- 夸克/百度各自成功迁移到对应新账号
- 50–200 条批处理可稳定跑完（允许部分失败）
- 失败项有完整原因与重试日志
- 三平台文案与配图均产出
- 三平台发布页可自动填充，最终发布由用户手动完成
- 支持断点续跑

## 10. 风险与边界
- 平台页面结构变化会影响自动填充，需要选择器更新
- 登录态过期会导致迁移或填充失败
- 链接失效与权限受限为外部不可控风险
- 自动化必须遵循平台规则与法律法规

## 11. 下一步
进入实现规划阶段：
1) 编写 `panflow-orchestrator` 与 `panflow-ingest` 规范
2) 定义 `adapter` 接口与 quark/baidu 最小实现
3) 定义 rewrite/image/fill 的模板与输入输出 contract
4) 制定批处理调度与恢复策略

## 12. 实现进度（更新）
- 已完成：
  - 基础工程脚手架（Node + TypeScript + Vitest + Zod）
  - 契约层：`item` schema 与 pipeline state 常量
  - ingest 最小实现与测试
  - transfer adapter 接口与 retry 最小实现与测试
  - `panflow-*` skills 文档首版
- 对应计划文件：
  - `docs/superpowers/plans/2026-03-28-panflow-content-pipeline-implementation.md`
- 当前测试结果：
  - `tests/contracts/item.test.ts` 通过
  - `tests/ingest/parse-input.test.ts` 通过
  - `tests/transfer/retry.test.ts` 通过
- 待完成：rewrite / image / fill / orchestrator / report / e2e
