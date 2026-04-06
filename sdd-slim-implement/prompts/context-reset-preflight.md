# Context Reset Preflight Template

Use this before `sdd-slim-implement` starts reading the spec.

```text
Preflight:

1. Check whether the current environment actually exposes a callable `clear` / reset / session-reset tool.
2. If it exists, call it exactly once before implementation begins.
3. If it does not exist, do not invent or simulate it; instead, explicitly proceed as a fresh-context pass.
4. After preflight, re-read the selected spec and rely only on that spec plus current code.
```

Rule:

- 不要假设所有 Claude / agent 环境都有标准 `clear` 工具
