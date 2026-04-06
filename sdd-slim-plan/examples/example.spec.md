# Checkout Button Loading State

> Status: ready
> Created: 2026-04-06
> Updated: 2026-04-06
> Source: pasted requirement summary
> Canonical File: `.sdd-slim/checkout-button-loading-state.spec.md`

## 1. Requirement Summary

- 提交订单时，按钮要进入 loading 状态
- loading 期间不能重复点击
- 请求失败后恢复按钮状态并展示错误信息

## 2. Requirement Breakdown

| ID | Type | Title | Current Understanding | Source | Status |
| --- | --- | --- | --- | --- | --- |
| P1 | requirement | 提交中显示 loading | 点击提交后按钮进入 loading，直到请求结束 | 需求正文第 1 条 | confirmed |
| P2 | requirement | 阻止重复提交 | loading 期间再次点击无效 | 需求正文第 2 条 | confirmed |
| Q1 | clarification | 错误提示文案 | 失败时展示固定 toast 文案 | 需求正文第 3 条 | resolved |

## 3. Clarification Log

### Q1 错误提示文案

- Current understanding: 失败时展示通用错误提示
- Why clarification is needed: 文案会影响验收标准和回归验证
- User answer: 使用“提交失败，请稍后重试”
- Final resolution: 固定 toast 文案为“提交失败，请稍后重试”
- Status: resolved

## 4. Point Confirmation Log

### P1 提交中显示 loading

- User-facing summary used in askquestion: 点击提交后按钮立即进入 loading，请求结束后恢复
- Current understanding presented to user: checkout 提交动作需要一个覆盖成功与失败分支的 loading 生命周期
- Code basis presented to user: `src/pages/checkout/index.tsx` 已有异步提交入口，`src/components/SubmitButton.tsx` 可承接按钮态 props
- Proposed HOW presented to user: 复用 `isSubmitting` 状态并把 loading / disabled 透传到按钮组件
- Candidate tasks presented to user: T1 页面状态接线；T2 按钮组件接收 loading / disabled
- Suggested validation presented to user: 提交流程回归 + 失败路径回归 + 类型检查
- User answer: 确认
- Final confirmed interpretation: loading 从点击开始，到成功或失败结束
- Status: confirmed

### P2 阻止重复提交

- User-facing summary used in askquestion: loading 期间再次点击不应发起第二次请求
- Current understanding presented to user: 防重提需要在 handler 和按钮禁用态两层同时成立
- Code basis presented to user: `src/pages/checkout/index.tsx` 的 submit handler 是唯一提交入口
- Proposed HOW presented to user: 在 handler 顶部增加 guard，并复用 loading 态禁用按钮
- Candidate tasks presented to user: T3 提交 guard 与错误恢复
- Suggested validation presented to user: 人工快速重复点击验证 + 失败后重试验证
- User answer: 确认
- Final confirmed interpretation: 需要在 handler 层和按钮态层同时防重入
- Status: confirmed

## 5. Research Findings

### P1 提交中显示 loading

- Entry files: `src/pages/checkout/index.tsx`, `src/components/SubmitButton.tsx`
- Related modules: checkout page state, submit button component
- Reusable patterns: 现有保存表单流程已使用 `isSubmitting` 状态
- Proposed execution approach: 复用 `isSubmitting` 布尔状态，提交前置 true，请求结束统一恢复 false
- Candidate tasks: T1 页面状态接线；T2 按钮组件接收 disabled/loading
- Suggested validations: 页面提交流程回归；类型检查
- Risks: 请求异常分支可能遗漏恢复状态
- Feasibility: high
- Questions requiring user input: none

### P2 阻止重复提交

- Entry files: `src/pages/checkout/index.tsx`
- Related modules: submit handler
- Reusable patterns: 表单保存页已有重复点击 guard
- Proposed execution approach: 在 handler 开头增加 `if (isSubmitting) return`
- Candidate tasks: T3 提交 guard
- Suggested validations: 重复点击不会触发第二次请求
- Risks: 需要确认所有失败分支都能恢复状态
- Feasibility: high
- Questions requiring user input: none

## 6. Pending User Input

- none

## 7. Confirmed Scope

### In Scope

- 提交按钮 loading
- 提交期间禁用按钮
- 失败后恢复按钮并提示错误

### Out of Scope

- 修改接口协议
- 新增全局 loading 方案

## 8. Acceptance Criteria

- [ ] 点击提交后按钮立刻进入 loading 状态
- [ ] loading 期间重复点击不会再次提交
- [ ] 请求失败后按钮恢复可点击，并展示“提交失败，请稍后重试”

## 9. Task Checklist

- [ ] T1: 给 checkout 页面增加 `isSubmitting` 状态流转
  - Source: P1
  - Files: `src/pages/checkout/index.tsx`
  - How: 复用现有异步提交状态模式，在请求前后维护布尔状态
  - Acceptance: 提交前后状态切换正确
  - Validation: 手动回归提交流程

- [ ] T2: 让提交按钮接收 loading / disabled 状态
  - Source: P1
  - Files: `src/components/SubmitButton.tsx`
  - How: 沿用现有按钮 props 模式暴露 `loading` 与 `disabled`
  - Acceptance: loading 中显示禁用态
  - Validation: 组件页面联调

- [ ] T3: 在提交 handler 中增加重复点击 guard 与错误恢复
  - Source: P2
  - Files: `src/pages/checkout/index.tsx`
  - How: 在 handler 顶部短路，异常分支统一恢复状态并弹 toast
  - Acceptance: 重复点击无第二次请求，失败后可再次点击
  - Validation: 人工触发失败路径验证

## 10. Execution Notes

- Reserved for `sdd-slim-implement`

## 11. Review Findings

- Reserved for `sdd-slim-review`

## 12. Fix Notes

- Reserved for `sdd-slim-fix`

## 13. Risks / Follow-ups

- 需要确认所有早返回和异常分支都能恢复 `isSubmitting`
