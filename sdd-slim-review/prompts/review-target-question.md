# Review Target Question Template

Use this when the review target is ambiguous.

```text
question: |
  当前存在多个可能的 review 目标：
  - 1. <spec/file/diff A>
  - 2. <spec/file/diff B>
  - 3. <spec/file/diff C>

  请确认本轮 `sdd-slim-review` 应该审查哪一个。
```

Rules:

- 只问 review 目标，不顺带问修复方案
- 如果已经有明确 spec，就不要重复问
