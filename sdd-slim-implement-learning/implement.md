# SDD Slim Implement Learning — Execute Spec

> 输入：一个 learning 版 `.sdd-slim/*.spec.md`
> 输出：实现代码 + 更新后的同一 spec 文件

## 单文档策略

本阶段继续使用同一个 canonical `*.spec.md`：

- 任务进度直接更新在 `Task Checklist`
- 教学式执行记录直接追加到 `Execution Notes`
- 当前实现单位始终是单个 `T*`

## HARD GATES

- 只能由用户显式触发 `sdd-slim-implement-learning`
- 编码前必须完整读取选定的 spec 文件
- 如果存在多个候选 spec 且用户未指定，必须通过 `askquestion` 让用户选择
- 如果 spec 状态不是 `ready` / `in-progress` / `implemented-with-issues`，记录 blocker 并停止
- 如果 spec 不包含 learning 相关 section，例如 `Project Module Map`、`Knowledge Point Backlog`、带知识点映射的 `Task Checklist`，记录 blocker 并停止
- implement-learning 必须严格按 `T*` 顺序逐个推进，不得把多个 task 合并成一个大包偷偷实现
- 当前主代理必须自己完成代码阅读、实现、验证与 spec 回写；禁止使用 subagent
- 禁止 `--mutiAgent`、并行代理或“让别的 agent 先写我来审核”的做法
- 每个 `T*` 开始前，必须明确当前 task 对应的 `M*`、`K*`、Learning Goal、Explanation Focus、Comment Expectations
- 每个 `T*` 的代码改动必须尽量形成一个可见、可验证、可讲解的小闭环
- 如果为完成当前 `T*` 必须引入 spec 未写明的额外范围，必须先澄清或记录 blocker，不能静默扩 scope
- 若某个 `T*` 已完成代码改动但还没写回 `Execution Notes` 与验证结果，就不得把它标记为 `[x]`
- 不自动进入 review / fix

## 流程

### 步骤 1：选择目标 spec

- 找到 0 个：停止，并说明应先运行 `sdd-slim-plan-learning`
- 找到 1 个：使用它
- 找到多个且用户未指定：使用 `askquestion` 让用户选择

### 步骤 2：读取并检查 spec

至少确认以下内容存在：

- `Project Module Map`
- `Knowledge Point Backlog`
- `Task Checklist`
- 每个待执行 `T*` 的 `Source Module`、`Knowledge Points`、`Learning Goal`、`Explanation Focus`、`Validation`

如果缺失以上任一关键内容：

- 记录 blocker
- 停止

### 步骤 3：建立 task 队列

1. 把 `Task Checklist` 中所有未完成任务按 `T*` 顺序整理成队列
2. 当前轮只取队首 `T*`
3. 当前 `T*` 对应的 `M*` 与 `K*` 必须被重新读取，并作为本轮实现与讲解的唯一教学边界

### 步骤 4：单个 task 的教学式实现闭环

对每个 `T*`，严格按以下顺序执行：

1. 先总结本 task：
   - 它属于哪个模块 `M*`
   - 它承接哪些知识点 `K*`
   - 本 task 希望让学习者看懂什么
2. 直接由主代理阅读相关代码与文件上下文
3. 实现当前 `T*` 所需的最小改动
4. 在代码中补充足够的学习型注释，重点包括：
   - 关键数据流
   - 状态变化或时序
   - 边界条件
   - 抽象接口或约束
   - 容易让学习者误解的地方
5. 运行与当前 `T*` 对应的验证
6. 回写 `Task Checklist` 与 `Execution Notes`
7. 重新计算剩余 `T*`；如果仍有未完成任务，继续下一个 `T*`

### 步骤 5：注释规则

learning 版注释要求：

- 不追求每行都注释
- 但凡学习者仅通过函数名不容易理解的地方，都应该解释
- 如果当前 task 的重点是某个知识点，代码中最好能让读者直接看到该知识点落在哪里
- 注释要解释“为什么这样做”与“这一段在整条链路中的作用”，而不仅是复述代码字面意思

### 步骤 6：阻塞处理

如果执行中遇到以下任一情况，优先澄清，无法澄清再停止：

- 当前 `T*` 的期望行为不清楚
- 当前 `T*` 的知识点映射与实际代码严重不符
- 为完成当前 `T*` 必须提前做一个 spec 未规划的前置任务
- 缺少依赖信息、环境条件或必要输入

处理方式：

- 优先使用 `askquestion` 按 `prompts/blocking-question.md` 单点澄清
- 如果当前轮仍无法继续，则用 `templates/blocker-note.md` 写入 blocker
- 把 spec 状态更新为 `blocked`（如确有阻塞）
- 直接停止，等待用户再次调用

### 步骤 7：验证规则

每个 `T*` 完成后都至少做一个具体验证：

- 定向测试
- typecheck / lint / build
- 手动路径验证
- 其他和当前 task 直接相关的可重复验证

没有具体验证，不得宣称完成。

### 步骤 8：收尾

- 只有在所有 `T*` 都进入终态 `[x]` 或 `[~]` 后，才能结束 implement-learning
- 状态改为 `implemented` 或 `implemented-with-issues`
- 输出 changed files / validations / remaining risks
- 直接停止
