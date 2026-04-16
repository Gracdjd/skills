# Example Learning Execution Notes

```md
- 2026-04-16 T1 [x]
  - Source Module: M1
  - Knowledge Points: K1
  - Executor: main-agent
  - Files: `src/App.tsx`, `src/components/timer-panel.tsx`
  - Validation: manual verification of start / pause / reset state transitions
  - Explanation Delivered: 讲清了为什么 timer 需要 `remainingSeconds` 和 `timerStatus` 两类状态，以及控制动作为什么放在顶层统一管理
  - Comment Coverage: 在 `App.tsx` 的 timer state 定义和 action handlers 上补了注释，解释各状态字段职责与控制流入口
  - Deviation: none
  - Note: established the minimal timer state model before introducing real ticking behavior

- 2026-04-16 T2 [x]
  - Source Module: M1
  - Knowledge Points: K2
  - Executor: main-agent
  - Files: `src/App.tsx`
  - Validation: manual 10-second countdown run covering start, pause, resume, and reset
  - Explanation Delivered: 讲清了 interval effect 为什么必须有 cleanup，以及倒计时结束时为什么要在同一处收口停止逻辑
  - Comment Coverage: 在 effect 和 cleanup 附近加了注释，说明依赖选择、重复 interval 风险和结束边界
  - Deviation: none
  - Note: timer now ticks once per second without duplicate interval registration

- 2026-04-16 T3 [~]
  - Source Module: M1
  - Knowledge Points: K3
  - Executor: main-agent
  - Files: `src/lib/time.ts`, `src/components/timer-panel.tsx`
  - Validation: targeted unit test for `formatDuration`; manual UI spot-check
  - Explanation Delivered: 讲清了为什么时间格式化应从视图组件抽离，以及展示层如何只消费已经整理好的字符串
  - Comment Coverage: 在 `formatDuration` 函数和 timer panel 的显示入口处加了注释，解释输入约束和展示职责边界
  - Deviation: summary module has not started yet, so this task only covers formatting extraction
  - Note: formatting logic was extracted successfully, but the visual low-time warning is intentionally deferred to a later task
```
