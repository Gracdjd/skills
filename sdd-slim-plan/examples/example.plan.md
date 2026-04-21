# Checkout Button Loading State Plan

> Feature Folder: `.sdd-slim/2026.04.06.checkout-button-loading-state/`
> Spec File: `.sdd-slim/2026.04.06.checkout-button-loading-state/spec.md`
> Requirement Archive: `.sdd-slim/2026.04.06.checkout-button-loading-state/requirement.md`
> Worklog File: `.sdd-slim/2026.04.06.checkout-button-loading-state/worklog.md`

## File Role

- This file records planning decomposition, repo evidence, and confirmed HOW.
- Final feature contract stays in `spec.md`.
- Task execution and review evidence stay in `worklog.md`.

## 1. Requirement Breakdown

| ID  | Type          | Title              | Current Understanding                            | Source          | Status    |
| --- | ------------- | ------------------ | ------------------------------------------------ | --------------- | --------- |
| P1  | requirement   | 提交中显示 loading | checkout 提交链路需要显式按钮状态流转            | 需求正文第 1 条 | confirmed |
| P2  | requirement   | 阻止重复提交       | duplicate submit 需要在 handler 与按钮态双层成立 | 需求正文第 2 条 | confirmed |
| Q1  | clarification | 错误提示文案       | 失败时展示固定 toast 文案                        | 需求正文第 3 条 | resolved  |

## 2. Clarification Log

### Q1 错误提示文案

- Current understanding: 失败时展示通用错误提示
- Why clarification is needed: 文案会影响验收标准和回归验证
- User answer: 使用“提交失败，请稍后重试”
- Final resolution: 固定 toast 文案为“提交失败，请稍后重试”
- Status: resolved

## 3. Point Confirmation Log

### P1 提交中显示 loading

- User-facing summary used in askquestion: 点击提交后按钮立即进入 loading，请求结束后恢复
- Current understanding presented to user: checkout 提交动作需要一个覆盖成功与失败分支的 loading 生命周期
- Code basis presented to user: `src/pages/checkout/index.tsx` 已有异步提交入口，`src/components/SubmitButton.tsx` 可承接按钮态 props
- Proposed HOW presented to user: 复用 `isSubmitting` 状态并把 loading / disabled 透传到按钮组件
- Candidate tasks presented to user: T1 按钮组件扩展（独立实现包）；T2 页面状态接线（依赖 T1）
- Task packaging / dependency notes presented to user: 先扩按钮接口，再接页面状态，避免单个 `T*` 同时承接组件 API 变更和页面状态接线
- Suggested validation presented to user: T1 类型检查；T2 checkout 关键路径 E2E + 类型检查
- User answer: 确认
- Final confirmed interpretation: loading 从点击开始，到成功或失败结束
- Status: confirmed

### P2 阻止重复提交

- User-facing summary used in askquestion: loading 期间再次点击不应发起第二次请求
- Current understanding presented to user: 防重提需要在 handler 和按钮禁用态两层同时成立
- Code basis presented to user: `src/pages/checkout/index.tsx` 的 submit handler 是唯一提交入口
- Proposed HOW presented to user: 在 handler 顶部增加 guard，并复用 loading 态禁用按钮
- Candidate tasks presented to user: T3 提交 guard 与错误恢复（依赖 T2）
- Task packaging / dependency notes presented to user: guard 与错误恢复共享同一 handler 和同一验证路径，保留为单个实现包
- Suggested validation presented to user: checkout 重复点击与失败恢复 E2E
- User answer: 确认
- Final confirmed interpretation: 需要在 handler 层和按钮态层同时防重入
- Status: confirmed

## 4. Research Findings

### P1 提交中显示 loading

- Entry files: `src/pages/checkout/index.tsx`, `src/components/SubmitButton.tsx`
- Related modules: checkout page state, submit button component
- Reusable patterns: 现有保存表单流程已使用 `isSubmitting` 状态
- Proposed execution approach: 复用 `isSubmitting` 布尔状态，提交前置 true，请求结束统一恢复 false
- Candidate tasks: T1 按钮组件接收 disabled/loading；T2 页面状态接线
- Task packaging notes: 把组件接口扩展与页面接线拆成两个 implement-ready `T*`，避免单个任务同时修改组件 API 与页面状态流转
- Dependency hints: T1 -> T2
- Suggested validations: T1 类型检查；T2 checkout happy path E2E；类型检查
- Risks: 请求异常分支可能遗漏恢复状态
- Feasibility: high
- Questions requiring user input: none

### P2 阻止重复提交

- Entry files: `src/pages/checkout/index.tsx`
- Related modules: submit handler
- Reusable patterns: 表单保存页已有重复点击 guard
- Proposed execution approach: 在 handler 开头增加 `if (isSubmitting) return`
- Candidate tasks: T3 提交 guard
- Task packaging notes: 把 guard 与错误恢复保留为单个 `T*`，因为两者共享同一 handler 和同一错误路径验证
- Dependency hints: T2 -> T3
- Suggested validations: checkout duplicate-click E2E
- Risks: 需要确认所有失败分支都能恢复状态
- Feasibility: high
- Questions requiring user input: none

## 5. Pending User Input

- none

## 6. Coherence Notes

- Reserved for final planning coherence check

## 7. Test Design Handoff

### P1 提交中显示 loading

- Required lane: e2e
- Supporting lanes: unit
- Unit cases: U1 `SubmitButton` 接收 `loading` / `disabled` props 时渲染禁用态；U2 checkout submit handler 在请求开始与结束时切换 `isSubmitting`
- E2E journeys: J1 点击提交后按钮立即进入 loading，直到请求结束恢复
- Suggested test files: `src/pages/checkout/__tests__/submit-button.test.tsx`, `tests/checkout-submit.spec.ts`
- Shared fixtures / data setup: checkout submit mock response fixtures
- Review-stage generation notes: 组件态用 unit 固定，浏览器主链路用 e2e 承担 release gate

### P2 阻止重复提交

- Required lane: e2e
- Supporting lanes: unit
- Unit cases: U3 submit handler 在 `isSubmitting = true` 时短路返回；U4 error recovery 分支恢复 `isSubmitting`
- E2E journeys: J2 loading 期间重复点击被拦截；J3 失败后按钮恢复并展示错误提示
- Suggested test files: `src/pages/checkout/__tests__/submit-button.test.tsx`, `tests/checkout-submit.spec.ts`
- Shared fixtures / data setup: checkout submit mock response fixtures
- Review-stage generation notes: 把 duplicate guard 与 error recovery 放到同一个失败路径 spec，避免拆成两个互相重复的浏览器 journey
