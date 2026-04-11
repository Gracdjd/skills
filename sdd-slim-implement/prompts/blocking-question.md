# Blocking Clarification Question Template

Use this when implementation is blocked by one missing decision.

```text
question: |
  当前实现被一个阻塞点卡住：

  - 当前实现包：<P1 / T1-T3>
  - 阻塞原因：<what is ambiguous or missing>
  - 可选方向：<A / B if relevant>
  - 影响范围：<files / acceptance criteria / behavior>

  请只确认这一点，我再继续实现。
```

Rules:

- 一次只问一个阻塞点
- 问题必须紧贴当前任务，不要顺带扩 scope
