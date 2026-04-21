# Checkout Button Loading State

> Status: ready
> Created: 2026-04-06
> Updated: 2026-04-06
> Feature Folder: `.sdd-slim/2026.04.06.checkout-button-loading-state/`
> Requirement Archive: `.sdd-slim/2026.04.06.checkout-button-loading-state/requirement.md`
> Plan File: `.sdd-slim/2026.04.06.checkout-button-loading-state/plan.md`
> Worklog File: `.sdd-slim/2026.04.06.checkout-button-loading-state/worklog.md`
> Project Test File: `.sdd-slim/_project/test.md`
> Requirement Availability: available
> Original Sources: pasted requirement text
> Canonical File: `.sdd-slim/2026.04.06.checkout-button-loading-state/spec.md`
> Dedup Notes: none

## 1. Requirement Summary

- 提交订单时，按钮要进入 loading 状态
- loading 期间不能重复点击
- 请求失败后恢复按钮状态并展示错误信息

## 2. Confirmed Scope

### In Scope

- 提交按钮 loading
- 提交期间禁用按钮
- 失败后恢复按钮并提示错误

### Out of Scope

- 修改接口协议
- 新增全局 loading 方案

## 3. Acceptance Criteria

- [ ] 点击提交后按钮立刻进入 loading 状态
- [ ] loading 期间重复点击不会再次提交
- [ ] 请求失败后按钮恢复可点击，并展示“提交失败，请稍后重试”

## 4. Verification Strategy

- Target Surface: web
- Required Harness: e2e
- Supporting Lanes: unit
- Project Regression:
  - Source File: `.sdd-slim/_project/test.md`
  - Run on Every Feature Close-out: yes
- Unit Harness:
  - Command: `pnpm test:unit -- checkout-submit`
  - Coverage Source: stdout + v8
  - Minimum Signal: 覆盖 submit handler 的 happy path、duplicate guard 与 error recovery；supporting lane 不替代 e2e gate
- E2E Harness:
  - Tooling: Playwright MCP 优先；checkout e2e 需要长期保留时落 repo 内 Playwright suite，项目命令仅用于 CI 或显式回归复跑
  - Critical Journeys: J1 提交后进入 loading；J2 loading 期间重复点击被拦截；J3 失败后按钮恢复并展示错误提示
  - Minimum Signal: 所有 critical journeys pass
- Report Requirements:
  - Unit Coverage: 即使作为 supporting lane 也要给出实际覆盖率，或写清 blocked / skipped 原因
  - E2E Success Rate: 必须写 passed journeys / total journeys
- Review-Owned Test Generation:
  - Source Section: `plan.md` -> `Test Design Handoff`
  - Expected Output: `src/pages/checkout/__tests__/submit-button.test.tsx` + `tests/checkout-submit.spec.ts`

## 5. Risks / Follow-ups

- 需要确认所有早返回和异常分支都能恢复 `isSubmitting`
