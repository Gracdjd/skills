# Pomodoro Focus App Learning Clone — Example Plan

> Feature Folder: `.sdd-slim/2026.04.16.pomodoro-focus-app-learning-clone/`
> Requirement Archive: `.sdd-slim/2026.04.16.pomodoro-focus-app-learning-clone/requirement.md`
> Canonical File: `.sdd-slim/2026.04.16.pomodoro-focus-app-learning-clone/spec.md`

## 1. Project Module Map

| ID  | Module          | Responsibility                           | Why Learn Now                          | Depends On | Planned Knowledge Points | Status    |
| --- | --------------- | ---------------------------------------- | -------------------------------------- | ---------- | ------------------------ | --------- |
| M1  | Timer Core      | 搭建倒计时主链路、状态切换与操作按钮     | 一开始就让学习者看到最核心的可见结果   | none       | K1, K2, K3               | confirmed |
| M2  | Task Flow       | 让计时器和任务列表联动，形成完整专注会话 | 在有计时器后再引入业务状态更自然       | M1         | K4, K5                   | confirmed |
| M3  | Session Summary | 记录专注完成结果并展示统计反馈           | 在主链路可用后再学习派生数据与汇总视图 | M1, M2     | K6, K7                   | confirmed |

## 2. Clarification Log

### Q1 统计是否需要持久化

- Current understanding: 首版只需要页面刷新前的本地状态统计
- Why clarification is needed: 这会影响是否提前引入存储层
- User answer: 首版不做持久化，只做内存态统计
- Final resolution: M3 仅实现会话内统计，不引入 localStorage 或后端
- Status: resolved

## 3. Module Confirmation Log

### M1 Timer Core

- User-facing summary used in askquestion: 先做一个完整可操作的倒计时器，让用户能开始、暂停、重置并看到剩余时间变化
- Knowledge points presented to user: React 状态建模、计时副作用、格式化展示
- Candidate tasks presented to user: T1 倒计时状态建模；T2 计时 interval 生命周期；T3 控制按钮与时间显示
- Suggested validation presented to user: 手动验证开始/暂停/重置；基础测试覆盖时间格式化
- Status: confirmed

### M2 Task Flow

- User-facing summary used in askquestion: 在已有计时器上加入任务列表，让当前任务与专注会话关联起来
- Knowledge points presented to user: 列表状态更新、当前选中项、跨组件状态传递
- Candidate tasks presented to user: T4 任务列表渲染；T5 当前任务选择；T6 完成专注后任务计数联动
- Suggested validation presented to user: 手动验证任务切换与计时器联动
- Status: confirmed

### M3 Session Summary

- User-facing summary used in askquestion: 最后补一个轻量统计区，让学习者看到已完成的专注次数和当前进展
- Knowledge points presented to user: 派生状态、聚合展示、模块边界收口
- Candidate tasks presented to user: T7 会话记录累计；T8 统计卡片展示
- Suggested validation presented to user: 手动完成一轮专注会话后检查统计变化
- Status: confirmed

## 4. Module Research Findings

### M1 Timer Core

- Entry files: `src/App.tsx`, `src/components/timer-panel.tsx`, `src/lib/time.ts`
- Runtime / data flow: 用户点击开始后更新 `timerStatus`，interval 每秒推进剩余秒数，展示层根据剩余秒数格式化输出
- Reusable patterns: 单一 source of truth 的本地状态 + effect 清理定时器
- Candidate tasks: T1 状态与动作；T2 interval effect；T3 视图层与按钮交互
- Risks: interval 清理不当会造成重复计时；重置逻辑容易遗漏状态同步

### M2 Task Flow

- Entry files: `src/components/task-list.tsx`, `src/components/task-item.tsx`, `src/App.tsx`
- Runtime / data flow: 任务列表维护数组状态，当前任务 id 传入 timer header；专注完成后更新当前任务完成次数
- Reusable patterns: 顶层持有共享状态，子组件只接收必要的 value 和 action
- Candidate tasks: T4 列表渲染；T5 当前任务切换；T6 专注完成联动任务次数
- Risks: 任务完成计数和 timer 完成事件的边界容易重复触发

### M3 Session Summary

- Entry files: `src/components/session-summary.tsx`, `src/App.tsx`
- Runtime / data flow: timer 完成事件写入 session records，summary 根据 records 和 active task 派生展示文本
- Reusable patterns: 由原始记录派生展示数据，而不是重复维护多份真值
- Candidate tasks: T7 session records；T8 summary cards
- Risks: 如果 timer 完成事件和重置事件耦合太紧，统计可能漏记或重复记

## 5. Knowledge Point Backlog

| ID  | Knowledge Point                      | Module | First Teaching Task | Status  |
| --- | ------------------------------------ | ------ | ------------------- | ------- |
| K1  | 用明确状态表示 timer 当前阶段        | M1     | T1                  | planned |
| K2  | 用 effect 正确管理 interval 生命周期 | M1     | T2                  | planned |
| K3  | 把时间格式化逻辑从视图里分离         | M1     | T3                  | planned |
| K4  | 列表状态的增删改查与选中态           | M2     | T4                  | planned |
| K5  | 在多个 UI 区块间共享最小必要状态     | M2     | T5                  | planned |
| K6  | 用事件记录而不是堆更多临时布尔状态   | M3     | T7                  | planned |
| K7  | 从原始数据派生 summary UI            | M3     | T8                  | planned |

## 6. Learning Route

1. M1: 先拿到一个真实可交互的计时器，建立对主工作流的整体感觉
2. M2: 在计时器之上加入任务语义，让专注动作开始有业务对象
3. M3: 最后再看记录与统计，学习如何把主链路收束成反馈面板

## 7. Pending User Input

- none

## 8. Coherence Notes

- 当前路线遵循“先可见结果，再抽象补齐”的 learning 顺序
- 所有知识点都已有首次讲解任务，不需要额外插入纯基础设施模块
