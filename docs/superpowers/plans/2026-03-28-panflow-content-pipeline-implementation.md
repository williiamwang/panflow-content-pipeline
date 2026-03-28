# PanFlow Content Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a stable, open-source-first `panflow-*` skill system that takes old pan links/copy, migrates to new accounts, generates platform-specific copy/images, and auto-fills publish forms (manual final publish).

**Architecture:** Use a modular pipeline with one orchestrator skill and multiple `panflow-*` sub-skills, backed by a local Node.js runtime. Core logic is adapter-based (quark/baidu first), state-machine driven, resumable, and idempotent. Browser automation is isolated in page-object modules to reduce breakage.

**Tech Stack:** Node.js + TypeScript, Playwright, Zod, SQLite (better-sqlite3), Sharp, xlsx/csv-parse, markdown templating, Claude skills (`SKILL.md`).

---

## File Structure Lock-In

### Create
- `E:/VibeCoding/Skills/panflow-content-pipeline/package.json`
- `E:/VibeCoding/Skills/panflow-content-pipeline/tsconfig.json`
- `E:/VibeCoding/Skills/panflow-content-pipeline/.gitignore`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/contracts/item.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/contracts/state.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/ingest/parse-input.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/ingest/normalize-item.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/transfer/adapter.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/transfer/adapters/quark-adapter.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/transfer/adapters/baidu-adapter.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/transfer/retry.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/rewrite/templates.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/rewrite/rewrite.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/image/generate-xhs.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/image/generate-wechat.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/image/generate-xianyu.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/fill/pages/xhs-page.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/fill/pages/wechat-page.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/fill/pages/xianyu-page.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/fill/fill.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/orchestrator/run.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/runtime/db.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/runtime/checkpoint.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/src/report/report.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/skills/panflow-orchestrator/SKILL.md`
- `E:/VibeCoding/Skills/panflow-content-pipeline/skills/panflow-ingest/SKILL.md`
- `E:/VibeCoding/Skills/panflow-content-pipeline/skills/panflow-transfer/SKILL.md`
- `E:/VibeCoding/Skills/panflow-content-pipeline/skills/panflow-rewrite/SKILL.md`
- `E:/VibeCoding/Skills/panflow-content-pipeline/skills/panflow-image/SKILL.md`
- `E:/VibeCoding/Skills/panflow-content-pipeline/skills/panflow-fill/SKILL.md`
- `E:/VibeCoding/Skills/panflow-content-pipeline/skills/panflow-report/SKILL.md`
- `E:/VibeCoding/Skills/panflow-content-pipeline/tests/contracts/item.test.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/tests/ingest/parse-input.test.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/tests/transfer/retry.test.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/tests/rewrite/rewrite.test.ts`
- `E:/VibeCoding/Skills/panflow-content-pipeline/tests/orchestrator/run.test.ts`

### Modify
- `E:/VibeCoding/Skills/panflow-content-pipeline/docs/superpowers/specs/2026-03-28-panflow-content-pipeline-design.md` (mark reviewed + link plan)

---

### Task 1: Bootstrap runtime workspace

**Files:**
- Create: `package.json`, `tsconfig.json`, `.gitignore`

- [ ] **Step 1: Write failing bootstrap check**
Create `tests/contracts/item.test.ts` with a minimal import that should fail before setup.

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test -- tests/contracts/item.test.ts`
Expected: FAIL (module/toolchain missing)

- [ ] **Step 3: Add minimal Node/TS test toolchain**
Add scripts and dependencies for `vitest`, `typescript`, `ts-node`.

- [ ] **Step 4: Run test to verify runner boots**
Run: `npm test -- tests/contracts/item.test.ts`
Expected: PASS/EMPTY (runner starts successfully)

- [ ] **Step 5: Commit**
Commit message: `chore: bootstrap panflow runtime`

### Task 2: Define contracts and state machine

**Files:**
- Create: `src/contracts/item.ts`, `src/contracts/state.ts`
- Test: `tests/contracts/item.test.ts`

- [ ] **Step 1: Write failing contract tests**
Add tests for input/output schema fields and allowed statuses.

