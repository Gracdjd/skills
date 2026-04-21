# Point Confirmation Question Template

Use this for every `P*` after codebase research has been completed, including simple points that already look clear.

```text
question: |
  P1: <title>

  基于需求和代码库探索，我当前准备写入 planning artifacts 的内容是：
  - 当前理解：<current understanding>
  - 代码依据：<entry files / reusable patterns>
  - 建议 HOW：<proposed execution approach>
  - 候选任务：<candidate tasks；默认每个都会作为 implement 阶段单个 `T*` 独立派发>
  - 建议验证：<suggested validations>

  请确认或修正这一点；即使当前看起来没有明显歧义，也要先完成这次确认，我才会把它转成正式任务。
```

Rules:

- 每个 `P*` 都要使用一次，简单 `P*` 也不能跳过
- 一次只确认一个 `P*`
- 如果当前 `P*` 还带有额外阻塞项，问题可以聚焦该阻塞点，但仍需覆盖当前理解与建议 HOW
- 如果用户确认范围无误，但候选任务粒度仍过大，主代理在写入 `Task Checklist` 前仍需继续拆分
- 如果用户修正了行为、边界或 HOW，需要回写 `plan.md` / `spec.md` / `worklog.md` 中受影响的部分，必要时重新调用 subagent
