# Context Reset Preflight Template

Use this before `sdd-slim-implement` starts reading the spec.

```text
Preflight:

1. Check whether the current environment actually exposes a callable `clear` / reset / session-reset tool.
2. If it exists, call it exactly once before implementation begins.
3. Otherwise, check whether the environment supports starting a new session / fresh run; if yes, restart implementation in that fresh session.
4. Otherwise, if the environment exposes a `compact` / `compress` capability, use it only as a fallback and explicitly note that it reduces context rather than fully clearing it.
5. After preflight, re-read the selected spec and rely only on that spec plus current code.
```

Rule:

- 不要假设所有 Claude / agent 环境都有标准 `clear` 工具
- Claude / Claude SDK commonly support sessions; starting a new session is preferable to compaction when true reset is unavailable
