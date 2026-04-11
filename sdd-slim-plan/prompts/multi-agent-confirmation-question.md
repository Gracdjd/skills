# Multi-Agent Confirmation Question Template

Use this when `sdd-slim-plan` detects `--mutiAgent` or the user explicitly asks to enable multiple subagents in parallel.

```text
question: |
  当前可以切换到 multiAgent 模式，并行调用多个 subagent 做 plan 阶段的代码库探索，以缩短等待时间。

  需要你确认的点：

  - 并行范围：只用于独立的 repo exploration / research
  - 不会并行的部分：spec 写回、`P*` 用户确认、`Q*` 澄清、最终 ready 判定仍由主 agent 串行完成
  - 代价：可能增加 token / 资源消耗

  是否确认开启多个 agent 并行完成这次 plan 探索？
```

Rules:

- 只有在检测到 `--mutiAgent` 或用户明确表示要开启多个 subagent 时才使用
- 一次只问这一件事，不要混入其他 `Q*` 或 `P*` 确认
- 只有收到明确肯定答复，才允许切换到 multiAgent 模式