- [ ] **Step 2: Run tests to verify fail**
Run: `npm test -- tests/contracts/item.test.ts`
Expected: FAIL (contracts not implemented)

- [ ] **Step 3: Implement minimal Zod schemas + status enums**
Include `INGESTED -> TRANSFERRED -> REWRITTEN -> IMAGED -> FILLED -> DONE` and failure statuses.

- [ ] **Step 4: Run tests to verify pass**
Run: `npm test -- tests/contracts/item.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Commit message: `feat: add item contracts and state machine`

### Task 3: Implement ingest for single/multi/table input

**Files:**
- Create: `src/ingest/parse-input.ts`, `src/ingest/normalize-item.ts`
- Test: `tests/ingest/parse-input.test.ts`

- [ ] **Step 1: Write failing tests for 3 input modes**
Cover single text, multi-line text, CSV/XLSX paths.

- [ ] **Step 2: Run tests to verify fail**
Run: `npm test -- tests/ingest/parse-input.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement parser + normalization**
Return standardized item list with `batch_id` and normalized platform hints.

- [ ] **Step 4: Run tests to verify pass**
Run: `npm test -- tests/ingest/parse-input.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Commit message: `feat: support single multi and table ingestion`

### Task 4: Implement transfer adapter interface + retry policy

**Files:**
- Create: `src/transfer/adapter.ts`, `src/transfer/adapters/quark-adapter.ts`, `src/transfer/adapters/baidu-adapter.ts`, `src/transfer/retry.ts`
- Test: `tests/transfer/retry.test.ts`

- [ ] **Step 1: Write failing retry tests**
Test “fail twice then skip” and “success before max retry”.

- [ ] **Step 2: Run tests to verify fail**
Run: `npm test -- tests/transfer/retry.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement adapter interface + retry wrapper**
Add abstract adapter API and retry limit `2` as default.

- [ ] **Step 4: Run tests to verify pass**
Run: `npm test -- tests/transfer/retry.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Commit message: `feat: add transfer adapters and retry policy`

### Task 5: Implement compliant rewrite module

**Files:**
- Create: `src/rewrite/templates.ts`, `src/rewrite/rewrite.ts`
- Test: `tests/rewrite/rewrite.test.ts`

- [ ] **Step 1: Write failing rewrite tests**
Validate three outputs (`xiaohongshu`, `wechat`, `xianyu`) exist and preserve key resource facts.

- [ ] **Step 2: Run tests to verify fail**
Run: `npm test -- tests/rewrite/rewrite.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement template-driven rewrite**
Implement style-specific generation with compliance note hooks.

- [ ] **Step 4: Run tests to verify pass**
Run: `npm test -- tests/rewrite/rewrite.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Commit message: `feat: add platform-specific rewrite pipeline`

### Task 6: Implement platform image generation modules

**Files:**
- Create: `src/image/generate-xhs.ts`, `src/image/generate-wechat.ts`, `src/image/generate-xianyu.ts`

- [ ] **Step 1: Write failing image smoke tests**
Add basic tests for output file creation and expected dimensions per platform.

- [ ] **Step 2: Run tests to verify fail**
Run: `npm test -- tests/image`
Expected: FAIL

- [ ] **Step 3: Implement minimal Sharp-based generators**
Generate deterministic placeholder assets using item metadata.

- [ ] **Step 4: Run tests to verify pass**
Run: `npm test -- tests/image`
Expected: PASS

- [ ] **Step 5: Commit**
Commit message: `feat: add xhs wechat xianyu image generators`

### Task 7: Implement publish-form auto-fill (manual final publish)

**Files:**
- Create: `src/fill/pages/xhs-page.ts`, `src/fill/pages/wechat-page.ts`, `src/fill/pages/xianyu-page.ts`, `src/fill/fill.ts`

- [ ] **Step 1: Write failing Playwright contract tests**
Stub page-object methods: open draft, fill title/content, attach images, stop before publish click.

- [ ] **Step 2: Run tests to verify fail**
Run: `npm test -- tests/fill`
Expected: FAIL

- [ ] **Step 3: Implement page objects + fill orchestrator**
Ensure final publish button is never clicked.

- [ ] **Step 4: Run tests to verify pass**
Run: `npm test -- tests/fill`
Expected: PASS

- [ ] **Step 5: Commit**
Commit message: `feat: add safe auto-fill for publish forms`

### Task 8: Implement orchestrator + checkpoint resume

**Files:**
- Create: `src/runtime/db.ts`, `src/runtime/checkpoint.ts`, `src/orchestrator/run.ts`
- Test: `tests/orchestrator/run.test.ts`

- [ ] **Step 1: Write failing orchestration tests**
Test pipeline order, status transitions, resume from partial failure, idempotent re-run.

- [ ] **Step 2: Run tests to verify fail**
Run: `npm test -- tests/orchestrator/run.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement state persistence and runner**
Persist per-item step results and errors in SQLite + JSONL report trail.

