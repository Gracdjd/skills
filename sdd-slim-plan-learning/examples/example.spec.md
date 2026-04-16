# Pomodoro Focus App Learning Clone

> Status: ready
> Created: 2026-04-16
> Updated: 2026-04-16
> Requirement Archive: `.sdd-slim/pomodoro-focus-app-learning-clone.requirement.md`
> Requirement Availability: available
> Original Sources: current workspace reference app + pasted user goal text
> Canonical File: `.sdd-slim/pomodoro-focus-app-learning-clone.spec.md`

## 1. Learning Goal Summary

- What project is being studied: 一个带专注计时、任务列表和会话统计的 Pomodoro Web App
- What replica is being targeted: 复刻一个精简但完整的专注应用，保留主工作流和核心交互
- What may be simplified: 先不做账户体系、云同步、复杂图表动效
- What should stay faithful: 计时主链路、任务切换体验、会话统计反馈

## 2. Project Module Map

| ID  | Module          | Responsibility                           | Why Learn Now                          | Depends On | Planned Knowledge Points | Status    |
| --- | --------------- | ---------------------------------------- | -------------------------------------- | ---------- | ------------------------ | --------- |
| M1  | Timer Core      | 搭建倒计时主链路、状态切换与操作按钮     | 一开始就让学习者看到最核心的可见结果   | none       | K1, K2, K3               | confirmed |
| M2  | Task Flow       | 让计时器和任务列表联动，形成完整专注会话 | 在有计时器后再引入业务状态更自然       | M1         | K4, K5                   | confirmed |
| M3  | Session Summary | 记录专注完成结果并展示统计反馈           | 在主链路可用后再学习派生数据与汇总视图 | M1, M2     | K6, K7                   | confirmed |

## 3. Clarification Log

### Q1 统计是否需要持久化

- Current understanding: 首版只需要页面刷新前的本地状态统计
- Why clarification is needed: 这会影响是否提前引入存储层
- User answer: 首版不做持久化，只做内存态统计
- Final resolution: M3 仅实现会话内统计，不引入 localStorage 或后端
- Status: resolved

## 4. Module Confirmation Log

### M1 Timer Core

- User-facing summary used in askquestion: 先做一个完整可操作的倒计时器，让用户能开始、暂停、重置并看到剩余时间变化
- Why this module is scheduled here: 它能最快提供可见结果，也为后续任务流和统计流提供时间状态基础
- Knowledge points presented to user: React 状态建模、计时副作用、格式化展示
- Candidate tasks presented to user: T1 倒计时状态建模；T2 计时 interval 生命周期；T3 控制按钮与时间显示
- Suggested validation presented to user: 手动验证开始/暂停/重置；基础测试覆盖时间格式化
- User answer: 确认，先把计时器闭环做出来
- Final confirmed interpretation: M1 以“能真实操作的计时器”为交付目标，不先做额外抽象
- Status: confirmed

### M2 Task Flow

- User-facing summary used in askquestion: 在已有计时器上加入任务列表，让当前任务与专注会话关联起来
- Why this module is scheduled here: 学习者已经理解时间状态后，再看任务状态与 UI 交互会更顺
- Knowledge points presented to user: 列表状态更新、当前选中项、跨组件状态传递
- Candidate tasks presented to user: T4 任务列表渲染；T5 当前任务选择；T6 完成专注后任务计数联动
- Suggested validation presented to user: 手动验证任务切换与计时器联动
- User answer: 确认，任务列表先做最小版
- Final confirmed interpretation: M2 只关注任务与专注流的联动，不扩到拖拽排序等高级交互
- Status: confirmed

### M3 Session Summary

