# Fix Target Question Template

Use this when `Review Findings` does not expose any actionable issue.

```text
question: |
  当前没有可直接消费的 review findings。

  请确认本轮 `sdd-slim-fix` 要修复哪个具体问题：
  - bug 描述 / 报错 / failing test / 诊断信息
  - 期望行为
  - 若有相关文件或 spec，也请指出
```

Rules:

- 只问“本轮修什么”
- 用户一旦给出明确目标，就按单个问题进入 fix 流程
