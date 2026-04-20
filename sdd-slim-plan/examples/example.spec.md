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
- Project Regression:
  - Source File: `.sdd-slim/_project/test.md`
  - Run on Every Feature Close-out: yes
- Unit Harness:
  - Command: none required for this feature
  - Coverage Source: n/a
  - Minimum Signal: n/a；若仓库已有相关按钮单测，可作为补充信号记录，但不是本轮 release gate
- E2E Harness:
  - Tooling: agent-browser；若仓库已有 checkout e2e suite，可一并复用
  - Critical Journeys: J1 提交后进入 loading；J2 loading 期间重复点击被拦截；J3 失败后按钮恢复并展示错误提示
  - Minimum Signal: 所有 critical journeys pass
- Report Requirements:
  - Unit Coverage: 允许写 explicit n/a，因为 required harness 是 e2e
  - E2E Success Rate: 必须写 passed journeys / total journeys

## 5. Risks / Follow-ups

- 需要确认所有早返回和异常分支都能恢复 `isSubmitting`
