# Pomodoro Focus App Learning Clone — Example Worklog

> Feature Folder: `.sdd-slim/2026.04.16.pomodoro-focus-app-learning-clone/`
> Canonical File: `.sdd-slim/2026.04.16.pomodoro-focus-app-learning-clone/spec.md`

## 1. Task Checklist

- [ ] T1: 建立 timer 的核心状态与控制动作
  - Source Module: M1
  - Knowledge Points: K1
  - Learning Goal: 让学习者先看懂 timer 至少需要哪些状态与动作
  - Files: `src/App.tsx`, `src/components/timer-panel.tsx`
  - How: 在顶层放置 `remainingSeconds` 与 `timerStatus`，把动作函数传给 timer panel
  - Explanation Focus: 为什么 timer status 不能只靠布尔值混过去；为什么顶层持有状态更利于后续模块复用
  - Comment Expectations: 解释 timer 状态字段的职责，以及控制动作如何影响主链路
  - Acceptance: 按钮动作能驱动状态切换并正确更新按钮文案
  - Validation: timer critical journey J1 的初始控制态与按钮切换校验

- [ ] T2: 接入 interval 副作用，让时间真实流动
  - Source Module: M1
  - Knowledge Points: K2
  - Learning Goal: 让学习者理解计时器 effect 的建立、清理与停止条件
  - Files: `src/App.tsx`
  - How: 用 effect 在 running 状态下注册 interval，在 cleanup 中统一清理
  - Explanation Focus: effect 依赖为什么这样写；为什么 cleanup 是计时场景的关键
  - Comment Expectations: 解释 interval 启停条件、cleanup 原因、倒数结束边界
  - Acceptance: 不会出现重复计时或暂停后仍继续递减
  - Validation: timer critical journey J1 的倒计时推进、暂停与重置 e2e 校验

- [ ] T5: 让当前任务与 timer 头部联动
  - Source Module: M2
  - Knowledge Points: K5
  - Learning Goal: 理解共享状态如何在多个 UI 区块之间传递且保持单一真值
  - Files: `src/App.tsx`, `src/components/task-list.tsx`, `src/components/timer-panel.tsx`
  - How: 在顶层维护 `activeTaskId`，由 list 更新、由 timer panel 消费
  - Explanation Focus: 为什么不用在 task list 和 timer panel 各存一份当前任务
  - Comment Expectations: 解释共享状态流向，以及当前任务解析逻辑
  - Acceptance: 当前任务切换后，所有相关 UI 同步更新
  - Validation: task critical journey J2 的头部联动 e2e 校验

- [ ] T8: 展示 summary cards
  - Source Module: M3
  - Knowledge Points: K7
  - Learning Goal: 让学习者看到如何从 session records 派生 summary UI
  - Files: `src/components/session-summary.tsx`, `src/App.tsx`
  - How: 从 session records 计算 completed focus count 与当前 streak，再渲染两到三个轻量卡片
  - Explanation Focus: 为什么 summary 是派生值而不是第二份真值
  - Comment Expectations: 解释派生统计公式与空状态分支
  - Acceptance: 完成一轮 session 后 summary cards 正确更新
  - Validation: summary critical journey J3 的统计反馈 e2e 校验

## 2. Execution Notes

- pending

## 3. Review Findings

- pending

## 4. Repair Notes

- pending

## 5. Verification Harness Report

- pending
