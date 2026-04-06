# Pending User Input Output Template

Use this when `sdd-slim-plan` cannot fully close a spec.

```md
## Pending User Input

- Q1: <question title>
  - Why blocked: <why planning cannot fully close this point>
  - Needed from user: <the exact missing decision / data>
  - Affected items: <P*/T*>
```

Rules:

- 只记录仍然缺失的信息
- 如果当前轮已经提出 askquestion 但尚未全部关闭，可以保留此区块作为 spec 内的未决清单
- 如果当前轮不适合继续澄清，可以写完后停止，等待用户手动再次调用