- User-facing summary used in askquestion: 最后补一个轻量统计区，让学习者看到已完成的专注次数和当前进展
- Why this module is scheduled here: 只有在计时和任务都打通后，统计展示才有真实数据来源
- Knowledge points presented to user: 派生状态、聚合展示、模块边界收口
- Candidate tasks presented to user: T7 会话记录累计；T8 统计卡片展示
- Suggested validation presented to user: 手动完成一轮专注会话后检查统计变化
- User answer: 确认
- Final confirmed interpretation: M3 聚焦轻量统计反馈，不引入持久化与复杂图表
- Status: confirmed

## 5. Module Research Findings

### M1 Timer Core

- Learning objective: 理解一个可视化倒计时器如何由状态、定时副作用和控制动作组成
- Entry files: `src/App.tsx`, `src/components/timer-panel.tsx`, `src/lib/time.ts`
- Related modules: app shell, timer panel, shared time formatter
- Runtime / data flow: 用户点击开始后更新 `timerStatus`，interval 每秒推进剩余秒数，展示层根据剩余秒数格式化输出
- Reusable patterns: 单一 source of truth 的本地状态 + effect 清理定时器
- Knowledge points to teach first: K1 状态建模；K2 interval 生命周期；K3 格式化函数与展示分层
- Knowledge points that can wait: 统计聚合、持久化、复杂动画
- Proposed module build approach: 先让 timer 自己跑起来，再补控制按钮和展示格式，而不是先做一堆全局状态抽象
- Candidate tasks: T1 状态与动作；T2 interval effect；T3 视图层与按钮交互
- Suggested validations: 手动验证开始/暂停/重置；单元测试验证格式化函数
- Risks: interval 清理不当会造成重复计时；重置逻辑容易遗漏状态同步
- Feasibility: high
- Questions requiring user input: none

### M2 Task Flow

- Learning objective: 理解列表数据如何和主业务状态协同，而不是孤立渲染一个静态列表
- Entry files: `src/components/task-list.tsx`, `src/components/task-item.tsx`, `src/App.tsx`
- Related modules: timer core, task list, active task badge
- Runtime / data flow: 任务列表维护数组状态，当前任务 id 传入 timer header；专注完成后更新当前任务完成次数
- Reusable patterns: 顶层持有共享状态，子组件只接收必要的 value 和 action
- Knowledge points to teach first: K4 列表状态更新；K5 跨组件共享状态
- Knowledge points that can wait: 复杂筛选、拖拽重排
- Proposed module build approach: 先做静态任务列表和选中态，再在完成专注时补计数联动
- Candidate tasks: T4 列表渲染；T5 当前任务切换；T6 专注完成联动任务次数
- Suggested validations: 手动切换任务；完成一次专注后检查任务次数更新
- Risks: 任务完成计数和 timer 完成事件的边界容易重复触发
- Feasibility: high
- Questions requiring user input: none

### M3 Session Summary

- Learning objective: 理解如何从已有状态推导统计结果，并用最小 UI 做反馈闭环
- Entry files: `src/components/session-summary.tsx`, `src/App.tsx`
- Related modules: timer core, task flow, summary cards
- Runtime / data flow: timer 完成事件写入 session records，summary 根据 records 和 active task 派生展示文本
- Reusable patterns: 由原始记录派生展示数据，而不是重复维护多份真值
- Knowledge points to teach first: K6 事件记录；K7 派生统计展示
- Knowledge points that can wait: 图表组件、趋势分析
- Proposed module build approach: 先记录最小 session item，再渲染两到三个关键统计卡片
- Candidate tasks: T7 session records；T8 summary cards
- Suggested validations: 手动完成一个 session 并检查统计
- Risks: 如果 timer 完成事件和重置事件耦合太紧，统计可能漏记或重复记
- Feasibility: medium
- Questions requiring user input: none

## 6. Knowledge Point Backlog

