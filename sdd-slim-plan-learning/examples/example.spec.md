# Pomodoro Focus App Learning Clone

> Status: ready
> Created: 2026-04-16
> Updated: 2026-04-16
> Feature Folder: `.sdd-slim/2026.04.16.pomodoro-focus-app-learning-clone/`
> Requirement Archive: `.sdd-slim/2026.04.16.pomodoro-focus-app-learning-clone/requirement.md`
> Requirement Availability: available
> Original Sources: current workspace reference app + pasted user goal text
> Plan File: `.sdd-slim/2026.04.16.pomodoro-focus-app-learning-clone/plan.md`
> Worklog File: `.sdd-slim/2026.04.16.pomodoro-focus-app-learning-clone/worklog.md`
> Project Test File: `.sdd-slim/_project/test.md`
> Canonical File: `.sdd-slim/2026.04.16.pomodoro-focus-app-learning-clone/spec.md`

## 1. Learning Goal Summary

- What project is being studied: 一个带专注计时、任务列表和会话统计的 Pomodoro Web App
- What replica is being targeted: 复刻一个精简但完整的专注应用，保留主工作流和核心交互
- What may be simplified: 先不做账户体系、云同步、复杂图表动效
- What should stay faithful: 计时主链路、任务切换体验、会话统计反馈

## 2. Confirmed Scope

### In Scope

- 可开始、暂停、重置的 Pomodoro 倒计时
- 最小任务列表与当前任务切换
- 完成专注后的会话内统计反馈

### Out of Scope

- 用户登录
- 云同步
- 拖拽排序
- 复杂图表与动画系统

## 3. Acceptance Criteria

- [ ] 用户可以完成一轮开始、暂停、继续、重置的 timer 操作
- [ ] 用户可以切换当前任务并在完成专注后看到任务相关反馈
- [ ] 用户可以看到本次会话内的专注次数与基础摘要

## 4. Verification Strategy

- Target Surface: web
- Required Harness: e2e
- Unit Harness:
  - Command: `pnpm vitest --coverage` 用于 `src/lib/time.ts` 等纯函数的补充验证
  - Coverage Source: coverage summary json 或终端输出
  - Minimum Signal: 仅作为补充学习信号，不替代 required e2e lane
- E2E Harness:
  - Tooling: agent-browser；若仓库已有 Playwright 套件，可一并复用
  - Critical Journeys: J1 timer 开始/暂停/重置；J2 当前任务切换并在面板同步；J3 完成一轮 session 后 summary 更新
  - Minimum Signal: 所有 critical journeys pass
- Project Regression:
  - File: `.sdd-slim/_project/test.md`
  - Expected reruns: timer core smoke、task selection smoke、session summary smoke
- Report Requirements:
  - Unit Coverage: 允许作为补充信号记录；若未执行需说明原因
  - E2E Success Rate: 必须写 passed journeys / total journeys

## 5. Risks / Follow-ups

- 如果 timer 完成事件和 reset 行为耦合过紧，M3 的统计可能出现漏记或重复记
- 如后续要扩展持久化，应在新的 feature folder 中单独规划，而不是把 localStorage 提前塞进当前 learning 路线

- [ ] T8: 展示最小统计卡片
  - Source Module: M3
  - Knowledge Points: K7
  - Learning Goal: 理解如何从记录数据派生出易读的 UI 反馈
  - Files: `src/components/session-summary.tsx`, `src/App.tsx`
  - Expected Output: 页面出现总专注次数、当前任务专注次数等轻量 summary
  - How: `session-summary` 只接收记录和当前任务，内部做最小派生展示
  - Explanation Focus: 为什么 summary 不需要再维护自己的真值；怎样避免重复状态
  - Comment Expectations: 解释派生计算与展示边界
  - Acceptance: summary 数据与已完成 session 数量保持一致
  - Validation: summary critical journey J3 的统计卡片 e2e 校验

## 12. Execution Notes

- Reserved for `sdd-slim-implement-learning`

## 13. Review Findings

- Reserved for review stage

## 14. Repair Notes

- Reserved for review-stage repairs and learning reflections

## 15. Risks / Follow-ups

- 如果后续要加入持久化，需要重新规划一个新的学习模块，而不是直接把 localStorage 散落进现有 task
- 如果 UI 动效成为学习重点，应单独新增模块，不要混入 Timer Core 的首轮实现
