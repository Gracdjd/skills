---
name: sdd-slim-implement-learning
description: |
  Use when: 已有 learning 版 canonical feature artifact set，现在要按教学节奏一边实现、一边讲解地复刻项目。
  该 skill 必须按 `T*` 顺序逐个实现，而不是按 `P*` 或整包模块并行推进；每个 task 都要解释它承接的知识点、为什么这么实现，并在代码里写足够的学习型注释。
  implement-learning 阶段禁止使用 subagent，也禁止多 agent 并行；当前主代理必须自己完成代码阅读、实现、验证，并把进度回写到 `worklog.md`、必要状态回写到 `spec.md`。
  implement-learning 是标准 implement 规则的教学例外：为了帮助学习者理解，可以在必要时通过 `askquestion` 做单点澄清并暂停，不能套用标准 implement / review 的“禁止打断用户”规则。
user-invocable: true
---

# SDD Slim Implement Learning

只做 learning-oriented implementation。

## 路由

1. 读取 `implement.md`
2. 阻塞澄清提问参考 `prompts/blocking-question.md`
3. 执行记录参考 `templates/execution-note.md`
4. 阻塞记录参考 `templates/blocker-note.md`
5. 示例见 `examples/example-execution-notes.md`

## 独立性规则

- 本 skill 只能由用户手动调用
- 只接受 learning 版 feature artifact set 作为事实边界，并按 `T*` 顺序推进
- 当前实现单元是 `T*`，不是 `P*`、不是整个 `M*` 包
- `spec.md` 提供学习目标与范围边界，`plan.md` 提供模块图与知识点上下文，`worklog.md` 记录任务进度与教学式执行记录
- implement-learning 阶段严禁使用 subagent
- implement-learning 阶段严禁多 agent / multiAgent / 并行代理实现
- implement-learning 是标准实现链路的教学例外：允许为了帮助学习而用 `askquestion` 做单点澄清并暂停
- 如果当前环境无法由主代理独立完成实现，就必须记录 blocker 并停止，不能降级为委派 subagent
- 每个 `T*` 开始前，都必须重新读取其对应模块 `M*` 与知识点 `K*`，明确当前 task 要讲什么
- 每个 `T*` 完成后，都必须在 `worklog.md` 的 `Execution Notes` 记录：本 task 讲解了哪些知识点、为什么这样实现、验证做了什么
- 代码注释必须服务于学习：关键数据流、状态变化、边界条件、抽象接口、非直观取舍都应有解释
- 不自动进入 review 或其他 skill

## Learning Implement 的核心差异

- 目标不是“最快把 spec 做完”，而是“让每一步实现都能被学习者读懂并复现”
- 先按 task 打通一个小闭环，再进入下一个 task
- 每个 task 的实现都要把相关知识点讲明白，而不是只追求代码通过
- 注释要求明显高于普通实现模式，但仍然要避免逐行废话式注释