| ID  | Knowledge Point                      | Module | Why It Matters                                       | First Teaching Task | Status  |
| --- | ------------------------------------ | ------ | ---------------------------------------------------- | ------------------- | ------- |
| K1  | 用明确状态表示 timer 当前阶段        | M1     | 学习者需要先理解倒计时不是只有数字变化，还有运行状态 | T1                  | planned |
| K2  | 用 effect 正确管理 interval 生命周期 | M1     | 这是计时器最容易写错的地方                           | T2                  | planned |
| K3  | 把时间格式化逻辑从视图里分离         | M1     | 让展示层更容易读懂和测试                             | T3                  | planned |
| K4  | 列表状态的增删改查与选中态           | M2     | 任务流是后续联动的基础                               | T4                  | planned |
| K5  | 在多个 UI 区块间共享最小必要状态     | M2     | 学习者需要理解为什么状态放在顶层                     | T5                  | planned |
| K6  | 用事件记录而不是堆更多临时布尔状态   | M3     | 为统计和后续扩展留出清晰路径                         | T7                  | planned |
| K7  | 从原始数据派生 summary UI            | M3     | 这是复刻真实产品反馈面板的核心                       | T8                  | planned |

## 7. Learning Route

1. M1: 先拿到一个真实可交互的计时器，建立对主工作流的整体感觉
2. M2: 在计时器之上加入任务语义，让专注动作开始有业务对象
3. M3: 最后再看记录与统计，学习如何把主链路收束成反馈面板

## 8. Confirmed Scope

### In Scope

- 可开始、暂停、重置的 Pomodoro 倒计时
- 最小任务列表与当前任务切换
- 完成专注后的会话内统计反馈

### Out of Scope

- 用户登录
- 云同步
- 拖拽排序
- 复杂图表与动画系统

## 9. Acceptance Criteria

- [ ] 用户可以完成一轮开始、暂停、继续、重置的 timer 操作
- [ ] 用户可以切换当前任务并在完成专注后看到任务相关反馈
- [ ] 用户可以看到本次会话内的专注次数与基础摘要

## 10. Task Checklist

- [ ] T1: 建立 timer 的核心状态与控制动作
  - Source Module: M1
  - Knowledge Points: K1
  - Learning Goal: 让学习者先看懂 timer 至少需要哪些状态与动作
  - Files: `src/App.tsx`, `src/components/timer-panel.tsx`
  - Expected Output: 页面上出现可点击的开始、暂停、重置控制，但倒计时逻辑还可以是静态秒数
  - How: 在顶层放置 `remainingSeconds` 与 `timerStatus`，把动作函数传给 timer panel
  - Explanation Focus: 为什么 timer status 不能只靠布尔值混过去；为什么顶层持有状态更利于后续模块复用
  - Comment Expectations: 解释 timer 状态字段的职责，以及控制动作如何影响主链路
  - Acceptance: 按钮动作能驱动状态切换并正确更新按钮文案
  - Validation: 手动验证开始/暂停/重置按钮状态变化

- [ ] T2: 接入 interval 副作用，让时间真实流动
  - Source Module: M1
  - Knowledge Points: K2
  - Learning Goal: 让学习者理解计时器 effect 的建立、清理与停止条件
  - Files: `src/App.tsx`
  - Expected Output: timer 开始后每秒递减，暂停与重置都能正确停止 interval
  - How: 用 effect 在 running 状态下注册 interval，在 cleanup 中统一清理
  - Explanation Focus: effect 依赖为什么这样写；为什么 cleanup 是计时场景的关键
  - Comment Expectations: 解释 interval 启停条件、cleanup 原因、倒数结束边界
  - Acceptance: 不会出现重复计时或暂停后仍继续递减
  - Validation: 手动观察 10 秒倒计时的开始、暂停、重置

- [ ] T3: 抽离时间格式化并完善 timer 展示层
  - Source Module: M1
  - Knowledge Points: K3
  - Learning Goal: 让学习者看到“业务状态”和“展示格式”应分开处理
  - Files: `src/lib/time.ts`, `src/components/timer-panel.tsx`
  - Expected Output: 倒计时展示为 `MM:SS`，视图组件不再内联格式化逻辑
  - How: 把格式化逻辑移动到 `time.ts`，timer panel 只消费结果
  - Explanation Focus: 为什么展示辅助函数值得独立出来；怎样降低 UI 组件认知负担
  - Comment Expectations: 解释格式化函数的输入输出约束和 UI 层职责边界
  - Acceptance: 时间展示稳定，格式化逻辑可单独测试
  - Validation: 单元测试时间格式化；页面联调