- [ ] **Step 4: Run tests to verify pass**
Run: `npm test -- tests/orchestrator/run.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Commit message: `feat: add resumable orchestrator runtime`

### Task 9: Implement report output

**Files:**
- Create: `src/report/report.ts`

- [ ] **Step 1: Write failing report tests**
Require per-item summary, failure reason, retry count, fill status.

- [ ] **Step 2: Run tests to verify fail**
Run: `npm test -- tests/report`
Expected: FAIL

- [ ] **Step 3: Implement report generation**
Export JSON + CSV + markdown summary.

- [ ] **Step 4: Run tests to verify pass**
Run: `npm test -- tests/report`
Expected: PASS

- [ ] **Step 5: Commit**
Commit message: `feat: add execution report outputs`

### Task 10: Write `panflow-*` skills and chain contracts

**Files:**
- Create: all `skills/panflow-*/SKILL.md`
- Modify: spec file with plan link

- [ ] **Step 1: Write failing skill acceptance scenarios**
Create scenario checklist: “user only provides one link”, “batch input”, “partial failure resume”, “manual publish gate”.

- [ ] **Step 2: Run baseline behavior without skills**
Record failures/rationalizations for each scenario.

- [ ] **Step 3: Write minimal skills with explicit triggers**
Each skill frontmatter: `name`, `description` (`Use when...`). Keep chain deterministic.

- [ ] **Step 4: Re-run scenarios and verify pass**
Verify orchestrator calls sub-skills in correct order and honors constraints.

- [ ] **Step 5: Commit**
Commit message: `feat: add panflow skill suite and workflow chaining`

### Task 11: End-to-end dry run with 20-sample batch

**Files:**
- Create: `runtime/reports/e2e-sample-report.md` (generated artifact)

- [ ] **Step 1: Prepare sample dataset with mixed outcomes**
Include valid links, invalid links, and missing copy cases.

- [ ] **Step 2: Run full pipeline**
Run: `npm run panflow -- --input ./samples/sample-20.csv`
Expected: completes with partial-success tolerance.

- [ ] **Step 3: Verify acceptance criteria**
Check: retry behavior, resume ability, per-platform outputs, no auto-publish click.

- [ ] **Step 4: Generate final report**
Ensure done/partial/failed counts and error codes are complete.

- [ ] **Step 5: Commit**
Commit message: `test: add e2e dry run evidence for panflow v1`

---

## Parallel Execution Strategy (as requested)

Use **subagent-driven execution in parallel** where dependencies allow:
- Lane A: contracts + ingest
- Lane B: transfer + retry
- Lane C: rewrite + image
- Lane D: fill page objects
- Lane E: skills docs

Merge gates:
1. Contracts gate before orchestrator
2. Orchestrator gate before E2E
3. E2E gate before completion claim

---

## Test Commands (final verification)

- `npm test`
- `npm run lint`
- `npm run panflow -- --input ./samples/sample-20.csv --dry-run`

Expected:
- Tests pass
- Lint passes
- Dry-run report generated with success/partial/failed breakdown and retry history

---

## Documentation Updates

- Add “implementation status” section to:
  - `E:/VibeCoding/Skills/panflow-content-pipeline/docs/superpowers/specs/2026-03-28-panflow-content-pipeline-design.md`
- Add usage guide:
  - `E:/VibeCoding/Skills/panflow-content-pipeline/docs/README.md`
