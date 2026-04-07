# Point Confirmation Question Template

Use this only when one `P*` still has a real blocking uncertainty after codebase research has been completed.

```text
question: |
  P1: <title>

  基于需求和代码库探索，我当前准备写入 spec 的内容是：
  - 当前理解：<current understanding>
  - 代码依据：<entry files / reusable patterns>
  - 建议 HOW：<proposed execution approach>
  - 候选任务：<candidate tasks>
  - 建议验证：<suggested validations>

  这里仍有一个阻塞 planning 的未决点，请只确认或修正这一点；关闭后我才会把它转成正式任务。
```

Rules:

- 只有存在真正阻塞任务化的未决项时才使用
- 一次只确认一个 `P*`
- 如果用户修正了行为、边界或 HOW，需要回写 spec，必要时重新调用 explorer
