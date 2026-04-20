---
name: sdd-slim-implement
description: |
  Use when: 已有用户确认过的 canonical feature artifact set，现在要严格按文档实现。
  进入实现前先做 context-compression preflight：若运行环境是 OpenCode，则显式执行一次 `/compact`（别名 `/summarize`）；若其他环境暴露了等价的显式 compaction action，也只执行一次；若当前界面只有自动 compaction 配置而没有显式入口，不得声称已手动触发压缩；若两者都没有，则显式说明未压缩并重新读取 `spec.md`、`plan.md`、`worklog.md` 与当前代码。
  然后重新读取 feature artifact set；实现阶段必须把每个未完成 P* 对应的一组 T* 作为一个实现包先交给 subagent 执行；默认串行逐个处理。若检测到 `--mutiAgent` 或用户明确要求多个 agent 并行实现，主 agent 必须先做独立性判断：能并行就直接开启，不能并行就自动降级为串行并记录原因。主 agent 负责分派、审核、逐条回写 `worklog.md` 中的 checklist / execution notes、同步 `spec.md` 状态、重新计算剩余未完成 P* 与 stop condition；只有全部未完成 P* 均已实现完毕或出现无法安全继续的 blocker 时才能停止。
  标准 implement 阶段禁止打断用户：除 `implement-learning` 外，不得在实现阶段通过 `askquestion` 暂停等待用户；遇到歧义、缺口、多候选 artifact set 或并行分派争议时，必须基于现有 artifact set 与当前代码做最保守决策、记录 assumption / deviation / blocker，并直接运行到阶段终态。
user-invocable: true
---

# SDD Slim Implement

只做 implementation。

## 路由

1. 读取 `implement.md`
2. 实现前预处理参考 `prompts/context-reset-preflight.md`（内容为上下文压缩 preflight）
3. subagent 实现包下发参考 `prompts/subagent-implementation-prompt.md`
4. 使用 `templates/execution-note.md` 记录执行结果
5. 如果中途阻塞，使用 `templates/blocker-note.md` 回写 blocker
6. 示例见 `examples/example-execution-notes.md`

## 独立性规则

- 本 skill 只能由用户手动调用
- 开始实现前，执行一次 context compression preflight：OpenCode 环境优先显式使用 `/compact`（别名 `/summarize`）
- 如果不是 OpenCode，只有在当前环境明确暴露了等价的显式 compaction action 时，才允许执行一次对应动作
- 如果当前环境只有自动 compaction 配置或自动压缩行为，没有显式触发入口，不得把它表述成“已手动执行压缩”
- 不得主动改用 `clear/reset` 或 `new session/fresh run` 充当 implement preflight
- 如果当前环境既没有显式 compaction action，也没有可确认的自动 compaction 机制，必须明确说明“未进行上下文压缩”，然后重新读取 `spec.md`、`plan.md`、`worklog.md` 与当前代码继续 implement
- 标准 implement 阶段禁止用 `askquestion` 打断用户；遇到歧义、缺口或多候选目标时，必须自主做最保守决策并记录依据
- 实现必须把 `spec.md` 当作唯一执行边界，把 `plan.md` 当作 HOW / 风险上下文，把 `worklog.md` 当作唯一进度账本：只实现已确认 `T*`，不得因为“顺手修一下”“先跑通主链路”而扩 scope
- 默认且强制采用 subagent-per-P：每个未完成 `P*` 实现包都必须先交给一个 subagent；主 agent 只负责选择当前 `P*` 包边界、下发约束、审核结果、决定是否接受
- subagent 默认只应处理单个 `P*` 及其关联的多个 `T*`；不得同时承担多个未完成 `P*` 的跨点编排
- 主 agent 不得直接承担任何属于当前 `P*` 的产品代码实现；如果 subagent 结果不足，必须继续重派同一 `P*` 或记录 blocker，而不是主 agent 直接下场补实现
- 默认是单 agent 串行实现；如果用户消息中带有 `--mutiAgent`，或明确表达“开启多个 agent / 多个 subagent 并行实现”，主 agent 必须自行判定是否可安全并行：可并行就直接开启，不可并行就自动降级为串行并记录原因
- multiAgent 模式只允许并行执行彼此独立的 `P*` 实现包；同一个 `P*` 内部仍由一个 subagent 负责，不得拆成多个 agent 并行改写同一实现包
- 若多个 `P*` 共享同一关键文件、迁移顺序、公共接口或验证环境，主 agent 必须判定其不独立并退回串行模式
- 主 agent 不得把 spec 状态管理、任务完成判定、deviation / blocker 认定完全外包给 subagent
- 每完成一个 `P*` 包中的任意 `T*`，都必须由主 agent 立即回写 `worklog.md` 中的 `Task Checklist` 与 `Execution Notes`，并在需要时同步 `spec.md` 状态；不得拖到全部代码写完后再统一补记
- 只有当所有未完成 `P*` 都被重新计算为已完成、已部分完成但可接受，或因 blocker 停止时，implement 才允许结束；不得在仅完成部分 `P*` 后提前收尾
- 一旦发现实现已经偏离 spec、跳过回写、或需要依赖未写明假设，必须立即先回写 assumption / deviation / blocker，再决定是否沿最保守路径继续
- 如果某项工作尚未写回 `worklog.md`，就不得宣称该 `T*` 已完成
- 如果验证尚未完成，就不得把该 `T*` 标为 `[x]`
- 不自动触发 `sdd-slim-review`
- 不自动进入任何其他 skill
- 完成后不主动推荐进入其他 skill