- [ ] T4: 渲染最小任务列表并支持添加初始任务
  - Source Module: M2
  - Knowledge Points: K4
  - Learning Goal: 让学习者掌握列表状态与渲染的基本闭环
  - Files: `src/App.tsx`, `src/components/task-list.tsx`, `src/components/task-item.tsx`
  - Expected Output: 页面出现任务列表并可展示当前的任务项
  - How: 顶层维护任务数组，task list 负责渲染，task item 负责展示单项
  - Explanation Focus: 为什么列表真值放在顶层；为什么 item 组件不要自己复制状态
  - Comment Expectations: 解释列表数据结构、key 选择、父子组件职责划分
  - Acceptance: 初始任务能稳定渲染，不出现重复 key 或局部真值漂移
  - Validation: 手动检查任务渲染与切换

- [ ] T5: 让当前任务与 timer 头部联动
  - Source Module: M2
  - Knowledge Points: K5
  - Learning Goal: 理解共享状态如何在多个 UI 区块之间传递且保持单一真值
  - Files: `src/App.tsx`, `src/components/task-list.tsx`, `src/components/timer-panel.tsx`
  - Expected Output: 切换任务后，timer 面板能显示当前任务名称
  - How: 在顶层维护 `activeTaskId`，由 list 更新、由 timer panel 消费
  - Explanation Focus: 为什么不用在 task list 和 timer panel 各存一份当前任务
  - Comment Expectations: 解释共享状态流向，以及当前任务解析逻辑
  - Acceptance: 当前任务切换后，所有相关 UI 同步更新
  - Validation: 手动切换任务并观察 timer 头部变化

- [ ] T6: 在专注完成时更新任务完成次数
  - Source Module: M2
  - Knowledge Points: K4, K5
  - Learning Goal: 让学习者看到业务事件如何反向更新列表数据
  - Files: `src/App.tsx`
  - Expected Output: 完成一次专注后，当前任务的 focus count 增加
  - How: 在 timer 完成事件里基于 `activeTaskId` 更新对应任务项
  - Explanation Focus: 为什么把“专注完成”视为一个事件边界；为什么更新逻辑应集中在顶层
  - Comment Expectations: 解释事件触发点与任务数组更新方式
  - Acceptance: 每完成一次 session 只增加一次次数，不重复累计
  - Validation: 手动完成一轮短 session 并检查任务次数

- [ ] T7: 记录完成的 session 事件
  - Source Module: M3
  - Knowledge Points: K6
  - Learning Goal: 理解原始事件记录如何为 summary 提供可信来源
  - Files: `src/App.tsx`
  - Expected Output: 内存中维护一组最小 session records
  - How: 在 timer 完成事件里追加一条 session record，而不是单独维护多个统计布尔值
  - Explanation Focus: 为什么先存原始记录，比直接堆 totalCount 更清晰
  - Comment Expectations: 解释 session record 结构与记录时机
  - Acceptance: 每次专注完成都新增一条合法记录
  - Validation: 手动触发两轮 session 并检查记录数量

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
  - Validation: 手动完成 session 后检查 summary UI

## 11. Execution Notes

- Reserved for `sdd-slim-implement-learning`

## 12. Review Findings

- Reserved for review stage

## 13. Fix Notes

- Reserved for fix stage

## 14. Risks / Follow-ups

- 如果后续要加入持久化，需要重新规划一个新的学习模块，而不是直接把 localStorage 散落进现有 task
- 如果 UI 动效成为学习重点，应单独新增模块，不要混入 Timer Core 的首轮实现
